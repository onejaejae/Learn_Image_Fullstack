import React, { useContext, useRef, useEffect, useCallback } from "react";
import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "./ImageList.css";

export const ImageList = () => {
  const {
    Images,
    isPublic,
    setIsPublic,
    imageLoading,
    imageError,
    setImageUrl,
  } = useContext(ImageContext);

  const [me] = useContext(AuthContext);
  const elementRef = useRef(null);

  const loadMoreImages = useCallback(() => {
    if (Images.length === 0 || imageLoading) return;
    const lastImage = Images[Images.length - 1]._id;
    setImageUrl(
      `${isPublic ? "" : "/users/personal"}/images?imageId=${lastImage}`
    );
  }, [Images, imageLoading, isPublic, setImageUrl]);

  useEffect(() => {
    if (!elementRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadMoreImages();
    });
    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [loadMoreImages]);

  const imgList = Images.map((image, index) => (
    <Link
      key={image.key}
      to={`/images/${image._id}`}
      ref={index + 5 === Images.length ? elementRef : null}
    >
      <img
        src={`https://imagefullstack.s3.ap-northeast-2.amazonaws.com/raw/${image.key}`}
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
