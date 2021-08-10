import React, { useState, useContext } from "react";
import axios from "axios";
import "./UploadForm.css";
import { toast } from "react-toastify";
import { ProgressBar } from "./ProgressBar";
import { ImageContext } from "../context/ImageContext";

export const UploadForm = () => {
  const defaultFileName = "이미지 파일을 업로드 해주세요";
  const [File, setFile] = useState(null);
  const [FileName, setFileName] = useState(defaultFileName);
  const [Percent, setPercent] = useState(0);
  const [ImgSrc, setImgSrc] = useState(null);
  const [isPublic, setIsPublic] = useState(true);

  const { Images, setImages, myImages, setMyImages } = useContext(ImageContext);

  const imageSelectHandler = (e) => {
    const imageFile = e.target.files[0];
    setFile(imageFile);
    setFileName(imageFile.name);

    const fileReader = new FileReader();
    fileReader.readAsDataURL(imageFile);
    fileReader.onload = (e) => setImgSrc(e.target.result);
  };

  const imageSubmitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", File);
    formData.append("public", isPublic);

    try {
      // https://react.vlpt.us/redux-middleware/09-cors-and-proxy.html
      const { data } = await axios.post("/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setPercent(Math.round((100 * e.loaded) / e.total));
        },
      });

      if (isPublic) setImages([...Images, data]);
      else setMyImages([...myImages, data]);

      toast.success("이미지 업로드 성공!");
      setTimeout(() => {
        setPercent(0);
        setFileName(defaultFileName);
        setFile(null);
        setImgSrc(null);
      }, 3000);
    } catch (error) {
      toast.error(error.response.data.message);
      setPercent(0);
      setFileName(defaultFileName);
      setFile(null);
      setImgSrc(null);
      console.error(error);
    }
  };

  return (
    <form onSubmit={imageSubmitHandler}>
      <img
        className={`image-preview ${ImgSrc && "image-preview-show"}`}
        src={ImgSrc}
        alt="미리보기 이미지"
      />
      <ProgressBar percent={Percent} />
      <div className="file-dropper">
        {FileName}
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={imageSelectHandler}
        />
      </div>
      <input
        type="checkbox"
        id="public-check"
        value={!isPublic}
        onChange={() => setIsPublic(!isPublic)}
      />
      <label htmlFor="public-check">비공개</label>
      <button
        type="submit"
        style={{
          width: "100%",
          borderRadius: 3,
          height: 40,
          cursor: "pointer",
          marginBottom: 30,
        }}
      >
        제출
      </button>
    </form>
  );
};
