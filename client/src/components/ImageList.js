import React, { useContext, useRef, useEffect } from "react";
import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "./ImageList.css";

export const ImageList = () => {
  const {
    Images,
    myImages,
    isPublic,
    setIsPublic,
    loadMoreImages,
    imageLoading,
    imageError,
  } = useContext(ImageContext);

  const [me] = useContext(AuthContext);
  const elementRef = useRef(null);

  useEffect(() => {
    if (!elementRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadMoreImages();
    });
    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [loadMoreImages]);

  const imgList = isPublic
    ? Images.map((image, index) => (
        <Link
          key={image.key}
          to={`/images/${image._id}`}
          ref={index + 5 === Images.length ? elementRef : null}
        >
          <img
            src={`http://localhost:5000/uploads/${image.key}`}
            alt="업로드 사진"
          />
        </Link>
      ))
    : myImages.map((image, index) => (
        <Link
          key={image.key}
          to={`/images/${image._id}`}
          ref={index + 5 === myImages.length ? elementRef : null}
        >
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
      {imageError && <div>Error...</div>}
      {imageLoading && <div>Loading...</div>}
    </div>
  );
};
