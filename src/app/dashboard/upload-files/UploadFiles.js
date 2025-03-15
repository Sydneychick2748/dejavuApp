"use client";
import React, { useState, useContext,useEffect } from "react";
import CreateNewDataBaseModal from "../modals/create-new-database/createNewDataBaseModal";
import ImportMediaModal from "../modals/create-new-database/importMediaModal";
import DisplayDataBaseModal from "../modals/create-new-database/displayDataBaseModal";

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
   
  const { finalSelectedImages, setFinalSelectedImages } = useContext(ImageContext); // ✅ Get from context
  const [localFinalSelectedImages, setLocalFinalSelectedImages] = useState([]); // ✅ Keep local state for usage

  // Sync local state with context when it updates
  useEffect(() => {
    setFinalSelectedImages(localFinalSelectedImages); // ✅ Ensure it's always up to date
  }, [localFinalSelectedImages, setFinalSelectedImages]);



  const handleOpenCreateDatabase = () => {
    console.log("Create New Database button clicked");
    setShowCreateDbModal(true);
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
          height: "650px",
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
              onClick={handleButtonClick}
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
              onClick={handleButtonClick}
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
              onClick={handleButtonClick}
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
                backgroundColor: "#f4f4f4",
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

        {/* Buttons */}
        <div
        style={{
          display: "flex",
          flexDirection: "column", // ✅ Stack buttons vertically
          alignItems: "center", // ✅ Keep them centered
          gap: "5px", // ✅ Adds spacing between buttons
          marginTop: "180px", // ✅ Moves all buttons down
        }}
        >
        <button
          style={buttonStyle("#4a88ff", "white")}
          onClick={handleButtonClick}
          onMouseOver={(e) => (e.currentTarget.style.background = "#2a6cd3")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#4a88ff")}
        >
          Open a database
        </button>

        <button
          style={buttonStyle("#4a88ff", "white")}
          onClick={handleButtonClick}
          onMouseOver={(e) => (e.currentTarget.style.background = "#2a6cd3")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#4a88ff")}
        >
          Connect to ES database
        </button>

        <button
          style={buttonStyle("#4a88ff", "white")}
          onClick={handleButtonClick}
          disabled
        >
          Connect to live video
        </button>

        <button
          style={buttonStyle("#a9d096", "white")}
          onMouseOver={(e) => (e.currentTarget.style.background = "#7fa763")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#a9d096")}
          onClick={handleCombinedClick} // Both functions run properly
        >
          Create new database
        </button>

        {/* 1. Create New Database Modal */}
        {showCreateDbModal && (
          <CreateNewDataBaseModal
            onClose={() => {
              console.log("Closing CreateNewDataBaseModal");
              setShowCreateDbModal(false);
            }}
            onNext={() => {
              console.log(
                "Proceeding from CreateNewDataBaseModal to ImportMediaModal"
              );
              setShowCreateDbModal(false);
              setShowImportMediaModal(true);
            }}
          />
        )}

        {/* 2. Import Media Modal */}
        {showImportMediaModal && (
          <ImportMediaModal
            onClose={() => {
              console.log("Closing ImportMediaModal");
              setShowImportMediaModal(false);
            }}
            onNext={() => {
              console.log(
                "Proceeding from ImportMediaModal to DisplayDataBaseModal"
              );
              setShowImportMediaModal(false);
              setShowDisplayDbModal(true);
            }}
          />
        )}

        {/* 3. Display Database Modal (FINAL STEP) */}
        {showDisplayDbModal && (
          <DisplayDataBaseModal
            onClose={() => {
              console.log("Closing DisplayDataBaseModal");
              setShowDisplayDbModal(false);
            }}
            onNext={() => {
              console.log(
                "Finishing DisplayDataBaseModal and returning to UploadFiles UI"
              );
              setShowDisplayDbModal(false);
            }}
          />
        )}
        </div>
      </div>
    </>
  );
}
