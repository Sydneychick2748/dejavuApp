



// "use client";
// import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
// import { ImageContext } from "@/contexts/ImageContext";
// import { generateUniqueId } from "@/utils/idGenerator";
// import {
//   FaCloudUploadAlt,
//   FaFolder,
//   FaFolderOpen,
//   FaTimes,
//   FaArrowRight,
//   FaFileImage,
//   FaFileVideo,
//   FaForward,
//   FaBackward,
//   FaChevronDown,
//   FaChevronUp,
// } from "react-icons/fa";
// import FinderModal from "../finder/finderModal";
// import "./createNewDatabase.css";

// // Define minimal styles for dynamic or inline requirements
// const styles = {
//   modalStyle: {
//     position: "fixed",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     backgroundColor: "white",
//     borderRadius: "8px",
//     zIndex: 1000,
//     display: "block",
//     width: "70vw",
//     height: "90vh",
//     boxShadow: "0 4px 15px rgba(0, 0, 123, 0.2)",
//     overflow: "hidden",
//   },
//   headerStyle: {
//     backgroundColor: "#EEF2FF",
//     padding: "10px 20px",
//     borderTopLeftRadius: "8px",
//     borderTopRightRadius: "8px",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   contentStyle: {
//     padding: "20px",
//     color: "black",
//     display: "flex",
//     flexDirection: "column",
//     height: "calc(100% - 40px)",
//   },
//   modalOverlayStyle: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 1100,
//   },
//   modalContentStyle: {
//     backgroundColor: "white",
//     padding: "20px",
//     borderRadius: "8px",
//     textAlign: "center",
//     boxShadow: "0 4px 15px rgba(0, 0, 123, 0.2)",
//     color: "#000000",
//   },
// };

// const CombinedCreateDatabaseModal = ({ onClose, onFinish, existingDatabaseNames }) => {
//   const { setFinalSelectedImages } = useContext(ImageContext);
//   const [databaseName, setDatabaseName] = useState("");
//   const [databaseNameError, setDatabaseNameError] = useState("");
//   const [importMediaError, setImportMediaError] = useState("");
//   const [saveLocation, setSaveLocation] = useState("");
//   const [selectedFolders, setSelectedFolders] = useState([]);
//   const [isDatabaseNameLocked, setIsDatabaseNameLocked] = useState(false);
//   const [showFinderModal, setShowFinderModal] = useState(false);
//   const folderInputRef = useRef(null);
//   const moreMediaInputRef = useRef(null);

//   const allFiles = useMemo(() => {
//     const files = [];
//     const collectFilesRecursively = (folders) => {
//       folders.forEach((folder) => {
//         if (folder.files && folder.files.length > 0) {
//           files.push(...folder.files);
//         }
//         if (folder.subFolders && folder.subFolders.length > 0) {
//           collectFilesRecursively(folder.subFolders);
//         }
//       });
//     };
//     collectFilesRecursively(selectedFolders);
//     return files;
//   }, [selectedFolders]);

//   const [fileSelections, setFileSelections] = useState({});
//   const [fileMetadata, setFileMetadata] = useState({});
//   const [showMediaInfoModal, setShowMediaInfoModal] = useState(false);
//   const [mediaInfoFile, setMediaInfoFile] = useState(null);
//   const [selectedPreview, setSelectedPreview] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [videoDuration, setVideoDuration] = useState(0);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [totalFrames, setTotalFrames] = useState(0);
//   const [resolution, setResolution] = useState("N/A");
//   const videoRef = useRef(null);
//   const [databaseCount, setDatabaseCount] = useState(() =>
//     parseInt(localStorage.getItem("databaseCount") || "1", 10)
//   );
//   const [clickedIcon, setClickedIcon] = useState(null);
//   const [fileUrls, setFileUrls] = useState({});
//   const [databaseSelected, setDatabaseSelected] = useState(true);
//   const [isFilesExpanded, setIsFilesExpanded] = useState(true);
//   const [resolutionLevel, setResolutionLevel] = useState(6);
//   const [colorSetting, setColorSetting] = useState("fullColor");
//   const [useGPU, setUseGPU] = useState(false);

//   const fileUrlCache = useRef(new Map());

//   const getFileUrl = (file, index) => {
//     if (!file || !(file instanceof File)) {
//       console.error("Invalid file object:", file);
//       return null;
//     }

//     const fileId = `file-${index}`;
//     if (!fileUrlCache.current.has(fileId)) {
//       try {
//         const url = URL.createObjectURL(file);
//         fileUrlCache.current.set(fileId, url);
//         return url;
//       } catch (error) {
//         console.error("Failed to create object URL for file:", file, error);
//         return null;
//       }
//     }
//     return fileUrlCache.current.get(fileId);
//   };

//   useEffect(() => {
//     const newFileUrls = {};
//     allFiles.forEach((file, index) => {
//       const fileId = `file-${index}`;
//       if (!fileUrls[fileId]) {
//         const url = getFileUrl(file, index);
//         if (url) {
//           newFileUrls[fileId] = url;
//         }
//       } else {
//         newFileUrls[fileId] = fileUrls[fileId];
//       }
//     });
//     setFileUrls(newFileUrls);

//     return () => {
//       Object.keys(fileUrls).forEach((fileId) => {
//         if (!newFileUrls[fileId]) {
//           const url = fileUrls[fileId];
//           if (url) {
//             URL.revokeObjectURL(url);
//           }
//           fileUrlCache.current.delete(fileId);
//         }
//       });
//     };
//   }, [allFiles]);

//   useEffect(() => {
//     const fetchMetadata = async () => {
//       const metadataPromises = allFiles.map(async (file, index) => {
//         const formData = new FormData();
//         formData.append("file", file);
//         try {
//           const response = await fetch("http://localhost:8000/dashboard/extract-metadata", {
//             method: "POST",
//             body: formData,
//           });
//           if (!response.ok) throw new Error("Failed to fetch metadata");
//           const data = await response.json();
//           return { index, metadata: data };
//         } catch (error) {
//           console.error(`Error fetching metadata for file ${file.name}:`, error);
//           return {
//             index,
//             metadata: {
//               creationTime: null,
//               duration: 0,
//               totalFrames: 0,
//               resolution: "N/A",
//               fileSize: 0,
//               videoCodec: "N/A",
//               audioCodec: "N/A",
//               bitRate: "N/A",
//               fileFormat: "N/A",
//             },
//           };
//         }
//       });

//       const metadataResults = await Promise.all(metadataPromises);
//       const metadataMap = metadataResults.reduce((acc, { index, metadata }) => {
//         acc[index] = metadata;
//         return acc;
//       }, {});
//       setFileMetadata(metadataMap);
//     };

//     fetchMetadata();
//   }, [allFiles]);

//   useEffect(() => {
//     localStorage.setItem("databaseCount", databaseCount);
//   }, [databaseCount]);

//   useEffect(() => {
//     console.log("Existing database names:", existingDatabaseNames);
//   }, [existingDatabaseNames]);

//   useEffect(() => {
//     setFileSelections((prev) => {
//       const newFileSelections = { ...prev };
//       allFiles.forEach((_, index) => {
//         if (newFileSelections[index] === undefined) {
//           newFileSelections[index] = true;
//         }
//       });
//       Object.keys(newFileSelections).forEach((key) => {
//         if (parseInt(key) >= allFiles.length) {
//           delete newFileSelections[key];
//         }
//       });
//       return newFileSelections;
//     });
//   }, [allFiles]);

//   const handleFolderChange = (event) => {
//     const files = Array.from(event.target.files);
//     if (files.length === 0) return;

//     const folderTree = { name: "", subFolders: new Map() };

//     files.forEach((file) => {
//       console.log(`File: ${file.name}, Type: ${file.type}`);

//       const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
//       const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
//       const isValidFile =
//         validImageTypes.includes(file.type.toLowerCase()) ||
//         validVideoTypes.includes(file.type.toLowerCase());

//       if (!isValidFile) return;

//       const pathParts = file.webkitRelativePath.split("/");
//       pathParts.pop();
//       let currentLevel = folderTree.subFolders;

//       pathParts.forEach((part, index) => {
//         if (!currentLevel.has(part)) {
//           currentLevel.set(part, { name: part, subFolders: new Map(), files: [] });
//         }
//         if (index === pathParts.length - 1) {
//           currentLevel.get(part).files.push(file);
//         } else {
//           currentLevel = currentLevel.get(part).subFolders;
//         }
//       });

//       if (pathParts.length > 0 && !folderTree.name) {
//         folderTree.name = pathParts[0];
//       }
//     });

//     const convertMapToArray = (map) =>
//       Array.from(map.values()).map((folder) => ({
//         ...folder,
//         subFolders: convertMapToArray(folder.subFolders),
//       }));

//     const newFolders = convertMapToArray(folderTree.subFolders);
//     if (newFolders.length === 0) {
//       alert("No images or videos found in the selected folders.");
//       return;
//     }

//     setSelectedFolders((prev) => {
//       const existingNames = new Set(prev.map((f) => f.name));
//       const uniqueNewFolders = newFolders.filter((f) => !existingNames.has(f.name));
//       return [...prev, ...uniqueNewFolders];
//     });

//     event.target.value = "";
//   };

//   const handleUploadClick = () => {
//     if (!databaseName.trim()) {
//       setImportMediaError("Please enter your database name first.");
//       return;
//     }
//     setImportMediaError("");
//     setIsDatabaseNameLocked(true);
//     folderInputRef.current?.click();
//   };

//   const handleMoreMediaUploadClick = () => {
//     if (!databaseName.trim()) {
//       setImportMediaError("Please enter your database name first.");
//       return;
//     }
//     setImportMediaError("");
//     setIsDatabaseNameLocked(true);
//     moreMediaInputRef.current?.click();
//   };

//   const handleFolderIconClick = () => {
//     setShowFinderModal(true);
//   };

//   const handleSelectLocation = (path) => {
//     setSaveLocation(path);
//   };

//   const isDuplicateName =
//     databaseName.trim() && existingDatabaseNames.includes(databaseName.trim().toLowerCase());

//   const toggleDatabaseSelection = () => {
//     const newSelected = !databaseSelected;
//     setDatabaseSelected(newSelected);
//     const newFileSelections = {};
//     allFiles.forEach((_, index) => {
//       newFileSelections[index] = newSelected;
//     });
//     setFileSelections(newFileSelections);
//   };

//   const toggleFileSelection = (fileIndex) => {
//     setFileSelections((prev) => ({
//       ...prev,
//       [fileIndex]: !prev[fileIndex],
//     }));
//     const allFilesChecked = Object.values({
//       ...fileSelections,
//       [fileIndex]: !fileSelections[fileIndex],
//     }).every(Boolean);
//     setDatabaseSelected(allFilesChecked);
//   };

//   const handleMediaInfoClick = (file) => {
//     setMediaInfoFile(file);
//     setShowMediaInfoModal(true);
//   };

//   const handleFinish = () => {
//     if (!databaseName.trim()) {
//       setDatabaseNameError("You need to name your database.");
//       return;
//     }

//     if (selectedFolders.length === 0) {
//       alert("Please upload at least one folder with images or videos.");
//       return;
//     }

//     if (existingDatabaseNames.includes(databaseName.trim().toLowerCase())) {
//       setDatabaseNameError("Database name already exists. Please choose a unique name.");
//       return;
//     }

//     const selectedFiles = allFiles
//       .filter((_, index) => fileSelections[index])
//       .map((file) => {
//         const id = generateUniqueId("db-");
//         return Object.assign(file, { id });
//       });

//     if (selectedFiles.length === 0) {
//       console.warn("No files selected to create the database");
//       return;
//     }

//     const databaseNameFinal = databaseName.trim();
//     setDatabaseCount((prev) => prev + 1);
//     onFinish({ files: selectedFiles, databaseName: databaseNameFinal, resolutionLevel, colorSetting });
//     onClose();
//   };

//   const getFileIcon = (file, iconId) => {
//     const handleMouseDown = () => setClickedIcon(iconId);
//     const handleMouseUp = () => setClickedIcon(null);

//     const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
//     const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
//     const isImage = validImageTypes.includes(file.type.toLowerCase());
//     const isVideo = validVideoTypes.includes(file.type.toLowerCase());

//     return isImage ? (
//       <FaFileImage
//         className={`file-icon-base ${clickedIcon === iconId ? "file-icon-clicked" : "file-icon-hover"}`}
//         onMouseDown={handleMouseDown}
//         onMouseUp={handleMouseUp}
//       />
//     ) : isVideo ? (
//       <FaFileVideo
//         className={`file-icon-base ${clickedIcon === iconId ? "file-icon-clicked" : "file-icon-hover"}`}
//         onMouseDown={handleMouseDown}
//         onMouseUp={handleMouseUp}
//       />
//     ) : (
//       <FaFileImage
//         className={`file-icon-base ${clickedIcon === iconId ? "file-icon-clicked" : "file-icon-hover"}`}
//         onMouseDown={handleMouseDown}
//         onMouseUp={handleMouseUp}
//       />
//     );
//   };

//   const handleVideoLoadedMetadata = () => {
//     if (videoRef.current) {
//       setVideoDuration(videoRef.current.duration);
//       setResolution(`${videoRef.current.videoWidth}x${videoRef.current.videoHeight}`);
//       const frameRate = 30;
//       setTotalFrames(Math.floor(videoRef.current.duration * frameRate));
//     }
//   };

//   const handleTimeUpdate = () => {
//     if (videoRef.current) {
//       setCurrentTime(videoRef.current.currentTime);
//     }
//   };

//   const ensureVideoReady = async () => {
//     if (videoRef.current && videoRef.current.readyState < 2) {
//       console.log("Waiting for video to be ready...");
//       await new Promise((resolve) => {
//         videoRef.current.addEventListener("canplay", resolve, { once: true });
//       });
//       console.log("Video ready: readyState =", videoRef.current.readyState);
//     }
//   };

//   const handleSeek = async (e) => {
//     const newTime = parseFloat(e.target.value);
//     setCurrentTime(newTime);
//     if (videoRef.current) {
//       if (videoRef.current.readyState < 2) {
//         await ensureVideoReady();
//       }
//       videoRef.current.currentTime = newTime;
//       videoRef.current.pause();
//       console.log("Range input: newTime =", newTime);
//     } else {
//       console.error("videoRef.current is not available for seek");
//     }
//   };

//   const handleFastForward = async () => {
//     if (videoRef.current) {
//       const newTime = Math.min(currentTime + 5, videoDuration);
//       setCurrentTime(newTime);
//       await ensureVideoReady();
//       videoRef.current.currentTime = newTime;
//       videoRef.current.pause();
//       console.log("Fast-forward: newTime =", newTime);
//     } else {
//       console.error("videoRef.current is not available for fast-forward");
//     }
//   };

//   const handleRewind = async () => {
//     if (videoRef.current) {
//       const newTime = Math.max(currentTime - 5, 0);
//       setCurrentTime(newTime);
//       await ensureVideoReady();
//       videoRef.current.currentTime = newTime;
//       videoRef.current.pause();
//       console.log("Rewind: newTime =", newTime);
//     } else {
//       console.error("videoRef.current is not available for rewind");
//     }
//   };

//   const formatTime = (time) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
//   };

//   const formatDateTime = (timestamp) => {
//     if (!timestamp) return "N/A";
//     const date = new Date(timestamp);
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = date.toLocaleString("default", { month: "short" }).toUpperCase();
//     const year = String(date.getFullYear()).slice(-2);
//     const hours = String(date.getHours()).padStart(2, "0");
//     const minutes = String(date.getMinutes()).padStart(2, "0");
//     const seconds = String(date.getSeconds()).padStart(2, "0");
//     const timezone = "EST";
//     return `${day}${month}${year} ${hours}:${minutes}:${seconds}${timezone}`;
//   };

//   const totalItems = allFiles.length;

//   return (
//     <div className="modal" style={styles.modalStyle}>
//       <div style={styles.headerStyle}>
//         <h3 style={{ color: "black", margin: 0, fontSize: 15 }}>Create New Database</h3>
//         <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//           <button
//             onClick={onClose}
//             style={{
//               width: "24px",
//               height: "24px",
//               backgroundColor: "white",
//               borderRadius: "50%",
//               border: "none",
//               color: "black",
//               fontSize: "16px",
//               fontWeight: "400",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               cursor: "pointer",
//               padding: "0",
//               transition: "background-color 0.3s ease",
//             }}
//           >
//             ×
//           </button>
//         </div>
//       </div>
//       <div style={styles.contentStyle}>
//         <div className="input-container">
//           <label htmlFor="databaseName" className="input-label">
//             Database Name:
//           </label>
//           <div style={{ position: "relative", width: "100%" }}>
//             <input
//               type="text"
//               id="databaseName"
//               value={databaseName}
//               onChange={(e) => {
//                 if (!isDatabaseNameLocked) {
//                   setDatabaseName(e.target.value);
//                   if (databaseNameError && e.target.value.trim()) {
//                     setDatabaseNameError("");
//                   }
//                 }
//               }}
//               onBlur={() => {
//                 if (databaseName.trim() && !isDatabaseNameLocked) {
//                   setIsDatabaseNameLocked(true);
//                 }
//               }}
//               placeholder="Text field"
//               className="input-field"
//               disabled={isDatabaseNameLocked}
//             />
//           </div>
//           {databaseNameError && <div className="input-error">{databaseNameError}</div>}
//           {isDuplicateName && !databaseNameError && (
//             <div className="input-error">
//               Database name already exists. Please choose a unique name.
//             </div>
//           )}
//         </div>

//         <div className="input-container">
//           <label htmlFor="saveLocation" className="input-label">
//             Save to:
//           </label>
//           <div className="input-group">
//             <input
//               type="text"
//               id="saveLocation"
//               value={saveLocation}
//               onChange={(e) => setSaveLocation(e.target.value)}
//               placeholder="Location"
//               className="input-field"
//             />
//             <button className="browse-button" onClick={handleFolderIconClick}>
//               Browse
//             </button>
//           </div>
//           <div className="items-selected">
//             {totalItems} item{totalItems !== 1 ? "s" : ""} selected.
//           </div>
//           {importMediaError && <div className="input-error">{importMediaError}</div>}
//         </div>

//         {/* Media Import Section */}
//         <div className="media-import-container">
//           {/* Left Side: Import Button or File Selection */}
//           <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
//             <div className="media-import-left left-panel">
//               {selectedFolders.length > 0 ? (
//                 <>
//                   <div
//                     style={{
//                       padding: "10px",
//                       borderBottom: "1px solid #ddd",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                     }}
//                   >
//                     <div style={{ display: "flex", alignItems: "center" }}>
//                       <input
//                         type="checkbox"
//                         checked={databaseSelected}
//                         onChange={toggleDatabaseSelection}
//                         style={{ marginRight: "8px" }}
//                       />
//                       <FaFolder size={40} style={{ color: "#FFD700", marginRight: "12px" }} />
//                       <div>
//                         <strong style={{ fontSize: "18px", color: "#000000" }}>
//                           {databaseName || "Unnamed Database"}
//                         </strong>
//                         <div style={{ fontSize: "0.9rem", color: "#555" }}>
//                           {totalItems} item{totalItems !== 1 ? "s" : ""}
//                         </div>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => setIsFilesExpanded(!isFilesExpanded)}
//                       className="toggle-button"
//                     >
//                       {isFilesExpanded ? <FaChevronUp /> : <FaChevronDown />}
//                     </button>
//                   </div>

//                   {isFilesExpanded && allFiles.length > 0 ? (
//                     allFiles.map((file, index) => {
//                       const fileId = `file-${index}`;
//                       const fileUrl = fileUrls[fileId] || "";
//                       const metadata = fileMetadata[index] || {};
//                       const duration = metadata.duration ? formatTime(metadata.duration) : "N/A";
//                       const frames = metadata.totalFrames || "N/A";
//                       const handlePreviewClick = () => {
//                         setSelectedPreview(fileUrl);
//                         setSelectedFile(file);
//                       };
//                       return (
//                         <div
//                           key={fileId}
//                           className="file-item"
//                           style={{ opacity: fileSelections[index] ? 1 : 0.4 }}
//                         >
//                           <input
//                             type="checkbox"
//                             checked={fileSelections[index] ?? true}
//                             onChange={() => toggleFileSelection(index)}
//                             style={{ marginRight: "8px" }}
//                           />
//                           {fileUrl && file.type && file.type.toLowerCase().startsWith("image/") ? (
//                             <img
//                               src={fileUrl}
//                               alt={file.name}
//                               style={{
//                                 maxWidth: "100px",
//                                 maxHeight: "100px",
//                                 marginRight: "8px",
//                                 cursor: "pointer",
//                                 borderRadius: "4px",
//                               }}
//                               onClick={handlePreviewClick}
//                             />
//                           ) : fileUrl && file.type && file.type.toLowerCase().startsWith("video/") ? (
//                             <video
//                               src={fileUrl}
//                               style={{
//                                 maxWidth: "100px",
//                                 maxHeight: "100px",
//                                 marginRight: "8px",
//                                 cursor: "pointer",
//                                 borderRadius: "4px",
//                               }}
//                               muted
//                               onLoadedMetadata={handleVideoLoadedMetadata}
//                               onClick={handlePreviewClick}
//                             >
//                               Your browser does not support the video tag.
//                             </video>
//                           ) : (
//                             <span style={{ marginRight: "8px" }}>
//                               {getFileIcon(file, `file-${fileId}`)}
//                             </span>
//                           )}
//                           <div style={{ display: "flex", flexDirection: "column" }}>
//                             <span
//                               style={{
//                                 fontSize: "0.8rem",
//                                 cursor: "pointer",
//                                 color: selectedPreview === fileUrl ? "#0056D2" : "#000000",
//                                 fontWeight: selectedPreview === fileUrl ? "bold" : "normal",
//                               }}
//                               onClick={handlePreviewClick}
//                             >
//                               {file.name}
//                             </span>
//                             <span style={{ fontSize: "0.7rem", color: "#555" }}>
//                               {file.type && file.type.toLowerCase().startsWith("video/")
//                                 ? `${duration} | ${frames} frames`
//                                 : "N/A"}
//                             </span>
//                             <span
//                               style={{ fontSize: "0.7rem", color: "#007BFF", cursor: "pointer" }}
//                               onClick={() => handleMediaInfoClick(file)}
//                             >
//                               Media info
//                             </span>
//                           </div>
//                         </div>
//                       );
//                     })
//                   ) : isFilesExpanded ? (
//                     <p style={{ color: "#000000", padding: "10px" }}>No files selected.</p>
//                   ) : null}
//                 </>
//               ) : (
//                 <div className="import-media-button-container">
//                   <button onClick={handleUploadClick} className="import-media-button">
//                     Import media
//                   </button>
//                   <input
//                     type="file"
//                     ref={folderInputRef}
//                     onChange={handleFolderChange}
//                     webkitdirectory="true"
//                     directory="true"
//                     multiple
//                     style={{ display: "none" }}
//                   />
//                 </div>
//               )}
//             </div>

//             {/* "Import More Media" Button - Under the left box */}
//             {selectedFolders.length > 0 && (
//               <div className="import-more-media-container">
//                 <button onClick={handleMoreMediaUploadClick} className="import-media-button">
//                   Import more media
//                 </button>
//                 <input
//                   type="file"
//                   ref={moreMediaInputRef}
//                   onChange={handleFolderChange}
//                   webkitdirectory="true"
//                   directory="true"
//                   multiple
//                   style={{ display: "none" }}
//                 />
//               </div>
//             )}
//           </div>

//           {/* Right Side: Preview with Video Controls */}
//           <div className="media-import-right">
//             {selectedPreview ? (
//               <div className="right-panel">
//                 <div style={{ width: "100%", textAlign: "left", marginBottom: "10px" }}>
//                   <strong style={{ fontSize: "16px", color: "#000000" }}>
//                     {selectedFile?.name || "Unknown"}
//                   </strong>
//                   <span style={{ fontSize: "14px", color: "#555", marginLeft: "10px" }}>
//                     Frame 001 / {totalFrames}
//                   </span>
//                 </div>
//                 <div style={{ width: "100%", height: "50%", position: "relative" }}>
//                   {selectedFile?.type && selectedFile.type.toLowerCase().startsWith("video/") ? (
//                     <>
//                       <video
//                         key={selectedPreview}
//                         ref={videoRef}
//                         src={selectedPreview}
//                         style={{
//                           width: "100%",
//                           height: "100%",
//                           objectFit: "contain",
//                           borderRadius: "5px",
//                         }}
//                         muted
//                         onLoadedMetadata={handleVideoLoadedMetadata}
//                         onTimeUpdate={handleTimeUpdate}
//                       >
//                         Your browser does not support the video tag.
//                       </video>
//                       <div className="video-controls">
//                         <button
//                           onClick={handleRewind}
//                           title="Rewind 5 seconds"
//                           style={{
//                             background: "none",
//                             border: "none",
//                             cursor: "pointer",
//                             padding: "5px",
//                             display: "flex",
//                             alignItems: "center",
//                             color: "#007BFF",
//                             transition: "color 0.3s ease",
//                           }}
//                         >
//                           <FaBackward size={20} />
//                         </button>
//                         <span>{formatTime(currentTime)}</span>
//                         <input
//                           type="range"
//                           min="0"
//                           max={videoDuration || 0}
//                           step="0.1"
//                           value={currentTime}
//                           onChange={handleSeek}
//                           style={{
//                             flex: 1,
//                             cursor: "pointer",
//                             accentColor: "#007BFF",
//                           }}
//                         />
//                         <span>{formatTime(videoDuration)}</span>
//                         <button
//                           onClick={handleFastForward}
//                           title="Fast-forward 5 seconds"
//                           style={{
//                             background: "none",
//                             border: "none",
//                             cursor: "pointer",
//                             padding: "5px",
//                             display: "flex",
//                             alignItems: "center",
//                             color: "#007BFF",
//                             transition: "color 0.3s ease",
//                           }}
//                         >
//                           <FaForward size={20} />
//                         </button>
//                       </div>
//                     </>
//                   ) : selectedFile?.type && selectedFile.type.toLowerCase().startsWith("image/") ? (
//                     <img
//                       src={selectedPreview}
//                       alt="Selected Preview"
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "contain",
//                         borderRadius: "5px",
//                       }}
//                     />
//                   ) : (
//                     <div style={{ color: "#000000", padding: "10px" }}>
//                       No preview available.
//                     </div>
//                   )}
//                 </div>
//                 <div className="preview-details">
//                   <p style={{ margin: "5px 0", color: "#000000" }}>
//                     C:\Users\Admin\{databaseName || "Unnamed Database"}\{selectedFile?.name || "Unknown"}
//                   </p>
//                   <p style={{ margin: "5px 0", color: "#000000" }}>
//                     {formatTime(videoDuration)} | {totalFrames} frames
//                   </p>
//                   <p style={{ margin: "5px 0", color: "#000000" }}>
//                     {((selectedFile?.size || 0) / (1024 * 1024)).toFixed(1)} MB
//                   </p>
//                   <p style={{ margin: "5px 0", color: "#000000" }}>
//                     {resolution === "N/A" ? "1080p" : resolution.includes("x") ? `${resolution.split("x")[1]}p` : resolution}
//                   </p>
//                   <p style={{ margin: "5px 0", color: "#000000" }}>
//                     {formatDateTime(fileMetadata[allFiles.findIndex((f) => f === selectedFile)]?.creationTime)}
//                   </p>
//                   <p
//                     style={{ margin: "5px 0", color: "#007BFF", cursor: "pointer" }}
//                     onClick={() => console.log("Open File clicked")}
//                   >
//                     Open File
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               <div className="placeholder-video-controls">
//                 <button className="placeholder-video-button" disabled>
//                   <FaBackward size={20} />
//                 </button>
//                 <span className="placeholder-time">0:00</span>
//                 <input
//                   type="range"
//                   min="0"
//                   max="100"
//                   step="0.1"
//                   value="0"
//                   className="placeholder-range-input"
//                   disabled
//                 />
//                 <span className="placeholder-time">0:00</span>
//                 <button className="placeholder-video-button" disabled>
//                   <FaForward size={20} />
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Settings Section */}
//         <div className="settings-section">
//           <div className="modalslider-container">
//             <input
//               type="range"
//               min="2"
//               max="12"
//               step="1"
//               value={resolutionLevel}
//               onChange={(e) => setResolutionLevel(parseInt(e.target.value))}
//               className="modalslider"
//             />
//             <div className="slider-ticks">
//               {[...Array(11)].map((_, index) => {
//                 const value = index + 2;
//                 return (
//                   <div key={value} className="slider-tick">
//                     <span className="slider-tick-label">{value}</span>
//                   </div>
//                 );
//               })}
//             </div>
//             <label className="modalslider-label">Database Pattern Density Level:</label>
//           </div>
//           <div className="radio-group">
//             <label className="slider-label">Database Color Settings:</label>
//             <label className="radio-label">
//               <input
//                 type="radio"
//                 value="fullColor"
//                 checked={colorSetting === "fullColor"}
//                 onChange={(e) => setColorSetting(e.target.value)}
//                 className="radio-input"
//               />
//               Full color
//             </label>
//             <label className="radio-label">
//               <input
//                 type="radio"
//                 value="blackAndWhite"
//                 checked={colorSetting === "blackAndWhite"}
//                 onChange={(e) => setColorSetting(e.target.value)}
//                 className="radio-input"
//               />
//               Black & white
//             </label>
//             <label className="checkbox-label">
//               <input
//                 type="checkbox"
//                 checked={useGPU}
//                 onChange={(e) => setUseGPU(e.target.checked)}
//                 className="checkbox-input"
//               />
//               Use GPU acceleration
//             </label>
//           </div>
//         </div>

//         <div className="button-container">
//           <button onClick={onClose} className="cancel-button">
//             Cancel
//           </button>
//           <button
//             onClick={handleFinish}
//             className="create-button enabled"
//           >
//             Create Database
//           </button>
//         </div>
//       </div>

//       {showMediaInfoModal && (
//         <div style={styles.modalOverlayStyle}>
//           <div style={styles.modalContentStyle}>
//             <h3 style={{ color: "#000000" }}>Media Info</h3>
//             <p style={{ color: "#000000" }}>
//               {mediaInfoFile ? `File Name: ${mediaInfoFile.name}` : "No file selected."}
//             </p>
//             <p style={{ color: "#000000" }}>
//               {`File Size: ${((mediaInfoFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB`}
//             </p>
//             <p style={{ color: "#000000" }}>
//               {`Resolution: ${fileMetadata[allFiles.findIndex((f) => f === mediaInfoFile)]?.resolution || "N/A"}`}
//             </p>
//             <p style={{ color: "#000000" }}>
//               {`Duration: ${formatTime(fileMetadata[allFiles.findIndex((f) => f === mediaInfoFile)]?.duration || 0)}`}
//             </p>
//             <p style={{ color: "#000000" }}>
//               {`Frames: ${fileMetadata[allFiles.findIndex((f) => f === mediaInfoFile)]?.totalFrames || "N/A"}`}
//             </p>
//             <p style={{ color: "#000000" }}>
//               {`Video Codec: ${fileMetadata[allFiles.findIndex((f) => f === mediaInfoFile)]?.videoCodec || "N/A"}`}
//             </p>
//             <p style={{ color: "#000000" }}>
//               {`Audio Codec: ${fileMetadata[allFiles.findIndex((f) => f === mediaInfoFile)]?.audioCodec || "N/A"}`}
//             </p>
//             <p style={{ color: "#000000" }}>
//               {`Bit Rate: ${fileMetadata[allFiles.findIndex((f) => f === mediaInfoFile)]?.bitRate || "N/A"}`}
//             </p>
//             <p style={{ color: "#000000" }}>
//               {`Format: ${fileMetadata[allFiles.findIndex((f) => f === mediaInfoFile)]?.fileFormat || "N/A"}`}
//             </p>
//             <p style={{ color: "#000000" }}>
//               {`Date: ${formatDateTime(fileMetadata[allFiles.findIndex((f) => f === mediaInfoFile)]?.creationTime)}`}
//             </p>
//             <button onClick={() => setShowMediaInfoModal(false)} className="modal-close-button">
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {showFinderModal && (
//         <FinderModal
//           onClose={() => setShowFinderModal(false)}
//           onSelectLocation={handleSelectLocation}
//           databaseName={databaseName}
//           savePath={saveLocation}
//           items={allFiles.filter((_, index) => fileSelections[index])}
//         />
//       )}
//     </div>
//   );
// };

// export default CombinedCreateDatabaseModal;

"use client";
import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import { ImageContext } from "@/contexts/ImageContext";
import { useDatabaseLocation } from "../../../../contexts/PreferencesContext";
import { generateUniqueId } from "@/utils/idGenerator";
import {
  FaCloudUploadAlt,
  FaFolder,
  FaFolderOpen,
  FaTimes,
  FaArrowRight,
  FaFileImage,
  FaFileVideo,
  FaForward,
  FaBackward,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import FinderModal from "../finder/finderModal";
import "./createNewDatabase.css";

// Define minimal styles for dynamic or inline requirements
const styles = {
  modalStyle: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    borderRadius: "8px",
    zIndex: 1000,
    display: "block",
    width: "70vw",
    height: "90vh",
    boxShadow: "0 4px 15px rgba(0, 0, 123, 0.2)",
    overflow: "hidden",
  },
  headerStyle: {
    backgroundColor: "#EEF2FF",
    padding: "10px 20px",
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contentStyle: {
    padding: "20px",
    color: "black",
    display: "flex",
    flexDirection: "column",
    height: "calc(100% - 40px)",
  },
  modalOverlayStyle: {
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
  },
  modalContentStyle: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 4px 15px rgba(0, 0, 123, 0.2)",
    color: "#000000",
  },
};

const CombinedCreateDatabaseModal = ({ onClose, onFinish, existingDatabaseNames }) => {
  const { setFinalSelectedImages } = useContext(ImageContext);
  const { databaseLocation, isLoading } = useDatabaseLocation(); // Fetch from backend
  const [databaseName, setDatabaseName] = useState("");
  const [databaseNameError, setDatabaseNameError] = useState("");
  const [importMediaError, setImportMediaError] = useState("");
  const [saveLocation, setSaveLocation] = useState(""); // Will be set to /Photon if default
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [isDatabaseNameLocked, setIsDatabaseNameLocked] = useState(false);
  const [showFinderModal, setShowFinderModal] = useState(false);
  const folderInputRef = useRef(null);
  const moreMediaInputRef = useRef(null);

  // Set saveLocation to a default path when databaseLocation is "default"
  useEffect(() => {
    if (!isLoading) {
      if (databaseLocation === "default") {
        setSaveLocation("/Photon"); // Default save location
        console.log("Preferences set to default. Save location set to /Photon.");
      } else {
        setSaveLocation(""); // Reset when manual
        console.log("Preferences set to manual. Save location will be selected by user.");
      }
    }
  }, [databaseLocation, isLoading]);

  const allFiles = useMemo(() => {
    const files = [];
    const collectFilesRecursively = (folders) => {
      folders.forEach((folder) => {
        if (folder.files && folder.files.length > 0) {
          files.push(...folder.files);
        }
        if (folder.subFolders && folder.subFolders.length > 0) {
          collectFilesRecursively(folder.subFolders);
        }
      });
    };
    collectFilesRecursively(selectedFolders);
    return files;
  }, [selectedFolders]);

  const [fileSelections, setFileSelections] = useState({});
  const [fileMetadata, setFileMetadata] = useState({});
  const [showMediaInfoModal, setShowMediaInfoModal] = useState(false);
  const [mediaInfoFile, setMediaInfoFile] = useState(null);
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [resolution, setResolution] = useState("N/A");
  const videoRef = useRef(null);
  const [databaseCount, setDatabaseCount] = useState(() =>
    parseInt(localStorage.getItem("databaseCount") || "1", 10)
  );
  const [clickedIcon, setClickedIcon] = useState(null);
  const [fileUrls, setFileUrls] = useState({});
  const [databaseSelected, setDatabaseSelected] = useState(true);
  const [isFilesExpanded, setIsFilesExpanded] = useState(true);
  const [resolutionLevel, setResolutionLevel] = useState(6);
  const [colorSetting, setColorSetting] = useState("fullColor");
  const [useGPU, setUseGPU] = useState(false);

  const fileUrlCache = useRef(new Map());

  const getFileUrl = (file, index) => {
    if (!file || !(file instanceof File)) {
      console.error("Invalid file object:", file);
      return null;
    }

    const fileId = `file-${index}`;
    if (!fileUrlCache.current.has(fileId)) {
      try {
        const url = URL.createObjectURL(file);
        fileUrlCache.current.set(fileId, url);
        return url;
      } catch (error) {
        console.error("Failed to create object URL for file:", file, error);
        return null;
      }
    }
    return fileUrlCache.current.get(fileId);
  };

  useEffect(() => {
    const newFileUrls = {};
    allFiles.forEach((file, index) => {
      const fileId = `file-${index}`;
      if (!fileUrls[fileId]) {
        const url = getFileUrl(file, index);
        if (url) {
          newFileUrls[fileId] = url;
        }
      } else {
        newFileUrls[fileId] = fileUrls[fileId];
      }
    });
    setFileUrls(newFileUrls);

    return () => {
      Object.keys(fileUrls).forEach((fileId) => {
        if (!newFileUrls[fileId]) {
          const url = fileUrls[fileId];
          if (url) {
            URL.revokeObjectURL(url);
          }
          fileUrlCache.current.delete(fileId);
        }
      });
    };
  }, [allFiles]);

  useEffect(() => {
    const fetchMetadata = async () => {
      const metadataPromises = allFiles.map(async (file, index) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
          const response = await fetch("http://localhost:8000/dashboard/extract-metadata", {
            method: "POST",
            body: formData,
          });
          if (!response.ok) throw new Error("Failed to fetch metadata");
          const data = await response.json();
          return { index, metadata: data };
        } catch (error) {
          console.error(`Error fetching metadata for file ${file.name}:`, error);
          return {
            index,
            metadata: {
              creationTime: null,
              duration: 0,
              totalFrames: 0,
              resolution: "N/A",
              fileSize: 0,
              videoCodec: "N/A",
              audioCodec: "N/A",
              bitRate: "N/A",
              fileFormat: "N/A",
            },
          };
        }
      });

      const metadataResults = await Promise.all(metadataPromises);
      const metadataMap = metadataResults.reduce((acc, { index, metadata }) => {
        acc[index] = metadata;
        return acc;
      }, {});
      setFileMetadata(metadataMap);
    };

    fetchMetadata();
  }, [allFiles]);

  useEffect(() => {
    localStorage.setItem("databaseCount", databaseCount);
  }, [databaseCount]);

  useEffect(() => {
    console.log("Existing database names:", existingDatabaseNames);
  }, [existingDatabaseNames]);

  useEffect(() => {
    setFileSelections((prev) => {
      const newFileSelections = { ...prev };
      allFiles.forEach((_, index) => {
        if (newFileSelections[index] === undefined) {
          newFileSelections[index] = true;
        }
      });
      Object.keys(newFileSelections).forEach((key) => {
        if (parseInt(key) >= allFiles.length) {
          delete newFileSelections[key];
        }
      });
      return newFileSelections;
    });
  }, [allFiles]);

  const handleFolderChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const folderTree = { name: "", subFolders: new Map() };

    files.forEach((file) => {
      console.log(`File: ${file.name}, Type: ${file.type}`);

      const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
      const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
      const isValidFile =
        validImageTypes.includes(file.type.toLowerCase()) ||
        validVideoTypes.includes(file.type.toLowerCase());

      if (!isValidFile) return;

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
    if (!databaseName.trim()) {
      setImportMediaError("Please enter your database name first.");
      return;
    }
    setImportMediaError("");
    setIsDatabaseNameLocked(true);
    folderInputRef.current?.click();
  };

  const handleMoreMediaUploadClick = () => {
    if (!databaseName.trim()) {
      setImportMediaError("Please enter your database name first.");
      return;
    }
    setImportMediaError("");
    setIsDatabaseNameLocked(true);
    moreMediaInputRef.current?.click();
  };

  const handleFolderIconClick = () => {
    setShowFinderModal(true);
  };

  const handleSelectLocation = (path) => {
    setSaveLocation(path);
    console.log("User selected save location:", path);
  };

  const isDuplicateName =
    databaseName.trim() && existingDatabaseNames.includes(databaseName.trim().toLowerCase());

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
      [fileIndex]: !fileSelections[fileIndex],
    }).every(Boolean);
    setDatabaseSelected(allFilesChecked);
  };

  const handleMediaInfoClick = (file) => {
    setMediaInfoFile(file);
    setShowMediaInfoModal(true);
  };

  const handleFinish = async () => {
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

    const selectedFiles = allFiles
      .filter((_, index) => fileSelections[index])
      .map((file) => {
        const id = generateUniqueId("db-");
        return Object.assign(file, { id });
      });

    if (selectedFiles.length === 0) {
      console.warn("No files selected to create the database");
      return;
    }

    // Log the files being sent
    console.log("Files being sent:", selectedFiles.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size
    })));

    // Prepare form data for the backend
    const formData = new FormData();
    formData.append("user_id", "user123");
    formData.append("database_name", databaseName);
    // Use saveLocation if set (manual mode), otherwise use /Photon (default mode)
    const finalSavePath = databaseLocation === "default" ? "/Photon" : saveLocation;
    formData.append("save_path", finalSavePath);
    selectedFiles.forEach((file, index) => {
      formData.append(`files`, file, file.name);
    });

    console.log(`Saving database "${databaseName}" to path: ${finalSavePath}`);

    try {
      const response = await fetch("http://localhost:8000/dashboard/save-database", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to save database. Response:", response.status, errorText);
        throw new Error(`Failed to save database: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log("Database saved successfully:", result);

      const databaseNameFinal = databaseName.trim();
      setDatabaseCount((prev) => prev + 1);
      onFinish({ files: selectedFiles, databaseName: databaseNameFinal, resolutionLevel, colorSetting });
      onClose();
    } catch (error) {
      console.error("Error saving database:", error);
      alert(`Failed to save database: ${error.message}`);
    }
  };

  const getFileIcon = (file, iconId) => {
    const handleMouseDown = () => setClickedIcon(iconId);
    const handleMouseUp = () => setClickedIcon(null);

    const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
    const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
    const isImage = validImageTypes.includes(file.type.toLowerCase());
    const isVideo = validVideoTypes.includes(file.type.toLowerCase());

    return isImage ? (
      <FaFileImage
        className={`file-icon-base ${clickedIcon === iconId ? "file-icon-clicked" : "file-icon-hover"}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
    ) : isVideo ? (
      <FaFileVideo
        className={`file-icon-base ${clickedIcon === iconId ? "file-icon-clicked" : "file-icon-hover"}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
    ) : (
      <FaFileImage
        className={`file-icon-base ${clickedIcon === iconId ? "file-icon-clicked" : "file-icon-hover"}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
    );
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
      setResolution(`${videoRef.current.videoWidth}x${videoRef.current.videoHeight}`);
      const frameRate = 30;
      setTotalFrames(Math.floor(videoRef.current.duration * frameRate));
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const ensureVideoReady = async () => {
    if (videoRef.current && videoRef.current.readyState < 2) {
      console.log("Waiting for video to be ready...");
      await new Promise((resolve) => {
        videoRef.current.addEventListener("canplay", resolve, { once: true });
      });
      console.log("Video ready: readyState =", videoRef.current.readyState);
    }
  };

  const handleSeek = async (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      if (videoRef.current.readyState < 2) {
        await ensureVideoReady();
      }
      videoRef.current.currentTime = newTime;
      videoRef.current.pause();
      console.log("Range input: newTime =", newTime);
    } else {
      console.error("videoRef.current is not available for seek");
    }
  };

  const handleFastForward = async () => {
    if (videoRef.current) {
      const newTime = Math.min(currentTime + 5, videoDuration);
      setCurrentTime(newTime);
      await ensureVideoReady();
      videoRef.current.currentTime = newTime;
      videoRef.current.pause();
      console.log("Fast-forward: newTime =", newTime);
    } else {
      console.error("videoRef.current is not available for fast-forward");
    }
  };

  const handleRewind = async () => {
    if (videoRef.current) {
      const newTime = Math.max(currentTime - 5, 0);
      setCurrentTime(newTime);
      await ensureVideoReady();
      videoRef.current.currentTime = newTime;
      videoRef.current.pause();
      console.log("Rewind: newTime =", newTime);
    } else {
      console.error("videoRef.current is not available for rewind");
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" }).toUpperCase();
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const timezone = "EST";
    return `${day}${month}${year} ${hours}:${minutes}:${seconds}${timezone}`;
  };

  const totalItems = allFiles.length;

  if (isLoading) {
    return <div>Loading preferences...</div>;
  }

  return (
    <div className="modal" style={styles.modalStyle}>
      <div style={styles.headerStyle}>
        <h3 style={{ color: "black", margin: 0, fontSize: 15 }}>Create New Database</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={onClose}
            style={{
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
            }}
          >
            ×
          </button>
        </div>
      </div>
      <div style={styles.contentStyle}>
        <div className="input-container">
          <label htmlFor="databaseName" className="input-label">
            Database Name:
          </label>
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type="text"
              id="databaseName"
              value={databaseName}
              onChange={(e) => {
                if (!isDatabaseNameLocked) {
                  setDatabaseName(e.target.value);
                  if (databaseNameError && e.target.value.trim()) {
                    setDatabaseNameError("");
                  }
                }
              }}
              onBlur={() => {
                if (databaseName.trim() && !isDatabaseNameLocked) {
                  setIsDatabaseNameLocked(true);
                }
              }}
              placeholder="Text field"
              className="input-field"
              disabled={isDatabaseNameLocked}
            />
          </div>
          {databaseNameError && <div className="input-error">{databaseNameError}</div>}
          {isDuplicateName && !databaseNameError && (
            <div className="input-error">
              Database name already exists. Please choose a unique name.
            </div>
          )}
        </div>

        {/* Conditionally render the "Save to" input and "Browse" button */}
        {databaseLocation === "manual" && (
          <div className="input-container">
            <label htmlFor="saveLocation" className="input-label">
              Save to:
            </label>
            <div className="input-group">
              <input
                type="text"
                id="saveLocation"
                value={saveLocation}
                onChange={(e) => setSaveLocation(e.target.value)}
                placeholder="Location"
                className="input-field"
              />
              <button className="browse-button" onClick={handleFolderIconClick}>
                Browse
              </button>
            </div>
            <div className="items-selected">
              {totalItems} item{totalItems !== 1 ? "s" : ""} selected.
            </div>
            {importMediaError && <div className="input-error">{importMediaError}</div>}
          </div>
        )}

        {/* Media Import Section */}
        <div className="media-import-container">
          {/* Left Side: Import Button or File Selection */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div className="media-import-left left-panel">
              {selectedFolders.length > 0 ? (
                <>
                  <div
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="checkbox"
                        checked={databaseSelected}
                        onChange={toggleDatabaseSelection}
                        style={{ marginRight: "8px" }}
                      />
                      <FaFolder size={40} style={{ color: "#FFD700", marginRight: "12px" }} />
                      <div>
                        <strong style={{ fontSize: "18px", color: "#000000" }}>
                          {databaseName || "Unnamed Database"}
                        </strong>
                        <div style={{ fontSize: "0.9rem", color: "#555" }}>
                          {totalItems} item{totalItems !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsFilesExpanded(!isFilesExpanded)}
                      className="toggle-button"
                    >
                      {isFilesExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>

                  {isFilesExpanded && allFiles.length > 0 ? (
                    allFiles.map((file, index) => {
                      const fileId = `file-${index}`;
                      const fileUrl = fileUrls[fileId] || "";
                      const metadata = fileMetadata[index] || {};
                      const duration = metadata.duration ? formatTime(metadata.duration) : "N/A";
                      const frames = metadata.totalFrames || "N/A";
                      const handlePreviewClick = () => {
                        setSelectedPreview(fileUrl);
                        setSelectedFile(file);
                      };
                      return (
                        <div
                          key={fileId}
                          className="file-item"
                          style={{ opacity: fileSelections[index] ? 1 : 0.4 }}
                        >
                          <input
                            type="checkbox"
                            checked={fileSelections[index] ?? true}
                            onChange={() => toggleFileSelection(index)}
                            style={{ marginRight: "8px" }}
                          />
                          {fileUrl && file.type && file.type.toLowerCase().startsWith("image/") ? (
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
                              onClick={handlePreviewClick}
                            />
                          ) : fileUrl && file.type && file.type.toLowerCase().startsWith("video/") ? (
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
                              onLoadedMetadata={handleVideoLoadedMetadata}
                              onClick={handlePreviewClick}
                            >
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <span style={{ marginRight: "8px" }}>
                              {getFileIcon(file, `file-${fileId}`)}
                            </span>
                          )}
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span
                              style={{
                                fontSize: "0.8rem",
                                cursor: "pointer",
                                color: selectedPreview === fileUrl ? "#0056D2" : "#000000",
                                fontWeight: selectedPreview === fileUrl ? "bold" : "normal",
                              }}
                              onClick={handlePreviewClick}
                            >
                              {file.name}
                            </span>
                            <span style={{ fontSize: "0.7rem", color: "#555" }}>
                              {file.type && file.type.toLowerCase().startsWith("video/")
                                ? `${duration} | ${frames} frames`
                                : "N/A"}
                            </span>
                            <span
                              style={{ fontSize: "0.7rem", color: "#007BFF", cursor: "pointer" }}
                              onClick={() => handleMediaInfoClick(file)}
                            >
                              Media info
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : isFilesExpanded ? (
                    <p style={{ color: "#000000", padding: "10px" }}>No files selected.</p>
                  ) : null}
                </>
              ) : (
                <div className="import-media-button-container">
                  <button onClick={handleUploadClick} className="import-media-button">
                    Import media
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
              )}
            </div>

            {/* "Import More Media" Button - Under the left box */}
            {selectedFolders.length > 0 && (
              <div className="import-more-media-container">
                <button onClick={handleMoreMediaUploadClick} className="import-media-button">
                  Import more media
                </button>
                <input
                  type="file"
                  ref={moreMediaInputRef}
                  onChange={handleFolderChange}
                  webkitdirectory="true"
                  directory="true"
                  multiple
                  style={{ display: "none" }}
                />
              </div>
            )}
          </div>

          {/* Right Side: Preview with Video Controls */}
          <div className="media-import-right">
            {selectedPreview ? (
              <div className="right-panel">
                <div style={{ width: "100%", textAlign: "left", marginBottom: "10px" }}>
                  <strong style={{ fontSize: "16px", color: "#000000" }}>
                    {selectedFile?.name || "Unknown"}
                  </strong>
                  <span style={{ fontSize: "14px", color: "#555", marginLeft: "10px" }}>
                    Frame 001 / {totalFrames}
                  </span>
                </div>
                <div style={{ width: "100%", height: "50%", position: "relative" }}>
                  {selectedFile?.type && selectedFile.type.toLowerCase().startsWith("video/") ? (
                    <>
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
                      <div className="video-controls">
                        <button
                          onClick={handleRewind}
                          title="Rewind 5 seconds"
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "5px",
                            display: "flex",
                            alignItems: "center",
                            color: "#007BFF",
                            transition: "color 0.3s ease",
                          }}
                        >
                          <FaBackward size={20} />
                        </button>
                        <span>{formatTime(currentTime)}</span>
                        <input
                          type="range"
                          min="0"
                          max={videoDuration || 0}
                          step="0.1"
                          value={currentTime}
                          onChange={handleSeek}
                          style={{
                            flex: 1,
                            cursor: "pointer",
                            accentColor: "#007BFF",
                          }}
                        />
                        <span>{formatTime(videoDuration)}</span>
                        <button
                          onClick={handleFastForward}
                          title="Fast-forward 5 seconds"
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "5px",
                            display: "flex",
                            alignItems: "center",
                            color: "#007BFF",
                            transition: "color 0.3s ease",
                          }}
                        >
                          <FaForward size={20} />
                        </button>
                      </div>
                    </>
                  ) : selectedFile?.type && selectedFile.type.toLowerCase().startsWith("image/") ? (
                    <img
                      src={selectedPreview}
                      alt="Selected Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        borderRadius: "5px",
                      }}
                    />
                  ) : (
                    <div style={{ color: "#000000", padding: "10px" }}>
                      No preview available.
                    </div>
                  )}
                </div>
                <div className="preview-details">
                  <p style={{ margin: "5px 0", color: "#000000" }}>
                    C:\Users\Admin\{databaseName || "Unnamed Database"}\{selectedFile?.name || "Unknown"}
                  </p>
                  <p style={{ margin: "5px 0", color: "#000000" }}>
                    {formatTime(videoDuration)} | {totalFrames} frames
                  </p>
                  <p style={{ margin: "5px 0", color: "#000000" }}>
                    {((selectedFile?.size || 0) / (1024 * 1024)).toFixed(1)} MB
                  </p>
                  <p style={{ margin: "5px 0", color: "#000000" }}>
                    {resolution === "N/A" ? "1080p" : resolution.includes("x") ? `${resolution.split("x")[1]}p` : resolution}
                  </p>
                  <p style={{ margin: "5px 0", color: "#000000" }}>
                    {formatDateTime(fileMetadata[allFiles.findIndex((f) => f === selectedFile)]?.creationTime)}
                  </p>
                  <p
                    style={{ margin: "5px 0", color: "#007BFF", cursor: "pointer" }}
                    onClick={() => console.log("Open File clicked")}
                  >
                    Open File
                  </p>
                </div>
              </div>
            ) : (
              <div className="placeholder-video-controls">
                <button className="placeholder-video-button" disabled>
                  <FaBackward size={20} />
                </button>
                <span className="placeholder-time">0:00</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value="0"
                  className="placeholder-range-input"
                  disabled
                />
                <span className="placeholder-time">0:00</span>
                <button className="placeholder-video-button" disabled>
                  <FaForward size={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Settings Section */}
        <div className="settings-section">
          <div className="modalslider-container">
            <input
              type="range"
              min="2"
              max="12"
              step="1"
              value={resolutionLevel}
              onChange={(e) => setResolutionLevel(parseInt(e.target.value))}
              className="modalslider"
            />
            <div className="slider-ticks">
              {[...Array(11)].map((_, index) => {
                const value = index + 2;
                return (
                  <div key={value} className="slider-tick">
                    <span className="slider-tick-label">{value}</span>
                  </div>
                );
              })}
            </div>
            <label className="modalslider-label">Database Pattern Density Level:</label>
          </div>
          <div className="radio-group">
            <label className="slider-label">Database Color Settings:</label>
            <label className="radio-label">
              <input
                type="radio"
                value="fullColor"
                checked={colorSetting === "fullColor"}
                onChange={(e) => setColorSetting(e.target.value)}
                className="radio-input"
              />
              Full color
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="blackAndWhite"
                checked={colorSetting === "blackAndWhite"}
                onChange={(e) => setColorSetting(e.target.value)}
                className="radio-input"
              />
              Black & white
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={useGPU}
                onChange={(e) => setUseGPU(e.target.checked)}
                className="checkbox-input"
              />
              Use GPU acceleration
            </label>
          </div>
        </div>

        <div className="button-container">
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
          <button onClick={handleFinish} className="create-button enabled">
            Create Database
          </button>
        </div>
      </div>

      {showMediaInfoModal && (
        <div style={styles.modalOverlayStyle}>
          <div style={styles.modalContentStyle}>
            <h3 style={{ color: "#000000" }}>Media Info</h3>
            <p style={{ color: "#000000" }}>
              {mediaInfoFile ? `File Name: ${mediaInfoFile.name}` : "No file selected."}
            </p>
            <p style={{ color: "#000000" }}>
              {`File Size: ${((mediaInfoFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB`}
            </p>
            <p style={{ color: "#000000" }}>
              {`Resolution: ${fileMetadata[allFiles.findIndex((f) => f === mediaInfoFile)]?.resolution || "N/A"}`}
            </p>
            <p style={{ color: "#000000" }}>
              {`Duration: ${formatTime(fileMetadata[allFiles.findIndex((f) => f === mediaInfoFile)]?.duration || 0)}`}
            </p>
            <p style={{ color: "#000000" }}>
              {`Frames: ${fileMetadata[allFiles.findIndex((f) => f === mediaInfoFile)]?.totalFrames || "N/A"}`}
            </p>
            <p style={{ color: "#000000" }}>
              {`Video Codec: ${fileMetadata[allFiles.findIndex((f) => f === mediaInfoFile)]?.videoCodec || "N/A"}`}
            </p>
            <p style={{ color: "#000000" }}>
              {`Audio Codec: ${fileMetadata[allFiles.findIndex((f) => f === mediaInfoFile)]?.audioCodec || "N/A"}`}
            </p>
            <p style={{ color: "#000000" }}>
              {`Bit Rate: ${fileMetadata[allFiles.findIndex((f) => f === mediaInfoFile)]?.bitRate || "N/A"}`}
            </p>
            <p style={{ color: "#000000" }}>
              {`Format: ${fileMetadata[allFiles.findIndex((f) => f === mediaInfoFile)]?.fileFormat || "N/A"}`}
            </p>
            <p style={{ color: "#000000" }}>
              {`Date: ${formatDateTime(fileMetadata[allFiles.findIndex((f) => f === mediaInfoFile)]?.creationTime)}`}
            </p>
            <button onClick={() => setShowMediaInfoModal(false)} className="modal-close-button">
              Close
            </button>
          </div>
        </div>
      )}

      {showFinderModal && (
        <FinderModal
          onClose={() => setShowFinderModal(false)}
          onSelectLocation={handleSelectLocation}
          databaseName={databaseName}
          savePath={saveLocation}
          items={allFiles.filter((_, index) => fileSelections[index])}
        />
      )}
    </div>
  );
};

export default CombinedCreateDatabaseModal;