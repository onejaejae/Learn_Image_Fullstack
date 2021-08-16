import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const ImageContext = createContext();

export const ImageProvider = (prop) => {
  const [Images, setImages] = useState([]);
  const [myImages, setMyImages] = useState([]);
  const [isPublic, setIsPublic] = useState(true);
  const [imageUrl, setImageUrl] = useState("/images");
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [me] = useContext(AuthContext);
  const pastImageUrlRef = useRef();

  useEffect(() => {
    if (pastImageUrlRef.current === imageUrl) return;
    setImageLoading(true);
    axios
      .get(imageUrl)
      .then((result) =>
        isPublic
          ? setImages((prevData) => [...prevData, ...result.data.images])
          : setMyImages((prevData) => [...prevData, ...result.data.images])
      )
      .catch((err) => {
        console.log(err);
        setImageError(err);
      })
      .finally(() => {
        setImageLoading(false);
        pastImageUrlRef.current = imageUrl;
      });
  }, [imageUrl, isPublic]);

  useEffect(() => {
    const fetchMyImages = async () => {
      try {
        const {
          data: { images },
        } = await axios.get("/users/personal/images");
        setMyImages(images);
      } catch (error) {
        console.error(error);
      }
    };

    if (me)
      setTimeout(() => {
        fetchMyImages();
      }, 0);
    else {
      setMyImages([]);
      setIsPublic(true);
    }
  }, [me]);

  return (
    <ImageContext.Provider
      value={{
        Images: isPublic ? Images : myImages,
        setImages,
        setMyImages,
        isPublic,
        setIsPublic,
        imageLoading,
        imageError,
        setImageUrl,
      }}
    >
      {prop.children}
    </ImageContext.Provider>
  );
};
