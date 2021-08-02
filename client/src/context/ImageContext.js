import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ImageContext = createContext();

export const ImageProvider = (prop) => {
  const [Images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const {
          data: { images },
        } = await axios.get("/images");
        setImages(images);
      } catch (error) {
        console.log(error);
      }
    };

    fetchImages();
  }, []);

  return (
    <ImageContext.Provider value={[Images, setImages]}>
      {prop.children}
    </ImageContext.Provider>
  );
};
