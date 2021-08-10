import React, { useState, useContext } from "react";
import axios from "axios";
import "./UploadForm.css";
import { toast } from "react-toastify";
import { ProgressBar } from "./ProgressBar";
import { ImageContext } from "../context/ImageContext";

export const UploadForm = () => {
  const defaultFileName = "이미지 파일을 업로드 해주세요";
  const [Files, setFiles] = useState(null);
  const [Percent, setPercent] = useState(0);
  const [isPublic, setIsPublic] = useState(true);
  const [previews, setPreviews] = useState([]);

  const { Images, setImages, myImages, setMyImages } = useContext(ImageContext);

  const imageSelectHandler = async (e) => {
    const imageFiles = e.target.files;
    setFiles(imageFiles);

    const imagePreviews = await Promise.all(
      [...imageFiles].map((imageFile) => {
        return new Promise((resolve, reject) => {
          try {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(imageFile);
            fileReader.onload = (e) =>
              resolve({ imgSrc: e.target.result, filename: imageFile.name });
          } catch (error) {
            reject(error);
          }
        });
      })
    );

    setPreviews(imagePreviews);
  };

  const imageSubmitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (let file of Files) {
      formData.append("image", file);
    }
    formData.append("public", isPublic);

    try {
      // https://react.vlpt.us/redux-middleware/09-cors-and-proxy.html
      const { data } = await axios.post("/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setPercent(Math.round((100 * e.loaded) / e.total));
        },
      });

      if (isPublic) setImages([...Images, ...data]);
      else setMyImages([...myImages, ...data]);

      toast.success("이미지 업로드 성공!");
      setTimeout(() => {
        setPercent(0);

        setPreviews([]);
      }, 3000);
    } catch (error) {
      toast.error(error.response.data.message);
      setPercent(0);

      setPreviews([]);
      console.error(error);
    }
  };

  const previewImages = previews.map((preview, index) => (
    <img
      style={{ width: 200, height: 200, objectFit: "cover" }}
      key={index}
      src={preview.imgSrc}
      alt=""
      className={`image-preview ${preview.ImgSrc && "image-preview-show"}`}
    />
  ));

  const fileName =
    previews.length === 0
      ? "이미지 파일을 업로드 해주세요."
      : previews.reduce(
          (previous, current) => previous + `${current.fileName}`,
          ""
        );

  return (
    <form onSubmit={imageSubmitHandler}>
      <div style={{ display: "flex", flexWrap: "wrap" }}>{previewImages}</div>
      <ProgressBar percent={Percent} />
      <div className="file-dropper">
        {fileName}
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={imageSelectHandler}
          multiple
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
