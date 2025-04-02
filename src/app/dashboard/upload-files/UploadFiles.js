

"use client";
import React, { useState, useContext, useEffect } from "react";
import CreateNewDataBaseModal from "../modals/create-new-database/createNewDataBaseModal";
import ImportMediaModal from "../modals/create-new-database/importMediaModal";
import DisplayDataBaseModal from "../modals/create-new-database/displayDataBaseModal";
import { ImageContext } from "@/contexts/ImageContext";
import {
  FaPlus,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
  FaSearch,
  FaInfoCircle,
  FaArrowUp,
  FaArrowDown,
  FaTh,
  FaList,
} from "react-icons/fa";
import { Box } from "@chakra-ui/react";
import "./uploadFiles.css"; // Updated import path
// Reusable button styles (for center buttons)
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
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});
export default function UploadFiles() {
  // Modal chain states
  const [showCreateDbModal, setShowCreateDbModal] = useState(false);
  const [showImportMediaModal, setShowImportMediaModal] = useState(false);
  const [showDisplayDbModal, setShowDisplayDbModal] = useState(false);
  const [showPlusModal, setShowPlusModal] = useState(false);
  // State for folder selections from CreateNewDataBaseModal
  const [folderSelections, setFolderSelections] = useState([]);
  // State for the selected folders from ImportMediaModal
  const [selectedFolders, setSelectedFolders] = useState([]);
  // State for multiple databases
  const [databases, setDatabases] = useState([]);
  const [selectedDatabaseIndex, setSelectedDatabaseIndex] = useState(null);
  // State for Media Info Modal
  const [showMediaInfoModal, setShowMediaInfoModal] = useState(false);
  const [mediaInfoFile, setMediaInfoFile] = useState(null);
  // State for frame expansion (only for toggling visibility of saved frames)
  const [expandedFrames, setExpandedFrames] = useState({});
  // Get the setters and state from ImageContext
  const {
    setSelectedImage,
    setUploadedFiles,
    finalSelectedImages,
    setFinalSelectedImages,
  } = useContext(ImageContext);
  const [localFinalSelectedImages, setLocalFinalSelectedImages] = useState([]);
  // Search and UI states
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAscending, setIsAscending] = useState(true);
  const [isGridView, setIsGridView] = useState(false);
  // State to track if the Create New Database button is clicked
  const [isCreateButtonClicked, setIsCreateButtonClicked] = useState(false);
  // Sync local state with context when it updates
  useEffect(() => {
    setFinalSelectedImages(localFinalSelectedImages);
  }, [localFinalSelectedImages, setFinalSelectedImages]);
  const handleOpenCreateDatabase = () => {
    setShowCreateDbModal(true);
    setShowPlusModal(false);
    setIsCreateButtonClicked(true);
  };
  const handleImageClick = (file) => {
    const fileUrl = URL.createObjectURL(file);
    setSelectedImage(fileUrl);
  };
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(files);
  };
  const handleMediaInfoClick = (file) => {
    setMediaInfoFile(file);
    setShowMediaInfoModal(true);
  };
  const handleDisplayDbNext = (data) => {
    const newDatabase = {
      name: data.databaseName,
      files: data.files,
      savedFrames: data.savedFrames || [],
    };
    setDatabases((prev) => [...prev, newDatabase]);
    setLocalFinalSelectedImages([
      ...data.files,
      ...(data.savedFrames || []).map((frame) => frame.file),
    ]);
    setSelectedDatabaseIndex(databases.length);
    setShowDisplayDbModal(false);
  };
  const handleDeleteDatabase = (index) => {
    setDatabases((prev) => prev.filter((_, i) => i !== index));
    if (selectedDatabaseIndex === index) {
      setSelectedDatabaseIndex(null);
      setLocalFinalSelectedImages([]);
    } else if (selectedDatabaseIndex > index) {
      setSelectedDatabaseIndex(selectedDatabaseIndex - 1);
    }
    console.log("Database deleted, returning to initial state");
  };
  const handleExpandFrames = (file) => {
    if (!file.type.startsWith("video/")) {
      return;
    }
    const fileId = `${file.name}-${file.lastModified}`;
    setExpandedFrames((prev) => ({
      ...prev,
      [fileId]: !prev[fileId],
    }));
  };
  const handleSort = () => {
    setIsAscending(!isAscending);
  };
  const toggleView = () => {
    setIsGridView(!isGridView);
  };
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  return (
    <div className="upload-files-container">
      {/* Database Tabs Row at the Top */}
      {databases.length > 0 && (
        <Box
          display="flex"
          gap="10px"
          mb="0" // Changed from 10px to 0 to remove space between tabs and gallery
          flexWrap="wrap"
        >
          {databases.map((db, index) => (
            <Box key={index} className="database-tab">
              <Box
                className="database-tab-name"
                onClick={() => {
                  setSelectedDatabaseIndex(index);
                  setLocalFinalSelectedImages([
                    ...db.files,
                    ...db.savedFrames.map((frame) => frame.file),
                  ]);
                }}
              >
                {db.name}
              </Box>
              <Box
                as="button"
                className="database-tab-close"
                onClick={() => handleDeleteDatabase(index)}
              >
                <FaTimes size={12} />
              </Box>
            </Box>
          ))}
          <Box
            as="button"
            className="database-tab-add"
            onClick={() => setShowPlusModal(true)}
          >
            <FaPlus />
          </Box>
        </Box>
      )}
      {/* Main UploadFiles Container */}
      <div className="main-container">
        {/* Top Navigation: Search and Controls (shown only if no database exists) */}
        {databases.length === 0 && (
          <div className="top-navigation">
            {/* Left side: Search Input & + Button */}
            <div className="search-container">
              <button className="add-button" onClick={handleOpenCreateDatabase}>
                +
              </button>
              <div className="search-input-wrapper">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsExpanded(true)}
                  onBlur={() => setIsExpanded(false)}
                  className="search-input"
                  style={{
                    width: isExpanded ? "200px" : "120px",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>

{/* Right side: Info, Sort, Grid/List Buttons */}
            <div className="controls-container">
              <button
                className="info-button"
                onClick={() => console.log("Info clicked")}
              >
                <FaInfoCircle className="info-icon" />
              </button>
              <button className="sort-button" onClick={handleSort}>
                <FaArrowUp className="sort-icon" />
                <FaArrowDown className="sort-icon" />
              </button>
              <button className="toggle-button" onClick={toggleView}>
                {isGridView ? (
                  <FaTh className="toggle-icon" />
                ) : (
                  <FaList className="toggle-icon" />
                )}
              </button>
            </div>
          </div>
        )}
        {/* Center Buttons for Database (shown only if no database exists) */}
        {databases.length === 0 &&
          !showCreateDbModal &&
          !showImportMediaModal &&
          !showDisplayDbModal &&
          !showPlusModal && (
            <div className="center-buttons">
              <button className="action-button open-database">
                Open a Database
              </button>
              <button className="action-button connect-es-database">
                Connect to ES Database
              </button>
              <button className="action-button connect-live-video" disabled>
                Connect to Live Video
              </button>
              <button
                className="action-button create-new-database"
                style={{
                  background: isCreateButtonClicked
                    ? "linear-gradient(to bottom, #2E7D32, #81C784)"
                    : undefined,
                }}
                onClick={handleOpenCreateDatabase}
              >
                Create New Database
              </button>
            </div>
          )}
        {/* + Icon Modal (without Close button) */}
        {showPlusModal && (
          <div className="plus-modal">
            <button
              className="plus-modal-close"
              onClick={() => setShowPlusModal(false)} // Assumes this state exists in your component
            >
              ×
            </button>
            <h4 className="plusModalOpendatabase">Open A Database</h4>
            <h4 className="plusModalConnectEs">Connect To ES Database</h4>
            <button
              className="plus-modal-button"
              onClick={handleOpenCreateDatabase}
            >
              Create New Database
            </button>
            <h4 className="plusModalConnecttoLive">Connect To Live Video</h4>
          </div>
        )}
        {/* STEP 1: Create New Database Modal */}
        {showCreateDbModal && (
          <CreateNewDataBaseModal
            onClose={() => {
              setShowCreateDbModal(false);
              setIsCreateButtonClicked(false);
            }}
            onNext={(folders) => {
              setFolderSelections(folders);
              setShowCreateDbModal(false);
              setShowImportMediaModal(true);
            }}
          />
        )}
        {/* STEP 2: Import Media Modal */}
        {showImportMediaModal && (
          <ImportMediaModal
            folderSelections={folderSelections}
            onClose={() => setShowImportMediaModal(false)}
            onNext={(folders) => {
              setSelectedFolders(folders);
              setShowImportMediaModal(false);
              setShowDisplayDbModal(true);
            }}
          />
        )}
        {/* STEP 3: Display Database Modal */}
        {showDisplayDbModal && (
          <DisplayDataBaseModal
            onClose={() => setShowDisplayDbModal(false)}
            onNext={handleDisplayDbNext}
            selectedFolders={selectedFolders}
          />
        )}
        {/* Final Gallery Display on Main Page */}
        {selectedDatabaseIndex !== null && !showDisplayDbModal && (
          <div className="gallery-container">
            <h3 className="gallery-title">Final Gallery</h3>
            <div className="gallery-items">
              {databases[selectedDatabaseIndex].files.map(
                (file, index, arr) => {
                  const fileUrl = URL.createObjectURL(file);
                  const fileId = `${file.name}-${file.lastModified}`;
                  const isExpanded = expandedFrames[fileId] || false;
                  const associatedFrames = databases[
                    selectedDatabaseIndex
                  ].savedFrames.filter(
                    (frame) => frame.sourceFileId === fileId
                  );
                  return (
                    <div
                      key={index}
                      className="gallery-item"
                      onClick={() => handleImageClick(file)}
                    >
                      <div className="gallery-item-index">
                        {index + 1} of {arr.length}
                      </div>
                      <div className="gallery-item-media">
                        {file.type.startsWith("image/") ? (
                          <img
                            src={fileUrl}
                            alt={file.name}
                            className="gallery-image"
                          />
                        ) : file.type.startsWith("video/") ? (
                          <video
                            src={fileUrl}
                            className="gallery-video"
                            muted
                            loop
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : null}
                      </div>
                      <div className="gallery-item-details">
                        <div className="gallery-item-name">{file.name}</div>
                        <div
                          className="gallery-item-media-info"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMediaInfoClick(file);
                          }}
                        >
                          Media Info
                        </div>
                        {file.type.startsWith("video/") && (
                          <div
                            className="gallery-item-expand-frames"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExpandFrames(file);
                            }}
                          >
                            Expand Frames{" "}
                            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                          </div>
                        )}
                        {isExpanded && (
                          <div className="gallery-item-frames">
                            {associatedFrames.length > 0 ? (
                              <div className="gallery-item-frames-list">
                                {associatedFrames.map((frame, frameIndex) => (
                                  <div
                                    key={frameIndex}
                                    className="gallery-item-frame"
                                  >
                                    <img
                                      src={frame.dataUrl}
                                      alt={`Frame at ${formatTime(
                                        frame.timestamp
                                      )}`}
                                      className="gallery-frame-image"
                                    />
                                    <p className="gallery-frame-timestamp">
                                      {formatTime(frame.timestamp)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="gallery-no-frames">
                                No frames saved for this video.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

{/* Media Info Modal */}
        {showMediaInfoModal && (
          <div className="media-info-modal">
            {/* Light blue header bar */}
            <div className="media-info-header">
              <h3>Media Info</h3>
              <button
                className="media-info-modal-close"
                onClick={() => setShowMediaInfoModal(false)}
              >
                ×
              </button>
            </div>
            {/* Modal content */}
            <div className="media-info-content">
              <p>
                {mediaInfoFile
                  ? `File Name: ${mediaInfoFile.name}`
                  : "No file selected."}
              </p>
              <p>File type/Kind: </p>
              <p>File Size: </p>
              <p>Location: </p>
              <p>Created: </p>
              <p>Resolution: </p>
              <p>Duration: </p>
              <p>Frames: </p>
              <p>Codec: </p>
            </div>
            {/* Footer with buttons */}
            <div className="media-info-footer">
              <button className="media-info-button">Open</button>
              <button className="media-info-button">Send</button>
              <button className="media-info-button media-info-close-button">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
