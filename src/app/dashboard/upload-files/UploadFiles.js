"use client";
import React, { useState, useContext, useEffect } from "react";
import CreateNewDataBaseModal from "../modals/create-new-database/createNewDataBaseModal";
import ImportMediaModal from "../modals/create-new-database/importMediaModal";
import DisplayDataBaseModal from "../modals/create-new-database/displayDataBaseModal";
import { ImageContext } from "@/contexts/ImageContext";

// Reusable button styles
const buttonStyle = (bgColor, textColor) => ({
  padding: "2px 2px",
  fontSize: "12px",
  cursor: "pointer",
  backgroundColor: bgColor,
  border: "none",
  borderRadius: "20px",
  color: textColor,
  width: "200px",
  margin: "5px 0",
  transition: "background 0.3s ease",
  textAlign: "center",
  display: "flex", // Ensures button content is centered
  justifyContent: "center", // Centers text inside button
  alignItems: "center",
  // marginTop: "50px",  // Added spacing below search bar
  // padding: "40px",  // Increased padding for better spacing
});

export default function UploadFiles({ setIsButtonClicked }) {
  const [showCreateDbModal, setShowCreateDbModal] = useState(false);
  const [showImportMediaModal, setShowImportMediaModal] = useState(false);
  const [showDisplayDbModal, setShowDisplayDbModal] = useState(false);

  // State for folder selections from CreateNewDataBaseModal
  const [folderSelections, setFolderSelections] = useState([]);

  // State for the selected folders from ImportMediaModal
  const [selectedFolders, setSelectedFolders] = useState([]);

  // State to hold only the checked images from the modal
  // const [finalSelectedImages, setFinalSelectedImages] = useState([]);

  // State for Media Info Modal
  const [showMediaInfoModal, setShowMediaInfoModal] = useState(false);
  const [mediaInfoFile, setMediaInfoFile] = useState(null);

  // Get the setter for the selected image from your ImageContext
  const { setSelectedImage } = useContext(ImageContext);

  // Your existing state
  const { setUploadedFiles } = useContext(ImageContext);

  const { finalSelectedImages, setFinalSelectedImages } =
    useContext(ImageContext); // ✅ Get from context
  const [localFinalSelectedImages, setLocalFinalSelectedImages] = useState([]); // ✅ Keep local state for usage

  // Sync local state with context when it updates
  useEffect(() => {
    setFinalSelectedImages(localFinalSelectedImages); // ✅ Ensure it's always up to date
  }, [localFinalSelectedImages, setFinalSelectedImages]);

  const [searchQuery, setSearchQuery] = useState("");
  // const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAscending, setIsAscending] = useState(true);
  const [items, setItems] = useState(["Banana", "Apple", "Cherry", "Date"]);
  const [isGridView, setIsGridView] = useState(false);
  // const [bgColor, setBgColor] = useState("#f1f1f1"); // Default color

  // const handleButtonClick = () => {
  //   setIsButtonClicked(true); // Update state when any button is clicked
  //   setBgColor("#e7eaee"); // Change background on click
  // };

  // Sorting Function
  const handleSort = () => {
    setIsAscending(!isAscending);
  };

  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  const handleCombinedClick = () => {
    handleButtonClick(); // Changes search bar background
    handleOpenCreateDatabase(); // Opens the modal
  };

  const handleOpenCreateDatabase = () => {
    console.log("Create New Database button clicked");
    setShowCreateDbModal(true);
  };

  // When an image row is clicked, update the context with the image URL.
  const handleImageClick = (file) => {
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(files); // Store images in context
  };

  // Handler for when Media Info is clicked
  const handleMediaInfoClick = (file) => {
    setMediaInfoFile(file);
    setShowMediaInfoModal(true);
  };

  return (
    <>
      <div
        className="databaseLeftContainer"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // This centers items horizontally
          justifyContent: "flex-start", // Change this from 'center' to 'flex-start' to push content down
          width: "90%",
          height: "700px",
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
          // padding: "10px",
          flexWrap: "nowrap", // Prevent wrapping
          paddingBottom: "40px",
          marginTop: "30px", // This will add space at the top to push content downward
          marginLeft: "30px",
        }}
      >
        {/* Top Navigation: Search and Controls */}
        <div
          className="buttonRowContainer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between", // ✅ Push left and right sides apart
            width: "100%", // Ensures full row width
            padding: "10px 10px", // Optional padding for spacing
          }}
        >
          {/* Left side: Search Input & + Button */}
          <div
            className="leftSideButtonContainer"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <button
              // onClick={handleButtonClick}
              style={{
                width: "30px",
                height: "30px",
                fontSize: "40px",
                fontWeight: "300",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#d6d6d6",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: "2",
                paddingBottom: "5px",
              }}
            >
              +
            </button>

            <input
              type="text"
              value={searchQuery}
              // onClick={handleButtonClick}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              onBlur={() => setIsExpanded(false)}
              style={{
                width: isExpanded ? "200px" : "120px",
                padding: "8px 8px 8px 30px",
                transition: "width 0.3s ease",
                height: "30px",
                borderRadius: "20px",
                border: "none",
                backgroundColor: "#d6d6d6",
                outline: "none",
                boxShadow: "none",
                backgroundImage: "url('/images/logos/searchIcon.png')",
                backgroundSize: "20px 20px",
                backgroundPosition: "10px center",
                backgroundRepeat: "no-repeat",
              }}
            />
          </div>

          {/* Right side: Info, Sort, Grid/List Buttons */}
          <div
            className="rightSideButtonContainer"
            style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}
          >
            <button
              // onClick={handleButtonClick}
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "#d6d6d6",
                backgroundImage: `url('/images/logos/DB Info.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: "pointer",
              }}
            ></button>

            <button
              onClick={(e) => {
                handleSort();
                handleButtonClick();
              }}
              style={{
                width: "70px", // Keeps the button size fixed
                height: "30px",
                display: "flex",
                flexDirection: "column", // Stack icons vertically
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "7px",
                backgroundColor: "#d6d6d6",
                cursor: "pointer",
                paddingRight: "30px", // ✅ Extends button to the right
                paddingLeft: "0px", // ✅ Extends button to the left
                paddingTop: "0px",
                gap: "3px", // ✅ Keeps spacing consistent
              }}
            >
              {/* Ascending Icon (Bigger) */}
              <img
                src="/images/logos/upCaretIcon.png"
                alt="Up Arrow"
                style={{
                  width: "12px", // ✅ Slightly larger
                  height: "12px",
                  objectFit: "contain",
                  transform: "scale(1)", // ✅ Enlarges without changing button size
                  flexShrink: 0, // ✅ Prevents shrinking inside flexbox
                }}
              />

              {/* Descending Icon (Bigger) */}
              <img
                src="/images/logos/downCareticon.png"
                alt="Down Arrow"
                style={{
                  width: "12px", // ✅ Slightly larger
                  height: "12px",
                  objectFit: "contain",
                  transform: "scale(1)", // ✅ Enlarges without affecting layout
                  flexShrink: 0, // ✅ Keeps size stable
                }}
              />
            </button>

            <button
              onClick={(e) => {
                toggleView();
                handleButtonClick();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                padding: "px 10px",
                borderRadius: "5px",
                width: "45px", // Adjust size as needed
                height: "30px",
                // border: "1px solid #ccc",
                // backgroundColor: "#f4f4f4",
                cursor: "pointer",
              }}
            >
              <img
                src={
                  isGridView
                    ? "/images/logos/Toggle Grid.png" // Replace with actual grid view image path
                    : "/images/logos/toggle list.png" // Replace with actual list view image path
                }
                alt={isGridView ? "Grid View" : "List View"}
                style={{
                  width: "25px", // Adjust size as needed
                  height: "25px",
                  objectFit: "contain",
                }}
              />
            </button>
          </div>
        </div>

        {/* Center Buttons for Database */}
        <div
          style={{
            display: "flex",
            flexDirection: "column", // ✅ Stack buttons vertically
            alignItems: "center", // ✅ Keep them centered
            gap: "5px", // ✅ Adds spacing between buttons
            marginTop: "250px", // ✅ Moves all buttons down
          }}
        >
          <button
            style={buttonStyle("#4a88ff", "white")}
            // onClick={handleButtonClick}
            onMouseOver={(e) => (e.currentTarget.style.background = "#2a6cd3")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#4a88ff")}
          >
            Open a database
          </button>

          <button
            style={buttonStyle("#4a88ff", "white")}
            // onClick={handleButtonClick}
            onMouseOver={(e) => (e.currentTarget.style.background = "#2a6cd3")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#4a88ff")}
          >
            Connect to ES database
          </button>

          <button
            style={buttonStyle("#4a88ff", "white")}
            // onClick={handleButtonClick}
            disabled
          >
            Connect to live video
          </button>

          <button
            style={buttonStyle("#a9d096", "white")}
            onMouseOver={(e) => (e.currentTarget.style.background = "#7fa763")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#a9d096")}
            // onClick={handleCombinedClick} // Both functions run properly
          >
            Create new database
          </button>

          {/* 1. Create New Database Modal */}
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

          {/* 2. Import Media Modal */}
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

          {/* 3. Display Database Modal (FINAL STEP) */}
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
      </div>
    </>
  );
}
