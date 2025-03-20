
"use client";
import React, { useState, useContext, useEffect } from "react";
import CreateNewDataBaseModal from "../modals/create-new-database/createNewDataBaseModal";
import ImportMediaModal from "../modals/create-new-database/importMediaModal";
import DisplayDataBaseModal from "../modals/create-new-database/displayDataBaseModal";
import { ImageContext } from "@/contexts/ImageContext";
import { FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";

// Reusable button styles
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
  const [expandedFrames, setExpandedFrames] = useState({}); // { fileId: boolean }

  // Get the setters and state from ImageContext
  const { setSelectedImage, setUploadedFiles, finalSelectedImages, setFinalSelectedImages } = useContext(ImageContext);
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
      savedFrames: data.savedFrames || [], // Store saved frames in the database
    };
    setDatabases((prev) => [...prev, newDatabase]);
    setLocalFinalSelectedImages([...data.files, ...(data.savedFrames || []).map((frame) => frame.file)]);
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

  // Handle frame expansion click (only toggles visibility of saved frames)
  const handleExpandFrames = (file) => {
    if (!file.type.startsWith("video/")) {
      return; // Only process videos
    }

    const fileId = `${file.name}-${file.lastModified}`;
    setExpandedFrames((prev) => ({
      ...prev,
      [fileId]: !prev[fileId],
    }));
  };

  // UI interaction handlers
  const handleSort = () => {
    setIsAscending(!isAscending);
  };

  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  // Format timestamp for display (MM:SS)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "90%",
        height: "650px",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
        paddingBottom: "40px",
        marginTop: "30px",
        marginLeft: "30px",
      }}
    >
      {/* Top Navigation: Search and Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "10px",
        }}
      >
        {/* Left side: Search Input & + Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={handleOpenCreateDatabase}
            style={{
              width: "30px",
              height: "30px",
              fontSize: "40px",
              fontWeight: "300",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#D6D6D6",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: "2",
              paddingBottom: "5px",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#A9D096")} // Green on hover
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#D6D6D6")} // Back to original on mouse out
          >
            +
          </button>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onBlur={() => setIsExpanded(false)}
            style={{
              width: isExpanded ? "200px" : "120px",
              padding: "8px 8px 8px 30px",
              transition: "width 0.3s ease",
              height: "30px",
              borderRadius: "20px",
              border: "none",
              backgroundColor: "#D6D6D6",
              outline: "none",
              boxShadow: "none",
              backgroundImage: "url('/images/logos/searchIcon.png')",
              backgroundSize: "20px 20px",
              backgroundPosition: "10px center",
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>
        {/* Right side: Info, Sort, Grid/List Buttons */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}>
          <button
            onClick={() => console.log("Info clicked")}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "#D6D6D6",
              backgroundImage: `url('/images/logos/DB Info.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              cursor: "pointer",
            }}
          ></button>
          <button
            onClick={handleSort}
            style={{
              width: "70px",
              height: "30px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "7px",
              backgroundColor: "#D6D6D6",
              cursor: "pointer",
              paddingRight: "30px",
              paddingLeft: "0px",
              paddingTop: "0px",
              gap: "3px",
            }}
          >
            <img
              src="/images/logos/upCaretIcon.png"
              alt="Up Arrow"
              style={{ width: "12px", height: "12px", objectFit: "contain" }}
            />
            <img
              src="/images/logos/downCareticon.png"
              alt="Down Arrow"
              style={{ width: "12px", height: "12px", objectFit: "contain" }}
            />
          </button>
          <button
            onClick={toggleView}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              padding: "5px 10px",
              borderRadius: "5px",
              width: "45px",
              height: "30px",
              cursor: "pointer",
            }}
          >
            <img
              src={
                isGridView
                  ? "/images/logos/Toggle Grid.png"
                  : "/images/logos/toggle list.png"
              }
              alt={isGridView ? "Grid View" : "List View"}
              style={{ width: "25px", height: "25px", objectFit: "contain" }}
            />
          </button>
        </div>
      </div>

      {/* Center Buttons for Database */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "5px",
          marginTop: "250px",
        }}
      >
        {/* Conditionally render the "Create New Database" button only if no database exists */}
        {!databases.length &&
          !showCreateDbModal &&
          !showImportMediaModal &&
          !showDisplayDbModal &&
          !showPlusModal && (
            <>
              <button
                style={buttonStyle("#4A88FF", "white")}
                onMouseOver={(e) => (e.currentTarget.style.background = "#2A6CD3")}
                onMouseOut={(e) => (e.currentTarget.style.background = "#4A88FF")}
              >
                Open a Database
              </button>
              <button
                style={buttonStyle("#4A88FF", "white")}
                onMouseOver={(e) => (e.currentTarget.style.background = "#2A6CD3")}
                onMouseOut={(e) => (e.currentTarget.style.background = "#4A88FF")}
              >
                Connect to ES Database
              </button>
              <button
                style={buttonStyle("#4A88FF", "white")}
                disabled
              >
                Connect to Live Video
              </button>
              <button
                style={{
                  ...buttonStyle("#A9D096", "white"),
                  background: isCreateButtonClicked
                    ? "linear-gradient(to bottom, #2E7D32, #81C784)"
                    : "#A9D096",
                  transition: "background 0.3s ease",
                }}
                onMouseOver={(e) => {
                  if (!isCreateButtonClicked) {
                    e.currentTarget.style.background = "#7FA763";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isCreateButtonClicked) {
                    e.currentTarget.style.background = "#A9D096";
                  }
                }}
                onClick={handleOpenCreateDatabase}
              >
                Create New Database
              </button>
            </>
          )}

        {/* Display the current database name, delete button, and + icon if databases exist */}
        {databases.length > 0 && (
          <div style={{ marginTop: "10px" }}>
            {databases.map((db, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "5px",
                }}
              >
                <p
                  style={{
                    fontWeight: "bold",
                    cursor: "pointer",
                    color: selectedDatabaseIndex === index ? "blue" : "black",
                  }}
                  onClick={() => {
                    setSelectedDatabaseIndex(index);
                    setLocalFinalSelectedImages([
                      ...db.files,
                      ...db.savedFrames.map((frame) => frame.file),
                    ]);
                  }}
                >
                  {db.name}
                </p>
                <button
                  style={{
                    padding: "5px 10px",
                    fontSize: "14px",
                    cursor: "pointer",
                    background: "#FF4444",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                  }}
                  onClick={() => handleDeleteDatabase(index)}
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              style={{
                marginLeft: "10px",
                padding: "5px",
                fontSize: "20px",
                cursor: "pointer",
                background: "none",
                border: "none",
              }}
              onClick={() => setShowPlusModal(true)}
            >
              <FaPlus />
            </button>
          </div>
        )}

        {/* + Icon Modal (without Close button) */}
        {showPlusModal && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#fff",
              padding: "20px",
              border: "1px solid #ccc",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
              zIndex: 1000,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h3>Create New Database</h3>
            <button
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                fontSize: "16px",
                cursor: "pointer",
              }}
              onClick={handleOpenCreateDatabase}
            >
              Create New Database
            </button>
          </div>
        )}

        {/* STEP 1: Create New Database Modal */}
        {showCreateDbModal && (
          <CreateNewDataBaseModal
            onClose={() => setShowCreateDbModal(false)}
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
          <div style={{ marginTop: "30px" }}>
            <h3>Final Gallery</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {databases[selectedDatabaseIndex].files.map((file, index, arr) => {
                const fileUrl = URL.createObjectURL(file);
                const fileId = `${file.name}-${file.lastModified}`;
                const isExpanded = expandedFrames[fileId] || false;

                // Filter saved frames associated with this video file
                const associatedFrames = databases[
                  selectedDatabaseIndex
                ].savedFrames.filter((frame) => frame.sourceFileId === fileId);

                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      borderBottom: "1px solid #ddd",
                      padding: "10px 0",
                      cursor: "pointer",
                    }}
                    onClick={() => handleImageClick(file)}
                  >
                    {/* Left: Numbering */}
                    <div
                      style={{
                        width: "60px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {index + 1} of {arr.length}
                    </div>

                    {/* Thumbnail/Preview */}
                    <div>
                      {file.type.startsWith("image/") ? (
                        <img
                          src={fileUrl}
                          alt={file.name}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "4px",
                            marginRight: "10px",
                          }}
                        />
                      ) : file.type.startsWith("video/") ? (
                        <video
                          src={fileUrl}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "4px",
                            marginRight: "10px",
                          }}
                          muted
                          loop
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : null}
                    </div>

                    {/* Description */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "bold" }}>{file.name}</div>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          color: "#555",
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMediaInfoClick(file);
                        }}
                      >
                        Media Info
                      </div>
                      {file.type.startsWith("video/") && (
                        <div
                          style={{
                            fontSize: "0.9rem",
                            color: "#555",
                            cursor: "pointer",
                            marginTop: "5px",
                          }}
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
                        <div
                          style={{
                            marginTop: "5px",
                            padding: "5px",
                            background: "#f9f9f9",
                          }}
                        >
                          {associatedFrames.length > 0 ? (
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "10px",
                              }}
                            >
                              {associatedFrames.map((frame, frameIndex) => (
                                <div
                                  key={frameIndex}
                                  style={{ textAlign: "center" }}
                                >
                                  <img
                                    src={frame.dataUrl}
                                    alt={`Frame at ${formatTime(
                                      frame.timestamp
                                    )}`}
                                    style={{
                                      width: "100px",
                                      height: "100px",
                                      objectFit: "cover",
                                      borderRadius: "4px",
                                    }}
                                  />
                                  <p
                                    style={{
                                      fontSize: "0.8rem",
                                      color: "#555",
                                    }}
                                  >
                                    {formatTime(frame.timestamp)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p
                              style={{
                                fontSize: "0.9rem",
                                color: "#666",
                              }}
                            >
                              No frames saved for this video.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Media Info Modal */}
        {showMediaInfoModal && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#fff",
              padding: "20px",
              border: "1px solid #ccc",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
              zIndex: 1000,
            }}
          >
            <h3>Media Info</h3>
            <p>
              {mediaInfoFile
                ? `File Name: ${mediaInfoFile.name}`
                : "No file selected."}
            </p>
            <button onClick={() => setShowMediaInfoModal(false)}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}