

"use client";
import { color } from "@chakra-ui/system";
import React, { useState } from "react";
import { FaFolder } from "react-icons/fa";

const CreateNewDataBaseModal = ({ onClose, onNext }) => {
  const [selectedFolders, setSelectedFolders] = useState([]);

  const handleFolderSelect = (event) => {
    const filesArray = Array.from(event.target.files);
    console.log("New folder selection:", filesArray);
    const folderName =
      filesArray.length > 0 && filesArray[0].webkitRelativePath
        ? filesArray[0].webkitRelativePath.split("/")[0]
        : "Unnamed Folder";
    const newSelection = { folderName, files: filesArray };
    setSelectedFolders((prev) => [...prev, newSelection]);
  };

  const handleNextClick = () => {
    console.log("Passing folder selections:", selectedFolders);
    onNext(selectedFolders);
  };

  return (
    <div className="modal" style={modalStyle}>
      <div style={headerStyle}>
        {/* {" "} */}
        {/* Added blue header bar */}       
        <h3 style={{ color: "black", margin: 0, fontSize: 15 }}>
          Select New Database Location
        </h3>
        <button onClick={onClose} style={closeButtonStyle}>
          × {/* Unicode "X" character */}
        </button>
      </div>
      <div style={contentStyle}>
        {" "}
        {/* Added content wrapper */}
        <div style={{ margin: "10px 0" }}>
          {/* <label>Select A folder:</label> */}
        
          <input
            type="file"
            webkitdirectory="true"
            directory="true"
            multiple
            onChange={handleFolderSelect}
            style={{ marginTop: "5px" }}
          />
        </div>
        {selectedFolders.length > 0 && (
          <div style={summaryContainerStyle}>
            {selectedFolders.map((selection, index) => (
              <div key={index} style={summaryStyle}>
                <FaFolder size={32} style={{ marginRight: "8px" }} />
                <div>
                  <div>
                    <strong>{selection.folderName}</strong>
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "#555" }}>
                    {selection.files.length} file
                    {selection.files.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
          <div style={buttonContainerStyle}>
          <button onClick={handleNextClick} style={selectButtonStyle}>
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "45%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  borderRadius: "8px",
  zIndex: 1000,
  display: "block",
  width: "600px", // Increased from 400px to make it larger
  height: "45vh", // Optional: Limits height to 80% of viewport height
  overflowY: "auto", // Optional: Adds scroll if content exceeds maxHeight
};

const headerStyle = {
  backgroundColor: "#eef2ff",
  padding: "10px 20px",
  borderTopLeftRadius: "8px",
  borderTopRightRadius: "8px",
  display: "flex", // Use flexbox for layout
  justifyContent: "space-between", // "Create..." on left, button on right
  alignItems: "center", // Vertically center items
};

const contentStyle = {
  padding: "20px",
  color: "black",
  display: "flex", // Added to use flexbox
  flexDirection: "column", // Stack children vertically
  minHeight: "300px", // Ensures enough height to push button to bottom
  justifyContent: "space-between", // Pushes button container to bottom
};

const summaryContainerStyle = {
  margin: "10px 0",
};

const summaryStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "8px",
};

const buttonContainerStyle = {
  marginTop: "40px",
  display: "flex",
  justifyContent: "flex-end", // Moves button to the right
};

const selectButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "#007bff",
  color: "white",
  borderRadius: "20px",
  border: "none",
  width: "250px",
  height: "30px",
  cursor: "pointer",
  display: "flex", // Added to control text alignment
  alignItems: "center", // Centers text vertically
  justifyContent: "center", // Centers text horizontally
  lineHeight: "1", // Reduces default line height to move text up slightly
  paddingTop: "6px", // Adjusts padding to shift text up within button
};

const closeButtonStyle = {
  width: "24px", // Circle size
  height: "24px",
  backgroundColor: "white", // Red color
  borderRadius: "50%", // Makes it circular
  border: "none", // No border
  color: "black", // White "X"
  fontSize: "16px", // Size of the "X"
  fontWeight: "400",
  display: "flex", // Center the "X"
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer", // Hand cursor on hover
  padding: 0, // Remove default padding
};

export default CreateNewDataBaseModal;
