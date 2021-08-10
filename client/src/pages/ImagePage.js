import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router";
import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { filter } from "bluebird";

const ImagePage = () => {
  const { imageId } = useParams();
  const { Images, myImages, setImages, setMyImages } = useContext(ImageContext);
  const [me] = useContext(AuthContext);
  const [hasLiked, setHasLiked] = useState(false);
  const history = useHistory();

  const image =
    Images.find((image) => image._id === imageId) ||
    myImages.find((image) => image._id === imageId);

  useEffect(() => {
    if (me && image && image.likes.includes(me.id)) setHasLiked(true);
  }, [me, image]);

  if (!image) return <h3>Loading...</h3>;

  const onSubmit = async () => {
    try {
      const { data } = await axios.patch(
        `/images/${image._id}/${hasLiked ? "unlike" : "like"}`
      );
      setHasLiked(!hasLiked);

      const updateImage = (images, image) => {
        return [...images.filter((image) => image._id !== imageId), image].sort(
          (a, b) =>
            new Date(a.createAt).getTime() - new Date(b.createAt).getTime()
        );
      };

      hasLiked ? toast.success("좋아요 취소") : toast.success("좋아요!");

      if (data.public) setImages(updateImage(Images, data));
      else setMyImages(updateImage(myImages, data));
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const deleteHandler = async () => {
    try {
      if (!window.confirm("정말 해당 이미지를 삭제하시겠습니까?")) return;
      const { data } = await axios.delete(`/images/${imageId}`);

      setImages(Images.filter((image) => image._id !== imageId));
      setMyImages(myImages.filter((image) => image._id !== imageId));

      toast.success(data.message);
      history.push("/");
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  return (
    <div>
      <h3>Image Page - {imageId}</h3>
      <img
        style={{ width: "100%" }}
        src={`http://localhost:5000/uploads/${image.key}`}
        alt={image._id}
      ></img>
      <span>좋아요 {image.likes.length}</span>
      {me && image.user._id === me.id && (
        <button
          style={{ float: "right", marginLeft: 10 }}
          onClick={deleteHandler}
        >
          삭제
        </button>
      )}

      <button style={{ float: "right" }} onClick={onSubmit}>
        {hasLiked ? "좋아요 취소" : "좋아요"}
      </button>
    </div>
  );
};

export default ImagePage;
