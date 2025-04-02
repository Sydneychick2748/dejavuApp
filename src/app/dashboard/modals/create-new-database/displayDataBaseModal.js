"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import { ImageContext } from "@/contexts/ImageContext";
import { FaFolder, FaFileImage, FaFileVideo, FaFileAlt, FaForward, FaBackward, FaSave, FaChevronDown, FaChevronUp } from "react-icons/fa";

// DisplayDataBaseModal component to display and manage the database with folders, subfolders, and files
const DisplayDataBaseModal = ({ onClose, onNext, selectedFolders }) => {
  // Access the ImageContext to set final selected images
  const { setFinalSelectedImages } = useContext(ImageContext);

  // Access subFolders from structuredData (nested structure from ImportMediaModal)
  const subFolders = selectedFolders.mainFolder.subFolders;

  // State to manage folder selections (checkboxes for folders and subfolders)
  const [folderSelections, setFolderSelections] = useState(() => {
    const initialSelections = {};
    const setFolderSelectionsRecursively = (folders, parentPath = "") => {
      folders.forEach((folder, index) => {
        const folderPath = parentPath ? `${parentPath}/${index}` : `${index}`;
        initialSelections[folderPath] = true; // Default to checked
        if (folder.subFolders && folder.subFolders.length > 0) {
          setFolderSelectionsRecursively(folder.subFolders, folderPath); // Recursively set for subfolders
        }
      });
    };
    setFolderSelectionsRecursively(subFolders);
    return initialSelections;
  });

  // State to manage file selections (checkboxes for individual files)
  const [fileSelections, setFileSelections] = useState(() => {
    const initialFileSelections = {};
    const setFileSelectionsRecursively = (folders, parentPath = "") => {
      folders.forEach((folder, index) => {
        const folderPath = parentPath ? `${parentPath}/${index}` : `${index}`;
        initialFileSelections[folderPath] = folder.files.reduce((fileAcc, _, fileIndex) => {
          fileAcc[fileIndex] = true; // Default to checked
          return fileAcc;
        }, {});
        if (folder.subFolders && folder.subFolders.length > 0) {
          setFileSelectionsRecursively(folder.subFolders, folderPath); // Recursively set for subfolders
        }
      });
    };
    setFileSelectionsRecursively(subFolders);
    return initialFileSelections;
  });

  // State for Media Info Modal
  const [showMediaInfoModal, setShowMediaInfoModal] = useState(false); // Control visibility of Media Info Modal
  const [mediaInfoFile, setMediaInfoFile] = useState(null); // Store the file for Media Info Modal

  // State for Open File Modal
  const [showOpenFileModal, setShowOpenFileModal] = useState(false); // Control visibility of Open File Modal

  // State for previewing selected files
  const [selectedPreview, setSelectedPreview] = useState(null); // Store the URL of the selected file for preview
  const [selectedFileIndex, setSelectedFileIndex] = useState(null); // Store the index of the selected file

  // State for video controls
  const [videoDuration, setVideoDuration] = useState(0); // Store the duration of the video
  const [currentTime, setCurrentTime] = useState(0); // Store the current time of the video
  const videoRef = useRef(null); // Reference to the video element
  const canvasRef = useRef(null); // Reference to the canvas for capturing frames

  // State for saved frames
  const [savedFrames, setSavedFrames] = useState([]); // Store saved frames from videos

  // State for database count (for naming databases)
  const [databaseCount, setDatabaseCount] = useState(() => {
    return parseInt(localStorage.getItem("databaseCount") || "1", 10); // Initialize from localStorage
  });

  // State for tracking clicked icons (for styling)
  const [clickedIcon, setClickedIcon] = useState(null); // Track which icon is clicked

  // State for file URLs (for previewing)
  const [fileUrls, setFileUrls] = useState({}); // Store URLs for files

  // State for expanded folders (dropdown toggle)
  const [expanded, setExpanded] = useState({}); // Track which folders are expanded

  // State for database selection (top-level checkbox)
  const [databaseSelected, setDatabaseSelected] = useState(true); // Default to checked

  // Effect to generate file URLs for preview
  useEffect(() => {
    const newFileUrls = {};
    const generateFileUrlsRecursively = (folders, parentPath = "") => {
      folders.forEach((folder, index) => {
        const folderPath = parentPath ? `${parentPath}/${index}` : `${index}`;
        folder.files.forEach((file, fileIndex) => {
          const fileId = `${folderPath}-${fileIndex}`;
          if (!fileUrls[fileId]) {
            const url = URL.createObjectURL(file);
            newFileUrls[fileId] = url;
          }
        });
        if (folder.subFolders && folder.subFolders.length > 0) {
          generateFileUrlsRecursively(folder.subFolders, folderPath); // Recursively generate URLs for subfolders
        }
      });
    };
    generateFileUrlsRecursively(subFolders);
    setFileUrls((prev) => ({ ...prev, ...newFileUrls }));

    return () => {
      Object.values(newFileUrls).forEach((url) => URL.revokeObjectURL(url)); // Clean up URLs on unmount
    };
  }, [subFolders]); // Dependency: subFolders

  // Effect to update database count in localStorage
  useEffect(() => {
    localStorage.setItem("databaseCount", databaseCount); // Save database count to localStorage
  }, [databaseCount]); // Dependency: databaseCount

  // Function to toggle the top-level database selection
  const toggleDatabaseSelection = () => {
    const newSelected = !databaseSelected;
    setDatabaseSelected(newSelected);

    // Update folder selections
    const newFolderSelections = {};
    const setFolderSelectionsRecursively = (folders, parentPath = "") => {
      folders.forEach((index) => {
        const folderPath = parentPath ? `${parentPath}/${index}` : `${index}`;
        newFolderSelections[folderPath] = newSelected;
        const folder = getFolderByPath(folderPath);
        if (folder.subFolders && folder.subFolders.length > 0) {
          setFolderSelectionsRecursively(folder.subFolders, folderPath);
        }
      });
    };
    setFolderSelectionsRecursively(subFolders);
    setFolderSelections(newFolderSelections);

    // Update file selections
    const newFileSelections = {};
    const setFileSelectionsRecursively = (folders, parentPath = "") => {
      folders.forEach((index) => {
        const folderPath = parentPath ? `${parentPath}/${index}` : `${index}`;
        const folder = getFolderByPath(folderPath);
        newFileSelections[folderPath] = folder.files.reduce((fileAcc, _, fileIndex) => {
          fileAcc[fileIndex] = newSelected;
          return fileAcc;
        }, {});
        if (folder.subFolders && folder.subFolders.length > 0) {
          setFileSelectionsRecursively(folder.subFolders, folderPath);
        }
      });
    };
    setFileSelectionsRecursively(subFolders);
    setFileSelections(newFileSelections);
  };

  // Helper function to get a folder by its path
  const getFolderByPath = (path) => {
    const indices = path.split("/").map(Number);
    let current = subFolders;
    for (const index of indices) {
      current = current[index];
      if (current.subFolders) {
        current = current.subFolders;
      } else {
        break;
      }
    }
    return current;
  };

  // Function to toggle folder selection (for individual folders and subfolders)
  const toggleFolderSelection = (folderPath) => {
    const isChecked = !folderSelections[folderPath];
    setFolderSelections((prev) => ({
      ...prev,
      [folderPath]: isChecked,
    }));

    // Update file selections for this folder
    const folder = getFolderByPath(folderPath);
    const newFileSelections = { ...fileSelections };
    newFileSelections[folderPath] = folder.files.reduce((fileAcc, _, fileIndex) => {
      fileAcc[fileIndex] = isChecked;
      return fileAcc;
    }, {});
    setFileSelections(newFileSelections);

    // Update parent folder selections
    const updateParentSelections = (path) => {
      const parts = path.split("/");
      parts.pop(); // Remove the last index
      if (parts.length === 0) return;
      const parentPath = parts.join("/");
      const parentFolder = getFolderByPath(parentPath);
      const allChildrenChecked = parentFolder.subFolders.every((_, idx) => {
        const childPath = `${parentPath}/${idx}`;
        return folderSelections[childPath];
      });
      setFolderSelections((prev) => ({
        ...prev,
        [parentPath]: allChildrenChecked,
      }));
      updateParentSelections(parentPath); // Recursively update parents
    };
    updateParentSelections(folderPath);

    // Update database selection
    const allFoldersChecked = subFolders.every((_, idx) => folderSelections[`${idx}`]);
    setDatabaseSelected(allFoldersChecked);
  };

  // Function to toggle file selection (for individual files)
  const toggleFileSelection = (folderPath, fileIndex) => {
    setFileSelections((prev) => ({
      ...prev,
      [folderPath]: {
        ...prev[folderPath],
        [fileIndex]: !prev[folderPath][fileIndex],
      },
    }));

    // Update folder selection based on file selections
    const folder = getFolderByPath(folderPath);
    const allFilesChecked = Object.values(fileSelections[folderPath]).every(Boolean);
    setFolderSelections((prev) => ({
      ...prev,
      [folderPath]: allFilesChecked,
    }));

    // Update parent folder selections
    const updateParentSelections = (path) => {
      const parts = path.split("/");
      parts.pop(); // Remove the last index
      if (parts.length === 0) return;
      const parentPath = parts.join("/");
      const parentFolder = getFolderByPath(parentPath);
      const allChildrenChecked = parentFolder.subFolders.every((_, idx) => {
        const childPath = `${parentPath}/${idx}`;
        return folderSelections[childPath];
      });
      setFolderSelections((prev) => ({
        ...prev,
        [parentPath]: allChildrenChecked,
      }));
      updateParentSelections(parentPath); // Recursively update parents
    };
    updateParentSelections(folderPath);

    // Update database selection
    const allFoldersChecked = subFolders.every((_, idx) => folderSelections[`${idx}`]);
    setDatabaseSelected(allFoldersChecked);
  };

  // Function to toggle folder expansion (dropdown)
  const toggleExpanded = (folderPath) => {
    setExpanded((prev) => ({
      ...prev,
      [folderPath]: !prev[folderPath],
    }));
  };

  // Function to handle "Media Info" click
  const handleMediaInfoClick = (file) => {
    setMediaInfoFile(file); // Set the file for Media Info Modal
    setShowMediaInfoModal(true); // Show the Media Info Modal
  };

  // Function to handle "Open File" click
  const handleOpenFileClick = () => {
    setShowOpenFileModal(true); // Show the Open File Modal
  };

  // Function to handle the "Create Database" button click
  const handleFinish = () => {
    // Collect all selected files
    const selectedFiles = [];
    const collectSelectedFiles = (folders, parentPath = "") => {
      folders.forEach((folder, index) => {
        const folderPath = parentPath ? `${parentPath}/${index}` : `${index}`;
        if (folderSelections[folderPath]) {
          folder.files.forEach((file, fileIndex) => {
            if (fileSelections[folderPath][fileIndex]) {
              selectedFiles.push(file);
            }
          });
        }
        if (folder.subFolders && folder.subFolders.length > 0) {
          collectSelectedFiles(folder.subFolders, folderPath);
        }
      });
    };
    collectSelectedFiles(subFolders);

    // Collect saved frame files
    const frameFiles = savedFrames.map((frame) => frame.file);
    setFinalSelectedImages((prev) => [...prev, ...frameFiles]); // Update context with selected frame files

    // Generate database name
    const databaseName = `database ${String.fromCharCode(65 + databaseCount)}`;
    setDatabaseCount((prev) => prev + 1); // Increment database count
    onNext({ files: selectedFiles, databaseName, savedFrames }); // Pass data to the next modal
  };

  // Function to get the appropriate icon for a file
  const getFileIcon = (file, iconId) => {
    const baseStyle = {
      color: "#E0E7FF", // Light blue for normal state
      transition: "color 0.3s ease", // Smooth color transition
    };
    const hoverStyle = { color: "#0056D2" }; // Dark blue on hover
    const clickedStyle = { color: "#003087" }; // Keep the clicked style

    const iconStyle = {
      ...baseStyle,
      ...(clickedIcon === iconId ? clickedStyle : hoverStyle), // Simplified hover/click logic
    };

    const handleMouseDown = () => setClickedIcon(iconId); // Set clicked icon on mouse down
    const handleMouseUp = () => setClickedIcon(null); // Clear clicked icon on mouse up

    if (file.type.startsWith("image/"))
      return (
        <FaFileImage
          style={iconStyle}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        /> // Image icon
      );
    if (file.type.startsWith("video/"))
      return (
        <FaFileVideo
          style={iconStyle}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        /> // Video icon
      );
    return (
      <FaFileAlt
        style={iconStyle}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      /> // Default file icon
    );
  };

  // Function to get the count of selected items in a folder
  const getSelectedItemsCount = (folderPath) => {
    let count = 0;
    const folder = getFolderByPath(folderPath);
    if (folderSelections[folderPath]) {
      count += Object.values(fileSelections[folderPath]).filter(Boolean).length;
    }
    if (folder.subFolders && folder.subFolders.length > 0) {
      folder.subFolders.forEach((_, idx) => {
        const childPath = `${folderPath}/${idx}`;
        count += getSelectedItemsCount(childPath); // Recursively count selected items in subfolders
      });
    }
    return count;
  };

  // Function to handle video metadata loading
  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration); // Set video duration
      const canvas = canvasRef.current;
      canvas.width = videoRef.current.videoWidth; // Set canvas width
      canvas.height = videoRef.current.videoHeight; // Set canvas height
    }
  };

  // Function to handle video time updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime); // Update current time
    }
  };

  // Function to handle video seeking
  const handleSeek = (event) => {
    const newTime = parseFloat(event.target.value);
    setCurrentTime(newTime); // Update current time
    if (videoRef.current) {
      videoRef.current.currentTime = newTime; // Seek to new time
    }
  };

  // Function to fast-forward the video
  const handleFastForward = () => {
    if (videoRef.current) {
      const newTime = Math.min(videoRef.current.currentTime + 5, videoDuration);
      setCurrentTime(newTime); // Update current time
      videoRef.current.currentTime = newTime; // Fast-forward 5 seconds
    }
  };

  // Function to rewind the video
  const handleRewind = () => {
    if (videoRef.current) {
      const newTime = Math.max(videoRef.current.currentTime - 5, 0);
      setCurrentTime(newTime); // Update current time
      videoRef.current.currentTime = newTime; // Rewind 5 seconds
    }
  };

  // Function to format time in MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60); // Calculate minutes
    const seconds = Math.floor(time % 60); // Calculate seconds
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`; // Format as MM:SS
  };

  // Function to convert data URL to file
  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(","); // Split data URL
    const mime = arr[0].match(/:(.*?);/)[1]; // Extract MIME type
    const bstr = atob(arr[1]); // Decode base64
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n); // Convert to byte array
    }
    return new File([u8arr], filename, { type: mime }); // Create file
  };

  // Function to save a frame from the video
  const handleSaveFrame = () => {
    if (!videoRef.current || !canvasRef.current) return; // Check if video and canvas are available

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height); // Draw video frame on canvas
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8); // Convert to data URL
    const fileName = `frame-${formatTime(currentTime).replace(":", "-")}.jpg`; // Generate filename
    const frameFile = dataURLtoFile(dataUrl, fileName); // Convert data URL to file
    const sourceFile = subFolders.flatMap((folder) => folder.files)[selectedFileIndex];
    const sourceFileId = `${sourceFile.name}-${sourceFile.lastModified}`; // Generate source file ID
    setSavedFrames((prev) => [
      ...prev,
      { timestamp: currentTime, dataUrl, file: frameFile, sourceFileId }, // Add frame to saved frames
    ]);
  };

  // Function to delete a saved frame
  const handleDeleteFrame = (originalIndex) => {
    setSavedFrames((prev) => prev.filter((_, i) => i !== originalIndex)); // Remove frame at the specified index
  };

  // Calculate total items in the database
  const totalItems = calculateFolderStats(subFolders).fileCount;

  // Render folder hierarchy recursively
  const renderFolderHierarchy = (folders, parentPath = "") => {
    return folders.map((folder, index) => {
      const folderPath = parentPath ? `${parentPath}/${index}` : `${index}`;
      const subStats = calculateFolderStats(folder.subFolders || []);
      const totalFiles = (folder.files?.length || 0) + subStats.fileCount;
      return (
        <div key={folderPath} style={{ marginBottom: "10px", marginLeft: parentPath ? "20px" : "0" }}>
          <div style={headerStyle}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={folderSelections[folderPath] || false}
                onChange={() => toggleFolderSelection(folderPath)}
                style={{ marginRight: "8px" }}
              /> {/* Checkbox for folder */}
              <FaFolder
                size={32}
                style={{
                  marginRight: "8px",
                  color: "#007BFF",
                  transition: "color 0.3s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#0056D2")}
                onMouseOut={(e) =>
                  (e.currentTarget.style.color =
                    clickedIcon === `folder-${folderPath}` ? "#003087" : "#007BFF")
                }
                onMouseDown={() => setClickedIcon(`folder-${folderPath}`)}
                onMouseUp={() => setClickedIcon(null)}
              /> {/* Folder icon */}
              <div>
                <strong style={{ color: "#000000" }}>{folder.name}</strong> {/* Folder name */}
                <div style={{ fontSize: "0.9rem", color: "#555" }}>
                  {getSelectedItemsCount(folderPath)} item
                  {getSelectedItemsCount(folderPath) !== 1 ? "s" : ""} selected {/* Selected items count */}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <button
                onClick={() => toggleExpanded(folderPath)}
                style={toggleButtonStyle}
              >
                {expanded[folderPath] ? "▲" : "▼"} {/* Toggle button */}
              </button>
            </div>
          </div>

          {expanded[folderPath] && (
            <>
              {/* Render files in this folder */}
              {folder.files.length > 0 && (
                <div style={filesContainerStyle}>
                  {folder.files.map((file, fileIndex) => {
                    const fileId = `${folderPath}-${fileIndex}`;
                    const fileUrl = fileUrls[fileId] || "";
                    return (
                      <div
                        key={fileId}
                        style={{
                          ...fileItemStyle,
                          opacity: fileSelections[folderPath][fileIndex] ? 1 : 0.4,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={fileSelections[folderPath][fileIndex]}
                          onChange={() => toggleFileSelection(folderPath, fileIndex)}
                          style={{ marginRight: "8px" }}
                        /> {/* Checkbox for file */}
                        {file.type.startsWith("image/") ? (
                          <img
                            src={fileUrl}
                            alt={file.name}
                            style={{
                              maxWidth: "100px",
                              maxHeight: "100px",
                              marginRight: "8px",
                              cursor: "pointer",
                              borderRadius: "4px",
                            }}
                            onClick={() => {
                              setSelectedPreview(fileUrl);
                              setSelectedFileIndex(
                                subFolders
                                  .flatMap((folder) => folder.files)
                                  .findIndex((f) => f === file)
                              );
                            }}
                          /> // Image preview
                        ) : file.type.startsWith("video/") ? (
                          <video
                            src={fileUrl}
                            style={{
                              maxWidth: "100px",
                              maxHeight: "100px",
                              marginRight: "8px",
                              cursor: "pointer",
                              borderRadius: "4px",
                            }}
                            muted
                          >
                            Your browser does not support the video tag.
                          </video> // Video preview
                        ) : (
                          <span style={{ marginRight: "8px" }}>
                            {getFileIcon(file, `file-${fileId}`)} {/* Default file icon */}
                          </span>
                        )}
                        <span
                          style={{
                            fontSize: "0.8rem",
                            cursor: "pointer",
                            color: selectedPreview === fileUrl ? "#0056D2" : "#000000",
                            fontWeight: selectedPreview === fileUrl ? "bold" : "normal",
                          }}
                          onClick={() => {
                            setSelectedPreview(fileUrl);
                            setSelectedFileIndex(
                              subFolders
                                .flatMap((folder) => folder.files)
                                .findIndex((f) => f === file)
                            );
                          }}
                        >
                          {file.name} {/* File name */}
                        </span>
                        <span
                          style={{ marginLeft: "10px", color: "#007BFF", cursor: "pointer" }}
                          onClick={() => handleMediaInfoClick(file)}
                        >
                          Media Info {/* Media Info link */}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
              {/* Render subfolders if they exist */}
              {folder.subFolders?.length > 0 && (
                renderFolderHierarchy(folder.subFolders, folderPath)
              )}
            </>
          )}
        </div>
      );
    });
  };

  return (
    <div className="modal" style={modalStyle}>
      <div style={blueBarStyle}>
        <h3 style={{ color: "black", margin: 0, fontSize: 15 }}>
          New Database Settings {/* Modal title */}
        </h3>
        <button onClick={onClose} style={closeButtonStyle}>
          × {/* Close button */}
        </button>
      </div>

      <div style={{ display: "flex", width: "100%", height: "400px", flexDirection: "column" }}>
        {/* Database Header */}
        <div style={{ padding: "10px", borderBottom: "1px solid #ddd", display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            checked={databaseSelected}
            onChange={toggleDatabaseSelection}
            style={{ marginRight: "8px" }}
          /> {/* Checkbox for entire database */}
          <FaFolder size={40} style={{ color: "#FFD700", marginRight: "12px" }} /> {/* Large yellow folder icon */}
          <div>
            <strong style={{ fontSize: "18px", color: "#000000" }}>
              {selectedFolders.mainFolder.name} {/* Database name */}
            </strong>
            <div style={{ fontSize: "0.9rem", color: "#555" }}>
              {totalItems} item{totalItems !== 1 ? "s" : ""} {/* Total items count */}
            </div>
          </div>
        </div>

        {/* Folders and Files Section */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Left Side - Folders and Files */}
          <div style={leftPanelStyle}>
            {subFolders && subFolders.length > 0 ? (
              renderFolderHierarchy(subFolders)
            ) : (
              <p style={{ color: "#000000" }}>No folders selected.</p> // Message if no folders
            )}
          </div>

          {/* Right Side - Image/Video Preview and Details */}
          <div style={rightPanelStyle}>
            {selectedPreview ? (
              <>
                {subFolders
                  .flatMap((folder) => folder.files)
                  [selectedFileIndex]?.type.startsWith("video/") ? (
                  <div style={{ width: "100%", height: "70%", position: "relative" }}>
                    <video
                      key={selectedPreview}
                      ref={videoRef}
                      src={selectedPreview}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        borderRadius: "5px",
                      }}
                      muted
                      onLoadedMetadata={handleVideoLoadedMetadata}
                      onTimeUpdate={handleTimeUpdate}
                    >
                      Your browser does not support the video tag.
                    </video> {/* Video preview */}
                    {/* Custom Scrollbar with Fast-Forward, Rewind, and Save Frame Buttons */}
                    <div style={videoControlsStyle}>
                      <button
                        onClick={handleRewind}
                        style={videoButtonStyle}
                        title="Rewind 5 seconds"
                      >
                        <FaBackward size={20} /> {/* Rewind button */}
                      </button>
                      <span style={{ color: "#000000" }}>{formatTime(currentTime)}</span> {/* Current time */}
                      <input
                        type="range"
                        min="0"
                        max={videoDuration || 0}
                        step="0.1"
                        value={currentTime}
                        onChange={handleSeek}
                        style={rangeStyle}
                      /> {/* Seek bar */}
                      <span style={{ color: "#000000" }}>{formatTime(videoDuration)}</span> {/* Total duration */}
                      <button
                        onClick={handleFastForward}
                        style={videoButtonStyle}
                        title="Fast-forward 5 seconds"
                      >
                        <FaForward size={20} /> {/* Fast-forward button */}
                      </button>
                      <button
                        onClick={handleSaveFrame}
                        style={videoButtonStyle}
                        title="Save frame at current timestamp"
                      >
                        <FaSave size={20} /> {/* Save frame button */}
                      </button>
                    </div>
                  </div>
                ) : (
                  <img
                    src={selectedPreview}
                    alt="Selected Preview"
                    style={{
                      width: "100%",
                      height: "70%",
                      objectFit: "contain",
                      borderRadius: "5px",
                    }}
                  /> // Image preview
                )}
                <div style={previewDetailsStyle}>
                  <p>
                    <strong>Name:</strong>{" "}
                    {subFolders.flatMap((folder) => folder.files)[selectedFileIndex]?.name || "Unknown"} {/* File name */}
                  </p>
                  <p>
                    <strong>Size:</strong>{" "}
                    {(
                      (subFolders.flatMap((folder) => folder.files)[selectedFileIndex]?.size || 0) /
                      (1024 * 1024)
                    ).toFixed(2)}{" "}
                    MB {/* File size */}
                  </p>
                  <p>
                    <strong>Frame:</strong> N/A {/* Frame info (N/A for images) */}
                  </p>
                  <p
                    style={{ color: "#007BFF", cursor: "pointer" }}
                    onClick={handleOpenFileClick}
                  >
                    Open File {/* Open File link */}
                  </p>
                </div>
              </>
            ) : (
              <p style={{ fontSize: "14px", color: "#000000" }}>
                Click an image or video to preview {/* Placeholder message */}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal Buttons */}
      <div style={buttonContainerStyle}>
        <button onClick={onClose} style={cancelButtonStyle}>
          Cancel {/* Cancel button */}
        </button>
        <button onClick={handleFinish} style={createButtonStyle}>
          Create Database {/* Create Database button */}
        </button>
      </div>

      {/* Media Info Modal */}
      {showMediaInfoModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ color: "#000000" }}>Media Info</h3> {/* Modal title */}
            <p style={{ color: "#000000" }}>
              {mediaInfoFile ? `File Name: ${mediaInfoFile.name}` : "No file selected."} {/* File name */}
            </p>
            <button
              onClick={() => setShowMediaInfoModal(false)}
              style={modalCloseButtonStyle}
            >
              Close {/* Close button */}
            </button>
          </div>
        </div>
      )}

      {/* Open File Modal */}
      {showOpenFileModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ color: "#000000" }}>Open File</h3> {/* Modal title */}
            {subFolders
              .flatMap((folder) => folder.files)
              [selectedFileIndex]?.type.startsWith("video/") ? (
              <>
                <p style={{ color: "#000000" }}>Frames saved for this video:</p> {/* Frames section */}
                {savedFrames.length > 0 ? (
                  <div style={{ maxHeight: "300px", overflowY: "auto", marginTop: "10px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                      {savedFrames
                        .map((frame, originalIndex) => ({ frame, originalIndex }))
                        .filter(
                          ({ frame }) =>
                            frame.sourceFileId ===
                            `${subFolders
                              .flatMap((folder) => folder.files)
                              [selectedFileIndex]?.name}-${subFolders
                              .flatMap((folder) => folder.files)
                              [selectedFileIndex]?.lastModified}`
                        )
                        .map(({ frame, originalIndex }) => (
                          <div key={originalIndex} style={{ textAlign: "center", position: "relative" }}>
                            <img
                              src={frame.dataUrl}
                              alt={`Saved frame at ${formatTime(frame.timestamp)}`}
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                            /> {/* Saved frame image */}
                            <p style={{ fontSize: "0.8rem", color: "#555" }}>
                              {formatTime(frame.timestamp)} {/* Frame timestamp */}
                            </p>
                            <button
                              onClick={() => handleDeleteFrame(originalIndex)}
                              style={deleteFrameButtonStyle}
                              title="Delete frame"
                            >
                              X {/* Delete frame button */}
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: "0.9rem", color: "#666" }}>No frames saved for this video.</p> // Message if no frames
                )}
              </>
            ) : (
              <p style={{ color: "#000000" }}>No frames available for images.</p> // Message for images
            )}
            <button
              onClick={() => setShowOpenFileModal(false)}
              style={modalCloseButtonStyle}
            >
              Close {/* Close button */}
            </button>
          </div>
        </div>
      )}

      {/* Hidden canvas for capturing frames */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

// Styles (unchanged from your provided code)
const modalStyle = {
  position: "fixed", // Fixed position for modal
  top: "50%", // Center vertically
  left: "50%", // Center horizontally
  transform: "translate(-50%, -50%)", // Adjust for centering
  backgroundColor: "white", // White background
  borderRadius: "8px", // Rounded corners
  zIndex: 1000, // High z-index
  width: "900px", // Fixed width
  height: "500px", // Fixed height
  color: "#000000", // Black text
  display: "flex", // Flexbox layout
  flexDirection: "column", // Column layout
  boxShadow: "0 4px 15px rgba(0, 0, 123, 0.2)", // Subtle shadow
};

const blueBarStyle = {
  width: "100%", // Full width
  backgroundColor: "#EEF2FF", // Light blue background
  borderRadius: "8px 8px 0 0", // Rounded top corners
  padding: "10px 20px", // Padding
  display: "flex", // Flexbox layout
  alignItems: "center", // Center vertically
  justifyContent: "space-between", // Space between elements
  position: "relative", // Relative positioning
  minHeight: "40px", // Minimum height
};

const closeButtonStyle = {
  width: "24px", // Fixed width
  height: "24px", // Fixed height
  backgroundColor: "white", // White background
  borderRadius: "50%", // Circular shape
  border: "none", // No border
  color: "black", // Black text
  fontSize: "16px", // Font size
  fontWeight: "400", // Font weight
  display: "flex", // Flexbox layout
  alignItems: "center", // Center vertically
  justifyContent: "center", // Center horizontally
  cursor: "pointer", // Pointer cursor
  padding: 0, // No padding
  transition: "background-color 0.3s ease", // Smooth background transition
};

const headerStyle = {
  display: "flex", // Flexbox layout
  justifyContent: "space-between", // Space between elements
  alignItems: "center", // Center vertically
  marginBottom: "10px", // Bottom margin
  width: "100%", // Full width
};

const toggleButtonStyle = {
  padding: "6px 12px", // Padding
  border: "none", // No border
  borderRadius: "20px", // Rounded corners
  cursor: "pointer", // Pointer cursor
  backgroundColor: "#E0E7FF", // Light blue background
  color: "#0056D2", // Dark blue text
  transition: "background-color 0.3s ease", // Smooth background transition
};

const filesContainerStyle = {
  maxHeight: "300px", // Maximum height
  overflowY: "auto", // Scrollable
  padding: "10px", // Padding
  borderRadius: "4px", // Rounded corners
  marginBottom: "10px", // Bottom margin
  backgroundColor: "#F9FBFF", // Light background
};

const leftPanelStyle = {
  flex: 1, // Take up available space
  padding: "10px", // Padding
  overflowY: "auto", // Scrollable
  maxHeight: "400px", // Maximum height
};

const rightPanelStyle = {
  flex: 1, // Take up available space
  padding: "10px", // Padding
  display: "flex", // Flexbox layout
  flexDirection: "column", // Column layout
  alignItems: "center", // Center horizontally
  justifyContent: "flex-start", // Align to top
  backgroundColor: "#F9FBFF", // Light background
  maxHeight: "400px", // Maximum height
};

const fileItemStyle = {
  display: "flex", // Flexbox layout
  alignItems: "center", // Center vertically
  marginBottom: "8px", // Bottom margin
};

const videoControlsStyle = {
  marginTop: "10px", // Top margin
  display: "flex", // Flexbox layout
  alignItems: "center", // Center vertically
  gap: "10px", // Gap between elements
  width: "100%", // Full width
};

const videoButtonStyle = {
  background: "none", // No background
  border: "none", // No border
  cursor: "pointer", // Pointer cursor
  padding: "5px", // Padding
  display: "flex", // Flexbox layout
  alignItems: "center", // Center vertically
  color: "#007BFF", // Blue color
  transition: "color 0.3s ease", // Smooth color transition
};

const rangeStyle = {
  flex: 1, // Take up available space
  cursor: "pointer", // Pointer cursor
  accentColor: "#007BFF", // Blue accent color
};

const previewDetailsStyle = {
  marginTop: "30px", // Top margin
  textAlign: "center", // Center text
  color: "#000000", // Black text
  width: "100%", // Full width
};

const cancelButtonStyle = {
  padding: "8px 16px", // Padding
  marginLeft: "10px", // Left margin
  border: "none", // No border
  cursor: "pointer", // Pointer cursor
  backgroundColor: "#E8E8E8", // Gray background
  color: "black", // Black text
  width: "220px", // Fixed width
  borderRadius: "20px", // Rounded corners
  display: "flex", // Flexbox layout
  alignItems: "center", // Center vertically
  justifyContent: "center", // Center horizontally
  lineHeight: "1", // Line height
  paddingTop: "6px", // Adjust padding
  transition: "background-color 0.3s ease", // Smooth background transition
};

const createButtonStyle = {
  padding: "8px 16px", // Padding
  marginLeft: "10px", // Left margin
  border: "none", // No border
  cursor: "pointer", // Pointer cursor
  backgroundColor: "#007BFF", // Blue background
  color: "#FFFFFF", // White text
  width: "220px", // Fixed width
  borderRadius: "20px", // Rounded corners
  display: "flex", // Flexbox layout
  alignItems: "center", // Center vertically
  justifyContent: "center", // Center horizontally
  lineHeight: "1", // Line height
  paddingTop: "6px", // Adjust padding
  transition: "background-color 0.3s ease", // Smooth background transition
};

const buttonContainerStyle = {
  marginTop: "auto", // Push to bottom
  display: "flex", // Flexbox layout
  justifyContent: "flex-end", // Align to right
  padding: "10px 20px", // Padding
};

const modalOverlayStyle = {
  position: "fixed", // Fixed position
  top: 0, // Full screen
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  display: "flex", // Flexbox layout
  alignItems: "center", // Center vertically
  justifyContent: "center", // Center horizontally
  zIndex: 1100, // High z-index
};

const modalContentStyle = {
  backgroundColor: "white", // White background
  padding: "20px", // Padding
  borderRadius: "8px", // Rounded corners
  textAlign: "center", // Center text
  boxShadow: "0 4px 15px rgba(0, 0, 123, 0.2)", // Subtle shadow
  color: "#000000", // Black text
};

const modalCloseButtonStyle = {
  padding: "8px 16px", // Padding
  border: "none", // No border
  cursor: "pointer", // Pointer cursor
  backgroundColor: "#007BFF", // Blue background
  color: "#FFFFFF", // White text
  borderRadius: "20px", // Rounded corners
  transition: "background-color 0.3s ease", // Smooth background transition
};

const deleteFrameButtonStyle = {
  position: "absolute", // Absolute position
  top: "5px", // Position from top
  right: "5px", // Position from right
  background: "rgba(255, 0, 0, 0.7)", // Red background
  border: "none", // No border
  borderRadius: "4px", // Rounded corners
  width: "20px", // Fixed width
  height: "20px", // Fixed height
  display: "flex", // Flexbox layout
  alignItems: "center", // Center vertically
  justifyContent: "center", // Center horizontally
  cursor: "pointer", // Pointer cursor
  color: "white", // White text
  fontSize: "12px", // Font size
  fontWeight: "bold", // Bold text
  padding: "0", // No padding
  transition: "background-color 0.3s ease", // Smooth background transition
};

export default DisplayDataBaseModal;