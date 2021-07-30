import React, { useState } from "react";
import axios from "axios";
import "./UploadForm.css";
import { toast } from "react-toastify";
import { ProgressBar } from "./ProgressBar";

export const UploadForm = () => {
  const defaultFileName = "이미지 파일을 업로드 해주세요";
  const [File, setFile] = useState(null);
  const [FileName, setFileName] = useState(defaultFileName);
  const [Percent, setPercent] = useState(0);
  const [ImgSrc, setImgSrc] = useState(null);

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

    try {
      // https://react.vlpt.us/redux-middleware/09-cors-and-proxy.html
      const { data } = await axios.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setPercent(Math.round((100 * e.loaded) / e.total));
        },
      });

      toast.success("이미지 업로드 성공!");
      setTimeout(() => {
        setPercent(0);
        setFileName(defaultFileName);
        setFile(null);
        setImgSrc(null);
      }, 3000);
    } catch (error) {
      toast.error(error.massage);
      setPercent(0);
      setFileName(defaultFileName);
      setFile(null);
      setImgSrc(null);
      console.error(error);
    }
  };

  return (
    <form onSubmit={imageSubmitHandler}>
      <ProgressBar percent={Percent} />
      <img
        className={`image-preview ${ImgSrc && "image-preview-show"}`}
        src={ImgSrc}
        alt="미리보기 이미지"
      />
      <div className="file-dropper">
        {FileName}
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={imageSelectHandler}
        />
      </div>
      <button
        type="submit"
        style={{
          width: "100%",
          borderRadius: 3,
          height: 40,
          cursor: "pointer",
        }}
      >
        제출
      </button>
    </form>
  );
};
