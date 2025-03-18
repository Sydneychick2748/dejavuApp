"use client";
import React, { useState, useEffect } from "react";
import { FaFolder, FaFileImage, FaFileVideo, FaFileAlt } from "react-icons/fa";

const DisplayDataBaseModal = ({ onClose, onNext, selectedFolders }) => {
  // State to track folder selections (all folders initially checked)
  const [folderSelections, setFolderSelections] = useState(
    selectedFolders.reduce((acc, _, index) => {
      acc[index] = true; // All folders start checked
      return acc;
    }, {})
  );

  // State to track selected files per folder
  const [fileSelections, setFileSelections] = useState(
    selectedFolders.reduce((acc, folder, folderIndex) => {
      acc[folderIndex] = folder.files.reduce((fileAcc, _, fileIndex) => {
        fileAcc[fileIndex] = true; // All files start checked
        return fileAcc;
      }, {});
      return acc;
    }, {})
  );

  // State for media info modal
  const [showMediaInfoModal, setShowMediaInfoModal] = useState(false);
  const [mediaInfoFile, setMediaInfoFile] = useState(null);

  // State for open file modal
  const [showOpenFileModal, setShowOpenFileModal] = useState(false);

  // State to track selected preview (image or video)
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [selectedFileIndex, setSelectedFileIndex] = useState(null); // Track selected file index

  // State to track database name sequence
  const [databaseCount, setDatabaseCount] = useState(() => {
    return parseInt(localStorage.getItem("databaseCount") || "1", 10);
  });

  // Update localStorage when databaseCount changes
  useEffect(() => {
    localStorage.setItem("databaseCount", databaseCount);
  }, [databaseCount]);

  // Toggles a folder selection and its files
  const toggleFolderSelection = (folderIndex) => {
    const isChecked = !folderSelections[folderIndex];
    setFolderSelections((prev) => ({
      ...prev,
      [folderIndex]: isChecked,
    }));
    setFileSelections((prev) => ({
      ...prev,
      [folderIndex]: selectedFolders[folderIndex].files.reduce((fileAcc, _, fileIndex) => {
        fileAcc[fileIndex] = isChecked;
        return fileAcc;
      }, {}),
    }));
  };

  // Toggles an individual file selection inside a folder
  const toggleFileSelection = (folderIndex, fileIndex) => {
    setFileSelections((prev) => ({
      ...prev,
      [folderIndex]: {
        ...prev[folderIndex],
        [fileIndex]: !prev[folderIndex][fileIndex],
      },
    }));
  };

  // Expands the folders to show files
  const [expanded, setExpanded] = useState({});
  const toggleExpanded = (folderIndex) => {
    setExpanded((prev) => ({
      ...prev,
      [folderIndex]: !prev[folderIndex],
    }));
  };

  // Opens Media Info Modal
  const handleMediaInfoClick = (file) => {
    setMediaInfoFile(file);
    setShowMediaInfoModal(true);
  };

  // Opens Open File Modal
  const handleOpenFileClick = () => {
    setShowOpenFileModal(true);
  };

  // Function to collect selected files and send them back with database name
  const handleFinish = () => {
    const selectedFiles = selectedFolders.flatMap((folder, folderIndex) =>
      folder.files.filter((_, fileIndex) => fileSelections[folderIndex][fileIndex])
    );
    const databaseName = `database ${String.fromCharCode(65 + databaseCount)}`; // B, C, D, ...
    setDatabaseCount((prev) => prev + 1); // Increment for next database
    onNext({ files: selectedFiles, databaseName }); // Send selected files and database name to parent
  };

  // Helper function to get an icon based on file type (for non-preview cases)
  const getFileIcon = (file) => {
    if (file.type.startsWith("image/")) return <FaFileImage style={{ color: "#4A88FF" }} />;
    if (file.type.startsWith("video/")) return <FaFileVideo style={{ color: "#4A88FF" }} />;
    return <FaFileAlt style={{ color: "#4A88FF" }} />;
  };

  // Calculate the number of selected items in a folder
  const getSelectedItemsCount = (folderIndex) => {
    return Object.values(fileSelections[folderIndex]).filter(Boolean).length;
  };

  return (
    <div className="modal" style={modalStyle}>
      <h3 style={{ color: "#000000" }}>Display Database</h3>
      <div style={{ display: "flex", width: "100%", height: "300px" }}>
        {/* Left Side - Folders and Files */}
        <div style={leftPanelStyle}>
          {selectedFolders && selectedFolders.length > 0 ? (
            selectedFolders.map((folder, folderIndex) => (
              <div key={folderIndex} style={{ marginBottom: "10px" }}>
                <div style={headerStyle}>
                  <input
                    type="checkbox"
                    checked={folderSelections[folderIndex]}
                    onChange={() => toggleFolderSelection(folderIndex)}
                    style={{ marginRight: "8px" }}
                  />
                  <FaFolder size={32} style={{ marginRight: "8px", color: "#4A88FF" }} />
                  <div>
                    <strong style={{ color: "#000000" }}>{folder.folderName}</strong>
                    <div style={{ fontSize: "0.9rem", color: "#555" }}>
                      {getSelectedItemsCount(folderIndex)} item
                      {getSelectedItemsCount(folderIndex) !== 1 ? "s" : ""} selected
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleExpanded(folderIndex)}
                  style={{ ...toggleButtonStyle, backgroundColor: "#4A88FF", color: "#FFFFFF" }}
                >
                  {expanded[folderIndex] ? "Hide Files" : "Show Files"}
                </button>
                {expanded[folderIndex] && (
                  <div style={filesContainerStyle}>
                    {folder.files.map((file, fileIndex) => {
                      const fileUrl = URL.createObjectURL(file); // Use fileUrl for both images and videos
                      return (
                        <div
                          key={fileIndex}
                          style={{
                            ...fileItemStyle,
                            opacity: fileSelections[folderIndex][fileIndex] ? 1 : 0.4,
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={fileSelections[folderIndex][fileIndex]}
                            onChange={() => toggleFileSelection(folderIndex, fileIndex)}
                            style={{ marginRight: "8px" }}
                          />
                          {file.type.startsWith("image/") ? (
                            <img
                              src={fileUrl}
                              alt={file.name}
                              style={{
                                maxWidth: "100px",
                                maxHeight: "100px",
                                marginRight: "8px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                setSelectedPreview(fileUrl);
                                setSelectedFileIndex(fileIndex);
                              }}
                            />
                          ) : file.type.startsWith("video/") ? (
                            <video
                              src={fileUrl}
                              style={{
                                maxWidth: "100px",
                                maxHeight: "100px",
                                marginRight: "8px",
                                cursor: "pointer",
                              }}
                              muted // Mute to avoid autoplay sound
                            >
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <span style={{ marginRight: "8px" }}>{getFileIcon(file)}</span>
                          )}
                          <span
                            style={{
                              fontSize: "0.8rem",
                              cursor: "pointer",
                              color: selectedPreview === fileUrl ? "blue" : "#000000",
                              fontWeight: selectedPreview === fileUrl ? "bold" : "normal",
                            }}
                            onClick={() => {
                              setSelectedPreview(fileUrl);
                              setSelectedFileIndex(fileIndex);
                            }}
                          >
                            {file.name}
                          </span>
                          <span
                            style={{ marginLeft: "10px", color: "#3083F9", cursor: "pointer" }}
                            onClick={() => handleMediaInfoClick(file)}
                          >
                            Media Info
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p style={{ color: "#000000" }}>No folders selected.</p>
          )}
        </div>
        {/* Right Side - Image/Video Preview and Details */}
        <div style={rightPanelStyle}>
          {selectedPreview ? (
            <>
              {selectedFolders
                .flatMap((folder) => folder.files)
                .find((_, idx) => idx === selectedFileIndex)?.type.startsWith("video/") ? (
                <video
                  controls
                  src={selectedPreview}
                  style={{
                    width: "100%",
                    height: "70%",
                    objectFit: "contain",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={selectedPreview}
                  alt="Selected Preview"
                  style={{
                    width: "100%",
                    height: "70%",
                    objectFit: "contain",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                />
              )}
              <div style={{ marginTop: "10px", textAlign: "center", color: "#000000" }}>
                <p>
                  <strong>Name:</strong>{" "}
                  {selectedFolders
                    .flatMap((folder) => folder.files)
                    [selectedFileIndex]?.name || "Unknown"}
                </p>
                <p>
                  <strong>Size:</strong>{" "}
                  {(
                    (selectedFolders.flatMap((folder) => folder.files)[selectedFileIndex]?.size ||
                      0) /
                    (1024 * 1024)
                  ).toFixed(2)}{" "}
                  MB
                </p>
                <p>
                  <strong>Frame:</strong> N/A
                </p>
                <p
                  style={{ color: "#3083F9", cursor: "pointer" }}
                  onClick={handleOpenFileClick}
                >
                  Open File
                </p>
              </div>
            </>
          ) : (
            <p style={{ fontSize: "14px", color: "#000000" }}>Click an image or video to preview</p>
          )}
        </div>
      </div>
      {/* Modal Buttons */}
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
        <button onClick={onClose} style={{ ...buttonStyle, backgroundColor: "#4A88FF", color: "#FFFFFF" }}>
          Close
        </button>
        <button onClick={handleFinish} style={{ ...buttonStyle, backgroundColor: "#4A88FF", color: "#FFFFFF" }}>
          Finish
        </button>
      </div>
      {/* Media Info Modal */}
      {showMediaInfoModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ color: "#000000" }}>Media Info</h3>
            <p style={{ color: "#000000" }}>
              {mediaInfoFile ? `File Name: ${mediaInfoFile.name}` : "No file selected."}
            </p>
            <button
              onClick={() => setShowMediaInfoModal(false)}
              style={{ ...buttonStyle, backgroundColor: "#4CAF50", color: "#FFFFFF" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Open File Modal */}
      {showOpenFileModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ color: "#000000" }}>Open File</h3>
            <p style={{ color: "#000000" }}>I am a modal for open files</p>
            <button
              onClick={() => setShowOpenFileModal(false)}
              style={{ ...buttonStyle, backgroundColor: "#4CAF50", color: "#FFFFFF" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  padding: "20px",
  backgroundColor: "#E6F0FA", // Light blue background
  border: "1px solid #4A88FF",
  borderRadius: "8px",
  zIndex: 1000,
  width: "800px",
  height: "500px",
  color: "#000000", // Ensure base text color is black
};

const headerStyle = { display: "flex", alignItems: "center", marginBottom: "10px" };
const toggleButtonStyle = {
  padding: "6px 12px",
  marginBottom: "10px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
const filesContainerStyle = {
  maxHeight: "300px",
  overflowY: "auto",
  border: "1px solid #4A88FF",
  padding: "10px",
  borderRadius: "4px",
  marginBottom: "10px",
};
const leftPanelStyle = {
  flex: 1,
  padding: "10px",
  borderRight: "1px solid #4A88FF",
  overflowY: "auto",
  maxHeight: "400px",
};
const rightPanelStyle = {
  flex: 1,
  padding: "10px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#F0F8FF", // Slightly darker blue for contrast
  maxHeight: "400px",
};
const fileItemStyle = { display: "flex", alignItems: "center", marginBottom: "8px" };
const buttonStyle = {
  padding: "8px 16px",
  marginRight: "10px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1100,
};
const modalContentStyle = {
  backgroundColor: "#E6FFE6", // Light green background for sub-modals
  padding: "20px",
  borderRadius: "8px",
  textAlign: "center",
  border: "1px solid #4CAF50",
  color: "#000000", // Ensure text color is black
};

export default DisplayDataBaseModal;