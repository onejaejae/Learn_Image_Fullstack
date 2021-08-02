import React, { useContext } from "react";
import { ImageContext } from "../context/ImageContext";

export const ImageList = () => {
  const [Images] = useContext(ImageContext);

  const imgList = Images.map((image) => (
    <img
      key={image.key}
      style={{ width: "100%" }}
      src={`http://localhost:5000/uploads/${image.key}`}
      alt="업로드 사진"
    />
  ));

  return (
    <div>
      <h3>Image List</h3>
      {imgList}
    </div>
  );
};
