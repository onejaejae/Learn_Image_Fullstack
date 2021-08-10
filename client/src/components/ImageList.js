import React, { useContext, useState } from "react";
import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "./ImageList.css";

export const ImageList = () => {
  const { Images, myImages, isPublic, setIsPublic } = useContext(ImageContext);
  const [me] = useContext(AuthContext);

  const imgList = (isPublic ? Images : myImages).map((image) => (
    <Link key={image.key} to={`/images/${image._id}`}>
      <img
        src={`http://localhost:5000/uploads/${image.key}`}
        alt="업로드 사진"
      />
    </Link>
  ));

  return (
    <div>
      <h3 style={{ display: "inline-block", marginRight: 10 }}>
        Image List ({isPublic ? "공개" : "개인"} 사진)
      </h3>
      {me && (
        <button onClick={() => setIsPublic(!isPublic)}>
          {isPublic ? "개인" : "공개"} 사진 보기
        </button>
      )}
      <div className="image-list-container">{imgList}</div>
    </div>
  );
};
