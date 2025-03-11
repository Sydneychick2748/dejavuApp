"use client";
import { createContext, useState } from "react";

// Create context
export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]); // Store uploaded images

  return (
    <ImageContext.Provider value={{ selectedImage, setSelectedImage, uploadedFiles, setUploadedFiles }}>
      {children}
    </ImageContext.Provider>
  );
};
