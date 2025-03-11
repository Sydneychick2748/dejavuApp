
"use client";
import React, { useState, useContext } from "react";
import CreateNewDataBaseModal from "../modals/create-new-database/createNewDataBaseModal";
import ImportMediaModal from "../modals/create-new-database/importMediaModal";
import DisplayDataBaseModal from "../modals/create-new-database/displayDataBaseModal";
import { ImageContext } from "@/contexts/ImageContext";


export default function UploadFiles() {
  // Modal chain states
  // const { setUploadedFiles } = useImageContext();
  const [showCreateDbModal, setShowCreateDbModal] = useState(false);
  const [showImportMediaModal, setShowImportMediaModal] = useState(false);
  const [showDisplayDbModal, setShowDisplayDbModal] = useState(false);

  // State for folder selections from CreateNewDataBaseModal
  const [folderSelections, setFolderSelections] = useState([]);
  // State for the selected folders from ImportMediaModal
  const [selectedFolders, setSelectedFolders] = useState([]);
  // State to hold only the checked images from the modal
  const [finalSelectedImages, setFinalSelectedImages] = useState([]);

  // State for Media Info Modal
  const [showMediaInfoModal, setShowMediaInfoModal] = useState(false);
  const [mediaInfoFile, setMediaInfoFile] = useState(null);

  // Get the setter for the selected image from your ImageContext
   const { setSelectedImage } = useContext(ImageContext);
  // Your existing state
  const { setUploadedFiles } = useContext(ImageContext);
  


  const handleOpenCreateDatabase = () => {
    setShowCreateDbModal(true);
  };

  // When an image row is clicked, update the context with the image URL.
  const handleImageClick = (file) => {
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
   
};
  

  // Handler for when Media Info is clicked
  const handleMediaInfoClick = (file) => {
    setMediaInfoFile(file);
    setShowMediaInfoModal(true);
  };



  
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(files); // Store images in context
  };
  

  return (
    <div style={{ padding: "20px", color: "black" }}>
     
    
      <button
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
        onClick={handleOpenCreateDatabase}
      >
        Create New Database
      </button>

      {/* STEP 1: Create New Database Modal */}
      {showCreateDbModal && (
        <CreateNewDataBaseModal
          onClose={() => setShowCreateDbModal(false)}
          onNext={(folders) => {
            setFolderSelections(folders);
            setShowCreateDbModal(false);
            setShowImportMediaModal(true);
          }}
        />
      )}

      {/* STEP 2: Import Media Modal */}
      {showImportMediaModal && (
        <ImportMediaModal
          folderSelections={folderSelections}
          onClose={() => setShowImportMediaModal(false)}
          onNext={(folders) => {
            setSelectedFolders(folders);
            setShowImportMediaModal(false);
            setShowDisplayDbModal(true);
          }}
        />
      )}

      {/* STEP 3: Display Database Modal */}
      {showDisplayDbModal && (
        <DisplayDataBaseModal
          onClose={() => setShowDisplayDbModal(false)}
          onNext={(selectedFiles) => {
            // Store only checked images
            setFinalSelectedImages(selectedFiles);
            setShowDisplayDbModal(false);
          }}
          selectedFolders={selectedFolders}
        />
      )}

     {/* Final Gallery Display on Main Page (ONLY CHECKED IMAGES) */}
{finalSelectedImages.length > 0 && !showDisplayDbModal && (
  <div style={{ marginTop: "30px" }}>
    <h3>Final Gallery</h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {finalSelectedImages.map((file, index, arr) => {
        const imageUrl = URL.createObjectURL(file); // Generate URL once

        return (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid #ddd",
              padding: "10px 0",
              cursor: "pointer",
            }}
            onClick={() => handleImageClick(file)} // Handle click for selection
          >
    
            {/* Left: Numbering */}
            <div style={{ width: "60px", textAlign: "center", fontWeight: "bold" }}>
              {index + 1} of {arr.length}
            </div>
           
            {/* Thumbnail */}
            <div>
              <img
                src={imageUrl} // Use stored imageUrl
                alt={file.name}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "4px",
                  marginRight: "10px",
                }}
              />
            </div>

            {/* Description */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold" }}>{file.name}</div>
              <div
                style={{ fontSize: "0.9rem", color: "#555", cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering handleImageClick
                  handleMediaInfoClick(file);
                }}
              >
                Media Info
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}


      {/* Media Info Modal */}
      {showMediaInfoModal && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#fff",
            padding: "20px",
            border: "1px solid #ccc",
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            zIndex: 1000,
          }}
        >
          <h3>Media Info</h3>
          <p>
            {mediaInfoFile ? `File Name: ${mediaInfoFile.name}` : "No file selected."}
          </p>
          <button onClick={() => setShowMediaInfoModal(false)}>Close</button>
        </div>
      )}
    </div>
  );
}
