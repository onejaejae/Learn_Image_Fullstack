import React, { useState, useContext, useRef } from "react";
import axios from "axios";
import "./UploadForm.css";
import { toast } from "react-toastify";
import { ProgressBar } from "./ProgressBar";
import { ImageContext } from "../context/ImageContext";

export const UploadForm = () => {
  const [Files, setFiles] = useState(null);
  const [Percent, setPercent] = useState([]);
  const [isPublic, setIsPublic] = useState(true);
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setImages, setMyImages } = useContext(ImageContext);
  const inputRef = useRef();

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

  const imageSubmitHandler2 = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const presignedData = await axios.post("/images/presigned", {
        contentTypes: [...Files].map((file) => file.type),
      });

      // 위에서 서버에 요청해 받아온 S3 pre-signed URL을 이용해 client에서 s3에 저장
      await Promise.all(
        [...Files].map((file, index) => {
          const { presigned } = presignedData.data[index];

          const formData = new FormData();
          for (const key in presigned.fields) {
            formData.append(key, presigned.fields[key]);
          }

          formData.append("Content-Type", file.type);
          // file을 append 할 때는 항상 마지막에 해야한다.
          // 순서에 유의하자!
          formData.append("file", file);

          // const result = awiat axios.post(presigned.url, formData);
          // return result와 동일한 의미이다
          // promise.all을 사용했기 때문에
          // return axios.post(presigned.url, formData);가 위와 같은 의미가 된다.
          return axios.post(presigned.url, formData, {
            onUploadProgress: (e) => {
              setPercent((prevData) => {
                const newData = [...prevData];
                newData[index] = Math.round((100 * e.loaded) / e.total);
                return newData;
              });
            },
          });
        })
      );

      const res = await axios.post("images", {
        images: [...Files].map((file, index) => ({
          imageKey: presignedData.data[index].imageKey,
          originalname: file.name,
        })),
        isPublic,
      });

      if (isPublic) setImages((prevData) => [...res.data, ...prevData]);
      setMyImages((prevData) => [...res.data, ...prevData]);

      toast.success("이미지 업로드 성공!");
      setTimeout(() => {
        inputRef.current.value = null;
        setPercent([]);
        setPreviews([]);
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      // toast.error(error.response.data.message);
      setPercent([]);
      setPreviews([]);
      setIsLoading(false);
    }
  };

  // const imageSubmitHandler = async (e) => {
  //   e.preventDefault();

  //   const formData = new FormData();
  //   for (let file of Files) {
  //     formData.append("image", file);
  //   }
  //   formData.append("public", isPublic);

  //   try {
  //     // https://react.vlpt.us/redux-middleware/09-cors-and-proxy.html
  //     const { data } = await axios.post("/images", formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //       onUploadProgress: (e) => {
  //         setPercent(Math.round((100 * e.loaded) / e.total));
  //       },
  //     });

  //     if (isPublic) setImages((prevData) => [...data, ...prevData]);
  //     setMyImages((prevData) => [...data, ...prevData]);

  //     toast.success("이미지 업로드 성공!");
  //     setTimeout(() => {
  //       inputRef.current.value = null;
  //       setPercent([]);
  //       setPreviews([]);
  //     }, 3000);
  //   } catch (error) {
  //     console.error(error);
  //     toast.error(error.response.data.message);
  //     setPercent([]);
  //     setPreviews([]);
  //   }
  // };

  const previewImages = previews.map((preview, index) => (
    <div key={index}>
      <img
        style={{ width: 200, height: 200, objectFit: "cover" }}
        src={preview.imgSrc}
        alt=""
        className={`image-preview ${preview.imgSrc && "image-preview-show"}`}
      />
      <ProgressBar percent={Percent[index]} />
    </div>
  ));

  const fileName =
    previews.length === 0
      ? "이미지 파일을 업로드 해주세요."
      : previews.reduce(
          (previous, current) => previous + `${current.filename}`,
          ""
        );

  return (
    <form onSubmit={imageSubmitHandler2}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        {previewImages}
      </div>
      <div className="file-dropper">
        {fileName}
        <input
          ref={(ref) => {
            inputRef.current = ref;
          }}
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
        disabled={isLoading}
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
