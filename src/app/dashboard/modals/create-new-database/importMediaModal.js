"use client";
import React, { useState } from "react";
import { FaFolder } from "react-icons/fa";
const ImportMediaModal = ({ folderSelections, onClose, onNext }) => {
  const [selectedIndices, setSelectedIndices] = useState([]);
  const handleFolderClick = (index, folder) => {
    console.log("Folder clicked:", folder);
    setSelectedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  const handleNextClick = () => {
    if (selectedIndices.length > 0) {
      const selectedFolders = selectedIndices.map((index) => folderSelections[index]);
      console.log("Selected folders from ImportMediaModal:", selectedFolders);
      onNext(selectedFolders);
    }
  };
  return (
    <div className="modal" style={modalStyle}>
      <h3>Import Media</h3>
      <p>Select one or more folders from the list below:</p>
      <div style={{ marginTop: "10px" }}>
        {folderSelections && folderSelections.length > 0 ? (
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {folderSelections
              .filter((folder) => folder)
              .map((folder, index) => (
                <li
                  key={index}
                  onClick={() => handleFolderClick(index, folder)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                    padding: "8px",
                    border: selectedIndices.includes(index)
                      ? "2px solid blue"
                      : "1px solid #ccc",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  <FaFolder size={24} style={{ marginRight: "8px" }} />
                  <div>
                    <div style={{ fontWeight: "bold" }}>
                      {folder.folderName || "Unnamed Folder"}
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#555" }}>
                      {folder.files?.length || 0} file
                      {(folder.files?.length || 0) !== 1 ? "s" : ""}
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        ) : (
          <p>No folder selections available.</p>
        )}
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={onClose} style={buttonStyle}>
          Close
        </button>
        <button
          onClick={handleNextClick}
          style={buttonStyle}
          disabled={selectedIndices.length === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
};
const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  padding: "20px",
  backgroundColor: "white",
  border: "1px solid #ccc",
  borderRadius: "8px",
  zIndex: 1000,
  color: "black", // Ensure text color is visible

};
const buttonStyle = { padding: "8px 16px", marginRight: "10px" };
export default ImportMediaModal;





















