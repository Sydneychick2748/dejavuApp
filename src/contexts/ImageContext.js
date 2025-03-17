"use client";
import { createContext, useState } from "react";
// Create context
export const ImageContext = createContext();
export const ImageProvider = ({ children }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFileInfo, setSelectedFileInfo] = useState(null);
  const [finalSelectedImages, setFinalSelectedImages] = useState([]); // :white_check_mark: Added this
  return (
    <ImageContext.Provider
      value={{
        selectedImage,
        setSelectedImage,
        uploadedFiles,
        setUploadedFiles,
        selectedFileInfo,
        setSelectedFileInfo,
        finalSelectedImages, // :white_check_mark: Provide it globally
        setFinalSelectedImages, // :white_check_mark: Allow updates
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};