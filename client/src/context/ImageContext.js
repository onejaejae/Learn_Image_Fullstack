import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const ImageContext = createContext();

export const ImageProvider = (prop) => {
  const [Images, setImages] = useState([]);
  const [myImages, setMyImages] = useState([]);
  const [isPublic, setIsPublic] = useState(true);

  const [me] = useContext(AuthContext);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const {
          data: { images },
        } = await axios.get("/images");
        setImages(images);
      } catch (error) {
        console.error(error);
      }
    };
    fetchImages();
  }, []);

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

  return (
    <ImageContext.Provider
      value={{
        Images,
        setImages,
        myImages,
        setMyImages,
        isPublic,
        setIsPublic,
      }}
    >
      {prop.children}
    </ImageContext.Provider>
  );
};
