

"use client";
import React, { useState, useContext, useEffect, useCallback, useRef } from "react";
import CreateNewDataBaseModal from "../modals/create-new-database/createNewDataBaseModal";
import ImportMediaModal from "../modals/create-new-database/importMediaModal";
import DisplayDataBaseModal from "../modals/create-new-database/displayDataBaseModal";
import VideoFrameModal from "./VideoFrameModal";
import ImageUploadModal from "../search-for/ImageUploadModal"; // Import the new modal
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
  FaFilm,
} from "react-icons/fa";
import { Box } from "@chakra-ui/react";
import "./uploadFiles.css";

// Memoized GalleryItem component to prevent unnecessary re-renders
const GalleryItem = React.memo(({ file, index, arrLength, fileUrl, fileId, isExpanded, frameData, handleImageClick, handleVideoClick, handleMediaInfoClick, handleExpandFrames, formatFrameNumber, formatTime }) => {
  return (
    <div
      className="gallery-item"
      onClick={() => {
        if (file.type.startsWith("video/")) {
          handleVideoClick(file);
        } else {
          handleImageClick(file);
        }
      }}
      style={{ cursor: "pointer", transition: "all 0.3s ease", width: "220px" }}
    >
      <div className="gallery-item-index">{index + 1} of {arrLength}</div>
      <div className="gallery-item-media" style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {file.type.startsWith("image/") ? (
          <img src={fileUrl} alt={file.name} className="gallery-image" style={{ width: "200px", height: "200px", objectFit: "cover" }} />
        ) : file.type.startsWith("video/") ? (
          <>
            <div style={{ position: "relative", width: "200px", height: "200px" }}>
              <video
                src={fileUrl}
                className="gallery-video"
                muted
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              >
                Your browser does not support the video tag.
              </video>
              <FaFilm
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "10px",
                  color: "white",
                  fontSize: "24px",
                  zIndex: 1,
                }}
              />
            </div>
            {isExpanded && (
              <div
                className="gallery-item-frames"
                style={{
                  marginTop: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  alignItems: "center",
                  height: "200px",
                  overflowY: "auto",
                  transition: "height 0.3s ease",
                }}
              >
                {frameData[fileId] && frameData[fileId].length > 0 ? (
                  frameData[fileId].map((frame, frameIndex) => (
                    <div
                      key={frameIndex}
                      className="gallery-item-frame"
                      style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageClick({
                          fileUrl: frame.url,
                          fileName: `Frame_${frame.frame_number}`,
                          fileSize: 0,
                          fileType: "image/jpeg",
                        });
                      }}
                    >
                      <img
                        src={frame.url}
                        alt={`Frame ${String(frame.frame_number).padStart(3, "0")}`}
                        className="gallery-frame-image"
                        style={{ width: "50px", height: "50px", marginRight: "5px", objectFit: "cover" }}
                      />
                      <div>
                        <p style={{ margin: 0, color: "#000", fontWeight: "bold", fontSize: "12px" }}>{formatFrameNumber(frame.frame_number)}</p>
                        <p style={{ margin: "0 0 0 5px", color: "#007BFF", fontSize: "12px" }}>{formatTime(frame.timestamp)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="gallery-no-frames" style={{ fontSize: "12px" }}>
                    {frameData[fileId] === undefined ? "Loading frames..." : "No frames available."}
                  </p>
                )}
              </div>
            )}
          </>
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
            {isExpanded ? "Collapse frames" : "Expand Frames"} {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        )}
      </div>
    </div>
  );
});

const UploadFiles = React.memo(() => {
  const [showCreateDbModal, setShowCreateDbModal] = useState(false);
  const [showImportMediaModal, setShowImportMediaModal] = useState(false);
  const [showDisplayDbModal, setShowDisplayDbModal] = useState(false);
  const [showPlusModal, setShowPlusModal] = useState(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false); // State for image upload modal
  const [folderSelections, setFolderSelections] = useState([]);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [databases, setDatabases] = useState([]);
  const [selectedDatabaseIndex, setSelectedDatabaseIndex] = useState(null);
  const [showMediaInfoModal, setShowMediaInfoModal] = useState(false);
  const [mediaInfoFile, setMediaInfoFile] = useState(null);
  const [expandedFrames, setExpandedFrames] = useState({});
  const [frameData, setFrameData] = useState({});
  const [showVideoFrameModal, setShowVideoFrameModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [videoId, setVideoId] = useState(null);

  const { setSelectedImage, setUploadedFiles, finalSelectedImages, setFinalSelectedImages, setSelectedFileInfo } = useContext(ImageContext);
  const [localFinalSelectedImages, setLocalFinalSelectedImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAscending, setIsAscending] = useState(true);
  const [isGridView, setIsGridView] = useState(false);
  const [isCreateButtonClicked, setIsCreateButtonClicked] = useState(false);

  // Debounce timer for frame fetching
  const debounceTimer = useRef(null);

  useEffect(() => {
    setFinalSelectedImages(localFinalSelectedImages);
  }, [localFinalSelectedImages, setFinalSelectedImages]);

  const handleOpenCreateDatabase = useCallback(() => {
    setShowCreateDbModal(true);
    setShowPlusModal(false);
    setIsCreateButtonClicked(true);
  }, []);

  const handleImageClick = useCallback((fileInfo) => {
    setSelectedFileInfo({
      fileUrl: fileInfo.fileUrl || URL.createObjectURL(fileInfo),
      fileName: fileInfo.fileName || fileInfo.name,
      fileSize: fileInfo.fileSize || fileInfo.size,
      fileType: fileInfo.fileType || fileInfo.type,
    });
  }, [setSelectedFileInfo]);

  const handleVideoClick = useCallback(async (file) => {
    const fileUrl = URL.createObjectURL(file);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("http://localhost:8000/extract-frames/", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to extract frames");
      }
      const data = await response.json();
      setVideoId(data.video_id);
      setSelectedVideo(file);
      setSelectedVideoUrl(fileUrl);
      setShowVideoFrameModal(true);
    } catch (error) {
      console.error("Error extracting frames:", error);
    }
  }, []);

  const handleImageUpload = useCallback((event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(files);
  }, [setUploadedFiles]);

  const handleMediaInfoClick = useCallback((file) => {
    setMediaInfoFile(file);
    setShowMediaInfoModal(true);
  }, []);

  const handleDisplayDbNext = useCallback((data) => {
    const newDatabase = {
      name: data.databaseName,
      files: data.files,
    };
    setDatabases((prev) => [...prev, newDatabase]);
    setLocalFinalSelectedImages(data.files);
    setSelectedDatabaseIndex(databases.length);
    setShowDisplayDbModal(false);
  }, [databases]);

  const handleDeleteDatabase = useCallback((index) => {
    setDatabases((prev) => prev.filter((_, i) => i !== index));
    if (selectedDatabaseIndex === index) {
      setSelectedDatabaseIndex(null);
      setLocalFinalSelectedImages([]);
    } else if (selectedDatabaseIndex > index) {
      setSelectedDatabaseIndex(selectedDatabaseIndex - 1);
    }
    console.log("Database deleted, returning to initial state");
  }, [selectedDatabaseIndex]);

  const handleExpandFrames = useCallback(async (file) => {
    if (!file.type.startsWith("video/")) return;
    const fileId = `${file.name}-${file.lastModified}`;
    const isCurrentlyExpanded = expandedFrames[fileId] || false;

    setExpandedFrames((prev) => ({
      ...prev,
      [fileId]: !prev[fileId],
    }));

    if (!isCurrentlyExpanded && !frameData[fileId]) {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(async () => {
        try {
          const formData = new FormData();
          formData.append("file", file);
          const response = await fetch("http://localhost:8000/extract-frames/", {
            method: "POST",
            body: formData,
          });
          if (!response.ok) {
            throw new Error(`Failed to fetch frames: ${response.status} ${response.statusText}`);
          }
          const data = await response.json();
          if (!data.frames || !Array.isArray(data.frames)) {
            throw new Error("Invalid frames data received from server");
          }
          setFrameData((prev) => ({
            ...prev,
            [fileId]: data.frames,
          }));
          console.log(`Frames extracted for ${file.name}:`, data.frames);
        } catch (error) {
          console.error("Error fetching frames:", error.message);
          setFrameData((prev) => ({
            ...prev,
            [fileId]: [],
          }));
        }
      }, 300);
    }
  }, [expandedFrames, frameData]);

  const handleSort = useCallback(() => {
    setIsAscending((prev) => !prev);
  }, []);

  const toggleView = useCallback(() => {
    setIsGridView((prev) => !prev);
  }, []);

  const formatTime = useCallback((time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }, []);

  const formatFrameNumber = useCallback((number) => {
    return `Frame ${String(number).padStart(3, "0")}`;
  }, []);

  const handleAddImage = (imageInfo) => {
    // Create a new File object from the selected image
    const newFile = new File([imageInfo.fileUrl], imageInfo.fileName, {
      type: imageInfo.fileType,
      lastModified: Date.now(),
    });
    setLocalFinalSelectedImages((prev) => [...prev, newFile]);
    setDatabases((prev) => {
      const newDatabase = {
        name: `Database ${prev.length + 1}`,
        files: [newFile],
      };
      return [...prev, newDatabase];
    });
    setSelectedDatabaseIndex(databases.length);
  };

  return (
    <div className="upload-files-container">
      {databases.length > 0 && (
        <Box display="flex" gap="10px" mb="0" flexWrap="wrap">
          {databases.map((db, index) => (
            <Box key={index} className="database-tab">
              <Box
                className="database-tab-name"
                onClick={() => {
                  setSelectedDatabaseIndex(index);
                  setLocalFinalSelectedImages(db.files);
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
      <div className="main-container">
        {databases.length === 0 && (
          <div className="top-navigation">
            <div className="search-container">
              <button
                className="add-button"
                onClick={() => setShowImageUploadModal(true)}
              >
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
            <div className="controls-container">
              <button className="info-button" onClick={() => console.log("Info clicked")}>
                <FaInfoCircle className="info-icon" />
              </button>
              <button className="sort-button" onClick={handleSort}>
                <FaArrowUp className="sort-icon" />
                <FaArrowDown className="sort-icon" />
              </button>
              <button className="toggle-button" onClick={toggleView}>
                {isGridView ? <FaTh className="toggle-icon" /> : <FaList className="toggle-icon" />}
              </button>
            </div>
          </div>
        )}
        {databases.length === 0 && !showCreateDbModal && !showImportMediaModal && !showDisplayDbModal && !showPlusModal && (
          <div className="center-buttons">
            <button className="action-button open-database">Open a Database</button>
            <button className="action-button connect-es-database">Connect to ES Database</button>
            <button className="action-button connect-live-video" disabled>Connect to Live Video</button>
            <button
              className="action-button create-new-database"
              style={{
                background: isCreateButtonClicked ? "linear-gradient(to bottom, #2E7D32, #81C784)" : undefined,
              }}
              onClick={handleOpenCreateDatabase}
            >
              Create New Database
            </button>
          </div>
        )}
        {showPlusModal && (
          <div className="plus-modal">
            <button className="plus-modal-close" onClick={() => setShowPlusModal(false)}>×</button>
            <h4 className="plusModalOpendatabase">Open A Database</h4>
            <h4 className="plusModalConnectEs">Connect To ES Database</h4>
            <button className="plus-modal-button" onClick={handleOpenCreateDatabase}>Create New Database</button>
            <h4 className="plusModalConnecttoLive">Connect To Live Video</h4>
          </div>
        )}
        {showCreateDbModal && (
          <CreateNewDataBaseModal
            onClose={() => {
              setShowCreateDbModal(false);
              setIsCreateButtonClicked(false);
            }}
            onNext={(folders) => {
              console.log("Received folders in UploadFiles:", folders);
              setFolderSelections(folders);
              setShowCreateDbModal(false);
              setShowImportMediaModal(true);
            }}
          />
        )}
        {showImportMediaModal && (
          <ImportMediaModal
            folderSelections={folderSelections}
            onClose={() => setShowImportMediaModal(false)}
            onNext={(structuredData) => {
              console.log("Received structuredData in UploadFiles:", structuredData);
              setSelectedFolders(structuredData);
              setShowImportMediaModal(false);
              setShowDisplayDbModal(true);
            }}
          />
        )}
        {showDisplayDbModal && (
          <DisplayDataBaseModal
            onClose={() => setShowDisplayDbModal(false)}
            onNext={handleDisplayDbNext}
            selectedFolders={selectedFolders}
          />
        )}
        {selectedDatabaseIndex !== null && !showDisplayDbModal && (
          <div className="gallery-container">
            <h3 className="gallery-title">Final Gallery</h3>
            <div className="gallery-items" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {databases[selectedDatabaseIndex].files.map((file, index) => {
                const fileUrl = URL.createObjectURL(file);
                const fileId = `${file.name}-${file.lastModified}`;
                const isExpanded = expandedFrames[fileId] || false;
                return (
                  <GalleryItem
                    key={fileId}
                    file={file}
                    index={index}
                    arrLength={databases[selectedDatabaseIndex].files.length}
                    fileUrl={fileUrl}
                    fileId={fileId}
                    isExpanded={isExpanded}
                    frameData={frameData}
                    handleImageClick={handleImageClick}
                    handleVideoClick={handleVideoClick}
                    handleMediaInfoClick={handleMediaInfoClick}
                    handleExpandFrames={handleExpandFrames}
                    formatFrameNumber={formatFrameNumber}
                    formatTime={formatTime}
                  />
                );
              })}
            </div>
          </div>
        )}
        {showMediaInfoModal && (
          <div className="media-info-modal">
            <div className="media-info-header">
              <h3>Media Info</h3>
              <button className="media-info-modal-close" onClick={() => setShowMediaInfoModal(false)}>×</button>
            </div>
            <div className="media-info-content">
              <p>{mediaInfoFile ? `File Name: ${mediaInfoFile.name}` : "No file selected."}</p>
              <p>File type/Kind: </p>
              <p>File Size: </p>
              <p>Location: </p>
              <p>Created: </p>
              <p>Resolution: </p>
              <p>Duration: </p>
              <p>Frames: </p>
              <p>Codec: </p>
            </div>
            <div className="media-info-footer">
              <button className="media-info-button">Open</button>
              <button className="media-info-button">Send</button>
              <button className="media-info-button media-info-close-button">Close</button>
            </div>
          </div>
        )}
        {showVideoFrameModal && selectedVideo && (
          <VideoFrameModal
            file={selectedVideo}
            fileUrl={selectedVideoUrl}
            videoId={videoId}
            onClose={() => {
              setShowVideoFrameModal(false);
              setSelectedVideo(null);
              setSelectedVideoUrl(null);
              setVideoId(null);
            }}
            onFrameSelect={(frameInfo) => {
              handleImageClick(frameInfo);
            }}
          />
        )}
        {showImageUploadModal && (
          <ImageUploadModal
            onClose={() => setShowImageUploadModal(false)}
            onSelect={handleAddImage}
          />
        )}
      </div>
    </div>
  );
});

export default UploadFiles;