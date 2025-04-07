
"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import { ImageContext } from "@/contexts/ImageContext";
import { FaFolder, FaFileImage, FaFileVideo, FaForward, FaBackward, FaChevronDown, FaChevronUp } from "react-icons/fa";

const DisplayDataBaseModal = ({ onClose, onNext, selectedFolders }) => {
  const { setFinalSelectedImages } = useContext(ImageContext);
  const subFolders = selectedFolders.mainFolder.subFolders;

  const allFiles = [];
  const collectFilesRecursively = (folders) => {
    folders.forEach((folder) => {
      if (folder.files && folder.files.length > 0) {
        allFiles.push(...folder.files);
      }
      if (folder.subFolders && folder.subFolders.length > 0) {
        collectFilesRecursively(folder.subFolders);
      }
    });
  };
  collectFilesRecursively(subFolders);

  const [fileSelections, setFileSelections] = useState(() => {
    const initialFileSelections = {};
    allFiles.forEach((file, index) => {
      initialFileSelections[index] = true;
    });
    return initialFileSelections;
  });

  const [showMediaInfoModal, setShowMediaInfoModal] = useState(false);
  const [mediaInfoFile, setMediaInfoFile] = useState(null);
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef(null);

  const [databaseCount, setDatabaseCount] = useState(() => {
    return parseInt(localStorage.getItem("databaseCount") || "1", 10);
  });

  const [clickedIcon, setClickedIcon] = useState(null);
  const [fileUrls, setFileUrls] = useState({});
  const [databaseSelected, setDatabaseSelected] = useState(true);
  const [isFilesExpanded, setIsFilesExpanded] = useState(false);
  const [resolutionLevel, setResolutionLevel] = useState(2);
  const [colorSetting, setColorSetting] = useState("fullColor");

  useEffect(() => {
    const newFileUrls = {};
    allFiles.forEach((file, index) => {
      const fileId = `file-${index}`;
      if (!fileUrls[fileId]) {
        const url = URL.createObjectURL(file);
        newFileUrls[fileId] = url;
      }
    });
    setFileUrls((prev) => ({ ...prev, ...newFileUrls }));

    return () => {
      Object.values(newFileUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("databaseCount", databaseCount);
  }, [databaseCount]);

  const toggleDatabaseSelection = () => {
    const newSelected = !databaseSelected;
    setDatabaseSelected(newSelected);
    const newFileSelections = {};
    allFiles.forEach((_, index) => {
      newFileSelections[index] = newSelected;
    });
    setFileSelections(newFileSelections);
  };

  const toggleFileSelection = (fileIndex) => {
    setFileSelections((prev) => ({
      ...prev,
      [fileIndex]: !prev[fileIndex],
    }));
    const allFilesChecked = Object.values({
      ...fileSelections,
      [fileIndex]: !fileSelections[fileIndex]
    }).every(Boolean);
    setDatabaseSelected(allFilesChecked);
  };

  const handleMediaInfoClick = (file) => {
    setMediaInfoFile(file);
    setShowMediaInfoModal(true);
  };

  const handleFinish = () => {
    const selectedFiles = allFiles.filter((_, index) => fileSelections[index]);
    const databaseName = `database ${String.fromCharCode(65 + databaseCount)}`;
    setDatabaseCount((prev) => prev + 1);
    onNext({ files: selectedFiles, databaseName, resolutionLevel, colorSetting });
  };

  const getFileIcon = (file, iconId) => {
    const baseStyle = { color: "#E0E7FF", transition: "color 0.3s ease" };
    const hoverStyle = { color: "#0056D2" };
    const clickedStyle = { color: "#003087" };
    const iconStyle = {
      ...baseStyle,
      ...(clickedIcon === iconId ? clickedStyle : hoverStyle),
    };

    const handleMouseDown = () => setClickedIcon(iconId);
    const handleMouseUp = () => setClickedIcon(null);

    if (file.type.startsWith("image/"))
      return <FaFileImage style={iconStyle} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} />;
    if (file.type.startsWith("video/"))
      return <FaFileVideo style={iconStyle} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} />;
    return <FaFileImage style={iconStyle} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} />;
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSeek = (event) => {
    const newTime = parseFloat(event.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleFastForward = () => {
    if (videoRef.current) {
      const newTime = Math.min(videoRef.current.currentTime + 5, videoDuration);
      setCurrentTime(newTime);
      videoRef.current.currentTime = newTime;
    }
  };

  const handleRewind = () => {
    if (videoRef.current) {
      const newTime = Math.max(videoRef.current.currentTime - 5, 0);
      setCurrentTime(newTime);
      videoRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const totalItems = allFiles.length;

  return (
    <div className="modal" style={modalStyle}>
      <div style={blueBarStyle}>
        <h3 style={{ color: "black", margin: 0, fontSize: 15 }}>New Database Settings</h3>
        <button onClick={onClose} style={closeButtonStyle}>×</button>
      </div>

      <div style={{ display: "flex", width: "100%", height: "400px", flexDirection: "column" }}>
        <div style={{ padding: "10px", borderBottom: "1px solid #ddd", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={databaseSelected}
              onChange={toggleDatabaseSelection}
              style={{ marginRight: "8px" }}
            />
            <FaFolder size={40} style={{ color: "#FFD700", marginRight: "12px" }} />
            <div>
              <strong style={{ fontSize: "18px", color: "#000000" }}>{selectedFolders.mainFolder.name}</strong>
              <div style={{ fontSize: "0.9rem", color: "#555" }}>{totalItems} item{totalItems !== 1 ? "s" : ""}</div>
            </div>
          </div>
          <button
            onClick={() => setIsFilesExpanded(!isFilesExpanded)}
            style={toggleButtonStyle}
          >
            {isFilesExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <div style={leftPanelStyle}>
            {isFilesExpanded && allFiles.length > 0 ? (
              allFiles.map((file, index) => {
                const fileId = `file-${index}`;
                const fileUrl = fileUrls[fileId] || "";
                return (
                  <div
                    key={fileId}
                    style={{ ...fileItemStyle, opacity: fileSelections[index] ? 1 : 0.4 }}
                  >
                    <input
                      type="checkbox"
                      checked={fileSelections[index]}
                      onChange={() => toggleFileSelection(index)}
                      style={{ marginRight: "8px" }}
                    />
                    {fileUrl && file.type.startsWith("image/") ? (
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
                          setSelectedFile(file);
                        }}
                      />
                    ) : fileUrl && file.type.startsWith("video/") ? (
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
                      </video>
                    ) : (
                      <span style={{ marginRight: "8px" }}>{getFileIcon(file, `file-${fileId}`)}</span>
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
                        setSelectedFile(file);
                      }}
                    >
                      {file.name}
                    </span>
                    <span
                      style={{ marginLeft: "10px", color: "#007BFF", cursor: "pointer" }}
                      onClick={() => handleMediaInfoClick(file)}
                    >
                      Media Info
                    </span>
                  </div>
                );
              })
            ) : isFilesExpanded ? (
              <p style={{ color: "#000000" }}>No files selected.</p>
            ) : null}
          </div>

          <div style={rightPanelStyle}>
            {selectedPreview ? (
              <>
                {selectedFile?.type.startsWith("video/") ? (
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
                    </video>
                    <div style={videoControlsStyle}>
                      <button onClick={handleRewind} style={videoButtonStyle} title="Rewind 5 seconds">
                        <FaBackward size={20} />
                      </button>
                      <span style={{ color: "#000000" }}>{formatTime(currentTime)}</span>
                      <input
                        type="range"
                        min="0"
                        max={videoDuration || 0}
                        step="0.1"
                        value={currentTime}
                        onChange={handleSeek}
                        style={rangeStyle}
                      />
                      <span style={{ color: "#000000" }}>{formatTime(videoDuration)}</span>
                      <button onClick={handleFastForward} style={videoButtonStyle} title="Fast-forward 5 seconds">
                        <FaForward size={20} />
                      </button>
                    </div>
                  </div>
                ) : (
                  selectedPreview && (
                    <img
                      src={selectedPreview}
                      alt="Selected Preview"
                      style={{
                        width: "100%",
                        height: "70%",
                        objectFit: "contain",
                        borderRadius: "5px",
                      }}
                    />
                  )
                )}
                <div style={previewDetailsStyle}>
                  <p><strong>Name:</strong> {selectedFile?.name || "Unknown"}</p>
                  <p><strong>Size:</strong> {((selectedFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB</p>
                  {selectedFile?.type.startsWith("video/") ? (
                    <>
                      <p><strong>Resolution:</strong> {videoRef.current ? `${videoRef.current.videoWidth}x${videoRef.current.videoHeight}` : "N/A"}</p>
                      <p><strong>Duration:</strong> {formatTime(videoDuration)}</p>
                    </>
                  ) : (
                    <p><strong>Resolution:</strong> N/A</p>
                  )}
                  <p style={{ color: "#007BFF", cursor: "default" }}>Open File</p>
                </div>
              </>
            ) : (
              <p style={{ fontSize: "14px", color: "#000000" }}>Click an image or video to preview</p>
            )}
          </div>
        </div>

        <div style={{ padding: "10px", borderTop: "1px solid #ddd", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ fontSize: "14px", color: "#000000" }}>Database Resolution Level:</label>
            <input
              type="range"
              min="2"
              max="12"
              step="1"
              value={resolutionLevel}
              onChange={(e) => setResolutionLevel(parseInt(e.target.value))}
              style={{ flex: 1, cursor: "pointer", accentColor: "#007BFF" }}
            />
            <span style={{ fontSize: "14px", color: "#000000" }}>{resolutionLevel}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ fontSize: "14px", color: "#000000" }}>Database Color Settings:</label>
            <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <input
                type="radio"
                value="fullColor"
                checked={colorSetting === "fullColor"}
                onChange={(e) => setColorSetting(e.target.value)}
              />
              Full color
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <input
                type="radio"
                value="blackAndWhite"
                checked={colorSetting === "blackAndWhite"}
                onChange={(e) => setColorSetting(e.target.value)}
              />
              Black & white
            </label>
          </div>
        </div>
      </div>

      <div style={buttonContainerStyle}>
        <button onClick={onClose} style={cancelButtonStyle}>Cancel</button>
        <button onClick={handleFinish} style={createButtonStyle}>Create Database</button>
      </div>

      {showMediaInfoModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ color: "#000000" }}>Media Info</h3>
            <p style={{ color: "#000000" }}>{mediaInfoFile ? `File Name: ${mediaInfoFile.name}` : "No file selected."}</p>
            <button onClick={() => setShowMediaInfoModal(false)} style={modalCloseButtonStyle}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  borderRadius: "8px",
  zIndex: 1000,
  width: "900px",
  height: "500px",
  color: "#000000",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 4px 15px rgba(0, 0, 123, 0.2)",
};

const blueBarStyle = {
  width: "100%",
  backgroundColor: "#EEF2FF",
  borderRadius: "8px 8px 0 0",
  padding: "10px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  position: "relative",
  minHeight: "40px",
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
  padding: 0,
  transition: "background-color 0.3s ease",
};

const toggleButtonStyle = {
  padding: "6px 12px",
  border: "none",
  borderRadius: "20px",
  cursor: "pointer",
  backgroundColor: "#E0E7FF",
  color: "#0056D2",
  transition: "background-color 0.3s ease",
};

const leftPanelStyle = {
  flex: 1,
  padding: "10px",
  overflowY: "auto",
  maxHeight: "400px",
};

const rightPanelStyle = {
  flex: 1,
  padding: "10px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  backgroundColor: "#F9FBFF",
  maxHeight: "400px",
};

const fileItemStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "8px",
};

const videoControlsStyle = {
  marginTop: "10px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  width: "100%",
};

const videoButtonStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "5px",
  display: "flex",
  alignItems: "center",
  color: "#007BFF",
  transition: "color 0.3s ease",
};

const rangeStyle = {
  flex: 1,
  cursor: "pointer",
  accentColor: "#007BFF",
};

const previewDetailsStyle = {
  marginTop: "30px",
  textAlign: "center",
  color: "#000000",
  width: "100%",
};

const cancelButtonStyle = {
  padding: "8px 16px",
  marginLeft: "10px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#E8E8E8",
  color: "black",
  width: "220px",
  borderRadius: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: "1",
  paddingTop: "6px",
  transition: "background-color 0.3s ease",
};

const createButtonStyle = {
  padding: "8px 16px",
  marginLeft: "10px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#007BFF",
  color: "#FFFFFF",
  width: "220px",
  borderRadius: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: "1",
  paddingTop: "6px",
  transition: "background-color 0.3s ease",
};

const buttonContainerStyle = {
  marginTop: "auto",
  display: "flex",
  justifyContent: "flex-end",
  padding: "10px 20px",
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
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  textAlign: "center",
  boxShadow: "0 4px 15px rgba(0, 0, 123, 0.2)",
  color: "#000000",
};

const modalCloseButtonStyle = {
  padding: "8px 16px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#007BFF",
  color: "#FFFFFF",
  borderRadius: "20px",
  transition: "background-color 0.3s ease",
};

export default DisplayDataBaseModal;