import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
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

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setImageLoading(true);
        const {
          data: { images },
        } = await axios.get(imageUrl);
        setImages((prevData) => [...prevData, ...images]);
      } catch (error) {
        setImageError(error);
        console.error(error);
      } finally {
        setImageLoading(false);
      }
    };
    fetchImages();
  }, [imageUrl]);

  useEffect(() => {
    const fetchMyImages = async () => {
      try {
        const { data } = await axios.get("/users/personal");
        setMyImages(data);
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

  const lastImage = Images.length > 0 ? Images[Images.length - 1]._id : null;

  const loadMoreImages = useCallback(() => {
    if (imageLoading || !lastImage) return;

    setImageUrl(`/images?imageId=${lastImage}`);
  }, [lastImage, imageLoading]);

  return (
    <ImageContext.Provider
      value={{
        Images,
        setImages,
        myImages,
        setMyImages,
        isPublic,
        setIsPublic,
        loadMoreImages,
        imageLoading,
        imageError,
      }}
    >
      {prop.children}
    </ImageContext.Provider>
  );
};
