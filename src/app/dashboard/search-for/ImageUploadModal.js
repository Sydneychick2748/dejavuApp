

import React, { useState, useEffect } from "react";
import { FaUpload } from "react-icons/fa";
import imageUploadState from "./imageUploadState";
import { generateUniqueId } from "@/utils/idGenerator"; // Import the global ID generator

// Modal for uploading images only
const ImageUploadModal = ({ onClose, onSelect }) => {
  const [uploadedImages, setUploadedImages] = useState(imageUploadState.getUploadedImages());
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Sync local state with global state on mount
  useEffect(() => {
    setUploadedImages(imageUploadState.getUploadedImages());
  }, []);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (files.length !== event.target.files.length) {
      setErrorMessage("Only image files are allowed. Non-image files were ignored.");
      setTimeout(() => setErrorMessage(""), 3000);
    }

    if (files.length === 0) {
      return;
    }

    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    // Update global state
    imageUploadState.addUploadedImages(newImages);

    // Update local state to reflect the change
    setUploadedImages(imageUploadState.getUploadedImages());
  };

  const handleSelectImage = (image) => {
    setSelectedImagePreview(image.url);
    setSelectedFile(image.file);
  };

  const handleConfirm = () => {
    if (selectedFile) {
      // Assign a unique id to the file before passing it to onSelect
      const fileWithId = Object.assign(selectedFile, {
        id: generateUniqueId("modal-"), // Use global ID generator with a prefix
      });

      onSelect({
        file: fileWithId, // Pass the File object with the unique id
        fileUrl: selectedImagePreview,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
      });
    }
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        borderRadius: "8px",
        zIndex: 1000,
        width: "900px",
        height: "500px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 4px 15px rgba(0, 0, 123, 0.2)",
      }}
    >
      <div
        style={{
          width: "100%",
          backgroundColor: "#EEF2FF",
          borderRadius: "8px 8px 0 0",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: "40px",
        }}
      >
        <h3 style={{ color: "black", margin: 0, fontSize: 15 }}>
          Upload an Image
        </h3>
        <button
          onClick={onClose}
          style={{
            width: "24px",
            height: "24px",
            backgroundColor: "white",
            borderRadius: "50%",
            border: "none",
            color: "black",
            fontSize: "16px",
            fontWeight: "400",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            padding: 0,
            transition: "background-color 0.3s ease",
          }}
        >
          ×
        </button>
      </div>
      <div
        style={{
          display: "flex",
          flex: 1,
          padding: "10px",
        }}
      >
        <div
          style={{
            flex: 1,
            padding: "10px",
            overflowY: "auto",
            borderRight: "1px solid #ddd",
          }}
        >
          <p style={{ color: "#000", marginBottom: "10px", fontSize: "14px" }}>
            Please upload image files only (e.g., .jpg, .png).
          </p>
          <label
            style={{
              padding: "8px 16px",
              border: "none",
              cursor: "pointer",
              backgroundColor: "#E0E7FF",
              color: "#0056D2",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              transition: "background-color 0.3s ease",
            }}
          >
            <FaUpload /> Upload Image
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </label>
          {errorMessage && (
            <p style={{ color: "red", marginTop: "10px", fontSize: "14px" }}>
              {errorMessage}
            </p>
          )}
          {uploadedImages.length > 0 ? (
            uploadedImages.map((image, index) => (
              <div
                key={index}
                style={{
                  padding: "8px 10px",
                  margin: "5px 0",
                  cursor: "pointer",
                  backgroundColor: selectedImagePreview === image.url ? "#E0E7FF" : "transparent",
                  color: selectedImagePreview === image.url ? "#0056D2" : "#000",
                  borderRadius: "5px",
                  transition: "background-color 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  height: "40px",
                  overflow: "hidden",
                }}
                onClick={() => handleSelectImage(image)}
              >
                <img
                  src={image.url}
                  alt={image.file.name}
                  style={{
                    width: "30px",
                    height: "30px",
                    objectFit: "cover",
                    borderRadius: "3px",
                  }}
                />
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {image.file.name}
                </span>
              </div>
            ))
          ) : (
            <p style={{ color: "#000", marginTop: "10px" }}>
              No images uploaded yet.
            </p>
          )}
        </div>
        <div
          style={{
            flex: 1,
            padding: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#F9FBFF",
          }}
        >
          {selectedImagePreview ? (
            <img
              src={selectedImagePreview}
              alt="Selected Image"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                height: "300px",
                objectFit: "contain",
                borderRadius: "5px",
              }}
            />
          ) : (
            <p style={{ color: "#000" }}>Select an image to preview</p>
          )}
        </div>
      </div>
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          justifyContent: "flex-end",
          padding: "10px 20px",
        }}
      >
        <button
          onClick={onClose}
          style={{
            padding: "8px 16px",
            marginLeft: "10px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#E8E8E8",
            color: "black",
            width: "220px",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: "1",
            paddingTop: "6px",
            transition: "background-color 0.3s ease",
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          style={{
            padding: "8px 16px",
            marginLeft: "10px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#007BFF",
            color: "#FFFFFF",
            width: "220px",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: "1",
            paddingTop: "6px",
            transition: "background-color 0.3s ease",
          }}
          disabled={!selectedImagePreview}
        >
          Open
        </button>
      </div>
    </div>
  );
};

export default ImageUploadModal;

