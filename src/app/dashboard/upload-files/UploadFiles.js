"use client";
import React, { useState } from "react";
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

export default function UploadFiles() {
  const [showCreateDbModal, setShowCreateDbModal] = useState(false);
  const [showImportMediaModal, setShowImportMediaModal] = useState(false);
  const [showDisplayDbModal, setShowDisplayDbModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAscending, setIsAscending] = useState(true);
  const [items, setItems] = useState(["Banana", "Apple", "Cherry", "Date"]);
  const [isGridView, setIsGridView] = useState(false);

  const handleButtonClick = () => {
    setIsButtonClicked(true); // Update state when any button is clicked
  };

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

  return (
    <>
      {/* Search Within Parent Container */}
      {/* <div
      style={{
        padding: "20px",
        color: "black",
        width: "100%",
        backgroundColor: "#f4f4f4",
      }}
    > */}
      {/* Search Within Parent Container */}
      <div
        style={{
          width: "100%",
          backgroundColor: isButtonClicked ? "#0b2856" : "#d6d6d6", // Change background on click
          padding: "10px 20px",
          fontSize: "16px",
          fontWeight: "600",
          color: "white",
          transition: "background 0.3s ease",
          borderTopRightRadius: "10px", // Rounds only the top-right corner
        }}
      >
        Search within...
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "600px",
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
          padding: "20px",
          flexWrap: "nowrap", // Prevent wrapping
          paddingBottom: "40px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Search Input, + Button */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              paddingTop: "0px",
              marginBottom: "0px",
              position: "relative",
              width: "100%",
            }}
          >
            <button
              style={{
                width: "35px",
                height: "35px",
                width: "30px", // ✅ Smaller background
                height: "30px", // ✅ Smaller background
                fontSize: "24px", // ✅ Bigger "+"
                fontWeight: "bold",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#d6d6d6",
                color: "white",
                fontSize: "20px",
                cursor: "pointer",
                marginRight: "10px",
                marginTop: "-210px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              +
            </button>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              onBlur={() => setIsExpanded(false)}
              style={{
                width: isExpanded ? "70%" : "30%",
                padding: "8px",
                transition: "width 0.3s ease",
                height: "30px", // ✅ Smaller background
                borderRadius: "5px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#d6d6d6",
                // backgroundImage: 'url("/images/logos/searchIcon.png")',
                marginTop: "-210px", // Ensures it stays at the top
                outline: "none", // Removes default browser focus outline
                boxShadow: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "#d6d6d6",
                backgroundImage: `url('/images/logos/DB Info.png')`, // Replace with the correct path
                backgroundSize: "cover", // Ensures the image covers the button
                backgroundPosition: "center", // Centers the image
                cursor: "pointer",
                marginTop: "-170px",
                marginLeft: "auto",
                marginTop: "-390px",
              }}
            ></button>

            {/* A-Z Sorting Button */}
            <button
              onClick={handleSort}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "#f4f4f4",
                cursor: "pointer",
                marginLeft: "10px",
                marginTop: "-390px",
              }}
            >
              {isAscending ? " 🔼" : " 🔽"}
            </button>
          </div>

          {/* Grid/List Toggle Button */}
          <button
            onClick={toggleView}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "5px 10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              backgroundColor: "#f4f4f4",
              cursor: "pointer",
              marginBottom: "10px",
              marginTop: "-380px",
            }}
          >
            {isGridView ? "🔳" : "📄"}
          </button>

          {/* Items Container */}
          <div
            style={{
              display: isGridView ? "grid" : "block",
              gridTemplateColumns: isGridView ? "repeat(2, 1fr)" : "none",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                style={{
                  width: "100%",
                  height: "50px",
                  backgroundColor: "#e8e8e8",
                  borderRadius: "5px",
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Buttons */}
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
        {/* </div> */}
      </div>
    </>
  );
}
