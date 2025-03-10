
"use client";
import React, { useState } from "react";
import { FaFolder } from "react-icons/fa";

const CreateNewDataBaseModal = ({ onClose, onNext }) => {
  // Each folder selection is an object: { folderName: string, files: File[] }
  const [selectedFolders, setSelectedFolders] = useState([]);

  const handleFolderSelect = (event) => {
    // Convert FileList to an array
    const filesArray = Array.from(event.target.files);
    console.log("New folder selection:", filesArray);

    // Extract folder name from first file's webkitRelativePath if available
    const folderName =
      filesArray.length > 0 && filesArray[0].webkitRelativePath
        ? filesArray[0].webkitRelativePath.split("/")[0]
        : "Unnamed Folder";

    // Create a new folder selection object
    const newSelection = { folderName, files: filesArray };

    // Append this selection as a new entry (do not merge with previous ones)
    setSelectedFolders((prev) => [...prev, newSelection]);
  };

  const handleNextClick = () => {
    console.log("Passing folder selections:", selectedFolders);
    // Use selectedFolders (local state) rather than folderSelections
    onNext(selectedFolders);
  };

  return (
    <div className="modal" style={modalStyle}>
      <h3>Create New Database</h3>
      <p>Select one or more folders that will be used for the new database.</p>

      <div style={{ margin: "10px 0" }}>
        <label>Select a folder:</label>
        <br />
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

      <div style={{ marginTop: "20px" }}>
        <button onClick={onClose} style={buttonStyle}>
          Close
        </button>
        <button onClick={handleNextClick} style={buttonStyle}>
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
};

const summaryContainerStyle = {
  margin: "10px 0",
};

const summaryStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "8px",
};

const buttonStyle = {
  padding: "8px 16px",
  marginRight: "10px",
};

export default CreateNewDataBaseModal;
