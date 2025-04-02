"use client";
import React, { useState, useRef } from "react";
import { FaInfoCircle, FaCloudUploadAlt, FaFolder } from "react-icons/fa";

const CreateNewDataBaseModal = ({ onClose, onNext }) => {
  const [databaseName, setDatabaseName] = useState("");
  const [databaseNameError, setDatabaseNameError] = useState("");
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [showInfoMessage, setShowInfoMessage] = useState(false);
  const folderInputRef = useRef(null);

  // Handle folder selection
  const handleFolderChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const folderMap = new Map();

      // Group files by their top-level folder
      files.forEach((file) => {
        const folderName = file.webkitRelativePath.split("/")[0];
        if (!folderMap.has(folderName)) {
          folderMap.set(folderName, []);
        }
        if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
          folderMap.get(folderName).push(file);
        }
      });

      const newFolders = [];
      folderMap.forEach((folderFiles, folderName) => {
        if (folderFiles.length > 0) {
          newFolders.push({ folderName, files: folderFiles });
        }
      });

      if (newFolders.length > 0) {
        setSelectedFolders((prev) => {
          const existingNames = new Set(prev.map((f) => f.folderName));
          const uniqueNewFolders = newFolders.filter(
            (f) => !existingNames.has(f.folderName)
          );
          return [...prev, ...uniqueNewFolders];
        });
        console.log("Updated selected folders:", [...selectedFolders, ...newFolders]);
      } else {
        alert("No images or videos found in the selected folders.");
      }
    }
    event.target.value = "";
  };

  // Trigger folder input click
  const handleUploadClick = () => {
    folderInputRef.current?.click();
  };

  // Proceed to next modal
  const handleNextClick = () => {
    if (!databaseName.trim()) {
      setDatabaseNameError("You need to name your database.");
      return;
    }

    if (selectedFolders.length === 0) {
      alert("Please upload at least one folder with images or videos.");
      return;
    }

    setDatabaseNameError("");

    const databaseData = {
      mainFolder: {
        name: databaseName.trim(),
        subFolders: selectedFolders.map((folder) => ({
          name: folder.folderName,
          files: folder.files,
        })),
      },
    };

    console.log("Passing data to next modal:", databaseData);
    onNext(databaseData);
  };

  const toggleInfoMessage = () => {
    setShowInfoMessage((prev) => !prev);
  };

  return (
    <div className="modal" style={modalStyle}>
      <div style={headerStyle}>
        <h3 style={{ color: "black", margin: 0, fontSize: 15 }}>Create New Database</h3>
        <button onClick={onClose} style={closeButtonStyle}>×</button>
      </div>
      <div style={contentStyle}>
        <div style={{ margin: "10px 0" }}>
          <label
            htmlFor="databaseName"
            style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}
          >
            Database Name
          </label>
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type="text"
              id="databaseName"
              value={databaseName}
              onChange={(e) => {
                setDatabaseName(e.target.value);
                if (databaseNameError && e.target.value.trim()) {
                  setDatabaseNameError("");
                }
                if (showInfoMessage) {
                  setShowInfoMessage(false);
                }
              }}
              placeholder="Enter database name"
              style={{
                width: "100%",
                padding: "10px 40px 10px 20px",
                backgroundColor: "#D6D6D6",
                color: "white",
                borderRadius: "20px",
                border: "none",
                fontSize: "16px",
                fontWeight: "500",
                outline: "none",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => (e.target.style.backgroundColor = "#C0C0C0")}
              onBlur={(e) => (e.target.style.backgroundColor = "#D6D6D6")}
            />
            <FaInfoCircle
              size={20}
              style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "rgba(255, 255, 255, 0.7)",
                cursor: "pointer",
                transition: "color 0.3s ease",
              }}
              onClick={toggleInfoMessage}
              onMouseEnter={(e) => (e.target.style.color = "white")}
              onMouseLeave={(e) => (e.target.style.color = "rgba(255, 255, 255, 0.7)")}
            />
            <style jsx>{`
              #databaseName::placeholder {
                color: rgba(255, 255, 255, 0.7);
                opacity: 1;
              }
            `}</style>
          </div>
          {showInfoMessage && (
            <div
              style={{
                marginTop: "5px",
                padding: "8px",
                backgroundColor: "#F1F1F1",
                borderRadius: "5px",
                fontSize: "12px",
                color: "#333",
              }}
            >
              Enter the name of your new database. Uploaded folders with images and videos will be grouped under this name.
            </div>
          )}
          {databaseNameError && (
            <div style={{ color: "#FF4444", fontSize: "12px", marginTop: "5px" }}>
              {databaseNameError}
            </div>
          )}
        </div>

        <div style={{ margin: "10px 0", textAlign: "center" }}>
          <button onClick={handleUploadClick} style={uploadButtonStyle}>
            <FaCloudUploadAlt size={20} style={{ marginRight: "8px" }} />
            Upload Folders
          </button>
          <input
            type="file"
            ref={folderInputRef}
            onChange={handleFolderChange}
            webkitdirectory="true"
            directory="true"
            multiple
            style={{ display: "none" }}
          />
          <div style={{ fontSize: "12px", color: "#555", marginTop: "5px" }}>
            Select multiple folders containing images and videos to add them.
          </div>
        </div>

        {selectedFolders.length > 0 && (
          <div style={folderListStyle}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: "600" }}>
              Uploaded Folders ({selectedFolders.length})
            </h4>
            <div style={folderContainerStyle}>
              {selectedFolders.map((folder, index) => (
                <div key={`folder-${index}`} style={summaryStyle}>
                  <FaFolder size={32} style={{ marginRight: "8px", color: "#007BFF" }} />
                  <div>
                    <div>
                      <strong>{folder.folderName}</strong>
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#555" }}>
                      {folder.files.length} file{folder.files.length !== 1 ? "s" : ""} (images/videos)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={buttonContainerStyle}>
          <button onClick={handleNextClick} style={selectButtonStyle}>
            Create Database
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles
const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "45%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  borderRadius: "8px",
  zIndex: 1000,
  display: "block",
  width: "600px",
  height: "500px", // Fixed height
  boxShadow: "0 4px 15px rgba(0, 0, 123, 0.2)",
  overflow: "hidden", // Prevent modal scrolling
};

const headerStyle = {
  backgroundColor: "#EEF2FF",
  padding: "10px 20px",
  borderTopLeftRadius: "8px",
  borderTopRightRadius: "8px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const contentStyle = {
  padding: "20px",
  color: "black",
  display: "flex",
  flexDirection: "column",
  height: "calc(100% - 40px)", // Adjust for header height
};

const uploadButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#007BFF",
  color: "white",
  borderRadius: "20px",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "14px",
  transition: "background-color 0.3s ease",
};

const folderListStyle = {
  margin: "10px 0",
  flex: "1 1 auto", // Grow to fill available space
  minHeight: 0, // Allow shrinking
  display: "flex",
  flexDirection: "column",
};

const folderContainerStyle = {
  flex: "1 1 auto", // Fill available space in folderList
  overflowY: "auto", // Scrollable folder list
  border: "1px solid #ddd",
  borderRadius: "4px",
  padding: "10px",
};

const summaryStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "8px",
};

const buttonContainerStyle = {
  marginTop: "20px",
  display: "flex",
  justifyContent: "flex-end",
};

const selectButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "#007BFF",
  color: "white",
  borderRadius: "20px",
  border: "none",
  width: "250px",
  height: "30px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: "1",
  paddingTop: "6px",
  transition: "background-color 0.3s ease",
};

const closeButtonStyle = {
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
  padding: "0",
  transition: "background-color 0.3s ease",
};

export default CreateNewDataBaseModal;