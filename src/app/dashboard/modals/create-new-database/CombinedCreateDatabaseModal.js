



// This code is a React component for a modal that allows users to create a new database by uploading folders containing images and videos.
"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  FaCloudUploadAlt,
  FaFolder,
  FaFolderOpen,
  FaTimes,
  FaArrowRight,
} from "react-icons/fa";

const CombinedCreateDatabaseModal = ({ onClose, onNext, existingDatabaseNames }) => {
  const [databaseName, setDatabaseName] = useState("");
  const [databaseNameError, setDatabaseNameError] = useState("");
  const [saveLocation, setSaveLocation] = useState("Photon Location");
  const [selectedFolders, setSelectedFolders] = useState([]);
  const folderInputRef = useRef(null);

  useEffect(() => {
    console.log("Existing database names:", existingDatabaseNames);
  }, [existingDatabaseNames]);

  const handleFolderChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const folderTree = { name: "", subFolders: new Map() };

    files.forEach((file) => {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) return;

      const pathParts = file.webkitRelativePath.split("/");
      pathParts.pop();
      let currentLevel = folderTree.subFolders;

      pathParts.forEach((part, index) => {
        if (!currentLevel.has(part)) {
          currentLevel.set(part, { name: part, subFolders: new Map(), files: [] });
        }
        if (index === pathParts.length - 1) {
          currentLevel.get(part).files.push(file);
        } else {
          currentLevel = currentLevel.get(part).subFolders;
        }
      });

      if (pathParts.length > 0 && !folderTree.name) {
        folderTree.name = pathParts[0];
      }
    });

    const convertMapToArray = (map) =>
      Array.from(map.values()).map((folder) => ({
        ...folder,
        subFolders: convertMapToArray(folder.subFolders),
      }));

    const newFolders = convertMapToArray(folderTree.subFolders);
    if (newFolders.length === 0) {
      alert("No images or videos found in the selected folders.");
      return;
    }

    setSelectedFolders((prev) => {
      const existingNames = new Set(prev.map((f) => f.name));
      const uniqueNewFolders = newFolders.filter((f) => !existingNames.has(f.name));
      return [...prev, ...uniqueNewFolders];
    });

    event.target.value = "";
  };

  const handleUploadClick = () => {
    folderInputRef.current?.click();
  };

  const handleRemoveFolder = (index) => {
    setSelectedFolders((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNextClick = () => {
    if (!databaseName.trim()) {
      setDatabaseNameError("You need to name your database.");
      return;
    }

    if (selectedFolders.length === 0) {
      alert("Please upload at least one folder with images or videos.");
      return;
    }

    if (existingDatabaseNames.includes(databaseName.trim().toLowerCase())) {
      setDatabaseNameError("Database name already exists. Please choose a unique name.");
      return;
    }

    setDatabaseNameError("");

    const databaseData = {
      databaseName: databaseName.trim(),
      mainFolder: {
        name: databaseName.trim(),
        subFolders: selectedFolders.map((folder) => ({
          name: folder.name,
          files: folder.files,
          subFolders: folder.subFolders,
        })),
      },
    };

    console.log("Passing data to next modal:", databaseData);
    onNext(databaseData);
  };

  const handleFolderIconClick = () => {
    alert("Folder selection modal will open here in the future.");
  };

  const calculateFolderStats = (folders) => {
    let folderCount = folders.length;
    let subFolderCount = 0;
    let fileCount = 0;

    folders.forEach((folder) => {
      fileCount += folder.files?.length || 0;
      if (folder.subFolders && folder.subFolders.length > 0) {
        const subStats = calculateFolderStats(folder.subFolders);
        subFolderCount += subStats.folderCount;
        fileCount += subStats.fileCount;
      }
    });

    return { folderCount, subFolderCount, fileCount };
  };

  const { folderCount, subFolderCount, fileCount } = calculateFolderStats(selectedFolders);

  const isDuplicateName =
    databaseName.trim() && existingDatabaseNames.includes(databaseName.trim().toLowerCase());
  const hasValidationError = !databaseName.trim() || isDuplicateName;

  return (
    <div className="modal" style={modalStyle}>
      <div style={headerStyle}>
        <h3 style={{ color: "black", margin: 0, fontSize: 15 }}>Create New Database</h3>
        <button onClick={onClose} style={closeButtonStyle}>
          ×
        </button>
      </div>
      <div style={contentStyle}>
        <div style={{ margin: "10px 0" }}>
          <label
            htmlFor="databaseName"
            style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}
          >
            Database Name:
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
              }}
              placeholder="Text field"
              style={{
                width: "100%",
                padding: "10px 20px",
                backgroundColor: "#FFFFFF",
                color: "black",
                borderRadius: "0px",
                border: "1px solid #D6D6D6",
                fontSize: "16px",
                fontWeight: "500",
                outline: "none",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#C0C0C0")}
              onBlur={(e) => (e.target.style.borderColor = "#D6D6D6")}
            />
            <style jsx>{`
              #databaseName::placeholder {
                color: #999;
                opacity: 1;
              }
            `}</style>
          </div>
          {databaseNameError && (
            <div style={{ color: "#FF4444", fontSize: "12px", marginTop: "5px" }}>
              {databaseNameError}
            </div>
          )}
          {isDuplicateName && !databaseNameError && (
            <div style={{ color: "#FF4444", fontSize: "12px", marginTop: "5px" }}>
              Database name already exists. Please choose a unique name.
            </div>
          )}
        </div>

        <div style={{ margin: "10px 0", display: "flex", alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <label
              htmlFor="saveLocation"
              style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}
            >
              Save to:
            </label>
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type="text"
                id="saveLocation"
                value={saveLocation}
                onChange={(e) => setSaveLocation(e.target.value)}
                placeholder="Photon Location"
                style={{
                  width: "100%",
                  padding: "10px 20px",
                  backgroundColor: "#FFFFFF",
                  color: "black",
                  borderRadius: "0px",
                  border: "1px solid #D6D6D6",
                  fontSize: "16px",
                  fontWeight: "500",
                  outline: "none",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#C0C0C0")}
                onBlur={(e) => (e.target.style.borderColor = "#D6D6D6")}
              />
              <style jsx>{`
                #saveLocation::placeholder {
                  color: #999;
                  opacity: 1;
                }
              `}</style>
            </div>
            <div style={{ fontSize: "12px", color: "#555", marginTop: "5px" }}>
              0 items selected.
            </div>
          </div>
          <FaFolder
            size={20}
            style={{
              marginLeft: "10px",
              color: "#007BFF",
              cursor: "pointer",
              transition: "color 0.3s ease",
            }}
            onClick={handleFolderIconClick}
            onMouseEnter={(e) => (e.target.style.color = "#0056D2")}
            onMouseLeave={(e) => (e.target.style.color = "#007BFF")}
          />
        </div>

        <div style={{ margin: "10px 0", textAlign: "center" }}>
          <button onClick={handleUploadClick} style={importMediaButtonStyle}>
            Import more media
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
        </div>

        {selectedFolders.length > 0 && (
          <div style={folderListStyle}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "10px", height: "24px" }}>
              <FaFolder size={24} style={{ color: "#FFD700", marginRight: "8px", flexShrink: 0 }} />
              <span style={{ lineHeight: "24px" }}>
                Main Folder: <strong>{databaseName || "Unnamed Database"}</strong>
              </span>
            </div>
            <p>
              Subfolders in your database ({folderCount} folders, {subFolderCount} subfolders, {fileCount} files) (click X to remove):
            </p>
            <div style={folderContainerStyle}>
              {selectedFolders.map((folder, index) => {
                const subStats = calculateFolderStats(folder.subFolders || []);
                const totalFiles = (folder.files?.length || 0) + subStats.fileCount;
                return (
                  <div key={`folder-${index}`} style={{ marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <FaFolder size={24} style={{ marginRight: "8px", color: "#007BFF" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "bold", color: "black" }}>{folder.name}</div>
                        <div style={{ fontSize: "0.9rem", color: "black" }}>
                          {totalFiles} file{totalFiles !== 1 ? "s" : ""}
                          {folder.subFolders?.length > 0 && (
                            <span>
                              , {folder.subFolders.length} subfolder{folder.subFolders.length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                        {folder.subFolders?.length > 0 && (
                          <ul style={{ listStyleType: "none", padding: 0, marginLeft: "20px" }}>
                            {folder.subFolders.map((nestedFolder, nestedIndex) => (
                              <li
                                key={nestedIndex}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginBottom: "8px",
                                  padding: "8px",
                                  borderRadius: "4px",
                                }}
                              >
                                <FaFolderOpen size={20} style={{ marginRight: "8px", color: "#0056D2" }} />
                                <div>
                                  <div>{nestedFolder.name}</div>
                                  <div style={{ fontSize: "0.8rem", color: "#555" }}>
                                    {nestedFolder.files?.length || 0} file{nestedFolder.files?.length !== 1 ? "s" : ""}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <FaTimes
                        size={20}
                        style={{ color: "#FF4444", cursor: "pointer", marginLeft: "8px" }}
                        onClick={() => handleRemoveFolder(index)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={buttonContainerStyle}>
          <button onClick={onClose} style={cancelButtonStyle}>
            Cancel
          </button>
          <button
            onClick={handleNextClick}
            style={{
              ...selectButtonStyle,
              backgroundColor: hasValidationError ? "#B0BEC5" : "#007BFF",
              cursor: hasValidationError ? "not-allowed" : "pointer",
            }}
            disabled={hasValidationError}
          >
            Create Database
            <FaArrowRight style={{ marginLeft: "8px" }} />
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
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  borderRadius: "8px",
  zIndex: 1000,
  display: "block",
  width: "70vw",
  height: "80vh",
  boxShadow: "0 4px 15px rgba(0, 0, 123, 0.2)",
  overflow: "hidden",
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
  height: "calc(100% - 40px)",
};

const importMediaButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#007BFF",
  color: "white",
  borderRadius: "20px",
  border: "none",
  cursor: "pointer",
  fontSize: "14px",
  transition: "background-color 0.3s ease",
};

const folderListStyle = {
  margin: "10px 0",
  flex: "1 1 auto",
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
};

const folderContainerStyle = {
  flex: "1 1 auto",
  overflowY: "auto",
  border: "1px solid #ddd",
  borderRadius: "4px",
  padding: "10px",
};

const buttonContainerStyle = {
  marginTop: "20px",
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px", // Add spacing between buttons
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

const cancelButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "#D3D3D3", // Light gray background for Cancel button
  color: "black",
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

export default CombinedCreateDatabaseModal;