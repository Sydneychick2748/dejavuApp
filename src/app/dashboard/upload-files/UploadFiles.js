



// import React, { useState, useContext, useEffect, useCallback, useRef, useMemo } from "react";

// import CombinedCreateDatabaseModal from "../modals/create-new-database/CombinedCreateDatabaseModal";
// import VideoFrameModal from "./VideoFrameModal";
// import ImageUploadModal from "../search-for/ImageUploadModal";
// import { generateUniqueId } from "@/utils/idGenerator";

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
// const GalleryItem = React.memo(
//   ({
//     file,
//     fileUrl,
//     fileId,
//     isExpanded,
//     frameData,
//     videoMetadata,
//     cumulativeStartIndex, // Reintroduce for numbering
//     cumulativeEndIndex,   // Reintroduce for numbering
//     handleImageClick,
//     handleVideoClick,
//     handleMediaInfoClick,
//     handleExpandFrames,
//     formatFrameNumber,
//     formatTime,
//   }) => {
//     const actualFrameCount = frameData[fileId] ? frameData[fileId].length : 0;

//     // Memoize the video element to prevent re-renders unless fileUrl changes
//     const videoElement = useMemo(() => {
//       if (file && file.type && typeof file.type === "string" && file.type.startsWith("video/") && fileUrl) {
//         return (
//           <div style={{ position: "relative", width: "200px", height: "200px" }}>
//             <video
//               src={fileUrl}
//               className="gallery-video"
//               muted
//               style={{ width: "100%", height: "100%", objectFit: "cover" }}
//             >
//               Your browser does not support the video tag.
//             </video>
//             <FaFilm
//               style={{
//                 position: "absolute",
//                 bottom: "10px",
//                 left: "10px",
//                 color: "white",
//                 fontSize: "24px",
//                 zIndex: 1,
//               }}
//             />
//           </div>
//         );
//       }
//       return (
//         <div style={{ width: "200px", height: "200px", backgroundColor: "#ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>
//           <p style={{ color: "#666", fontSize: "12px" }}>Video unavailable</p>
//         </div>
//       );
//     }, [fileUrl, file]);

//     // Validate file before rendering
//     if (!file || !file.name || !file.type) {
//       console.error("Invalid file in GalleryItem:", file);
//       return (
//         <div style={{ width: "220px", height: "300px", backgroundColor: "#ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>
//           <p style={{ color: "#666", fontSize: "12px" }}>Invalid file</p>
//         </div>
//       );
//     }

//     return (
//       <div
//         className="gallery-item"
//         onClick={() => {
//           if (file.type && file.type.startsWith("video/")) {
//             handleVideoClick(file);
//           } else {
//             handleImageClick(file);
//           }
//         }}
//         style={{ cursor: "pointer", transition: "all 0.3s ease", width: "220px" }}
//       >
//         {/* Display cumulative numbering for videos and images */}
//         <div className="gallery-item-index">
//           {file.type && file.type.startsWith("video/")
//             ? `${cumulativeStartIndex}-${cumulativeEndIndex}`
//             : `${cumulativeStartIndex}`}
//         </div>
//         <div className="gallery-item-media" style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
//           {file.type && file.type.startsWith("image/") ? (
//             fileUrl ? (
//               <img src={fileUrl} alt={file.name} className="gallery-image" style={{ width: "200px", height: "200px", objectFit: "cover" }} onError={(e) => console.error("Image failed to load:", fileUrl)} />
//             ) : (
//               <div style={{ width: "200px", height: "200px", backgroundColor: "#ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 <p style={{ color: "#666", fontSize: "12px" }}>Image unavailable</p>
//               </div>
//             )
//           ) : file.type && file.type.startsWith("video/") ? (
//             <>
//               {videoElement}

//               {isExpanded && (
//                 <div
//                   className="gallery-item-frames"
//                   style={{
//                     marginTop: "10px",
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: "5px",
//                     alignItems: "center",
//                     height: "200px",
//                     overflowY: "auto",
//                     transition: "height 0.3s ease",
//                   }}
//                 >
//                   {frameData[fileId] && frameData[fileId].length > 0 ? (
//                     frameData[fileId].map((frame, frameIndex) => (
//                       <div
//                         key={frameIndex}
//                         className="gallery-item-frame"
//                         style={{ 
//                           display: "flex", 
//                           alignItems: "center", 
//                           cursor: "pointer", 
//                           width: "100%", 
//                           justifyContent: "space-between" 
//                         }}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleImageClick({
//                             fileUrl: frame.url,
//                             fileName: `Frame_${frame.frame_number}`,
//                             fileSize: 0,
//                             fileType: "image/jpeg",
//                           });
//                         }}
//                       >
//                         <div style={{ display: "flex", alignItems: "center" }}>
//                           {/* Display cumulative index for each frame */}
//                           <span style={{ marginRight: "10px", fontSize: "12px", fontWeight: "bold" }}>
//                             {cumulativeStartIndex + frameIndex}
//                           </span>
//                           <img
//                             src={frame.url}
//                             alt={`Frame ${String(frame.frame_number).padStart(3, "0")}`}
//                             className="gallery-frame-image"
//                             style={{ width: "50px", height: "50px", objectFit: "cover" }}
//                           />
//                         </div>
//                         <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
//                           <span style={{ fontSize: "12px", color: "#000" }}>
//                             {file.name} {formatFrameNumber(frame.frame_number)}
//                           </span>
//                           <span
//                             style={{ fontSize: "12px", color: "#007BFF", cursor: "pointer" }}
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleMediaInfoClick(file);
//                             }}
//                           >
//                             IMAGE INFO
//                           </span>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="gallery-no-frames" style={{ fontSize: "12px" }}>
//                       {frameData[fileId] === undefined ? "Loading frames..." : "No frames available."}
//                     </p>
//                   )}
//                 </div>
//               )}
//             </>
//           ) : (
//             <div style={{ width: "200px", height: "200px", backgroundColor: "#ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>
//               <p style={{ color: "#666", fontSize: "12px" }}>Unsupported file type</p>
//             </div>
//           )}

//           <div className="gallery-item-details" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             <div className="gallery-item-name" style={{ display: "flex", flexDirection: "column" }}>
//               <span style={{ fontSize: "12px", color: "#000" }}>{file.name}</span>
//               {file.type && file.type.startsWith("video/") && videoMetadata && videoMetadata[fileId] && (
//                 <span style={{ fontSize: "12px", color: "#000" }}>
//                   {formatTime(videoMetadata[fileId].duration)} | {actualFrameCount} frames
//                 </span>
//               )}
//             </div>
//             <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
//               <span
//                 className="gallery-item-media-info"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleMediaInfoClick(file);
//                 }}
//                 style={{ fontSize: "12px", color: "#007BFF", cursor: "pointer" }}
//               >
//                 Media info
//               </span>
//               {file.type && file.type.startsWith("video/") && (
//                 <span
//                   className="gallery-item-expand-frames"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleExpandFrames(file);
//                   }}
//                   style={{ fontSize: "12px", color: "#007BFF", cursor: "pointer" }}
//                 >
//                   {isExpanded ? "Collapse frames" : "Expand Frames"} {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// );

// const UploadFiles = React.memo(() => {
//   const [showCreateDbModal, setShowCreateDbModal] = useState(false);
//   const [showPlusModal, setShowPlusModal] = useState(false);
//   const [showImageUploadModal, setShowImageUploadModal] = useState(false);
//   const [pendingImages, setPendingImages] = useState([]);
//   const [databases, setDatabases] = useState([]);
//   const [selectedDatabaseIndex, setSelectedDatabaseIndex] = useState(null);
//   const [showMediaInfoModal, setShowMediaInfoModal] = useState(false);
//   const [mediaInfoFile, setMediaInfoFile] = useState(null);
//   const [expandedFrames, setExpandedFrames] = useState({});
//   const [frameData, setFrameData] = useState({});
//   const [showVideoFrameModal, setShowVideoFrameModal] = useState(false);
//   const [isVideoLoading, setIsVideoLoading] = useState(false);
//   const [selectedVideo, setSelectedVideo] = useState(null);
//   const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
//   const [videoId, setVideoId] = useState(null);
//   const [videoMetadata, setVideoMetadata] = useState({});
//   // Add photonNumbering state to store cumulative numbering data
//   const [photonNumbering, setPhotonNumbering] = useState([]);
//   // Add frameCounts state to store frame counts fetched from the backend
//   const [frameCounts, setFrameCounts] = useState({});
//   // Add state to track fetch errors
//   const [fetchError, setFetchError] = useState(null);

//   const { setSelectedImage, setUploadedFiles, finalSelectedImages, setFinalSelectedImages, setSelectedFileInfo } = useContext(ImageContext);
//   const [localFinalSelectedImages, setLocalFinalSelectedImages] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [isAscending, setIsAscending] = useState(true);
//   const [isGridView, setIsGridView] = useState(false);
//   const [isCreateButtonClicked, setIsCreateButtonClicked] = useState(false);
//   // Add state to track if database creation is in progress
//   const [isDatabaseCreating, setIsDatabaseCreating] = useState(false);

//   // Cache file URLs to prevent recreation on every render
//   const fileUrlCache = useRef(new Map());

//   const getFileUrl = (file) => {
//     if (!file || !(file instanceof File)) {
//       console.error("Invalid file object:", file);
//       return null;
//     }

//     const fileId = `${file.name}-${file.lastModified}-${file.id || ''}`;
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

//   // Clean up file URLs when component unmounts
//   useEffect(() => {
//     return () => {
//       fileUrlCache.current.forEach((url) => URL.revokeObjectURL(url));
//       fileUrlCache.current.clear();
//     };
//   }, []);

//   const debounceTimer = useRef(null);

//   const existingDatabaseNames = databases.map((db) => db.name.toLowerCase());

//   useEffect(() => {
//     setFinalSelectedImages(localFinalSelectedImages);
//   }, [localFinalSelectedImages, setFinalSelectedImages]);

//   // Compute cumulative indices for each file and frame using frameCounts
//   const computeCumulativeIndices = (files) => {
//     let currentIndex = 1; // Start numbering at 1
//     const indices = [];

//     files.forEach((file, index) => {
//       const fileId = `${file.name}`; // Match backend file_id
//       const frameCount = frameCounts[fileId]?.total_frames || 0;

//       console.log(`Computing indices for file: ${file.name}, Frame Count: ${frameCount}`);

//       if (file.type && file.type.startsWith("video/")) {
//         // For videos, the index range is from currentIndex to currentIndex + frameCount - 1
//         const startIndex = currentIndex;
//         const endIndex = startIndex + frameCount - 1;
//         indices.push({ startIndex, endIndex, frameCount });
//         currentIndex = endIndex + 1;
//       } else {
//         // For images, the index is just the currentIndex
//         indices.push({ startIndex: currentIndex, endIndex: currentIndex, frameCount: 0 });
//         currentIndex += 1;
//       }
//     });

//     console.log("Computed photonNumbering indices:", indices);
//     return indices;
//   };

//   // Check if the database contains any videos
//   const hasVideos = (files) => {
//     return files.some(file => file.type && file.type.startsWith("video/"));
//   };

//   // Fetch frame counts when selectedDatabaseIndex changes
//   useEffect(() => {
//     const fetchFrameCounts = async () => {
//       if (selectedDatabaseIndex !== null && databases[selectedDatabaseIndex]) {
//         const db = databases[selectedDatabaseIndex];
//         const userId = "user123"; // Replace with actual userId from your app context or auth system
//         // Replace spaces with underscores to match backend safe_database_name
//         const safeDatabaseName = db.name.replace(/\s+/g, "_");

//         // Skip fetching if the database only contains images (no videos)
//         if (!hasVideos(db.files)) {
//           console.log(`Database ${db.name} contains only images, skipping frame count fetch.`);
//           const fallbackFrameCounts = {};
//           db.files.forEach((file) => {
//             const fileId = `${file.name}`;
//             fallbackFrameCounts[fileId] = { total_frames: 0 };
//           });
//           setFrameCounts(fallbackFrameCounts);
//           setFetchError(null);
//           return;
//         }

//         // Wait if the database is still being created
//         if (isDatabaseCreating) {
//           console.log("Database creation in progress, delaying frame count fetch...");
//           await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
//         }

//         try {
//           const response = await fetch(`http://localhost:8000/dashboard/get-database-frame-counts/${userId}/${safeDatabaseName}`);
//           if (!response.ok) {
//             const errorText = await response.text();
//             throw new Error(`Failed to fetch frame counts: ${response.status} ${errorText}`);
//           }

//           const data = await response.json();
//           const newFrameCounts = {};
//           data.frame_counts.forEach((item) => {
//             newFrameCounts[item.file_id] = { total_frames: item.total_frames };
//           });
//           console.log("Fetched frame counts:", newFrameCounts);
//           setFrameCounts(newFrameCounts);
//           setFetchError(null);
//         } catch (error) {
//           console.error("Error fetching frame counts:", error.message);
//           setFetchError(error.message);
//           // Fallback to 0 frame counts if the fetch fails
//           const fallbackFrameCounts = {};
//           databases[selectedDatabaseIndex].files.forEach((file) => {
//             const fileId = `${file.name}`;
//             fallbackFrameCounts[fileId] = { total_frames: 0 };
//           });
//           setFrameCounts(fallbackFrameCounts);
//         }
//       }
//     };

//     fetchFrameCounts();
//   }, [selectedDatabaseIndex, databases, isDatabaseCreating]);

//   // Update photonNumbering when files or frameCounts changes
//   useEffect(() => {
//     if (selectedDatabaseIndex !== null && databases[selectedDatabaseIndex]) {
//       const indices = computeCumulativeIndices(databases[selectedDatabaseIndex].files);
//       setPhotonNumbering(indices);
//     }
//   }, [selectedDatabaseIndex, databases, frameCounts]);

//   const handleOpenCreateDatabase = useCallback(() => {
//     setShowCreateDbModal(true);
//     setShowPlusModal(false);
//     setIsCreateButtonClicked(true);
//   }, []);

//   const handleImageClick = useCallback((fileInfo) => {
//     setSelectedFileInfo({
//       fileUrl: fileInfo.fileUrl || (fileInfo instanceof File ? URL.createObjectURL(fileInfo) : null),
//       fileName: fileInfo.fileName || fileInfo.name,
//       fileSize: fileInfo.fileSize || fileInfo.size,
//       fileType: fileInfo.fileType || fileInfo.type,
//     });
//   }, [setSelectedFileInfo]);

//   const handleVideoClick = useCallback(async (file) => {
//     setIsVideoLoading(true);
//     try {
//       const fileUrl = getFileUrl(file);
//       const formData = new FormData();
//       formData.append("file", file);
//       const response = await fetch("http://localhost:8000/dashboard/extract-frames/", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error("Failed to extract frames");
//       }

//       const data = await response.json();
//       const fileId = `${file.name}-${file.lastModified}-${file.id || ''}`;
//       setVideoMetadata((prev) => ({
//         ...prev,
//         [fileId]: data.video_metadata,
//       }));

//       setVideoId(data.video_id);
//       setSelectedVideo(file);
//       setSelectedVideoUrl(fileUrl);
//       setShowVideoFrameModal(true);
//     } catch (error) {
//       console.error("Error extracting frames:", error);
//     } finally {
//       setIsVideoLoading(false);
//     }
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
//     setIsDatabaseCreating(true); // Set flag to indicate database creation is in progress
//     const filesWithIds = [...data.files, ...pendingImages]
//       .filter((file) => file && file.name && file.type && file instanceof File)
//       .map((file) => {
//         const id = generateUniqueId("db-");
//         return Object.assign(file, { id });
//       });

//     if (filesWithIds.length === 0) {
//       console.warn("No valid files to add to the database");
//       setIsDatabaseCreating(false);
//       return;
//     }

//     const newDatabase = {
//       name: data.databaseName,
//       files: filesWithIds,
//     };
//     setDatabases((prev) => [...prev, newDatabase]);
//     setLocalFinalSelectedImages(filesWithIds);
//     setSelectedDatabaseIndex(databases.length);
//     setPendingImages([]);
//     setIsDatabaseCreating(false); // Reset flag after database is created
//   }, [databases, pendingImages]);

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
//     if (!file || !file.type || !file.type.startsWith("video/")) return;
//     const fileId = `${file.name}-${file.lastModified}-${file.id || ''}`;
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
//           const response = await fetch("http://localhost:8000/dashboard/extract-frames/", {
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

//           const frames = data.frames.map((frame, index) => ({
//             ...frame,
//             frame_number: index + 1,
//           }));

//           setFrameData((prev) => ({
//             ...prev,
//             [fileId]: frames,
//           }));
//           setVideoMetadata((prev) => ({
//             ...prev,
//             [fileId]: data.video_metadata,
//           }));
//           console.log(`Frames extracted for ${file.name}:`, frames);
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
//     return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
//   }, []);

//   const formatFrameNumber = useCallback((number) => {
//     return `Frame_${String(number).padStart(3, "0")}`;
//   }, []);

//   const handleAddImage = (imageInfo) => {
//     if (!imageInfo.file) {
//       console.error("No file provided in imageInfo:", imageInfo);
//       return;
//     }

//     console.log("Adding image:", imageInfo.file);

//     if (!imageInfo.file.id) {
//       console.warn("File missing id, assigning new one:", imageInfo.file);
//       imageInfo.file.id = generateUniqueId("add-");
//     }

//     if (selectedDatabaseIndex !== null && databases[selectedDatabaseIndex]) {
//       setDatabases((prevDatabases) => {
//         const newDatabases = [...prevDatabases];
//         newDatabases[selectedDatabaseIndex] = {
//           ...newDatabases[selectedDatabaseIndex],
//           files: [...newDatabases[selectedDatabaseIndex].files, imageInfo.file],
//         };
//         return newDatabases;
//       });

//       setLocalFinalSelectedImages((prevImages) => [...prevImages, imageInfo.file]);
//     } else {
//       console.error("No database selected to add the image to.");
//     }
//   };

//   // Function to generate display name as "Database_A", "Database_B", etc.
//   const getDisplayName = (index) => {
//     const letter = String.fromCharCode(65 + index); // 65 is ASCII for 'A'
//     return `Database_${letter}`;
//   };

//   return (
//     <div className="upload-files-container">
//       {fetchError && (
//         <div style={{ color: "red", marginBottom: "10px" }}>
//           Error fetching frame counts: {fetchError}
//         </div>
//       )}
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
//                 {getDisplayName(index)} {/* Display "Database_A", "Database_B", etc. */}
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
//         <div className="top-navigation">
//           <div className="search-container">
//             <button
//               className="add-button"
//               onClick={databases.length > 0 ? () => setShowImageUploadModal(true) : undefined}
//               style={{ 
//                 backgroundColor: databases.length > 0 ? "#2E7D32" : "#ccc", 
//                 cursor: databases.length > 0 ? "pointer" : "not-allowed",
//                 display: "flex",
//               }}
//             >
//               +
//             </button>
//             <div className="search-input-wrapper">
//               <FaSearch className="search-icon" />
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => databases.length > 0 && setSearchQuery(e.target.value)}
//                 onFocus={() => setIsExpanded(true)}
//                 onBlur={() => setIsExpanded(false)}
//                 className="search-input"
//                 style={{
//                   width: isExpanded ? "200px" : "120px",
//                   transition: "width 0.3s ease",
//                   backgroundColor: databases.length > 0 ? "#fff" : "#f0f0f0",
//                   cursor: databases.length > 0 ? "text" : "not-allowed",
//                 }}
//                 disabled={databases.length === 0}
//               />
//             </div>
//           </div>
//           <div className="controls-container">
//             <button 
//               className="info-button" 
//               onClick={databases.length > 0 ? () => console.log("Info clicked") : undefined}
//               style={{ 
//                 cursor: databases.length > 0 ? "pointer" : "not-allowed",
//                 opacity: databases.length > 0 ? 1 : 0.5,
//               }}
//               disabled={databases.length === 0}
//             >
//               <FaInfoCircle className="info-icon" />
//             </button>
//             <button 
//               className="sort-button" 
//               onClick={databases.length > 0 ? handleSort : undefined}
//               style={{ 
//                 cursor: databases.length > 0 ? "pointer" : "not-allowed",
//                 opacity: databases.length > 0 ? 1 : 0.5,
//               }}
//               disabled={databases.length === 0}
//             >
//               <FaArrowUp className="sort-icon" />
//               <FaArrowDown className="sort-icon" />
//             </button>
//             <button 
//               className="toggle-button" 
//               onClick={databases.length > 0 ? toggleView : undefined}
//               style={{ 
//                 cursor: databases.length > 0 ? "pointer" : "not-allowed",
//                 opacity: databases.length > 0 ? 1 : 0.5,
//               }}
//               disabled={databases.length === 0}
//             >
//               {isGridView ? <FaTh className="toggle-icon" /> : <FaList className="toggle-icon" />}
//             </button>
//           </div>
//         </div>

//         {databases.length === 0 && !showCreateDbModal && !showPlusModal && (
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
//           <CombinedCreateDatabaseModal
//             onClose={() => {
//               setShowCreateDbModal(false);
//               setIsCreateButtonClicked(false);
//             }}
//             onFinish={handleDisplayDbNext}
//             existingDatabaseNames={existingDatabaseNames}
//           />
//         )}
//         {selectedDatabaseIndex !== null && (
//           <div className="gallery-container">
//             <h3 className="gallery-title">Final Gallery</h3>
//             <div className="gallery-items" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
//               {databases[selectedDatabaseIndex].files.map((file, index) => {
//                 const fileUrl = getFileUrl(file);
//                 const fileId = `${file.name}-${file.lastModified}-${file.id || ''}`;
//                 const isExpanded = expandedFrames[fileId] || false;
//                 const { startIndex, endIndex } = photonNumbering[index] || { startIndex: 0, endIndex: 0 };
//                 return (
//                   <GalleryItem
//                     key={file.id}
//                     file={file}
//                     fileUrl={fileUrl}
//                     fileId={fileId}
//                     isExpanded={isExpanded}
//                     frameData={frameData}
//                     videoMetadata={videoMetadata}
//                     cumulativeStartIndex={startIndex}
//                     cumulativeEndIndex={endIndex}
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
//         {isVideoLoading && (
//           <div
//             style={{
//               position: "fixed",
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%)",
//               backgroundColor: "rgba(0, 0, 0, 0.5)",
//               color: "white",
//               padding: "20px",
//               borderRadius: "5px",
//               zIndex: 1001,
//             }}
//           >
//             Loading video...
//           </div>
//         )}
//         {showVideoFrameModal && selectedVideo && (
//           <VideoFrameModal
//             file={selectedVideo}
//             fileUrl={selectedVideoUrl}
//             videoId={videoId}
//             videoMetadata={videoMetadata}
//             onClose={() => {
//               setShowVideoFrameModal(false);
//               setSelectedVideo(null);
//               setSelectedVideoUrl(null);
//               setVideoId(null);
//               setVideoMetadata({});
//             }}
//             onFrameSelect={(frameInfo) => {
//               handleImageClick(frameInfo);
//             }}
//           />
//         )}
//         {showImageUploadModal && (
//           <ImageUploadModal
//             onClose={() => setShowImageUploadModal(false)}
//             onSelect={handleAddImage}
//           />
//         )}
//       </div>
//     </div>
//   );
// });

// export default UploadFiles;
import React, { useState, useContext, useEffect, useCallback, useRef, useMemo } from "react";

import CombinedCreateDatabaseModal from "../modals/create-new-database/CombinedCreateDatabaseModal";
import VideoFrameModal from "./VideoFrameModal";
import ImageUploadModal from "../search-for/ImageUploadModal";
import { generateUniqueId } from "@/utils/idGenerator";

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
const GalleryItem = React.memo(
  ({
    file,
    fileUrl,
    fileId,
    isExpanded,
    frameData,
    videoMetadata,
    cumulativeStartIndex,
    cumulativeEndIndex,
    handleImageClick,
    handleVideoClick,
    handleMediaInfoClick,
    handleExpandFrames,
    formatFrameNumber,
    formatTime,
  }) => {
    const actualFrameCount = frameData[fileId] ? frameData[fileId].length : 0;

    // Memoize the video element to prevent re-renders unless fileUrl changes
    const videoElement = useMemo(() => {
      if (file && file.type && typeof file.type === "string" && file.type.startsWith("video/") && fileUrl) {
        return (
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
        );
      }
      return (
        <div style={{ width: "200px", height: "200px", backgroundColor: "#ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "#666", fontSize: "12px" }}>Video unavailable</p>
        </div>
      );
    }, [fileUrl, file]);

    // Validate file before rendering
    if (!file || !file.name || !file.type) {
      console.error("Invalid file in GalleryItem:", file);
      return (
        <div style={{ width: "220px", height: "300px", backgroundColor: "#ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "#666", fontSize: "12px" }}>Invalid file</p>
        </div>
      );
    }

    return (
      <div
        className="gallery-item"
        onClick={() => {
          if (file.type && file.type.startsWith("video/")) {
            handleVideoClick(file);
          } else {
            handleImageClick(file);
          }
        }}
        style={{ cursor: "pointer", transition: "all 0.3s ease", width: "220px" }}
      >
        {/* Display cumulative numbering for videos and images */}
        <div className="gallery-item-index">
          {file.type && file.type.startsWith("video/")
            ? `${cumulativeStartIndex}-${cumulativeEndIndex}`
            : `${cumulativeStartIndex}`}
        </div>
        <div className="gallery-item-media" style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {file.type && file.type.startsWith("image/") ? (
            fileUrl ? (
              <img src={fileUrl} alt={file.name} className="gallery-image" style={{ width: "200px", height: "200px", objectFit: "cover" }} onError={(e) => console.error("Image failed to load:", fileUrl)} />
            ) : (
              <div style={{ width: "200px", height: "200px", backgroundColor: "#ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "#666", fontSize: "12px" }}>Image unavailable</p>
              </div>
            )
          ) : file.type && file.type.startsWith("video/") ? (
            <>
              {videoElement}

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
                        style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          cursor: "pointer", 
                          width: "100%", 
                          justifyContent: "space-between" 
                        }}
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
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {/* Display cumulative index for each frame */}
                          <span style={{ marginRight: "10px", fontSize: "12px", fontWeight: "bold" }}>
                            {cumulativeStartIndex + frameIndex}
                          </span>
                          <img
                            src={frame.url}
                            alt={`Frame ${String(frame.frame_number).padStart(3, "0")}`}
                            className="gallery-frame-image"
                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                          />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                          <span style={{ fontSize: "12px", color: "#000" }}>
                            {file.name} {formatFrameNumber(frame.frame_number)}
                          </span>
                          <span
                            style={{ fontSize: "12px", color: "#007BFF", cursor: "pointer" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMediaInfoClick(file);
                            }}
                          >
                            IMAGE INFO
                          </span>
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
          ) : (
            <div style={{ width: "200px", height: "200px", backgroundColor: "#ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ color: "#666", fontSize: "12px" }}>Unsupported file type</p>
            </div>
          )}

          <div className="gallery-item-details" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="gallery-item-name" style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "12px", color: "#000" }}>{file.name}</span>
              {file.type && file.type.startsWith("video/") && videoMetadata && videoMetadata[fileId] && (
                <span style={{ fontSize: "12px", color: "#000" }}>
                  {formatTime(videoMetadata[fileId].duration)} | {actualFrameCount} frames
                </span>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <span
                className="gallery-item-media-info"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMediaInfoClick(file);
                }}
                style={{ fontSize: "12px", color: "#007BFF", cursor: "pointer" }}
              >
                Media info
              </span>
              {file.type && file.type.startsWith("video/") && (
                <span
                  className="gallery-item-expand-frames"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExpandFrames(file);
                  }}
                  style={{ fontSize: "12px", color: "#007BFF", cursor: "pointer" }}
                >
                  {isExpanded ? "Collapse frames" : "Expand Frames"} {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

const UploadFiles = React.memo(() => {
  const [showCreateDbModal, setShowCreateDbModal] = useState(false);
  const [showPlusModal, setShowPlusModal] = useState(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [pendingImages, setPendingImages] = useState([]);
  const [databases, setDatabases] = useState([]);
  const [selectedDatabaseIndex, setSelectedDatabaseIndex] = useState(null);
  const [showMediaInfoModal, setShowMediaInfoModal] = useState(false);
  const [mediaInfoFile, setMediaInfoFile] = useState(null);
  const [expandedFrames, setExpandedFrames] = useState({});
  const [frameData, setFrameData] = useState({});
  const [showVideoFrameModal, setShowVideoFrameModal] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [videoMetadata, setVideoMetadata] = useState({});
  const [photonNumbering, setPhotonNumbering] = useState([]);
  const [frameCounts, setFrameCounts] = useState({});
  const [fetchError, setFetchError] = useState(null);
  const [duplicateError, setDuplicateError] = useState(""); // State for duplicate image error message

  const { setSelectedImage, setUploadedFiles, finalSelectedImages, setFinalSelectedImages, setSelectedFileInfo } = useContext(ImageContext);
  const [localFinalSelectedImages, setLocalFinalSelectedImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAscending, setIsAscending] = useState(true);
  const [isGridView, setIsGridView] = useState(false);
  const [isCreateButtonClicked, setIsCreateButtonClicked] = useState(false);
  const [isDatabaseCreating, setIsDatabaseCreating] = useState(false);

  const fileUrlCache = useRef(new Map());

  const getFileUrl = (file) => {
    if (!file || !(file instanceof File)) {
      console.error("Invalid file object:", file);
      return null;
    }

    const fileId = `${file.name}-${file.lastModified}-${file.id || ''}`;
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
    return () => {
      fileUrlCache.current.forEach((url) => URL.revokeObjectURL(url));
      fileUrlCache.current.clear();
    };
  }, []);

  const debounceTimer = useRef(null);

  const existingDatabaseNames = databases.map((db) => db.name.toLowerCase());

  useEffect(() => {
    setFinalSelectedImages(localFinalSelectedImages);
  }, [localFinalSelectedImages, setFinalSelectedImages]);

  const computeCumulativeIndices = (files) => {
    let currentIndex = 1;
    const indices = [];

    files.forEach((file, index) => {
      const fileId = `${file.name}`;
      const frameCount = frameCounts[fileId]?.total_frames || 0;

      console.log(`Computing indices for file: ${file.name}, Frame Count: ${frameCount}`);

      if (file.type && file.type.startsWith("video/")) {
        const startIndex = currentIndex;
        const endIndex = startIndex + frameCount - 1;
        indices.push({ startIndex, endIndex, frameCount });
        currentIndex = endIndex + 1;
      } else {
        indices.push({ startIndex: currentIndex, endIndex: currentIndex, frameCount: 0 });
        currentIndex += 1;
      }
    });

    console.log("Computed photonNumbering indices:", indices);
    return indices;
  };

  const hasVideos = (files) => {
    return files.some(file => file.type && file.type.startsWith("video/"));
  };

  useEffect(() => {
    const fetchFrameCounts = async () => {
      if (selectedDatabaseIndex !== null && databases[selectedDatabaseIndex]) {
        const db = databases[selectedDatabaseIndex];
        const userId = "user123";
        const safeDatabaseName = db.name.replace(/\s+/g, "_");

        if (!hasVideos(db.files)) {
          console.log(`Database ${db.name} contains only images, skipping frame count fetch.`);
          const fallbackFrameCounts = {};
          db.files.forEach((file) => {
            const fileId = `${file.name}`;
            fallbackFrameCounts[fileId] = { total_frames: 0 };
          });
          setFrameCounts(fallbackFrameCounts);
          setFetchError(null);
          return;
        }

        if (isDatabaseCreating) {
          console.log("Database creation in progress, delaying frame count fetch...");
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        try {
          const response = await fetch(`http://localhost:8000/dashboard/get-database-frame-counts/${userId}/${safeDatabaseName}`);
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch frame counts: ${response.status} ${errorText}`);
          }

          const data = await response.json();
          const newFrameCounts = {};
          data.frame_counts.forEach((item) => {
            newFrameCounts[item.file_id] = { total_frames: item.total_frames };
          });
          console.log("Fetched frame counts:", newFrameCounts);
          setFrameCounts(newFrameCounts);
          setFetchError(null);
        } catch (error) {
          console.error("Error fetching frame counts:", error.message);
          setFetchError(error.message);
          const fallbackFrameCounts = {};
          databases[selectedDatabaseIndex].files.forEach((file) => {
            const fileId = `${file.name}`;
            fallbackFrameCounts[fileId] = { total_frames: 0 };
          });
          setFrameCounts(fallbackFrameCounts);
        }
      }
    };

    fetchFrameCounts();
  }, [selectedDatabaseIndex, databases, isDatabaseCreating]);

  useEffect(() => {
    if (selectedDatabaseIndex !== null && databases[selectedDatabaseIndex]) {
      const indices = computeCumulativeIndices(databases[selectedDatabaseIndex].files);
      setPhotonNumbering(indices);
    }
  }, [selectedDatabaseIndex, databases, frameCounts]);

  const handleOpenCreateDatabase = useCallback(() => {
    setShowCreateDbModal(true);
    setShowPlusModal(false);
    setIsCreateButtonClicked(true);
  }, []);

  const handleImageClick = useCallback((fileInfo) => {
    setSelectedFileInfo({
      fileUrl: fileInfo.fileUrl || (fileInfo instanceof File ? URL.createObjectURL(fileInfo) : null),
      fileName: fileInfo.fileName || fileInfo.name,
      fileSize: fileInfo.fileSize || fileInfo.size,
      fileType: fileInfo.fileType || fileInfo.type,
    });
  }, [setSelectedFileInfo]);

  const handleVideoClick = useCallback(async (file) => {
    setIsVideoLoading(true);
    try {
      const fileUrl = getFileUrl(file);
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("http://localhost:8000/dashboard/extract-frames/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to extract frames");
      }

      const data = await response.json();
      const fileId = `${file.name}-${file.lastModified}-${file.id || ''}`;
      setVideoMetadata((prev) => ({
        ...prev,
        [fileId]: data.video_metadata,
      }));

      setVideoId(data.video_id);
      setSelectedVideo(file);
      setSelectedVideoUrl(fileUrl);
      setShowVideoFrameModal(true);
    } catch (error) {
      console.error("Error extracting frames:", error);
    } finally {
      setIsVideoLoading(false);
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
    setIsDatabaseCreating(true);
    const filesWithIds = [...data.files, ...pendingImages]
      .filter((file) => file && file.name && file.type && file instanceof File)
      .map((file) => {
        const id = generateUniqueId("db-");
        return Object.assign(file, { id });
      });

    if (filesWithIds.length === 0) {
      console.warn("No valid files to add to the database");
      setIsDatabaseCreating(false);
      return;
    }

    const newDatabase = {
      name: data.databaseName,
      files: filesWithIds,
    };
    setDatabases((prev) => [...prev, newDatabase]);
    setLocalFinalSelectedImages(filesWithIds);
    setSelectedDatabaseIndex(databases.length);
    setPendingImages([]);
    setIsDatabaseCreating(false);
  }, [databases, pendingImages]);

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
    if (!file || !file.type || !file.type.startsWith("video/")) return;
    const fileId = `${file.name}-${file.lastModified}-${file.id || ''}`;
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
          const response = await fetch("http://localhost:8000/dashboard/extract-frames/", {
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

          const frames = data.frames.map((frame, index) => ({
            ...frame,
            frame_number: index + 1,
          }));

          setFrameData((prev) => ({
            ...prev,
            [fileId]: frames,
          }));
          setVideoMetadata((prev) => ({
            ...prev,
            [fileId]: data.video_metadata,
          }));
          console.log(`Frames extracted for ${file.name}:`, frames);
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
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }, []);

  const formatFrameNumber = useCallback((number) => {
    return `Frame_${String(number).padStart(3, "0")}`;
  }, []);

  const handleAddImage = (imageInfo) => {
    if (!imageInfo.file) {
      console.error("No file provided in imageInfo:", imageInfo);
      return;
    }

    console.log("Adding image:", imageInfo.file);

    if (!imageInfo.file.id) {
      console.warn("File missing id, assigning new one:", imageInfo.file);
      imageInfo.file.id = generateUniqueId("add-");
    }

    if (selectedDatabaseIndex !== null && databases[selectedDatabaseIndex]) {
      // Check for duplicate image by file name
      const isDuplicate = databases[selectedDatabaseIndex].files.some(
        (existingFile) => existingFile.name === imageInfo.file.name
      );

      if (isDuplicate) {
        setDuplicateError("This image is already in your database.");
        setTimeout(() => setDuplicateError(""), 3000); // Clear message after 3 seconds
        return;
      }

      setDatabases((prevDatabases) => {
        const newDatabases = [...prevDatabases];
        newDatabases[selectedDatabaseIndex] = {
          ...newDatabases[selectedDatabaseIndex],
          files: [...newDatabases[selectedDatabaseIndex].files, imageInfo.file],
        };
        return newDatabases;
      });

      setLocalFinalSelectedImages((prevImages) => [...prevImages, imageInfo.file]);
    } else {
      console.error("No database selected to add the image to.");
    }
  };

  const getDisplayName = (index) => {
    const letter = String.fromCharCode(65 + index);
    return `Database_${letter}`;
  };

  return (
    <div className="upload-files-container">
      {fetchError && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          Error fetching frame counts: {fetchError}
        </div>
      )}
      {duplicateError && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          {duplicateError}
        </div>
      )}
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
                {getDisplayName(index)}
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
        <div className="top-navigation">
          <div className="search-container">
            <button
              className="add-button"
              onClick={databases.length > 0 ? () => setShowImageUploadModal(true) : undefined}
              style={{ 
                backgroundColor: databases.length > 0 ? "#2E7D32" : "#ccc", 
                cursor: databases.length > 0 ? "pointer" : "not-allowed",
                display: "flex",
              }}
            >
              +
            </button>
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => databases.length > 0 && setSearchQuery(e.target.value)}
                onFocus={() => setIsExpanded(true)}
                onBlur={() => setIsExpanded(false)}
                className="search-input"
                style={{
                  width: isExpanded ? "200px" : "120px",
                  transition: "width 0.3s ease",
                  backgroundColor: databases.length > 0 ? "#fff" : "#f0f0f0",
                  cursor: databases.length > 0 ? "text" : "not-allowed",
                }}
                disabled={databases.length === 0}
              />
            </div>
          </div>
          <div className="controls-container">
            <button 
              className="info-button" 
              onClick={databases.length > 0 ? () => console.log("Info clicked") : undefined}
              style={{ 
                cursor: databases.length > 0 ? "pointer" : "not-allowed",
                opacity: databases.length > 0 ? 1 : 0.5,
              }}
              disabled={databases.length === 0}
            >
              <FaInfoCircle className="info-icon" />
            </button>
            <button 
              className="sort-button" 
              onClick={databases.length > 0 ? handleSort : undefined}
              style={{ 
                cursor: databases.length > 0 ? "pointer" : "not-allowed",
                opacity: databases.length > 0 ? 1 : 0.5,
              }}
              disabled={databases.length === 0}
            >
              <FaArrowUp className="sort-icon" />
              <FaArrowDown className="sort-icon" />
            </button>
            <button 
              className="toggle-button" 
              onClick={databases.length > 0 ? toggleView : undefined}
              style={{ 
                cursor: databases.length > 0 ? "pointer" : "not-allowed",
                opacity: databases.length > 0 ? 1 : 0.5,
              }}
              disabled={databases.length === 0}
            >
              {isGridView ? <FaTh className="toggle-icon" /> : <FaList className="toggle-icon" />}
            </button>
          </div>
        </div>

        {databases.length === 0 && !showCreateDbModal && !showPlusModal && (
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
          <CombinedCreateDatabaseModal
            onClose={() => {
              setShowCreateDbModal(false);
              setIsCreateButtonClicked(false);
            }}
            onFinish={handleDisplayDbNext}
            existingDatabaseNames={existingDatabaseNames}
          />
        )}
        {selectedDatabaseIndex !== null && (
          <div className="gallery-container">
            <h3 className="gallery-title">Final Gallery</h3>
            <div className="gallery-items" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {databases[selectedDatabaseIndex].files.map((file, index) => {
                const fileUrl = getFileUrl(file);
                const fileId = `${file.name}-${file.lastModified}-${file.id || ''}`;
                const isExpanded = expandedFrames[fileId] || false;
                const { startIndex, endIndex } = photonNumbering[index] || { startIndex: 0, endIndex: 0 };
                return (
                  <GalleryItem
                    key={file.id}
                    file={file}
                    fileUrl={fileUrl}
                    fileId={fileId}
                    isExpanded={isExpanded}
                    frameData={frameData}
                    videoMetadata={videoMetadata}
                    cumulativeStartIndex={startIndex}
                    cumulativeEndIndex={endIndex}
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
        {isVideoLoading && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              padding: "20px",
              borderRadius: "5px",
              zIndex: 1001,
            }}
          >
            Loading video...
          </div>
        )}
        {showVideoFrameModal && selectedVideo && (
          <VideoFrameModal
            file={selectedVideo}
            fileUrl={selectedVideoUrl}
            videoId={videoId}
            videoMetadata={videoMetadata}
            onClose={() => {
              setShowVideoFrameModal(false);
              setSelectedVideo(null);
              setSelectedVideoUrl(null);
              setVideoId(null);
              setVideoMetadata({});
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