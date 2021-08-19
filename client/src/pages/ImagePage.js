import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router";
import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useHistory } from "react-router-dom";

const ImagePage = () => {
  const { imageId } = useParams();
  const { Images, setImages, setMyImages } = useContext(ImageContext);
  const [me] = useContext(AuthContext);
  const [hasLiked, setHasLiked] = useState(false);
  const [image, setImage] = useState();
  const [error, setError] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const img = Images.find((image) => image._id === imageId);
    if (img) setImage(img);
  }, [Images, imageId]);

  useEffect(() => {
    if (image && image._id === imageId) return;
    else
      axios
        .get(`/images/${imageId}`)
        .then(({ data }) => {
          setError(false);
          setImage(data);
        })
        .catch((err) => {
          setError(true);
          toast.error(err.response.data.message);
        });
  }, [imageId, image]);

  useEffect(() => {
    if (me && image && image.likes.includes(me.id)) setHasLiked(true);
  }, [me, image]);

  if (error) return <h3>Error...</h3>;
  else if (!image) return <h3>Loading...</h3>;

  const onSubmit = async () => {
    try {
      const { data } = await axios.patch(
        `/images/${image._id}/${hasLiked ? "unlike" : "like"}`
      );

      setHasLiked(!hasLiked);

      const updateImage = (images, image) => {
        return [...images.filter((image) => image._id !== imageId), image].sort(
          (a, b) => {
            if (a._id < b._id) return 1;
            else return -1;
          }
        );
      };

      hasLiked ? toast.success("좋아요 취소") : toast.success("좋아요!");

      if (data.public) setImages((prevData) => updateImage(prevData, data));
      setMyImages((prevData) => updateImage(prevData, data));
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const deleteHandler = async () => {
    try {
      if (!window.confirm("정말 해당 이미지를 삭제하시겠습니까?")) return;
      const { data } = await axios.delete(`/images/${imageId}`);

      setImages((prevData) =>
        prevData.filter((image) => image._id !== imageId)
      );
      setMyImages((prevData) =>
        prevData.filter((image) => image._id !== imageId)
      );

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
        src={`https://d3qfqa47hf1ig1.cloudfront.net/w600/${image.key}`}
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
