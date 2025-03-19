
"use client";
import React, { useState, useContext, useEffect, useRef } from "react";
import CreateNewDataBaseModal from "../modals/create-new-database/createNewDataBaseModal";
import ImportMediaModal from "../modals/create-new-database/importMediaModal";
import DisplayDataBaseModal from "../modals/create-new-database/displayDataBaseModal";
import { ImageContext } from "@/contexts/ImageContext";
import { FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";

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

  // State for frame expansion and extracted frames, scoped to each file
  const [fileFrames, setFileFrames] = useState({}); // { fileId: { frames: [], isExpanded: false, loading: false } }
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Get the setters and state from ImageContext
  const { setSelectedImage, setUploadedFiles, finalSelectedImages, setFinalSelectedImages } = useContext(ImageContext);
  const [localFinalSelectedImages, setLocalFinalSelectedImages] = useState([]);

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
    const newDatabase = { name: data.databaseName, files: data.files };
    setDatabases((prev) => [...prev, newDatabase]);
    setLocalFinalSelectedImages(data.files);
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

  // Client-side frame extraction (kept as fallback)
  const extractFramesClient = (file) => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const frameList = [];

      video.src = url;
      video.load();

      video.onloadedmetadata = () => {
        const duration = video.duration;
        const frameRate = 30; // Assuming 30 FPS; adjust based on video metadata if needed
        const totalFrames = Math.floor(duration * frameRate);
        const interval = duration / totalFrames;

        let currentTime = 0;
        const captureFrame = () => {
          if (currentTime <= duration) {
            video.currentTime = currentTime;
            video.onseeked = () => {
              context.drawImage(video, 0, 0, canvas.width, canvas.height);
              frameList.push(canvas.toDataURL("image/jpeg"));
              currentTime += interval;
              video.onseeked = captureFrame;
            };
          } else {
            video.onseeked = null;
            URL.revokeObjectURL(url);
            resolve(frameList);
          }
        };

        captureFrame();
      };
    });
  };

  // Backend frame extraction using FFmpeg, updated with dynamic timestamps
  const extractFramesBackend = async (file) => {
    // Use a unique identifier for the file to avoid conflicts
    const fileId = `${file.name}-${file.lastModified}`;
    setFileFrames((prev) => ({
      ...prev,
      [fileId]: { ...prev[fileId], frames: [], loading: true },
    }));

    try {
      console.log("Uploading file to /extract-frames:", file);
      const formData = new FormData();
      formData.append("file", file);

      // Fetch video duration to set appropriate timestamps
      const url = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.src = url;
      await new Promise((resolve) => {
        video.onloadedmetadata = () => resolve();
        video.load();
      });
      const duration = video.duration;
      URL.revokeObjectURL(url);

      // Generate timestamps based on video duration (1 frame per second)
      const timestamps = Array.from(
        { length: Math.floor(duration) + 1 },
        (_, i) => i.toString()
      ).join(",");
      formData.append("timestamps", timestamps); // e.g., "0,1,2,3" for a 3.96s video
      formData.append("save_frames", "false");

      const response = await fetch("http://localhost:8000/extract-frames/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
        throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
      }

      const data = await response.json();
      if (data.error) {
        console.error("Server returned error:", data.error);
        throw new Error(data.error);
      }

      // Map the frames from the response
      const frameData = data.frames.map((frame) => frame.data || frame.url || "");
      return { frames: frameData, fileId };
    } catch (error) {
      console.error("Error extracting frames from backend:", error);
      // Fallback to client-side extraction if backend fails
      const frameData = await extractFramesClient(file);
      return { frames: frameData, fileId };
    } finally {
      setFileFrames((prev) => ({
        ...prev,
        [fileId]: { ...prev[fileId], loading: false },
      }));
    }
  };

  // Handle frame expansion click
  const handleExpandFrames = async (file) => {
    if (!file.type.startsWith("video/")) {
      return; // Only process videos
    }

    const fileId = `${file.name}-${file.lastModified}`;
    // Initialize state for this file if not present
    setFileFrames((prev) => ({
      ...prev,
      [fileId]: { frames: [], isExpanded: false, loading: false, ...prev[fileId] },
    }));

    // Toggle expansion
    setFileFrames((prev) => ({
      ...prev,
      [fileId]: { ...prev[fileId], isExpanded: !prev[fileId]?.isExpanded },
    }));

    // If already extracted, no need to fetch again
    if (fileFrames[fileId]?.frames?.length > 0) {
      return;
    }

    const { frames } = await extractFramesBackend(file);
    setFileFrames((prev) => ({
      ...prev,
      [fileId]: { ...prev[fileId], frames },
    }));
  };

  return (
    <div style={{ padding: "20px", color: "black" }}>
      {/* Conditionally render the "Create New Database" button only if no database exists */}
      {!databases.length &&
        !showCreateDbModal &&
        !showImportMediaModal &&
        !showDisplayDbModal &&
        !showPlusModal && (
          <button
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
            }}
            onClick={handleOpenCreateDatabase}
          >
            Create New Database
          </button>
        )}

      {/* Display the current database name, delete button, and + icon if databases exist */}
      {databases.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          {databases.map((db, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
              <p
                style={{
                  fontWeight: "bold",
                  cursor: "pointer",
                  color: selectedDatabaseIndex === index ? "blue" : "black",
                }}
                onClick={() => {
                  setSelectedDatabaseIndex(index);
                  setLocalFinalSelectedImages(db.files);
                }}
              >
                {db.name}
              </p>
              <button
                style={{
                  padding: "5px 10px",
                  fontSize: "14px",
                  cursor: "pointer",
                  background: "#ff4444",
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
              const frameData = fileFrames[fileId] || { frames: [], isExpanded: false, loading: false };

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
                  <div style={{ width: "60px", textAlign: "center", fontWeight: "bold" }}>
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
                      style={{ fontSize: "0.9rem", color: "#555", cursor: "pointer" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMediaInfoClick(file);
                      }}
                    >
                      Media Info
                    </div>
                    {file.type.startsWith("video/") && (
                      <div
                        style={{ fontSize: "0.9rem", color: "#555", cursor: "pointer", marginTop: "5px" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExpandFrames(file);
                        }}
                      >
                        Expand Frames {frameData.isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                    )}
                    {frameData.loading && <p>Loading frames...</p>}
                    {frameData.isExpanded && frameData.frames.length > 0 && (
                      <div style={{ marginTop: "5px", padding: "5px", background: "#f9f9f9" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                          {frameData.frames.map((frame, frameIndex) => (
                            <img
                              key={frameIndex}
                              src={frame}
                              alt={`Frame ${frameIndex + 1}`}
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                            />
                          ))}
                        </div>
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
          <p>{mediaInfoFile ? `File Name: ${mediaInfoFile.name}` : "No file selected."}</p>
          <button onClick={() => setShowMediaInfoModal(false)}>Close</button>
        </div>
      )}

      {/* Hidden video and canvas elements for frame extraction */}
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} style={{ display: "none" }} width="100" height="100" />
    </div>
  );
}