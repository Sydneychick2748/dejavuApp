
// "use client";
// import React, { useState, useContext, useEffect, useCallback, useRef } from "react";
// import CreateNewDataBaseModal from "../modals/create-new-database/createNewDataBaseModal";
// import ImportMediaModal from "../modals/create-new-database/importMediaModal";
// import DisplayDataBaseModal from "../modals/create-new-database/displayDataBaseModal";
// import { ImageContext } from "@/contexts/ImageContext";
// import {
//   FaPlus,
//   FaChevronDown,
//   FaChevronUp,
//   FaTimes,
//   FaSearch,
//   FaInfoCircle,
//   FaArrowUp,
//   FaArrowDown,
//   FaTh,
//   FaList,
//   FaFilm,
// } from "react-icons/fa";
// import { Box } from "@chakra-ui/react";
// import "./uploadFiles.css";

// // Memoized GalleryItem component to prevent unnecessary re-renders
// const GalleryItem = React.memo(({ file, index, arrLength, fileUrl, fileId, isExpanded, frameData, handleImageClick, handleFrameClick, handleMediaInfoClick, handleExpandFrames, formatFrameNumber, formatTime }) => {
//   return (
//     <div
//       className="gallery-item"
//       onClick={() => handleImageClick(file)}
//       style={{ cursor: "pointer", transition: "all 0.3s ease", width: "220px" }}
//     >
//       <div className="gallery-item-index">{index + 1} of {arrLength}</div>
//       <div className="gallery-item-media" style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
//         {file.type.startsWith("image/") ? (
//           <img src={fileUrl} alt={file.name} className="gallery-image" style={{ width: "200px", height: "200px", objectFit: "cover" }} />
//         ) : file.type.startsWith("video/") ? (
//           <>
//             <div style={{ position: "relative", width: "200px", height: "200px" }}>
//               <video
//                 src={fileUrl}
//                 className="gallery-video"
//                 muted
//                 loop
//                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
//               >
//                 Your browser does not support the video tag.
//               </video>
//               <FaFilm
//                 style={{
//                   position: "absolute",
//                   bottom: "10px",
//                   left: "10px",
//                   color: "white",
//                   fontSize: "24px",
//                   zIndex: 1,
//                 }}
//               />
//             </div>
//             {isExpanded && (
//               <div
//                 className="gallery-item-frames"
//                 style={{
//                   marginTop: "10px",
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: "5px",
//                   alignItems: "center",
//                   height: "200px",
//                   overflowY: "auto",
//                   transition: "height 0.3s ease",
//                 }}
//               >
//                 {frameData[fileId] && frameData[fileId].length > 0 ? (
//                   frameData[fileId].map((frame, frameIndex) => (
//                     <div
//                       key={frameIndex}
//                       className="gallery-item-frame"
//                       style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
//                       onClick={(e) => {
//                         e.stopPropagation(); // Prevent triggering the parent onClick
//                         handleFrameClick(frame);
//                       }}
//                     >
//                       <img
//                         src={frame.url}
//                         alt={`Frame ${String(frame.frame_number).padStart(3, "0")}`}
//                         className="gallery-frame-image"
//                         style={{ width: "50px", height: "50px", marginRight: "5px", objectFit: "cover" }}
//                       />
//                       <div>
//                         <p style={{ margin: 0, color: "#000", fontWeight: "bold", fontSize: "12px" }}>{formatFrameNumber(frame.frame_number)}</p>
//                         <p style={{ margin: "0 0 0 5px", color: "#007BFF", fontSize: "12px" }}>{formatTime(frame.timestamp)}</p>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="gallery-no-frames" style={{ fontSize: "12px" }}>
//                     {frameData[fileId] === undefined ? "Loading frames..." : "No frames available."}
//                   </p>
//                 )}
//               </div>
//             )}
//           </>
//         ) : null}
//       </div>
//       <div className="gallery-item-details">
//         <div className="gallery-item-name">{file.name}</div>
//         <div
//           className="gallery-item-media-info"
//           onClick={(e) => {
//             e.stopPropagation();
//             handleMediaInfoClick(file);
//           }}
//         >
//           Media Info
//         </div>
//         {file.type.startsWith("video/") && (
//           <div
//             className="gallery-item-expand-frames"
//             onClick={(e) => {
//               e.stopPropagation();
//               handleExpandFrames(file);
//             }}
//           >
//             {isExpanded ? "Collapse frames" : "Expand Frames"} {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// });

// const UploadFiles = React.memo(() => {
//   const [showCreateDbModal, setShowCreateDbModal] = useState(false);
//   const [showImportMediaModal, setShowImportMediaModal] = useState(false);
//   const [showDisplayDbModal, setShowDisplayDbModal] = useState(false);
//   const [showPlusModal, setShowPlusModal] = useState(false);
//   const [folderSelections, setFolderSelections] = useState([]);
//   const [selectedFolders, setSelectedFolders] = useState([]);
//   const [databases, setDatabases] = useState([]);
//   const [selectedDatabaseIndex, setSelectedDatabaseIndex] = useState(null);
//   const [showMediaInfoModal, setShowMediaInfoModal] = useState(false);
//   const [mediaInfoFile, setMediaInfoFile] = useState(null);
//   const [expandedFrames, setExpandedFrames] = useState({});
//   const [frameData, setFrameData] = useState({});

//   const { setSelectedImage, setUploadedFiles, finalSelectedImages, setFinalSelectedImages, setSelectedFileInfo } = useContext(ImageContext);
//   const [localFinalSelectedImages, setLocalFinalSelectedImages] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [isAscending, setIsAscending] = useState(true);
//   const [isGridView, setIsGridView] = useState(false);
//   const [isCreateButtonClicked, setIsCreateButtonClicked] = useState(false);

//   // Debounce timer for frame fetching
//   const debounceTimer = useRef(null);

//   useEffect(() => {
//     setFinalSelectedImages(localFinalSelectedImages);
//   }, [localFinalSelectedImages, setFinalSelectedImages]);

//   const handleOpenCreateDatabase = useCallback(() => {
//     setShowCreateDbModal(true);
//     setShowPlusModal(false);
//     setIsCreateButtonClicked(true);
//   }, []);

//   const handleImageClick = useCallback((file) => {
//     const fileUrl = URL.createObjectURL(file);
//     setSelectedImage(fileUrl);
//     // Store the file info in the context for SearchFor to use
//     setSelectedFileInfo({
//       fileUrl,
//       fileName: file.name,
//       fileSize: file.size,
//       fileType: file.type,
//     });
//   }, [setSelectedImage, setSelectedFileInfo]);

//   const handleFrameClick = useCallback((frame) => {
//     // Pass the frame image URL to SearchFor
//     setSelectedFileInfo({
//       fileUrl: frame.url,
//       fileName: `Frame_${frame.frame_number}`,
//       fileSize: 0, // Frames don't have a size in the response, so set to 0
//       fileType: "image/jpeg", // Frames are images
//     });
//   }, [setSelectedFileInfo]);

//   const handleImageUpload = useCallback((event) => {
//     const files = Array.from(event.target.files);
//     setUploadedFiles(files);
//   }, [setUploadedFiles]);

//   const handleMediaInfoClick = useCallback((file) => {
//     setMediaInfoFile(file);
//     setShowMediaInfoModal(true);
//   }, []);

//   const handleDisplayDbNext = useCallback((data) => {
//     const newDatabase = {
//       name: data.databaseName,
//       files: data.files,
//     };
//     setDatabases((prev) => [...prev, newDatabase]);
//     setLocalFinalSelectedImages(data.files);
//     setSelectedDatabaseIndex(databases.length);
//     setShowDisplayDbModal(false);
//   }, [databases]);

//   const handleDeleteDatabase = useCallback((index) => {
//     setDatabases((prev) => prev.filter((_, i) => i !== index));
//     if (selectedDatabaseIndex === index) {
//       setSelectedDatabaseIndex(null);
//       setLocalFinalSelectedImages([]);
//     } else if (selectedDatabaseIndex > index) {
//       setSelectedDatabaseIndex(selectedDatabaseIndex - 1);
//     }
//     console.log("Database deleted, returning to initial state");
//   }, [selectedDatabaseIndex]);

//   const handleExpandFrames = useCallback(async (file) => {
//     if (!file.type.startsWith("video/")) return;
//     const fileId = `${file.name}-${file.lastModified}`;
//     const isCurrentlyExpanded = expandedFrames[fileId] || false;

//     setExpandedFrames((prev) => ({
//       ...prev,
//       [fileId]: !prev[fileId],
//     }));

//     if (!isCurrentlyExpanded && !frameData[fileId]) {
//       // Debounce the fetch request
//       if (debounceTimer.current) {
//         clearTimeout(debounceTimer.current);
//       }

//       debounceTimer.current = setTimeout(async () => {
//         try {
//           const formData = new FormData();
//           formData.append("file", file);
//           const response = await fetch("http://localhost:8000/extract-frames/", {
//             method: "POST",
//             body: formData,
//           });
//           if (!response.ok) {
//             throw new Error(`Failed to fetch frames: ${response.status} ${response.statusText}`);
//           }
//           const data = await response.json();
//           if (!data.frames || !Array.isArray(data.frames)) {
//             throw new Error("Invalid frames data received from server");
//           }
//           setFrameData((prev) => ({
//             ...prev,
//             [fileId]: data.frames,
//           }));
//           console.log(`Frames extracted for ${file.name}:`, data.frames);
//         } catch (error) {
//           console.error("Error fetching frames:", error.message);
//           setFrameData((prev) => ({
//             ...prev,
//             [fileId]: [],
//           }));
//         }
//       }, 300); // Debounce for 300ms
//     }
//   }, [expandedFrames, frameData]);

//   const handleSort = useCallback(() => {
//     setIsAscending((prev) => !prev);
//   }, []);

//   const toggleView = useCallback(() => {
//     setIsGridView((prev) => !prev);
//   }, []);

//   const formatTime = useCallback((time) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
//   }, []);

//   const formatFrameNumber = useCallback((number) => {
//     return `Frame ${String(number).padStart(3, "0")}`;
//   }, []);

//   return (
//     <div className="upload-files-container">
//       {databases.length > 0 && (
//         <Box display="flex" gap="10px" mb="0" flexWrap="wrap">
//           {databases.map((db, index) => (
//             <Box key={index} className="database-tab">
//               <Box
//                 className="database-tab-name"
//                 onClick={() => {
//                   setSelectedDatabaseIndex(index);
//                   setLocalFinalSelectedImages(db.files);
//                 }}
//               >
//                 {db.name}
//               </Box>
//               <Box
//                 as="button"
//                 className="database-tab-close"
//                 onClick={() => handleDeleteDatabase(index)}
//               >
//                 <FaTimes size={12} />
//               </Box>
//             </Box>
//           ))}
//           <Box
//             as="button"
//             className="database-tab-add"
//             onClick={() => setShowPlusModal(true)}
//           >
//             <FaPlus />
//           </Box>
//         </Box>
//       )}
//       <div className="main-container">
//         {databases.length === 0 && (
//           <div className="top-navigation">
//             <div className="search-container">
//               <button className="add-button" onClick={handleOpenCreateDatabase}>+</button>
//               <div className="search-input-wrapper">
//                 <FaSearch className="search-icon" />
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   onFocus={() => setIsExpanded(true)}
//                   onBlur={() => setIsExpanded(false)}
//                   className="search-input"
//                   style={{
//                     width: isExpanded ? "200px" : "120px",
//                     transition: "width 0.3s ease",
//                   }}
//                 />
//               </div>
//             </div>
//             <div className="controls-container">
//               <button className="info-button" onClick={() => console.log("Info clicked")}>
//                 <FaInfoCircle className="info-icon" />
//               </button>
//               <button className="sort-button" onClick={handleSort}>
//                 <FaArrowUp className="sort-icon" />
//                 <FaArrowDown className="sort-icon" />
//               </button>
//               <button className="toggle-button" onClick={toggleView}>
//                 {isGridView ? <FaTh className="toggle-icon" /> : <FaList className="toggle-icon" />}
//               </button>
//             </div>
//           </div>
//         )}
//         {databases.length === 0 && !showCreateDbModal && !showImportMediaModal && !showDisplayDbModal && !showPlusModal && (
//           <div className="center-buttons">
//             <button className="action-button open-database">Open a Database</button>
//             <button className="action-button connect-es-database">Connect to ES Database</button>
//             <button className="action-button connect-live-video" disabled>Connect to Live Video</button>
//             <button
//               className="action-button create-new-database"
//               style={{
//                 background: isCreateButtonClicked ? "linear-gradient(to bottom, #2E7D32, #81C784)" : undefined,
//               }}
//               onClick={handleOpenCreateDatabase}
//             >
//               Create New Database
//             </button>
//           </div>
//         )}
//         {showPlusModal && (
//           <div className="plus-modal">
//             <button className="plus-modal-close" onClick={() => setShowPlusModal(false)}>×</button>
//             <h4 className="plusModalOpendatabase">Open A Database</h4>
//             <h4 className="plusModalConnectEs">Connect To ES Database</h4>
//             <button className="plus-modal-button" onClick={handleOpenCreateDatabase}>Create New Database</button>
//             <h4 className="plusModalConnecttoLive">Connect To Live Video</h4>
//           </div>
//         )}
//         {showCreateDbModal && (
//           <CreateNewDataBaseModal
//             onClose={() => {
//               setShowCreateDbModal(false);
//               setIsCreateButtonClicked(false);
//             }}
//             onNext={(folders) => {
//               console.log("Received folders in UploadFiles:", folders);
//               setFolderSelections(folders);
//               setShowCreateDbModal(false);
//               setShowImportMediaModal(true);
//             }}
//           />
//         )}
//         {showImportMediaModal && (
//           <ImportMediaModal
//             folderSelections={folderSelections}
//             onClose={() => setShowImportMediaModal(false)}
//             onNext={(structuredData) => {
//               console.log("Received structuredData in UploadFiles:", structuredData);
//               setSelectedFolders(structuredData);
//               setShowImportMediaModal(false);
//               setShowDisplayDbModal(true);
//             }}
//           />
//         )}
//         {showDisplayDbModal && (
//           <DisplayDataBaseModal
//             onClose={() => setShowDisplayDbModal(false)}
//             onNext={handleDisplayDbNext}
//             selectedFolders={selectedFolders}
//           />
//         )}
//         {selectedDatabaseIndex !== null && !showDisplayDbModal && (
//           <div className="gallery-container">
//             <h3 className="gallery-title">Final Gallery</h3>
//             <div className="gallery-items" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
//               {databases[selectedDatabaseIndex].files.map((file, index) => {
//                 const fileUrl = URL.createObjectURL(file);
//                 const fileId = `${file.name}-${file.lastModified}`;
//                 const isExpanded = expandedFrames[fileId] || false;
//                 return (
//                   <GalleryItem
//                     key={fileId}
//                     file={file}
//                     index={index}
//                     arrLength={databases[selectedDatabaseIndex].files.length}
//                     fileUrl={fileUrl}
//                     fileId={fileId}
//                     isExpanded={isExpanded}
//                     frameData={frameData}
//                     handleImageClick={handleImageClick}
//                     handleFrameClick={handleFrameClick}
//                     handleMediaInfoClick={handleMediaInfoClick}
//                     handleExpandFrames={handleExpandFrames}
//                     formatFrameNumber={formatFrameNumber}
//                     formatTime={formatTime}
//                   />
//                 );
//               })}
//             </div>
//           </div>
//         )}
//         {showMediaInfoModal && (
//           <div className="media-info-modal">
//             <div className="media-info-header">
//               <h3>Media Info</h3>
//               <button className="media-info-modal-close" onClick={() => setShowMediaInfoModal(false)}>×</button>
//             </div>
//             <div className="media-info-content">
//               <p>{mediaInfoFile ? `File Name: ${mediaInfoFile.name}` : "No file selected."}</p>
//               <p>File type/Kind: </p>
//               <p>File Size: </p>
//               <p>Location: </p>
//               <p>Created: </p>
//               <p>Resolution: </p>
//               <p>Duration: </p>
//               <p>Frames: </p>
//               <p>Codec: </p>
//             </div>
//             <div className="media-info-footer">
//               <button className="media-info-button">Open</button>
//               <button className="media-info-button">Send</button>
//               <button className="media-info-button media-info-close-button">Close</button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// });

// export default UploadFiles;


//  this is the on click and then poulatedd the box thisis working trying now to do the modal that he wanted with the vidoe 


// "use client";
// import React, { useState, useContext, useEffect, useCallback, useRef } from "react";
// import CreateNewDataBaseModal from "../modals/create-new-database/createNewDataBaseModal";
// import ImportMediaModal from "../modals/create-new-database/importMediaModal";
// import DisplayDataBaseModal from "../modals/create-new-database/displayDataBaseModal";
// import { ImageContext } from "@/contexts/ImageContext";
// import {
//   FaPlus,
//   FaChevronDown,
//   FaChevronUp,
//   FaTimes,
//   FaSearch,
//   FaInfoCircle,
//   FaArrowUp,
//   FaArrowDown,
//   FaTh,
//   FaList,
//   FaFilm,
//   FaForward,
//   FaBackward,
//   FaSave,
// } from "react-icons/fa";
// import { Box } from "@chakra-ui/react";
// import "./uploadFiles.css";

// // Modal for video frame selection
// const VideoFrameModal = ({ file, fileUrl, onClose, onFrameSelect }) => {
//   const [videoDuration, setVideoDuration] = useState(0);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [savedFrames, setSavedFrames] = useState([]);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     if (videoRef.current) {
//       videoRef.current.addEventListener("loadedmetadata", handleVideoLoadedMetadata);
//       videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
//     }
//     return () => {
//       if (videoRef.current) {
//         videoRef.current.removeEventListener("loadedmetadata", handleVideoLoadedMetadata);
//         videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
//       }
//     };
//   }, []);

//   const handleVideoLoadedMetadata = () => {
//     if (videoRef.current) {
//       setVideoDuration(videoRef.current.duration);
//       const canvas = canvasRef.current;
//       canvas.width = videoRef.current.videoWidth;
//       canvas.height = videoRef.current.videoHeight;
//     }
//   };

//   const handleTimeUpdate = () => {
//     if (videoRef.current) {
//       setCurrentTime(videoRef.current.currentTime);
//     }
//   };

//   const handleSeek = (event) => {
//     const newTime = parseFloat(event.target.value);
//     setCurrentTime(newTime);
//     if (videoRef.current) {
//       videoRef.current.currentTime = newTime;
//     }
//   };

//   const handleFastForward = () => {
//     if (videoRef.current) {
//       const newTime = Math.min(videoRef.current.currentTime + 5, videoDuration);
//       setCurrentTime(newTime);
//       videoRef.current.currentTime = newTime;
//     }
//   };

//   const handleRewind = () => {
//     if (videoRef.current) {
//       const newTime = Math.max(videoRef.current.currentTime - 5, 0);
//       setCurrentTime(newTime);
//       videoRef.current.currentTime = newTime;
//     }
//   };

//   const formatTime = (time) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
//   };

//   const dataURLtoFile = (dataUrl, filename) => {
//     const arr = dataUrl.split(",");
//     const mime = arr[0].match(/:(.*?);/)[1];
//     const bstr = atob(arr[1]);
//     let n = bstr.length;
//     const u8arr = new Uint8Array(n);
//     while (n--) {
//       u8arr[n] = bstr.charCodeAt(n);
//     }
//     return new File([u8arr], filename, { type: mime });
//   };

//   const handleSaveFrame = () => {
//     if (!videoRef.current || !canvasRef.current) return;

//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const context = canvas.getContext("2d");
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);
//     const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
//     const fileName = `frame-${formatTime(currentTime).replace(":", "-")}.jpg`;
//     const frameFile = dataURLtoFile(dataUrl, fileName);
//     setSavedFrames((prev) => [
//       ...prev,
//       { timestamp: currentTime, dataUrl, file: frameFile },
//     ]);
//   };

//   const handleFrameSelect = (frame) => {
//     onFrameSelect(frame.file);
//     onClose();
//   };

//   return (
//     <div style={modalStyle}>
//       <div style={blueBarStyle}>
//         <h3 style={{ color: "black", margin: 0, fontSize: 15 }}>
//           Select a Frame from {file.name}
//         </h3>
//         <button onClick={onClose} style={modalOpenButtonStyle}>×</button>
//       </div>
//       <div style={modalContentStyle}>
//         <div style={modalRightPanelStyle}>
//           <div style={{ width: "100%", height: "70%", position: "relative" }}>
//             <video
//               ref={videoRef}
//               src={fileUrl}
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 objectFit: "contain",
//                 borderRadius: "5px",
//               }}
//               muted
//             >
//               Your browser does not support the video tag.
//             </video>
//             <div style={videoControlsStyle}>
//               <button onClick={handleRewind} style={videoButtonStyle} title="Rewind 5 seconds">
//                 <FaBackward size={20} />
//               </button>
//               <span style={{ color: "#000000" }}>{formatTime(currentTime)}</span>
//               <input
//                 type="range"
//                 min="0"
//                 max={videoDuration || 0}
//                 step="0.1"
//                 value={currentTime}
//                 onChange={handleSeek}
//                 style={rangeStyle}
//               />
//               <span style={{ color: "#000000" }}>{formatTime(videoDuration)}</span>
//               <button onClick={handleFastForward} style={videoButtonStyle} title="Fast-forward 5 seconds">
//                 <FaForward size={20} />
//               </button>
//               <button onClick={handleSaveFrame} style={videoButtonStyle} title="Save frame at current timestamp">
//                 <FaSave size={20} />
//               </button>
//             </div>
//           </div>
//           {savedFrames.length > 0 ? (
//             <div style={{ maxHeight: "100px", overflowY: "auto", marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
//               {savedFrames.map((frame, index) => (
//                 <div key={index} style={{ textAlign: "center" }}>
//                   <img
//                     src={frame.dataUrl}
//                     alt={`Saved frame at ${formatTime(frame.timestamp)}`}
//                     style={{
//                       width: "80px",
//                       height: "80px",
//                       objectFit: "cover",
//                       borderRadius: "4px",
//                       cursor: "pointer",
//                     }}
//                     onClick={() => handleFrameSelect(frame)}
//                   />
//                   <p style={{ fontSize: "0.8rem", color: "#555" }}>{formatTime(frame.timestamp)}</p>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
//               No frames saved yet. Use the "Save Frame" button to capture frames.
//             </p>
//           )}
//         </div>
//       </div>
//       <div style={buttonContainerStyle}>
//         <button onClick={onClose} style={cancelButtonStyle}>Cancel</button>
//       </div>
//       <canvas ref={canvasRef} style={{ display: "none" }} />
//     </div>
//   );
// };

// // Memoized GalleryItem component to prevent unnecessary re-renders
// const GalleryItem = React.memo(({ file, index, arrLength, fileUrl, fileId, isExpanded, frameData, handleImageClick, handleVideoClick, handleMediaInfoClick, handleExpandFrames, formatFrameNumber, formatTime }) => {
//   return (
//     <div
//       className="gallery-item"
//       onClick={() => {
//         if (file.type.startsWith("video/")) {
//           handleVideoClick(file);
//         } else {
//           handleImageClick(file);
//         }
//       }}
//       style={{ cursor: "pointer", transition: "all 0.3s ease", width: "220px" }}
//     >
//       <div className="gallery-item-index">{index + 1} of {arrLength}</div>
//       <div className="gallery-item-media" style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
//         {file.type.startsWith("image/") ? (
//           <img src={fileUrl} alt={file.name} className="gallery-image" style={{ width: "200px", height: "200px", objectFit: "cover" }} />
//         ) : file.type.startsWith("video/") ? (
//           <>
//             <div style={{ position: "relative", width: "200px", height: "200px" }}>
//               <video
//                 src={fileUrl}
//                 className="gallery-video"
//                 muted
//                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
//               >
//                 Your browser does not support the video tag.
//               </video>
//               <FaFilm
//                 style={{
//                   position: "absolute",
//                   bottom: "10px",
//                   left: "10px",
//                   color: "white",
//                   fontSize: "24px",
//                   zIndex: 1,
//                 }}
//               />
//             </div>
//             {isExpanded && (
//               <div
//                 className="gallery-item-frames"
//                 style={{
//                   marginTop: "10px",
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: "5px",
//                   alignItems: "center",
//                   height: "200px",
//                   overflowY: "auto",
//                   transition: "height 0.3s ease",
//                 }}
//               >
//                 {frameData[fileId] && frameData[fileId].length > 0 ? (
//                   frameData[fileId].map((frame, frameIndex) => (
//                     <div
//                       key={frameIndex}
//                       className="gallery-item-frame"
//                       style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleImageClick({
//                           fileUrl: frame.url,
//                           fileName: `Frame_${frame.frame_number}`,
//                           fileSize: 0,
//                           fileType: "image/jpeg",
//                         });
//                       }}
//                     >
//                       <img
//                         src={frame.url}
//                         alt={`Frame ${String(frame.frame_number).padStart(3, "0")}`}
//                         className="gallery-frame-image"
//                         style={{ width: "50px", height: "50px", marginRight: "5px", objectFit: "cover" }}
//                       />
//                       <div>
//                         <p style={{ margin: 0, color: "#000", fontWeight: "bold", fontSize: "12px" }}>{formatFrameNumber(frame.frame_number)}</p>
//                         <p style={{ margin: "0 0 0 5px", color: "#007BFF", fontSize: "12px" }}>{formatTime(frame.timestamp)}</p>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="gallery-no-frames" style={{ fontSize: "12px" }}>
//                     {frameData[fileId] === undefined ? "Loading frames..." : "No frames available."}
//                   </p>
//                 )}
//               </div>
//             )}
//           </>
//         ) : null}
//       </div>
//       <div className="gallery-item-details">
//         <div className="gallery-item-name">{file.name}</div>
//         <div
//           className="gallery-item-media-info"
//           onClick={(e) => {
//             e.stopPropagation();
//             handleMediaInfoClick(file);
//           }}
//         >
//           Media Info
//         </div>
//         {file.type.startsWith("video/") && (
//           <div
//             className="gallery-item-expand-frames"
//             onClick={(e) => {
//               e.stopPropagation();
//               handleExpandFrames(file);
//             }}
//           >
//             {isExpanded ? "Collapse frames" : "Expand Frames"} {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// });

// const UploadFiles = React.memo(() => {
//   const [showCreateDbModal, setShowCreateDbModal] = useState(false);
//   const [showImportMediaModal, setShowImportMediaModal] = useState(false);
//   const [showDisplayDbModal, setShowDisplayDbModal] = useState(false);
//   const [showPlusModal, setShowPlusModal] = useState(false);
//   const [folderSelections, setFolderSelections] = useState([]);
//   const [selectedFolders, setSelectedFolders] = useState([]);
//   const [databases, setDatabases] = useState([]);
//   const [selectedDatabaseIndex, setSelectedDatabaseIndex] = useState(null);
//   const [showMediaInfoModal, setShowMediaInfoModal] = useState(false);
//   const [mediaInfoFile, setMediaInfoFile] = useState(null);
//   const [expandedFrames, setExpandedFrames] = useState({});
//   const [frameData, setFrameData] = useState({});
//   const [showVideoFrameModal, setShowVideoFrameModal] = useState(false);
//   const [selectedVideo, setSelectedVideo] = useState(null);
//   const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);

//   const { setSelectedImage, setUploadedFiles, finalSelectedImages, setFinalSelectedImages, setSelectedFileInfo } = useContext(ImageContext);
//   const [localFinalSelectedImages, setLocalFinalSelectedImages] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [isAscending, setIsAscending] = useState(true);
//   const [isGridView, setIsGridView] = useState(false);
//   const [isCreateButtonClicked, setIsCreateButtonClicked] = useState(false);

//   // Debounce timer for frame fetching
//   const debounceTimer = useRef(null);

//   useEffect(() => {
//     setFinalSelectedImages(localFinalSelectedImages);
//   }, [localFinalSelectedImages, setFinalSelectedImages]);

//   const handleOpenCreateDatabase = useCallback(() => {
//     setShowCreateDbModal(true);
//     setShowPlusModal(false);
//     setIsCreateButtonClicked(true);
//   }, []);

//   const handleImageClick = useCallback((fileInfo) => {
//     setSelectedFileInfo({
//       fileUrl: fileInfo.fileUrl || URL.createObjectURL(fileInfo),
//       fileName: fileInfo.fileName || fileInfo.name,
//       fileSize: fileInfo.fileSize || fileInfo.size,
//       fileType: fileInfo.fileType || fileInfo.type,
//     });
//   }, [setSelectedFileInfo]);

//   const handleVideoClick = useCallback((file) => {
//     const fileUrl = URL.createObjectURL(file);
//     setSelectedVideo(file);
//     setSelectedVideoUrl(fileUrl);
//     setShowVideoFrameModal(true);
//   }, []);

//   const handleImageUpload = useCallback((event) => {
//     const files = Array.from(event.target.files);
//     setUploadedFiles(files);
//   }, [setUploadedFiles]);

//   const handleMediaInfoClick = useCallback((file) => {
//     setMediaInfoFile(file);
//     setShowMediaInfoModal(true);
//   }, []);

//   const handleDisplayDbNext = useCallback((data) => {
//     const newDatabase = {
//       name: data.databaseName,
//       files: data.files,
//     };
//     setDatabases((prev) => [...prev, newDatabase]);
//     setLocalFinalSelectedImages(data.files);
//     setSelectedDatabaseIndex(databases.length);
//     setShowDisplayDbModal(false);
//   }, [databases]);

//   const handleDeleteDatabase = useCallback((index) => {
//     setDatabases((prev) => prev.filter((_, i) => i !== index));
//     if (selectedDatabaseIndex === index) {
//       setSelectedDatabaseIndex(null);
//       setLocalFinalSelectedImages([]);
//     } else if (selectedDatabaseIndex > index) {
//       setSelectedDatabaseIndex(selectedDatabaseIndex - 1);
//     }
//     console.log("Database deleted, returning to initial state");
//   }, [selectedDatabaseIndex]);

//   const handleExpandFrames = useCallback(async (file) => {
//     if (!file.type.startsWith("video/")) return;
//     const fileId = `${file.name}-${file.lastModified}`;
//     const isCurrentlyExpanded = expandedFrames[fileId] || false;

//     setExpandedFrames((prev) => ({
//       ...prev,
//       [fileId]: !prev[fileId],
//     }));

//     if (!isCurrentlyExpanded && !frameData[fileId]) {
//       if (debounceTimer.current) {
//         clearTimeout(debounceTimer.current);
//       }

//       debounceTimer.current = setTimeout(async () => {
//         try {
//           const formData = new FormData();
//           formData.append("file", file);
//           const response = await fetch("http://localhost:8000/extract-frames/", {
//             method: "POST",
//             body: formData,
//           });
//           if (!response.ok) {
//             throw new Error(`Failed to fetch frames: ${response.status} ${response.statusText}`);
//           }
//           const data = await response.json();
//           if (!data.frames || !Array.isArray(data.frames)) {
//             throw new Error("Invalid frames data received from server");
//           }
//           setFrameData((prev) => ({
//             ...prev,
//             [fileId]: data.frames,
//           }));
//           console.log(`Frames extracted for ${file.name}:`, data.frames);
//         } catch (error) {
//           console.error("Error fetching frames:", error.message);
//           setFrameData((prev) => ({
//             ...prev,
//             [fileId]: [],
//           }));
//         }
//       }, 300);
//     }
//   }, [expandedFrames, frameData]);

//   const handleSort = useCallback(() => {
//     setIsAscending((prev) => !prev);
//   }, []);

//   const toggleView = useCallback(() => {
//     setIsGridView((prev) => !prev);
//   }, []);

//   const formatTime = useCallback((time) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
//   }, []);

//   const formatFrameNumber = useCallback((number) => {
//     return `Frame ${String(number).padStart(3, "0")}`;
//   }, []);

//   return (
//     <div className="upload-files-container">
//       {databases.length > 0 && (
//         <Box display="flex" gap="10px" mb="0" flexWrap="wrap">
//           {databases.map((db, index) => (
//             <Box key={index} className="database-tab">
//               <Box
//                 className="database-tab-name"
//                 onClick={() => {
//                   setSelectedDatabaseIndex(index);
//                   setLocalFinalSelectedImages(db.files);
//                 }}
//               >
//                 {db.name}
//               </Box>
//               <Box
//                 as="button"
//                 className="database-tab-close"
//                 onClick={() => handleDeleteDatabase(index)}
//               >
//                 <FaTimes size={12} />
//               </Box>
//             </Box>
//           ))}
//           <Box
//             as="button"
//             className="database-tab-add"
//             onClick={() => setShowPlusModal(true)}
//           >
//             <FaPlus />
//           </Box>
//         </Box>
//       )}
//       <div className="main-container">
//         {databases.length === 0 && (
//           <div className="top-navigation">
//             <div className="search-container">
//               <button className="add-button" onClick={handleOpenCreateDatabase}>+</button>
//               <div className="search-input-wrapper">
//                 <FaSearch className="search-icon" />
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   onFocus={() => setIsExpanded(true)}
//                   onBlur={() => setIsExpanded(false)}
//                   className="search-input"
//                   style={{
//                     width: isExpanded ? "200px" : "120px",
//                     transition: "width 0.3s ease",
//                   }}
//                 />
//               </div>
//             </div>
//             <div className="controls-container">
//               <button className="info-button" onClick={() => console.log("Info clicked")}>
//                 <FaInfoCircle className="info-icon" />
//               </button>
//               <button className="sort-button" onClick={handleSort}>
//                 <FaArrowUp className="sort-icon" />
//                 <FaArrowDown className="sort-icon" />
//               </button>
//               <button className="toggle-button" onClick={toggleView}>
//                 {isGridView ? <FaTh className="toggle-icon" /> : <FaList className="toggle-icon" />}
//               </button>
//             </div>
//           </div>
//         )}
//         {databases.length === 0 && !showCreateDbModal && !showImportMediaModal && !showDisplayDbModal && !showPlusModal && (
//           <div className="center-buttons">
//             <button className="action-button open-database">Open a Database</button>
//             <button className="action-button connect-es-database">Connect to ES Database</button>
//             <button className="action-button connect-live-video" disabled>Connect to Live Video</button>
//             <button
//               className="action-button create-new-database"
//               style={{
//                 background: isCreateButtonClicked ? "linear-gradient(to bottom, #2E7D32, #81C784)" : undefined,
//               }}
//               onClick={handleOpenCreateDatabase}
//             >
//               Create New Database
//             </button>
//           </div>
//         )}
//         {showPlusModal && (
//           <div className="plus-modal">
//             <button className="plus-modal-close" onClick={() => setShowPlusModal(false)}>×</button>
//             <h4 className="plusModalOpendatabase">Open A Database</h4>
//             <h4 className="plusModalConnectEs">Connect To ES Database</h4>
//             <button className="plus-modal-button" onClick={handleOpenCreateDatabase}>Create New Database</button>
//             <h4 className="plusModalConnecttoLive">Connect To Live Video</h4>
//           </div>
//         )}
//         {showCreateDbModal && (
//           <CreateNewDataBaseModal
//             onClose={() => {
//               setShowCreateDbModal(false);
//               setIsCreateButtonClicked(false);
//             }}
//             onNext={(folders) => {
//               console.log("Received folders in UploadFiles:", folders);
//               setFolderSelections(folders);
//               setShowCreateDbModal(false);
//               setShowImportMediaModal(true);
//             }}
//           />
//         )}
//         {showImportMediaModal && (
//           <ImportMediaModal
//             folderSelections={folderSelections}
//             onClose={() => setShowImportMediaModal(false)}
//             onNext={(structuredData) => {
//               console.log("Received structuredData in UploadFiles:", structuredData);
//               setSelectedFolders(structuredData);
//               setShowImportMediaModal(false);
//               setShowDisplayDbModal(true);
//             }}
//           />
//         )}
//         {showDisplayDbModal && (
//           <DisplayDataBaseModal
//             onClose={() => setShowDisplayDbModal(false)}
//             onNext={handleDisplayDbNext}
//             selectedFolders={selectedFolders}
//           />
//         )}
//         {selectedDatabaseIndex !== null && !showDisplayDbModal && (
//           <div className="gallery-container">
//             <h3 className="gallery-title">Final Gallery</h3>
//             <div className="gallery-items" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
//               {databases[selectedDatabaseIndex].files.map((file, index) => {
//                 const fileUrl = URL.createObjectURL(file);
//                 const fileId = `${file.name}-${file.lastModified}`;
//                 const isExpanded = expandedFrames[fileId] || false;
//                 return (
//                   <GalleryItem
//                     key={fileId}
//                     file={file}
//                     index={index}
//                     arrLength={databases[selectedDatabaseIndex].files.length}
//                     fileUrl={fileUrl}
//                     fileId={fileId}
//                     isExpanded={isExpanded}
//                     frameData={frameData}
//                     handleImageClick={handleImageClick}
//                     handleVideoClick={handleVideoClick}
//                     handleMediaInfoClick={handleMediaInfoClick}
//                     handleExpandFrames={handleExpandFrames}
//                     formatFrameNumber={formatFrameNumber}
//                     formatTime={formatTime}
//                   />
//                 );
//               })}
//             </div>
//           </div>
//         )}
//         {showMediaInfoModal && (
//           <div className="media-info-modal">
//             <div className="media-info-header">
//               <h3>Media Info</h3>
//               <button className="media-info-modal-close" onClick={() => setShowMediaInfoModal(false)}>×</button>
//             </div>
//             <div className="media-info-content">
//               <p>{mediaInfoFile ? `File Name: ${mediaInfoFile.name}` : "No file selected."}</p>
//               <p>File type/Kind: </p>
//               <p>File Size: </p>
//               <p>Location: </p>
//               <p>Created: </p>
//               <p>Resolution: </p>
//               <p>Duration: </p>
//               <p>Frames: </p>
//               <p>Codec: </p>
//             </div>
//             <div className="media-info-footer">
//               <button className="media-info-button">Open</button>
//               <button className="media-info-button">Send</button>
//               <button className="media-info-button media-info-close-button">Close</button>
//             </div>
//           </div>
//         )}
//         {showVideoFrameModal && selectedVideo && (
//           <VideoFrameModal
//             file={selectedVideo}
//             fileUrl={selectedVideoUrl}
//             onClose={() => {
//               setShowVideoFrameModal(false);
//               setSelectedVideo(null);
//               setSelectedVideoUrl(null);
//             }}
//             onFrameSelect={(frameFile) => {
//               handleImageClick({
//                 fileUrl: URL.createObjectURL(frameFile),
//                 fileName: frameFile.name,
//                 fileSize: frameFile.size,
//                 fileType: frameFile.type,
//               });
//             }}
//           />
//         )}
//       </div>
//     </div>
//   );
// });

// // Modal Styles (reused from DisplayDataBaseModal)
// const modalStyle = {
//   position: "fixed",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   backgroundColor: "white",
//   borderRadius: "8px",
//   zIndex: 1000,
//   width: "900px",
//   height: "500px",
//   display: "flex",
//   flexDirection: "column",
//   boxShadow: "0 4px 15px rgba(0, 0, 123, 0.2)",
// };

// const blueBarStyle = {
//   width: "100%",
//   backgroundColor: "#EEF2FF",
//   borderRadius: "8px 8px 0 0",
//   padding: "10px 20px",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "space-between",
//   minHeight: "40px",
// };

// const modalContentStyle = {
//   display: "flex",
//   flex: 1,
//   padding: "10px",
// };

// const modalRightPanelStyle = {
//   flex: 1,
//   padding: "10px",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   justifyContent: "flex-start",
//   backgroundColor: "#F9FBFF",
// };

// const modalOpenButtonStyle = {
//   width: "24px",
//   height: "24px",
//   backgroundColor: "white",
//   borderRadius: "50%",
//   border: "none",
//   color: "black",
//   fontSize: "16px",
//   fontWeight: "400",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   cursor: "pointer",
//   padding: 0,
//   transition: "background-color 0.3s ease",
// };

// const videoControlsStyle = {
//   marginTop: "10px",
//   display: "flex",
//   alignItems: "center",
//   gap: "10px",
//   width: "100%",
// };

// const videoButtonStyle = {
//   background: "none",
//   border: "none",
//   cursor: "pointer",
//   padding: "5px",
//   display: "flex",
//   alignItems: "center",
//   color: "#007BFF",
//   transition: "color 0.3s ease",
// };

// const rangeStyle = {
//   flex: 1,
//   cursor: "pointer",
//   accentColor: "#007BFF",
// };

// const cancelButtonStyle = {
//   padding: "8px 16px",
//   marginLeft: "10px",
//   border: "none",
//   cursor: "pointer",
//   backgroundColor: "#E8E8E8",
//   color: "black",
//   width: "220px",
//   borderRadius: "20px",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   lineHeight: "1",
//   paddingTop: "6px",
//   transition: "background-color 0.3s ease",
// };

// const buttonContainerStyle = {
//   marginTop: "auto",
//   display: "flex",
//   justifyContent: "flex-end",
//   padding: "10px 20px",
// };

// export default UploadFiles;

"use client";
import React, { useState, useContext, useEffect, useCallback, useRef } from "react";
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
  FaFilm,
  FaForward,
  FaBackward,
  FaSave,
} from "react-icons/fa";
import { Box } from "@chakra-ui/react";
import "./uploadFiles.css";

// Modal for video frame selection
const VideoFrameModal = ({ file, fileUrl, videoId, onClose, onFrameSelect }) => {
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [savedFrames, setSavedFrames] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Fetch saved frames when the modal opens
  useEffect(() => {
    const fetchSavedFrames = async () => {
      try {
        const response = await fetch(`http://localhost:8000/get-saved-frames/${videoId}`);
        const data = await response.json();
        if (data.frames) {
          setSavedFrames(data.frames);
        }
      } catch (error) {
        console.error("Error fetching saved frames:", error);
      }
    };
    fetchSavedFrames();
  }, [videoId]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("loadedmetadata", handleVideoLoadedMetadata);
      videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("loadedmetadata", handleVideoLoadedMetadata);
        videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, []);

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
      const canvas = canvasRef.current;
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
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

  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleSaveFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    const fileName = `frame-${formatTime(currentTime).replace(":", "-")}.jpg`;
    const frameFile = dataURLtoFile(dataUrl, fileName);

    // Save the frame to the backend
    try {
      const formData = new FormData();
      formData.append("video_id", videoId);
      formData.append("timestamp", currentTime);
      formData.append("frame_data", frameFile, fileName);

      const response = await fetch("http://localhost:8000/save-frame/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save frame");
      }

      const data = await response.json();
      setSavedFrames((prev) => [...prev, data.frame]);
    } catch (error) {
      console.error("Error saving frame:", error);
    }
  };

  const handleFrameSelect = (frame) => {
    onFrameSelect({
      fileUrl: frame.url,
      fileName: `Frame_${formatTime(frame.timestamp)}`,
      fileSize: frame.size_bytes,
      fileType: "image/jpeg",
    });
    onClose();
  };

  return (
    <div style={modalStyle}>
      <div style={blueBarStyle}>
        <h3 style={{ color: "black", margin: 0, fontSize: 15 }}>
          Select a Frame from {file.name}
        </h3>
        <button onClick={onClose} style={modalOpenButtonStyle}>×</button>
      </div>
      <div style={modalContentStyle}>
        <div style={modalRightPanelStyle}>
          <div style={{ width: "100%", height: "200px", position: "relative" }}>
            <video
              ref={videoRef}
              src={fileUrl}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "5px",
              }}
              muted
            >
              Your browser does not support the video tag.
            </video>
            <div style={videoControlsStyle}>
              <button onClick={handleRewind} style={videoButtonStyle} title="Rewind 5 seconds">
                <FaBackward size={16} />
              </button>
              <span style={{ color: "#000000", fontSize: "12px" }}>{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={videoDuration || 0}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                style={rangeStyle}
              />
              <span style={{ color: "#000000", fontSize: "12px" }}>{formatTime(videoDuration)}</span>
              <button onClick={handleFastForward} style={videoButtonStyle} title="Fast-forward 5 seconds">
                <FaForward size={16} />
              </button>
              <button onClick={handleSaveFrame} style={videoButtonStyle} title="Save frame at current timestamp">
                <FaSave size={16} />
              </button>
            </div>
          </div>
          {savedFrames.length > 0 ? (
            <div style={{ maxHeight: "150px", overflowY: "auto", marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {savedFrames.map((frame, index) => (
                <div key={index} style={{ textAlign: "center" }}>
                  <img
                    src={frame.url}
                    alt={`Saved frame at ${formatTime(frame.timestamp)}`}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleFrameSelect(frame)}
                  />
                  <p style={{ fontSize: "0.7rem", color: "#555" }}>{formatTime(frame.timestamp)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
              No frames saved yet. Use the "Save Frame" button to capture frames.
            </p>
          )}
        </div>
      </div>
      <div style={buttonContainerStyle}>
        <button onClick={onClose} style={cancelButtonStyle}>Cancel</button>
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

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
    // First, call /extract-frames/ to get the video_id
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
              <button className="add-button" onClick={handleOpenCreateDatabase}>+</button>
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
      </div>
    </div>
  );
});

// Modal Styles (adjusted for smaller size)
const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  borderRadius: "8px",
  zIndex: 1000,
  width: "600px", // Reduced width
  height: "400px", // Reduced height
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
  minHeight: "40px",
};

const modalContentStyle = {
  display: "flex",
  flex: 1,
  padding: "10px",
  flexDirection: "column",
};

const modalRightPanelStyle = {
  flex: 1,
  padding: "10px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  backgroundColor: "#F9FBFF",
};

const modalOpenButtonStyle = {
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

const cancelButtonStyle = {
  padding: "8px 16px",
  marginLeft: "10px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#E8E8E8",
  color: "black",
  width: "150px",
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

export default UploadFiles;