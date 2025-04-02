// "use client";
// import { useState, useEffect, useContext } from "react"; // ✅ Add useContext

// import { useDropzone } from "react-dropzone";
// import {
//   Box,
//   VStack,
//   Button,
//   Text,
//   Input,
//   Image,
//   HStack,
//   Link,
// } from "@chakra-ui/react";
// import { FaCloudUploadAlt } from "react-icons/fa";

// import { ImageContext } from "@/contexts/ImageContext"; // ✅ Import context

// // Adjust these paths if needed, depending on your exact folder structure.
// import CreateNewDataBaseModal from "../modals/create-new-database/createNewDataBaseModal";
// import DisplayDataBaseModal from "../modals/create-new-database/displayDataBaseModal";
// import ImportMediaModal from "../modals/create-new-database/importMediaModal";
// // API endpoint
// const API_URL = "http://localhost:3001/databases";

// export default function UploadFiles() {
//   const [files, setFiles] = useState([]);
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [databaseName, setDatabaseName] = useState("");
//   const [databases, setDatabases] = useState([]);
//   const [showMonaLisa, setShowMonaLisa] = useState(false);
//   const [loadingMessage, setLoadingMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   // State to show/hide each modal in the chain
//   const [showCreateDbModal, setShowCreateDbModal] = useState(false);
//   const [showDisplayDbModal, setShowDisplayDbModal] = useState(false);
//   const [showImportMediaModal, setShowImportMediaModal] = useState(false);


//   // const router = useRouter();
//   const { setSelectedImage } = useContext(ImageContext); // ✅ Get function from context

//   // Fetch databases from backend on load
//   useEffect(() => {
//     console.log("Fetching databases from backend...");
//     const loadDatabases = async () => {
//       try {
//         const response = await fetch(API_URL);
//         if (!response.ok) throw new Error("Failed to fetch databases");
//         const data = await response.json();
//         setDatabases(data);
//         console.log("Fetched Databases:", data);
//       } catch (error) {
//         console.error("Error fetching databases:", error);
//       }
//     };
//     loadDatabases();
//   }, []);
//   // Handle file drop
//   const onDrop = (acceptedFiles) => {
//     if (!databaseName.trim()) {
//       setErrorMessage("Please enter a database name before uploading files.");
//       return;
//     }
//     console.log("Dropped files:", acceptedFiles);
//     if (acceptedFiles.length > 0) {
//       setShowMonaLisa(true);
//       setLoadingMessage("Files are loading...");
//       setTimeout(() => {
//         setShowMonaLisa(false);
//         setLoadingMessage("");
//         setFiles((prev) => [...prev, ...acceptedFiles]);
//       }, 3000);
//     }
//   };
//   // Handle name input
//   const handleDatabaseNameChange = (e) => {
//     setDatabaseName(e.target.value);
//     if (errorMessage) setErrorMessage("");
//   };
//   // Handle file selection
//   const handleSelectFile = (file) => {
//     console.log("Toggling file selection:", file);
//     setSelectedFiles((prev) =>
//       prev.includes(file) ? prev.filter((f) => f !== file) : [...prev, file]
//     );
//   };
//   // Handle file removal
//   const handleRemoveFile = (fileToRemove) => {
//     console.log("Removing file:", fileToRemove);
//     setFiles((prev) => prev.filter((file) => file !== fileToRemove));
//     setSelectedFiles((prev) => prev.filter((file) => file !== fileToRemove));
//   };
//   // Save database
//   const handleSaveDatabase = async () => {
//     if (!databaseName.trim()) {
//       setErrorMessage("Database name is required!");
//       return;
//     }
//     if (selectedFiles.length === 0) {
//       setErrorMessage("No files selected to save.");
//       return;
//     }
//     const newDatabase = {
//       name: databaseName,
//       files: selectedFiles.map((file) => file.name), // Store only file names
//     };
//     console.log("Saving Database:", newDatabase);
//     try {
//       const response = await fetch(API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newDatabase),
//       });
//       if (!response.ok) throw new Error("Failed to save database");
//       const savedData = await response.json();
//       console.log("Database saved successfully:", savedData);
//       setDatabases((prev) => [...prev, savedData]);
//       setDatabaseName("");
//       setFiles([]);
//       setSelectedFiles([]);
//     } catch (error) {
//       console.error("Error saving database:", error);
//     }
//   };
//   // Dropzone configuration
//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//     multiple: true,
//   });

//   // Navigate to searchFor.js with the selected image

//   // const handleSelectSingleImage = (file) => {
//   //   console.log("Navigating to SearchFor with file:", file);
//   //   const fileUrl = URL.createObjectURL(file);
//   //   router.push(`/search-for?image=${encodeURIComponent(fileUrl)}`);
//   // };

//   // Handle selecting an image
//   const handleSelectSingleImage = (file) => {
//     console.log("Selecting image for SearchFor:", file);
//     const fileUrl = URL.createObjectURL(file);
//     setSelectedImage(fileUrl); // ✅ Update context with selected image
//   };

//   return (
//     <VStack
//       spacing={6}
//       align="start"
//       w="full"
//       p={4}
//       borderRadius="lg"
//       bg="blue.100"
//       h="85vh"
//     >
//       <form style={{ width: "100%" }}>
//         {/* <Text fontSize="lg" fontWeight="bold" color="black">
//           Database Name
//         </Text> */}
//         {/* <Input
//           color="black"
//           placeholder="Enter a name for your database"
//           value={databaseName}
//           onChange={handleDatabaseNameChange}
//         /> */}
//         <Input
//           color="white.600"
//           placeholder="Search Within"
//           value={databaseName}
//           onChange={handleDatabaseNameChange}
//           borderRadius="2xl"
//           border="none"
//           bg="#3083F9"
//           boxShadow="sm"
//           // w="full"
//           _placeholder={{ color: "white" }} // Sets placeholder text color
//         />

//         {/* Placeholder Buttons */}
//         {/* <HStack w="full" spacing={4}>
//           <Button
//             w="40%"
//             colorScheme="gray"
//             variant="outline"
//             bg={"white"}
//             mt={8}
//             borderRadius={"2xl"}
//             border="none"
//             color={"black"}
//           >
//             Saved Database
//           </Button>

//           <Button
//             w="50%"
//             variant="ghost" // Makes background transparent
//             border="none"
//             mt={4}
//             fontSize="4xl" // Makes the "+" larger
//             color="#3083F9" // Sets text color
//             ml="-100px" // Adjust this value to move it further left
            
//           >
//             +
//           </Button>
//         </HStack> */}
//         <HStack w="full" spacing={4} flexWrap="nowrap" justify="start">
//           <Button
//             maxW="250px" // Prevents button from being too large
//             colorScheme="gray"
//             variant="outline"
//             bg="white"
//             mt={8}
//             borderRadius="2xl"
//             border="none"
//             color="black"
//             // ml={["0", "-20px", "-100px"]}
//           >
//             Saved Database
//           </Button>

//           <Button
//             w={["100%", "80%", "50%"]} // Adjusts width responsively
//             variant="ghost"
//             border="none"
//             mt={4}
//             fontSize={["2xl", "3xl", "4xl"]} // Scales size for different screens
//             color="#3083F9"
//             ml={["0", "-20px", "-100px"]} // Adjusts left margin responsively
//           >
//             +
//           </Button>
//         </HStack>

//         {errorMessage && (
//           <Text color="red.500" fontSize="sm" mt={2}>
//             {errorMessage}
//           </Text>
//         )}
//       </form>
//       <Box
//         {...getRootProps()}
//         p={4}
//         w="full"
//         mt={-5}
//         border="none"
//         borderColor="blue.400"
//         borderRadius="md"
//         bg="white"
//         textAlign="center"
//         cursor="pointer"
//         display="flex"
//         flexDirection="column"
//         alignItems="center"
//         justifyContent="center"
//       >
//         <FaCloudUploadAlt size={40} color="gray" />
//         <input {...getInputProps()} />
//         <Text color="black" mt={2}>
//           Drag and drop files here, or click to select files
//         </Text>
//       </Box>
//       {showMonaLisa && (
//         <Box textAlign="center" w="full">
//           <Text fontSize="lg" color="blue.500" mb={4}>
//             {loadingMessage}
//           </Text>
//           <Image
//             src="/images/logos/Mona_Lisa.jpg"
//             alt="Loading Mona Lisa"
//             boxSize="150px"
//             borderRadius="md"
//             objectFit="cover"
//             mx="auto"
//           />
//         </Box>
//       )}
//       {/* Display uploaded files with previews */}
//       {!showMonaLisa &&
//         files.map((file, index) => (
//           <Box
//             key={index}
//             display="flex"
//             alignItems="center"
//             w="full"
//             p={2}
//             border="1px solid"
//             borderColor="gray.300"
//             borderRadius="lg"
//             mb={2}
//             boxShadow="sm"
//             bg="white"
//           >
//             <input
//               type="checkbox"
//               checked={selectedFiles.includes(file)}
//               onChange={() => handleSelectFile(file)}
//               style={{ marginRight: "8px" }}
//             />
//             {file.type.startsWith("image/") ? (
//               <Image
//                 src={URL.createObjectURL(file)}
//                 alt={file.name}
//                 boxSize="80px"
//                 borderRadius="md"
//                 mr={3}
//                 cursor="pointer"
//                 onClick={() => handleSelectSingleImage(file)}
//               />
//             ) : file.type.startsWith("video/") ? (
//               <video
//                 src={URL.createObjectURL(file)}
//                 controls
//                 width="120"
//                 height="80"
//                 style={{ marginRight: "8px", borderRadius: "4px" }}
//               />
//             ) : (
//               <Text fontSize="sm" color="gray.700" w="full">
//                 {file.name}
//               </Text>
//             )}
//             <Box flex="1" ml={2}>
//               <Text fontWeight="bold" color="black">
//                 {file.name}
//               </Text>
//               <Text fontSize="sm" color="gray.500">
//                 Type: {file.type || "Unknown"}
//               </Text>
//               <Text fontSize="sm" color="gray.500">
//                 Size: {(file.size / 1024 / 1024).toFixed(2)} MB
//               </Text>
//             </Box>
//             <Button
//               onClick={() => handleRemoveFile(file)}
//               ml={2}
//               size="sm"
//               variant="outline"
//               colorScheme="red"
//               color={"black"}
//             >
//               Remove
//             </Button>
//           </Box>
//         ))}
//       {files.length > 0 && (
//         <Button
//           onClick={() => setFiles([])}
//           colorScheme="red"
//           variant="outline"
//           color={"black"}
//         >
//           Clear All Files
//         </Button>
//       )}
//       {selectedFiles.length > 0 && (
//         <Box
//           mt={4}
//           w="full"
//           p={4}
//           border="1px solid"
//           borderColor="gray.300"
//           borderRadius="md"
//         >
//           <Text fontSize="lg" fontWeight="bold" color="black" mb={2}>
//             Current Database: {databaseName}
//           </Text>
//           <Text fontWeight="bold" color="blue.500" mb={2}>
//             Selected Files:
//           </Text>
//           {selectedFiles.map((file, index) => (
//             <Text key={index} fontSize="sm" color="gray.500">
//               {file.name}
//             </Text>
//           ))}
//         </Box>
//       )}
//       {/* // this is the image that once you click on it will go to the searchFor  */}
//       {/* <Image src={URL.createObjectURL(file)} alt={file.name} boxSize="80px" borderRadius="md" mr={3} cursor="pointer" onClick={() => handleSelectSingleImage(file)} />
//        */}

//       <Button
//         colorScheme="blue"
//         variant="solid"
//         onClick={handleSaveDatabase}
//         disabled={!databaseName.trim() || selectedFiles.length === 0}
//       >
//         Save Database
//       </Button>
//       <div>
//       <h2>Upload Files</h2>

//       {/* Button that opens the FIRST modal */}
//       <button  onClick={() => setShowCreateDbModal(true)}  color="blue.500">
//         Create New Database
//       </button>

//       {/* 1. Create New Database Modal */}
//       {showCreateDbModal && (
//         <CreateNewDataBaseModal
//           // For closing this modal only
//           onClose={() => setShowCreateDbModal(false)}
//           // For moving on to the next modal
//           onNext={() => {
//             setShowCreateDbModal(false);
//             setShowDisplayDbModal(true);
//           }}
//         />
//       )}

//       {/* 2. Display Database Modal */}
//       {showDisplayDbModal && (
//         <DisplayDataBaseModal
//           onClose={() => setShowDisplayDbModal(false)}
//           onNext={() => {
//             setShowDisplayDbModal(false);
//             setShowImportMediaModal(true);
//           }}
//         />
//       )}

//       {/* 3. Import Media Modal */}
//       {showImportMediaModal && (
//         <ImportMediaModal
//           onClose={() => setShowImportMediaModal(false)}
//           // You could add onNext if there's a 4th step
//         />
//       )}
//     </div>

//     </VStack>
    
//   );
// }








// "use client";
// import React, { useState, useEffect, useRef, useContext } from "react";
// import { ImageContext } from "@/contexts/ImageContext"; // Import ImageContext to store frames
// import { FaFolder, FaFileImage, FaFileVideo, FaFileAlt, FaForward, FaBackward, FaSave } from "react-icons/fa";

// const DisplayDataBaseModal = ({ onClose, onNext, selectedFolders }) => {
//   // Access ImageContext to store saved frames
//   const { setFinalSelectedImages } = useContext(ImageContext);

//   // State to track folder selections (all folders initially checked)
//   const [folderSelections, setFolderSelections] = useState(
//     selectedFolders.reduce((acc, _, index) => {
//       acc[index] = true; // All folders start checked
//       return acc;
//     }, {})
//   );

//   // State to track selected files per folder
//   const [fileSelections, setFileSelections] = useState(
//     selectedFolders.reduce((acc, folder, folderIndex) => {
//       acc[folderIndex] = folder.files.reduce((fileAcc, _, fileIndex) => {
//         fileAcc[fileIndex] = true; // All files start checked
//         return fileAcc;
//       }, {});
//       return acc;
//     }, {})
//   );

//   // State for media info modal
//   const [showMediaInfoModal, setShowMediaInfoModal] = useState(false);
//   const [mediaInfoFile, setMediaInfoFile] = useState(null);

//   // State for open file modal
//   const [showOpenFileModal, setShowOpenFileModal] = useState(false);

//   // State to track selected preview (image or video)
//   const [selectedPreview, setSelectedPreview] = useState(null);
//   const [selectedFileIndex, setSelectedFileIndex] = useState(null); // Track selected file index

//   // State to track video duration and current time for the scrollbar
//   const [videoDuration, setVideoDuration] = useState(0);
//   const [currentTime, setCurrentTime] = useState(0);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null); // Hidden canvas for capturing frames

//   // State to store file URLs to prevent regeneration
//   const [fileUrls, setFileUrls] = useState({});

//   // State to store saved frames locally (timestamp, data URL, and source file ID)
//   const [savedFrames, setSavedFrames] = useState([]); // [{ timestamp: number, dataUrl: string, file: File, sourceFileId: string }]

//   // State to track database name sequence
//   const [databaseCount, setDatabaseCount] = useState(() => {
//     return parseInt(localStorage.getItem("databaseCount") || "1", 10);
//   });

//   // Generate file URLs once and store them
//   useEffect(() => {
//     const newFileUrls = {};
//     selectedFolders.forEach((folder, folderIndex) => {
//       folder.files.forEach((file, fileIndex) => {
//         const fileId = `${folderIndex}-${fileIndex}`;
//         if (!fileUrls[fileId]) {
//           const url = URL.createObjectURL(file);
//           newFileUrls[fileId] = url;
//         }
//       });
//     });
//     setFileUrls((prev) => ({ ...prev, ...newFileUrls }));

//     // Cleanup URLs on unmount
//     return () => {
//       Object.values(newFileUrls).forEach((url) => URL.revokeObjectURL(url));
//     };
//   }, [selectedFolders]);

//   // Update localStorage when databaseCount changes
//   useEffect(() => {
//     localStorage.setItem("databaseCount", databaseCount);
//   }, [databaseCount]);

//   // Toggles a folder selection and its files
//   const toggleFolderSelection = (folderIndex) => {
//     const isChecked = !folderSelections[folderIndex];

//     setFolderSelections((prev) => ({
//       ...prev,
//       [folderIndex]: isChecked,
//     }));

//     setFileSelections((prev) => ({
//       ...prev,
//       [folderIndex]: selectedFolders[folderIndex].files.reduce((fileAcc, _, fileIndex) => {
//         fileAcc[fileIndex] = isChecked;
//         return fileAcc;
//       }, {}),
//     }));
//   };

//   // Toggles an individual file selection inside a folder
//   const toggleFileSelection = (folderIndex, fileIndex) => {
//     setFileSelections((prev) => ({
//       ...prev,
//       [folderIndex]: {
//         ...prev[folderIndex],
//         [fileIndex]: !prev[folderIndex][fileIndex],
//       },
//     }));
//   };

//   // Expands the folders to show files
//   const [expanded, setExpanded] = useState({});

//   const toggleExpanded = (folderIndex) => {
//     setExpanded((prev) => ({
//       ...prev,
//       [folderIndex]: !prev[folderIndex],
//     }));
//   };

//   // Opens Media Info Modal
//   const handleMediaInfoClick = (file) => {
//     setMediaInfoFile(file);
//     setShowMediaInfoModal(true);
//   };

//   // Opens Open File Modal
//   const handleOpenFileClick = () => {
//     setShowOpenFileModal(true);
//   };

//   // Function to collect selected files and send them back with database name
//   const handleFinish = () => {
//     const selectedFiles = selectedFolders.flatMap((folder, folderIndex) =>
//       folder.files.filter((_, fileIndex) => fileSelections[folderIndex][fileIndex])
//     );

//     // Add saved frames to the final selected images in ImageContext
//     const frameFiles = savedFrames.map((frame) => frame.file);
//     setFinalSelectedImages((prev) => [...prev, ...frameFiles]);

//     const databaseName = `database ${String.fromCharCode(65 + databaseCount)}`; // B, C, D, ...
//     setDatabaseCount((prev) => prev + 1); // Increment for next database
//     onNext({ files: selectedFiles, databaseName, savedFrames }); // Pass saved frames to UploadFiles.js
//   };

//   // Helper function to get an icon based on file type (for non-preview cases)
//   const getFileIcon = (file) => {
//     if (file.type.startsWith("image/")) return <FaFileImage />;
//     if (file.type.startsWith("video/")) return <FaFileVideo />;
//     return <FaFileAlt />;
//   };

//   // Calculate the number of selected items in a folder
//   const getSelectedItemsCount = (folderIndex) => {
//     return Object.values(fileSelections[folderIndex]).filter(Boolean).length;
//   };

//   // Handle video metadata loading to get duration
//   const handleVideoLoadedMetadata = () => {
//     if (videoRef.current) {
//       setVideoDuration(videoRef.current.duration);
//       // Set canvas dimensions to match video
//       const canvas = canvasRef.current;
//       canvas.width = videoRef.current.videoWidth;
//       canvas.height = videoRef.current.videoHeight;
//     }
//   };

//   // Update current time as the video plays
//   const handleTimeUpdate = () => {
//     if (videoRef.current) {
//       setCurrentTime(videoRef.current.currentTime);
//     }
//   };

//   // Handle scrollbar change to seek video
//   const handleSeek = (event) => {
//     const newTime = parseFloat(event.target.value);
//     setCurrentTime(newTime);
//     if (videoRef.current) {
//       videoRef.current.currentTime = newTime;
//     }
//   };

//   // Handle fast-forward (skip forward 5 seconds)
//   const handleFastForward = () => {
//     if (videoRef.current) {
//       const newTime = Math.min(videoRef.current.currentTime + 5, videoDuration);
//       setCurrentTime(newTime);
//       videoRef.current.currentTime = newTime;
//     }
//   };

//   // Handle rewind (skip backward 5 seconds)
//   const handleRewind = () => {
//     if (videoRef.current) {
//       const newTime = Math.max(videoRef.current.currentTime - 5, 0);
//       setCurrentTime(newTime);
//       videoRef.current.currentTime = newTime;
//     }
//   };

//   // Format time for display (MM:SS)
//   const formatTime = (time) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
//   };

//   // Helper function to convert a data URL to a File object
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

//   // Handle saving the current frame
//   const handleSaveFrame = () => {
//     if (!videoRef.current || !canvasRef.current) return;

//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const context = canvas.getContext("2d");

//     // Draw the current video frame onto the canvas
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);

//     // Convert the canvas content to a data URL (JPEG format)
//     const dataUrl = canvas.toDataURL("image/jpeg", 0.8); // 0.8 is the quality (0 to 1)

//     // Create a File object from the data URL
//     const fileName = `frame-${formatTime(currentTime).replace(":", "-")}.jpg`;
//     const frameFile = dataURLtoFile(dataUrl, fileName);

//     // Get the source file ID of the current video
//     const sourceFile = selectedFolders
//       .flatMap((folder) => folder.files)
//       [selectedFileIndex];
//     const sourceFileId = `${sourceFile.name}-${sourceFile.lastModified}`;

//     // Store the frame with its timestamp and source file ID
//     setSavedFrames((prev) => [
//       ...prev,
//       { timestamp: currentTime, dataUrl, file: frameFile, sourceFileId },
//     ]);
//   };

//   // Handle deleting a frame
//   const handleDeleteFrame = (originalIndex) => {
//     setSavedFrames((prev) => prev.filter((_, i) => i !== originalIndex));
//   };

//   return (
//     <div className="modal" style={modalStyle}>
//       <h3>Display Database</h3>

//       <div style={{ display: "flex", width: "100%", height: "300px" }}>
//         {/* Left Side - Folders and Files */}
//         <div style={leftPanelStyle}>
//           {selectedFolders && selectedFolders.length > 0 ? (
//             selectedFolders.map((folder, folderIndex) => (
//               <div key={folderIndex} style={{ marginBottom: "10px" }}>
//                 <div style={headerStyle}>
//                   <input
//                     type="checkbox"
//                     checked={folderSelections[folderIndex]}
//                     onChange={() => toggleFolderSelection(folderIndex)}
//                     style={{ marginRight: "8px" }}
//                   />
//                   <FaFolder size={32} style={{ marginRight: "8px" }} />
//                   <div>
//                     <strong>{folder.folderName}</strong>
//                     <div style={{ fontSize: "0.9rem", color: "#555" }}>
//                       {getSelectedItemsCount(folderIndex)} item{getSelectedItemsCount(folderIndex) !== 1 ? "s" : ""} selected
//                     </div>
//                   </div>
//                 </div>

//                 <button onClick={() => toggleExpanded(folderIndex)} style={toggleButtonStyle}>
//                   {expanded[folderIndex] ? "Hide Files" : "Show Files"}
//                 </button>

//                 {expanded[folderIndex] && (
//                   <div style={filesContainerStyle}>
//                     {folder.files.map((file, fileIndex) => {
//                       const fileId = `${folderIndex}-${fileIndex}`;
//                       const fileUrl = fileUrls[fileId] || ""; // Use stored URL
//                       return (
//                         <div
//                           key={fileId}
//                           style={{
//                             ...fileItemStyle,
//                             opacity: fileSelections[folderIndex][fileIndex] ? 1 : 0.4,
//                           }}
//                         >
//                           <input
//                             type="checkbox"
//                             checked={fileSelections[folderIndex][fileIndex]}
//                             onChange={() => toggleFileSelection(folderIndex, fileIndex)}
//                             style={{ marginRight: "8px" }}
//                           />
//                           {file.type.startsWith("image/") ? (
//                             <img
//                               src={fileUrl}
//                               alt={file.name}
//                               style={{
//                                 maxWidth: "100px",
//                                 maxHeight: "100px",
//                                 marginRight: "8px",
//                                 cursor: "pointer",
//                               }}
//                               onClick={() => {
//                                 setSelectedPreview(fileUrl);
//                                 setSelectedFileIndex(
//                                   selectedFolders
//                                     .slice(0, folderIndex)
//                                     .reduce((acc, f) => acc + f.files.length, 0) + fileIndex
//                                 );
//                               }}
//                             />
//                           ) : file.type.startsWith("video/") ? (
//                             <video
//                               src={fileUrl}
//                               style={{
//                                 maxWidth: "100px",
//                                 maxHeight: "100px",
//                                 marginRight: "8px",
//                                 cursor: "pointer",
//                               }}
//                               muted // Mute to avoid autoplay sound
//                             >
//                               Your browser does not support the video tag.
//                             </video>
//                           ) : (
//                             <span style={{ marginRight: "8px" }}>{getFileIcon(file)}</span>
//                           )}
//                           <span
//                             style={{
//                               fontSize: "0.8rem",
//                               cursor: "pointer",
//                               color: selectedPreview === fileUrl ? "blue" : "black",
//                               fontWeight: selectedPreview === fileUrl ? "bold" : "normal",
//                             }}
//                             onClick={() => {
//                               setSelectedPreview(fileUrl);
//                               setSelectedFileIndex(
//                                 selectedFolders
//                                   .slice(0, folderIndex)
//                                   .reduce((acc, f) => acc + f.files.length, 0) + fileIndex
//                               );
//                             }}
//                           >
//                             {file.name}
//                           </span>
//                           <span
//                             style={{ marginLeft: "10px", color: "#3083F9", cursor: "pointer" }}
//                             onClick={() => handleMediaInfoClick(file)}
//                           >
//                             Media Info
//                           </span>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <p>No folders selected.</p>
//           )}
//         </div>

//         {/* Right Side - Image/Video Preview and Details */}
//         <div style={rightPanelStyle}>
//           {selectedPreview ? (
//             <>
//               {selectedFolders
//                 .flatMap((folder) => folder.files)
//                 .find((_, idx) => idx === selectedFileIndex)?.type.startsWith("video/") ? (
//                 <div style={{ width: "100%", height: "70%", position: "relative" }}>
//                   <video
//                     key={selectedPreview} // Ensure video element doesn't remount unnecessarily
//                     ref={videoRef}
//                     src={selectedPreview}
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       objectFit: "contain",
//                       border: "1px solid #ccc",
//                       borderRadius: "5px",
//                     }}
//                     muted // Mute to avoid autoplay sound
//                     onLoadedMetadata={handleVideoLoadedMetadata}
//                     onTimeUpdate={handleTimeUpdate}
//                   >
//                     Your browser does not support the video tag.
//                   </video>
//                   {/* Custom Scrollbar with Fast-Forward, Rewind, and Save Frame Buttons */}
//                   <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
//                     <button
//                       onClick={handleRewind}
//                       style={{
//                         background: "none",
//                         border: "none",
//                         cursor: "pointer",
//                         padding: "5px",
//                         display: "flex",
//                         alignItems: "center",
//                       }}
//                       title="Rewind 5 seconds"
//                     >
//                       <FaBackward size={20} color="#555" />
//                     </button>
//                     <span>{formatTime(currentTime)}</span>
//                     <input
//                       type="range"
//                       min="0"
//                       max={videoDuration || 0}
//                       step="0.1"
//                       value={currentTime}
//                       onChange={handleSeek}
//                       style={{
//                         flex: 1,
//                         cursor: "pointer",
//                       }}
//                     />
//                     <span>{formatTime(videoDuration)}</span>
//                     <button
//                       onClick={handleFastForward}
//                       style={{
//                         background: "none",
//                         border: "none",
//                         cursor: "pointer",
//                         padding: "5px",
//                         display: "flex",
//                         alignItems: "center",
//                       }}
//                       title="Fast-forward 5 seconds"
//                     >
//                       <FaForward size={20} color="#555" />
//                     </button>
//                     <button
//                       onClick={handleSaveFrame}
//                       style={{
//                         background: "none",
//                         border: "none",
//                         cursor: "pointer",
//                         padding: "5px",
//                         display: "flex",
//                         alignItems: "center",
//                       }}
//                       title="Save frame at current timestamp"
//                     >
//                       <FaSave size={20} color="#555" />
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <img
//                   src={selectedPreview}
//                   alt="Selected Preview"
//                   style={{
//                     width: "100%",
//                     height: "70%",
//                     objectFit: "contain",
//                     border: "1px solid #ccc",
//                     borderRadius: "5px",
//                   }}
//                 />
//               )}
//               <div style={{ marginTop: "40px", textAlign: "center" }}>
//                 <p>
//                   <strong>Name:</strong>{" "}
//                   {selectedFolders
//                     .flatMap((folder) => folder.files)
//                     [selectedFileIndex]?.name || "Unknown"}
//                 </p>
//                 <p>
//                   <strong>Size:</strong>{" "}
//                   {(
//                     (selectedFolders.flatMap((folder) => folder.files)[selectedFileIndex]?.size ||
//                       0) /
//                     (1024 * 1024)
//                   ).toFixed(2)}{" "}
//                   MB
//                 </p>
//                 <p>
//                   <strong>Frame:</strong> N/A
//                 </p>
//                 <p style={{ color: "#3083F9", cursor: "pointer" }} onClick={handleOpenFileClick}>
//                   Open File
//                 </p>
//               </div>
//             </>
//           ) : (
//             <p style={{ fontSize: "14px", color: "#666" }}>Click an image or video to preview</p>
//           )}
//         </div>
//       </div>

//       {/* Modal Buttons */}
//       <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
//         <button onClick={onClose} style={buttonStyle}>
//           Close
//         </button>
//         <button onClick={handleFinish} style={buttonStyle}>
//           Finish
//         </button>
//       </div>

//       {/* Media Info Modal */}
//       {showMediaInfoModal && (
//         <div style={modalOverlayStyle}>
//           <div style={modalContentStyle}>
//             <h3>Media Info</h3>
//             <p>I am a modal</p>
//             <button onClick={() => setShowMediaInfoModal(false)} style={buttonStyle}>
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Open File Modal */}
//       {showOpenFileModal && (
//         <div style={modalOverlayStyle}>
//           <div style={modalContentStyle}>
//             <h3>Open File</h3>
//             {selectedFolders
//               .flatMap((folder) => folder.files)
//               [selectedFileIndex]?.type.startsWith("video/") ? (
//               <>
//                 <p>Frames saved for this video:</p>
//                 {savedFrames.length > 0 ? (
//                   <div style={{ maxHeight: "300px", overflowY: "auto", marginTop: "10px" }}>
//                     <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
//                       {savedFrames
//                         .map((frame, originalIndex) => ({ frame, originalIndex })) // Keep track of original index
//                         .filter(
//                           ({ frame }) =>
//                             frame.sourceFileId ===
//                             `${selectedFolders
//                               .flatMap((folder) => folder.files)
//                               [selectedFileIndex]?.name}-${selectedFolders
//                               .flatMap((folder) => folder.files)
//                               [selectedFileIndex]?.lastModified}`
//                         )
//                         .map(({ frame, originalIndex }) => (
//                           <div key={originalIndex} style={{ textAlign: "center", position: "relative" }}>
//                             <img
//                               src={frame.dataUrl}
//                               alt={`Saved frame at ${formatTime(frame.timestamp)}`}
//                               style={{
//                                 width: "100px",
//                                 height: "100px",
//                                 objectFit: "cover",
//                                 borderRadius: "4px",
//                               }}
//                             />
//                             <p style={{ fontSize: "0.8rem", color: "#555" }}>
//                               {formatTime(frame.timestamp)}
//                             </p>
//                             <button
//                               onClick={() => handleDeleteFrame(originalIndex)} // Use original index
//                               style={{
//                                 position: "absolute",
//                                 top: "5px",
//                                 right: "5px",
//                                 background: "rgba(255, 0, 0, 0.7)",
//                                 border: "none",
//                                 borderRadius: "4px",
//                                 width: "20px",
//                                 height: "20px",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 cursor: "pointer",
//                                 color: "white",
//                                 fontSize: "12px",
//                                 fontWeight: "bold",
//                                 padding: "0",
//                               }}
//                               title="Delete frame"
//                             >
//                               X
//                             </button>
//                           </div>
//                         ))}
//                     </div>
//                   </div>
//                 ) : (
//                   <p style={{ fontSize: "0.9rem", color: "#666" }}>No frames saved for this video.</p>
//                 )}
//               </>
//             ) : (
//               <p>No frames available for images.</p>
//             )}
//             <button onClick={() => setShowOpenFileModal(false)} style={buttonStyle}>
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Hidden canvas for capturing frames */}
//       <canvas ref={canvasRef} style={{ display: "none" }} />
//     </div>
//   );
// };

// // Styles
// const modalStyle = {
//   position: "fixed",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   padding: "20px",
//   backgroundColor: "#fff",
//   border: "1px solid #ccc",
//   borderRadius: "8px",
//   zIndex: 1000,
//   width: "800px",
//   height: "500px",
// };

// const headerStyle = { display: "flex", alignItems: "center", marginBottom: "10px" };
// const toggleButtonStyle = { padding: "6px 12px", marginBottom: "10px" };
// const filesContainerStyle = {
//   maxHeight: "300px",
//   overflowY: "auto",
//   border: "1px solid #ddd",
//   padding: "10px",
//   borderRadius: "4px",
//   marginBottom: "10px",
// };

// const leftPanelStyle = {
//   flex: 1,
//   padding: "10px",
//   borderRight: "1px solid #ddd",
//   overflowY: "auto",
//   maxHeight: "400px",
// };

// const rightPanelStyle = {
//   flex: 1,
//   padding: "10px",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   justifyContent: "center",
//   backgroundColor: "#f9f9f9",
//   maxHeight: "400px",
// };

// const fileItemStyle = { display: "flex", alignItems: "center", marginBottom: "8px" };
// const buttonStyle = { padding: "8px 16px", marginRight: "10px" };

// const modalOverlayStyle = {
//   position: "fixed",
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   backgroundColor: "rgba(0, 0, 0, 0.5)",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   zIndex: 1100,
// };

// const modalContentStyle = {
//   backgroundColor: "#fff",
//   padding: "20px",
//   borderRadius: "8px",
//   textAlign: "center",
//   maxWidth: "600px",
//   width: "100%",
// };

// export default DisplayDataBaseModal;

// "use client";
// import React, { useState, useEffect, useRef, useContext } from "react";
// import { ImageContext } from "@/contexts/ImageContext"; // Import ImageContext to store frames
// import { FaFolder, FaFileImage, FaFileVideo, FaFileAlt, FaForward, FaBackward, FaSave } from "react-icons/fa";

// const DisplayDataBaseModal = ({ onClose, onNext, selectedFolders }) => {
//   // Access ImageContext to store saved frames
//   const { setFinalSelectedImages } = useContext(ImageContext);

//   // State to track folder selections (all folders initially checked)
//   const [folderSelections, setFolderSelections] = useState(
//     selectedFolders.reduce((acc, _, index) => {
//       acc[index] = true; // All folders start checked
//       return acc;
//     }, {})
//   );

//   // State to track selected files per folder
//   const [fileSelections, setFileSelections] = useState(
//     selectedFolders.reduce((acc, folder, folderIndex) => {
//       acc[folderIndex] = folder.files.reduce((fileAcc, _, fileIndex) => {
//         fileAcc[fileIndex] = true; // All files start checked
//         return fileAcc;
//       }, {});
//       return acc;
//     }, {})
//   );

//   // State for media info modal
//   const [showMediaInfoModal, setShowMediaInfoModal] = useState(false);
//   const [mediaInfoFile, setMediaInfoFile] = useState(null);

//   // State for open file modal
//   const [showOpenFileModal, setShowOpenFileModal] = useState(false);

//   // State to track selected preview (image or video)
//   const [selectedPreview, setSelectedPreview] = useState(null);
//   const [selectedFileIndex, setSelectedFileIndex] = useState(null); // Track selected file index

//   // State to track video duration and current time for the scrollbar
//   const [videoDuration, setVideoDuration] = useState(0);
//   const [currentTime, setCurrentTime] = useState(0);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null); // Hidden canvas for capturing frames

//   // State to store file URLs to prevent regeneration
//   const [fileUrls, setFileUrls] = useState({});

//   // State to store saved frames locally (timestamp, data URL, and source file ID)
//   const [savedFrames, setSavedFrames] = useState([]); // [{ timestamp: number, dataUrl: string, file: File, sourceFileId: string }]

//   // State to track database name sequence
//   const [databaseCount, setDatabaseCount] = useState(() => {
//     return parseInt(localStorage.getItem("databaseCount") || "1", 10);
//   });

//   // State to track which icon is clicked for the "clicked" effect
//   const [clickedIcon, setClickedIcon] = useState(null);

//   // Generate file URLs once and store them
//   useEffect(() => {
//     const newFileUrls = {};
//     selectedFolders.forEach((folder, folderIndex) => {
//       folder.files.forEach((file, fileIndex) => {
//         const fileId = `${folderIndex}-${fileIndex}`;
//         if (!fileUrls[fileId]) {
//           const url = URL.createObjectURL(file);
//           newFileUrls[fileId] = url;
//         }
//       });
//     });
//     setFileUrls((prev) => ({ ...prev, ...newFileUrls }));

//     // Cleanup URLs on unmount
//     return () => {
//       Object.values(newFileUrls).forEach((url) => URL.revokeObjectURL(url));
//     };
//   }, [selectedFolders]);

//   // Update localStorage when databaseCount changes
//   useEffect(() => {
//     localStorage.setItem("databaseCount", databaseCount);
//   }, [databaseCount]);

//   // Toggles a folder selection and its files
//   const toggleFolderSelection = (folderIndex) => {
//     const isChecked = !folderSelections[folderIndex];

//     setFolderSelections((prev) => ({
//       ...prev,
//       [folderIndex]: isChecked,
//     }));

//     setFileSelections((prev) => ({
//       ...prev,
//       [folderIndex]: selectedFolders[folderIndex].files.reduce((fileAcc, _, fileIndex) => {
//         fileAcc[fileIndex] = isChecked;
//         return fileAcc;
//       }, {}),
//     }));
//   };

//   // Toggles an individual file selection inside a folder
//   const toggleFileSelection = (folderIndex, fileIndex) => {
//     setFileSelections((prev) => ({
//       ...prev,
//       [folderIndex]: {
//         ...prev[folderIndex],
//         [fileIndex]: !prev[folderIndex][fileIndex],
//       },
//     }));
//   };

//   // Expands the folders to show files
//   const [expanded, setExpanded] = useState({});

//   const toggleExpanded = (folderIndex) => {
//     setExpanded((prev) => ({
//       ...prev,
//       [folderIndex]: !prev[folderIndex],
//     }));
//   };

//   // Opens Media Info Modal
//   const handleMediaInfoClick = (file) => {
//     setMediaInfoFile(file);
//     setShowMediaInfoModal(true);
//   };

//   // Opens Open File Modal
//   const handleOpenFileClick = () => {
//     setShowOpenFileModal(true);
//   };

//   // Function to collect selected files and send them back with database name
//   const handleFinish = () => {
//     const selectedFiles = selectedFolders.flatMap((folder, folderIndex) =>
//       folder.files.filter((_, fileIndex) => fileSelections[folderIndex][fileIndex])
//     );

//     // Add saved frames to the final selected images in ImageContext
//     const frameFiles = savedFrames.map((frame) => frame.file);
//     setFinalSelectedImages((prev) => [...prev, ...frameFiles]);

//     const databaseName = `database ${String.fromCharCode(65 + databaseCount)}`; // B, C, D, ...
//     setDatabaseCount((prev) => prev + 1); // Increment for next database
//     onNext({ files: selectedFiles, databaseName, savedFrames }); // Pass saved frames to UploadFiles.js
//   };

//   // Helper function to get an icon based on file type (for non-preview cases)
//   const getFileIcon = (file, iconId) => {
//     const baseStyle = {
//       color: "#4A88FF", // Default color from second modal
//       transition: "color 0.3s ease", // Smooth transition for hover/click
//     };

//     const hoverStyle = {
//       color: "#66B0FF", // Blue on hover
//     };

//     const clickedStyle = {
//       color: "#3B6CD9", // Darker blue when clicked
//     };

//     const iconStyle = {
//       ...baseStyle,
//       ...(clickedIcon === iconId ? clickedStyle : {}),
//     };

//     const handleMouseDown = () => setClickedIcon(iconId);
//     const handleMouseUp = () => setClickedIcon(null);

//     if (file.type.startsWith("image/"))
//       return (
//         <FaFileImage
//           style={iconStyle}
//           onMouseOver={(e) => (e.currentTarget.style.color = hoverStyle.color)}
//           onMouseOut={(e) => (e.currentTarget.style.color = clickedIcon === iconId ? clickedStyle.color : baseStyle.color)}
//           onMouseDown={handleMouseDown}
//           onMouseUp={handleMouseUp}
//         />
//       );
//     if (file.type.startsWith("video/"))
//       return (
//         <FaFileVideo
//           style={iconStyle}
//           onMouseOver={(e) => (e.currentTarget.style.color = hoverStyle.color)}
//           onMouseOut={(e) => (e.currentTarget.style.color = clickedIcon === iconId ? clickedStyle.color : baseStyle.color)}
//           onMouseDown={handleMouseDown}
//           onMouseUp={handleMouseUp}
//         />
//       );
//     return (
//       <FaFileAlt
//         style={iconStyle}
//         onMouseOver={(e) => (e.currentTarget.style.color = hoverStyle.color)}
//         onMouseOut={(e) => (e.currentTarget.style.color = clickedIcon === iconId ? clickedStyle.color : baseStyle.color)}
//         onMouseDown={handleMouseDown}
//         onMouseUp={handleMouseUp}
//       />
//     );
//   };

//   // Calculate the number of selected items in a folder
//   const getSelectedItemsCount = (folderIndex) => {
//     return Object.values(fileSelections[folderIndex]).filter(Boolean).length;
//   };

//   // Handle video metadata loading to get duration
//   const handleVideoLoadedMetadata = () => {
//     if (videoRef.current) {
//       setVideoDuration(videoRef.current.duration);
//       // Set canvas dimensions to match video
//       const canvas = canvasRef.current;
//       canvas.width = videoRef.current.videoWidth;
//       canvas.height = videoRef.current.videoHeight;
//     }
//   };

//   // Update current time as the video plays
//   const handleTimeUpdate = () => {
//     if (videoRef.current) {
//       setCurrentTime(videoRef.current.currentTime);
//     }
//   };

//   // Handle scrollbar change to seek video
//   const handleSeek = (event) => {
//     const newTime = parseFloat(event.target.value);
//     setCurrentTime(newTime);
//     if (videoRef.current) {
//       videoRef.current.currentTime = newTime;
//     }
//   };

//   // Handle fast-forward (skip forward 5 seconds)
//   const handleFastForward = () => {
//     if (videoRef.current) {
//       const newTime = Math.min(videoRef.current.currentTime + 5, videoDuration);
//       setCurrentTime(newTime);
//       videoRef.current.currentTime = newTime;
//     }
//   };

//   // Handle rewind (skip backward 5 seconds)
//   const handleRewind = () => {
//     if (videoRef.current) {
//       const newTime = Math.max(videoRef.current.currentTime - 5, 0);
//       setCurrentTime(newTime);
//       videoRef.current.currentTime = newTime;
//     }
//   };

//   // Format time for display (MM:SS)
//   const formatTime = (time) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
//   };

//   // Helper function to convert a data URL to a File object
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

//   // Handle saving the current frame
//   const handleSaveFrame = () => {
//     if (!videoRef.current || !canvasRef.current) return;

//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const context = canvas.getContext("2d");

//     // Draw the current video frame onto the canvas
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);

//     // Convert the canvas content to a data URL (JPEG format)
//     const dataUrl = canvas.toDataURL("image/jpeg", 0.8); // 0.8 is the quality (0 to 1)

//     // Create a File object from the data URL
//     const fileName = `frame-${formatTime(currentTime).replace(":", "-")}.jpg`;
//     const frameFile = dataURLtoFile(dataUrl, fileName);

//     // Get the source file ID of the current video
//     const sourceFile = selectedFolders
//       .flatMap((folder) => folder.files)
//       [selectedFileIndex];
//     const sourceFileId = `${sourceFile.name}-${sourceFile.lastModified}`;

//     // Store the frame with its timestamp and source file ID
//     setSavedFrames((prev) => [
//       ...prev,
//       { timestamp: currentTime, dataUrl, file: frameFile, sourceFileId },
//     ]);
//   };

//   // Handle deleting a frame
//   const handleDeleteFrame = (originalIndex) => {
//     setSavedFrames((prev) => prev.filter((_, i) => i !== originalIndex));
//   };

//   return (
//     <div className="modal" style={modalStyle}>
//       <div style={blueBarStyle}>
//         <h3 style={{ color: "black", margin: 0, fontSize: 15 }}>
//           New Database Settings
//         </h3>
//         <button onClick={onClose} style={closeButtonStyle}>
//           ×
//         </button>
//       </div>

//       <div style={{ display: "flex", width: "100%", height: "300px" }}>
//         {/* Left Side - Folders and Files */}
//         <div style={leftPanelStyle}>
//           {selectedFolders && selectedFolders.length > 0 ? (
//             selectedFolders.map((folder, folderIndex) => (
//               <div key={folderIndex} style={{ marginBottom: "10px" }}>
//                 <div style={headerStyle}>
//                   <div style={{ display: "flex", alignItems: "center" }}>
//                     <input
//                       type="checkbox"
//                       checked={folderSelections[folderIndex] || false}
//                       onChange={() => toggleFolderSelection(folderIndex)}
//                       style={{ marginRight: "8px" }}
//                     />
//                     <FaFolder
//                       size={32}
//                       style={{
//                         marginRight: "8px",
//                         color: "#4A88FF",
//                         transition: "color 0.3s ease",
//                       }}
//                       onMouseOver={(e) => (e.currentTarget.style.color = "#66B0FF")}
//                       onMouseOut={(e) =>
//                         (e.currentTarget.style.color =
//                           clickedIcon === `folder-${folderIndex}` ? "#3B6CD9" : "#4A88FF")
//                       }
//                       onMouseDown={() => setClickedIcon(`folder-${folderIndex}`)}
//                       onMouseUp={() => setClickedIcon(null)}
//                     />
//                     <div>
//                       <strong style={{ color: "#000000" }}>{folder.folderName}</strong>
//                       <div style={{ fontSize: "0.9rem", color: "#555" }}>
//                         {getSelectedItemsCount(folderIndex)} item
//                         {getSelectedItemsCount(folderIndex) !== 1 ? "s" : ""} selected
//                       </div>
//                     </div>
//                   </div>
//                   <div style={{ display: "flex", alignItems: "center" }}>
//                     <button
//                       onClick={() => toggleExpanded(folderIndex)}
//                       style={{
//                         ...toggleButtonStyle,
//                         backgroundColor: "#4A88FF",
//                         color: "#FFFFFF",
//                       }}
//                     >
//                       {expanded[folderIndex] ? " ▲" : " ▼"}
//                     </button>
//                   </div>
//                 </div>

//                 {expanded[folderIndex] && (
//                   <div style={filesContainerStyle}>
//                     {folder.files.map((file, fileIndex) => {
//                       const fileId = `${folderIndex}-${fileIndex}`;
//                       const fileUrl = fileUrls[fileId] || ""; // Use stored URL
//                       return (
//                         <div
//                           key={fileId}
//                           style={{
//                             ...fileItemStyle,
//                             opacity: fileSelections[folderIndex][fileIndex] ? 1 : 0.4,
//                           }}
//                         >
//                           <input
//                             type="checkbox"
//                             checked={fileSelections[folderIndex][fileIndex]}
//                             onChange={() => toggleFileSelection(folderIndex, fileIndex)}
//                             style={{ marginRight: "8px" }}
//                           />
//                           {file.type.startsWith("image/") ? (
//                             <img
//                               src={fileUrl}
//                               alt={file.name}
//                               style={{
//                                 maxWidth: "100px",
//                                 maxHeight: "100px",
//                                 marginRight: "8px",
//                                 cursor: "pointer",
//                               }}
//                               onClick={() => {
//                                 setSelectedPreview(fileUrl);
//                                 setSelectedFileIndex(
//                                   selectedFolders
//                                     .slice(0, folderIndex)
//                                     .reduce((acc, f) => acc + f.files.length, 0) + fileIndex
//                                 );
//                               }}
//                             />
//                           ) : file.type.startsWith("video/") ? (
//                             <video
//                               src={fileUrl}
//                               style={{
//                                 maxWidth: "100px",
//                                 maxHeight: "100px",
//                                 marginRight: "8px",
//                                 cursor: "pointer",
//                               }}
//                               muted // Mute to avoid autoplay sound
//                             >
//                               Your browser does not support the video tag.
//                             </video>
//                           ) : (
//                             <span style={{ marginRight: "8px" }}>
//                               {getFileIcon(file, `file-${fileId}`)}
//                             </span>
//                           )}
//                           <span
//                             style={{
//                               fontSize: "0.8rem",
//                               cursor: "pointer",
//                               color: selectedPreview === fileUrl ? "blue" : "#000000",
//                               fontWeight: selectedPreview === fileUrl ? "bold" : "normal",
//                             }}
//                             onClick={() => {
//                               setSelectedPreview(fileUrl);
//                               setSelectedFileIndex(
//                                 selectedFolders
//                                   .slice(0, folderIndex)
//                                   .reduce((acc, f) => acc + f.files.length, 0) + fileIndex
//                               );
//                             }}
//                           >
//                             {file.name}
//                           </span>
//                           <span
//                             style={{ marginLeft: "10px", color: "#3083F9", cursor: "pointer" }}
//                             onClick={() => handleMediaInfoClick(file)}
//                           >
//                             Media Info
//                           </span>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <p style={{ color: "#000000" }}>No folders selected.</p>
//           )}
//         </div>

//         {/* Right Side - Image/Video Preview and Details */}
//         <div style={rightPanelStyle}>
//           {selectedPreview ? (
//             <>
//               {selectedFolders
//                 .flatMap((folder) => folder.files)
//                 .find((_, idx) => idx === selectedFileIndex)?.type.startsWith("video/") ? (
//                 <div style={{ width: "100%", height: "70%", position: "relative" }}>
//                   <video
//                     key={selectedPreview} // Ensure video element doesn't remount unnecessarily
//                     ref={videoRef}
//                     src={selectedPreview}
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       objectFit: "contain",
//                       border: "1px solid #ccc",
//                       borderRadius: "5px",
//                     }}
//                     muted // Mute to avoid autoplay sound
//                     onLoadedMetadata={handleVideoLoadedMetadata}
//                     onTimeUpdate={handleTimeUpdate}
//                   >
//                     Your browser does not support the video tag.
//                   </video>
//                   {/* Custom Scrollbar with Fast-Forward, Rewind, and Save Frame Buttons */}
//                   <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
//                     <button
//                       onClick={handleRewind}
//                       style={{
//                         background: "none",
//                         border: "none",
//                         cursor: "pointer",
//                         padding: "5px",
//                         display: "flex",
//                         alignItems: "center",
//                       }}
//                       title="Rewind 5 seconds"
//                     >
//                       <FaBackward
//                         size={20}
//                         style={{
//                           color: "#555",
//                           transition: "color 0.3s ease",
//                         }}
//                         onMouseOver={(e) => (e.currentTarget.style.color = "#66B0FF")}
//                         onMouseOut={(e) =>
//                           (e.currentTarget.style.color =
//                             clickedIcon === "rewind" ? "#3B6CD9" : "#555")
//                         }
//                         onMouseDown={() => setClickedIcon("rewind")}
//                         onMouseUp={() => setClickedIcon(null)}
//                       />
//                     </button>
//                     <span style={{ color: "#000000" }}>{formatTime(currentTime)}</span>
//                     <input
//                       type="range"
//                       min="0"
//                       max={videoDuration || 0}
//                       step="0.1"
//                       value={currentTime}
//                       onChange={handleSeek}
//                       style={{
//                         flex: 1,
//                         cursor: "pointer",
//                       }}
//                     />
//                     <span style={{ color: "#000000" }}>{formatTime(videoDuration)}</span>
//                     <button
//                       onClick={handleFastForward}
//                       style={{
//                         background: "none",
//                         border: "none",
//                         cursor: "pointer",
//                         padding: "5px",
//                         display: "flex",
//                         alignItems: "center",
//                       }}
//                       title="Fast-forward 5 seconds"
//                     >
//                       <FaForward
//                         size={20}
//                         style={{
//                           color: "#555",
//                           transition: "color 0.3s ease",
//                         }}
//                         onMouseOver={(e) => (e.currentTarget.style.color = "#66B0FF")}
//                         onMouseOut={(e) =>
//                           (e.currentTarget.style.color =
//                             clickedIcon === "fastforward" ? "#3B6CD9" : "#555")
//                         }
//                         onMouseDown={() => setClickedIcon("fastforward")}
//                         onMouseUp={() => setClickedIcon(null)}
//                       />
//                     </button>
//                     <button
//                       onClick={handleSaveFrame}
//                       style={{
//                         background: "none",
//                         border: "none",
//                         cursor: "pointer",
//                         padding: "5px",
//                         display: "flex",
//                         alignItems: "center",
//                       }}
//                       title="Save frame at current timestamp"
//                     >
//                       <FaSave
//                         size={20}
//                         style={{
//                           color: "#555",
//                           transition: "color 0.3s ease",
//                         }}
//                         onMouseOver={(e) => (e.currentTarget.style.color = "#66B0FF")}
//                         onMouseOut={(e) =>
//                           (e.currentTarget.style.color =
//                             clickedIcon === "saveframe" ? "#3B6CD9" : "#555")
//                         }
//                         onMouseDown={() => setClickedIcon("saveframe")}
//                         onMouseUp={() => setClickedIcon(null)}
//                       />
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <img
//                   src={selectedPreview}
//                   alt="Selected Preview"
//                   style={{
//                     width: "100%",
//                     height: "70%",
//                     objectFit: "contain",
//                     border: "1px solid #ccc",
//                     borderRadius: "5px",
//                   }}
//                 />
//               )}
//               <div style={{ marginTop: "40px", textAlign: "center", color: "#000000" }}>
//                 <p>
//                   <strong>Name:</strong>{" "}
//                   {selectedFolders
//                     .flatMap((folder) => folder.files)
//                     [selectedFileIndex]?.name || "Unknown"}
//                 </p>
//                 <p>
//                   <strong>Size:</strong>{" "}
//                   {(
//                     (selectedFolders.flatMap((folder) => folder.files)[selectedFileIndex]?.size ||
//                       0) /
//                     (1024 * 1024)
//                   ).toFixed(2)}{" "}
//                   MB
//                 </p>
//                 <p>
//                   <strong>Frame:</strong> N/A
//                 </p>
//                 <p style={{ color: "#3083F9", cursor: "pointer" }} onClick={handleOpenFileClick}>
//                   Open File
//                 </p>
//               </div>
//             </>
//           ) : (
//             <p style={{ fontSize: "14px", color: "#000000" }}>
//               Click an image or video to preview
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Modal Buttons */}
//       <div style={buttonContainerStyle}>
//         <button
//           onClick={onClose}
//           style={{
//             ...buttonStyle,
//             backgroundColor: "#E8E8E8",
//             color: "black",
//             width: "220px",
//             borderRadius: "20px",
//           }}
//         >
//           Cancel
//         </button>
//         <button
//           onClick={handleFinish}
//           style={{
//             ...buttonStyle,
//             backgroundColor: "#4A88FF",
//             color: "#FFFFFF",
//             width: "220px",
//             borderRadius: "20px",
//           }}
//         >
//           Create Database
//         </button>
//       </div>

//       {/* Media Info Modal */}
//       {showMediaInfoModal && (
//         <div style={modalOverlayStyle}>
//           <div style={modalContentStyle}>
//             <h3 style={{ color: "#000000" }}>Media Info</h3>
//             <p style={{ color: "#000000" }}>
//               {mediaInfoFile ? `File Name: ${mediaInfoFile.name}` : "No file selected."}
//             </p>
//             <button
//               onClick={() => setShowMediaInfoModal(false)}
//               style={{
//                 ...buttonStyle,
//                 backgroundColor: "#4CAF50",
//                 color: "#FFFFFF",
//               }}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Open File Modal */}
//       {showOpenFileModal && (
//         <div style={modalOverlayStyle}>
//           <div style={modalContentStyle}>
//             <h3 style={{ color: "#000000" }}>Open File</h3>
//             {selectedFolders
//               .flatMap((folder) => folder.files)
//               [selectedFileIndex]?.type.startsWith("video/") ? (
//               <>
//                 <p style={{ color: "#000000" }}>Frames saved for this video:</p>
//                 {savedFrames.length > 0 ? (
//                   <div style={{ maxHeight: "300px", overflowY: "auto", marginTop: "10px" }}>
//                     <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
//                       {savedFrames
//                         .map((frame, originalIndex) => ({ frame, originalIndex }))
//                         .filter(
//                           ({ frame }) =>
//                             frame.sourceFileId ===
//                             `${selectedFolders
//                               .flatMap((folder) => folder.files)
//                               [selectedFileIndex]?.name}-${selectedFolders
//                               .flatMap((folder) => folder.files)
//                               [selectedFileIndex]?.lastModified}`
//                         )
//                         .map(({ frame, originalIndex }) => (
//                           <div key={originalIndex} style={{ textAlign: "center", position: "relative" }}>
//                             <img
//                               src={frame.dataUrl}
//                               alt={`Saved frame at ${formatTime(frame.timestamp)}`}
//                               style={{
//                                 width: "100px",
//                                 height: "100px",
//                                 objectFit: "cover",
//                                 borderRadius: "4px",
//                               }}
//                             />
//                             <p style={{ fontSize: "0.8rem", color: "#555" }}>
//                               {formatTime(frame.timestamp)}
//                             </p>
//                             <button
//                               onClick={() => handleDeleteFrame(originalIndex)}
//                               style={{
//                                 position: "absolute",
//                                 top: "5px",
//                                 right: "5px",
//                                 background: "rgba(255, 0, 0, 0.7)",
//                                 border: "none",
//                                 borderRadius: "4px",
//                                 width: "20px",
//                                 height: "20px",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 cursor: "pointer",
//                                 color: "white",
//                                 fontSize: "12px",
//                                 fontWeight: "bold",
//                                 padding: "0",
//                               }}
//                               title="Delete frame"
//                             >
//                               X
//                             </button>
//                           </div>
//                         ))}
//                     </div>
//                   </div>
//                 ) : (
//                   <p style={{ fontSize: "0.9rem", color: "#666" }}>No frames saved for this video.</p>
//                 )}
//               </>
//             ) : (
//               <p style={{ color: "#000000" }}>No frames available for images.</p>
//             )}
//             <button
//               onClick={() => setShowOpenFileModal(false)}
//               style={{
//                 ...buttonStyle,
//                 backgroundColor: "#4CAF50",
//                 color: "#FFFFFF",
//               }}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Hidden canvas for capturing frames */}
//       <canvas ref={canvasRef} style={{ display: "none" }} />
//     </div>
//   );
// };

// // Styles (Merged from the second DisplayDataBaseModal)
// const modalStyle = {
//   position: "fixed",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   padding: "20px",
//   backgroundColor: "white",
//   border: "1px solid #4A88FF",
//   borderRadius: "8px",
//   zIndex: 1000,
//   width: "900px",
//   height: "500px",
//   color: "#000000",
//   display: "flex",
//   flexDirection: "column",
// };

// const blueBarStyle = {
//   width: "100%",
//   backgroundColor: "#EEF2FF",
//   borderRadius: "8px 8px 0 0",
//   padding: "10px 20px",
//   display: "flex",
//   alignItems: "flex-start",
//   position: "relative",
//   minHeight: "40px",
// };

// const closeButtonStyle = {
//   position: "absolute",
//   top: "0",
//   right: "0",
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
//   padding: "10px",
//   paddingBottom: "10px",
//   margin: "10px",
// };

// const headerStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   marginBottom: "10px",
//   width: "100%",
// };

// const toggleButtonStyle = {
//   padding: "6px 12px",
//   border: "none",
//   borderRadius: "4px",
//   cursor: "pointer",
// };

// const filesContainerStyle = {
//   maxHeight: "300px",
//   overflowY: "auto",
//   border: "1px solid #4A88FF",
//   padding: "10px",
//   borderRadius: "4px",
//   marginBottom: "10px",
// };

// const leftPanelStyle = {
//   flex: 1,
//   padding: "10px",
//   borderRight: "1px solid #4A88FF",
//   overflowY: "auto",
//   maxHeight: "400px",
// };

// const rightPanelStyle = {
//   flex: 1,
//   padding: "10px",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   justifyContent: "center",
//   backgroundColor: "#F0F8FF",
//   maxHeight: "400px",
// };

// const fileItemStyle = {
//   display: "flex",
//   alignItems: "center",
//   marginBottom: "8px",
// };

// const buttonStyle = {
//   padding: "8px 16px",
//   marginLeft: "10px",
//   border: "none",
//   cursor: "pointer",
// };

// const buttonContainerStyle = {
//   marginTop: "auto",
//   display: "flex",
//   justifyContent: "flex-end",
//   padding: "10px 0",
// };

// const modalOverlayStyle = {
//   position: "fixed",
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   backgroundColor: "rgba(0, 0, 0, 0.5)",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   zIndex: 1100,
// };

// const modalContentStyle = {
//   backgroundColor: "#E6FFE6",
//   padding: "20px",
//   borderRadius: "8px",
//   textAlign: "center",
//   border: "1px solid #4CAF50",
//   color: "#000000",
// };

// export default DisplayDataBaseModal;

 "use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import { ImageContext } from "@/contexts/ImageContext";
import { FaFolder, FaFileImage, FaFileVideo, FaFileAlt, FaForward, FaBackward, FaSave } from "react-icons/fa";

const DisplayDataBaseModal = ({ onClose, onNext, selectedFolders }) => {
  const { setFinalSelectedImages } = useContext(ImageContext);

  const [folderSelections, setFolderSelections] = useState(
    selectedFolders.reduce((acc, _, index) => {
      acc[index] = true;
      return acc;
    }, {})
  );

  const [fileSelections, setFileSelections] = useState(
    selectedFolders.reduce((acc, folder, folderIndex) => {
      acc[folderIndex] = folder.files.reduce((fileAcc, _, fileIndex) => {
        fileAcc[fileIndex] = true;
        return fileAcc;
      }, {});
      return acc;
    }, {})
  );

  const [showMediaInfoModal, setShowMediaInfoModal] = useState(false);
  const [mediaInfoFile, setMediaInfoFile] = useState(null);
  const [showOpenFileModal, setShowOpenFileModal] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [selectedFileIndex, setSelectedFileIndex] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [savedFrames, setSavedFrames] = useState([]);
  const [databaseCount, setDatabaseCount] = useState(() => {
    return parseInt(localStorage.getItem("databaseCount") || "1", 10);
  });
  const [clickedIcon, setClickedIcon] = useState(null);
  const [fileUrls, setFileUrls] = useState({});
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const newFileUrls = {};
    selectedFolders.forEach((folder, folderIndex) => {
      folder.files.forEach((file, fileIndex) => {
        const fileId = `${folderIndex}-${fileIndex}`;
        if (!fileUrls[fileId]) {
          const url = URL.createObjectURL(file);
          newFileUrls[fileId] = url;
        }
      });
    });
    setFileUrls((prev) => ({ ...prev, ...newFileUrls }));

    return () => {
      Object.values(newFileUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFolders]);

  useEffect(() => {
    localStorage.setItem("databaseCount", databaseCount);
  }, [databaseCount]);

  const toggleFolderSelection = (folderIndex) => {
    const isChecked = !folderSelections[folderIndex];
    setFolderSelections((prev) => ({
      ...prev,
      [folderIndex]: isChecked,
    }));
    setFileSelections((prev) => ({
      ...prev,
      [folderIndex]: selectedFolders[folderIndex].files.reduce((fileAcc, _, fileIndex) => {
        fileAcc[fileIndex] = isChecked;
        return fileAcc;
      }, {}),
    }));
  };

  const toggleFileSelection = (folderIndex, fileIndex) => {
    setFileSelections((prev) => ({
      ...prev,
      [folderIndex]: {
        ...prev[folderIndex],
        [fileIndex]: !prev[folderIndex][fileIndex],
      },
    }));
  };

  const toggleExpanded = (folderIndex) => {
    setExpanded((prev) => ({
      ...prev,
      [folderIndex]: !prev[folderIndex],
    }));
  };

  const handleMediaInfoClick = (file) => {
    setMediaInfoFile(file);
    setShowMediaInfoModal(true);
  };

  const handleOpenFileClick = () => {
    setShowOpenFileModal(true);
  };

  const handleFinish = () => {
    const selectedFiles = selectedFolders.flatMap((folder, folderIndex) =>
      folder.files.filter((_, fileIndex) => fileSelections[folderIndex][fileIndex])
    );
    const frameFiles = savedFrames.map((frame) => frame.file);
    setFinalSelectedImages((prev) => [...prev, ...frameFiles]);
    const databaseName = `database ${String.fromCharCode(65 + databaseCount)}`;
    setDatabaseCount((prev) => prev + 1);
    onNext({ files: selectedFiles, databaseName, savedFrames });
  };

  const getFileIcon = (file, iconId) => {
    const baseStyle = {
      color: "#E0E7FF", // Light blue for normal state
      transition: "color 0.3s ease",
    };
    const hoverStyle = { color: "#0056D2" }; // Dark blue on hover
    const clickedStyle = { color: "#003087" }; // Keep the clicked style

const hoveredIcon = "blue"

    const iconStyle = {
      ...baseStyle,
      ...(hoveredIcon === iconId ? hoverStyle : {}), // Apply hover style if hovered
      ...(clickedIcon === iconId ? clickedStyle : {}), // Apply clicked style if clicked
    };

    const handleMouseEnter = () => setHoveredIcon(iconId);
    const handleMouseLeave = () => setHoveredIcon(null);
    const handleMouseDown = () => setClickedIcon(iconId);
    const handleMouseUp = () => setClickedIcon(null);

    if (file.type.startsWith("image/"))
      return (
        <FaFileImage
          style={iconStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
      );
    if (file.type.startsWith("video/"))
      return (
        <FaFileVideo
          style={iconStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
      );
    return (
      <FaFileAlt
        style={iconStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
    );
  };

  const getSelectedItemsCount = (folderIndex) => {
    return Object.values(fileSelections[folderIndex]).filter(Boolean).length;
  };

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

  const handleSaveFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    const fileName = `frame-${formatTime(currentTime).replace(":", "-")}.jpg`;
    const frameFile = dataURLtoFile(dataUrl, fileName);
    const sourceFile = selectedFolders.flatMap((folder) => folder.files)[selectedFileIndex];
    const sourceFileId = `${sourceFile.name}-${sourceFile.lastModified}`;
    setSavedFrames((prev) => [
      ...prev,
      { timestamp: currentTime, dataUrl, file: frameFile, sourceFileId },
    ]);
  };

  const handleDeleteFrame = (originalIndex) => {
    setSavedFrames((prev) => prev.filter((_, i) => i !== originalIndex));
  };

  return (
    <div className="modal" style={modalStyle}>
      <div style={blueBarStyle}>
        <h3 style={{ color: "black", margin: 0, fontSize: 15 }}>
          New Database Settings
        </h3>
        <button onClick={onClose} style={closeButtonStyle}>
          ×
        </button>
      </div>

      <div style={{ display: "flex", width: "100%", height: "400px" }}>
        {/* Left Side - Folders and Files */}
        <div style={leftPanelStyle}>
          {selectedFolders && selectedFolders.length > 0 ? (
            selectedFolders.map((folder, folderIndex) => (
              <div key={folderIndex} style={{ marginBottom: "10px" }}>
                <div style={headerStyle}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={folderSelections[folderIndex] || false}
                      onChange={() => toggleFolderSelection(folderIndex)}
                      style={{ marginRight: "8px" }}
                    />
                    <FaFolder
                      size={32}
                      style={{
                        marginRight: "8px",
                        color: "#007BFF", // Updated to match v2 blue
                        transition: "color 0.3s ease",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.color = "#0056D2")}
                      onMouseOut={(e) =>
                        (e.currentTarget.style.color =
                          clickedIcon === `folder-${folderIndex}` ? "#003087" : "#007BFF")
                      }
                      onMouseDown={() => setClickedIcon(`folder-${folderIndex}`)}
                      onMouseUp={() => setClickedIcon(null)}
                    />
                    <div>
                      <strong style={{ color: "#000000" }}>{folder.folderName}</strong>
                      <div style={{ fontSize: "0.9rem", color: "#555" }}>
                        {getSelectedItemsCount(folderIndex)} item
                        {getSelectedItemsCount(folderIndex) !== 1 ? "s" : ""} selected
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button
                      onClick={() => toggleExpanded(folderIndex)}
                      style={toggleButtonStyle}
                    >
                      {expanded[folderIndex] ? "▲" : "▼"}
                    </button>
                  </div>
                </div>

                {expanded[folderIndex] && (
                  <div style={filesContainerStyle}>
                    {folder.files.map((file, fileIndex) => {
                      const fileId = `${folderIndex}-${fileIndex}`;
                      const fileUrl = fileUrls[fileId] || "";
                      return (
                        <div
                          key={fileId}
                          style={{
                            ...fileItemStyle,
                            opacity: fileSelections[folderIndex][fileIndex] ? 1 : 0.4,
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={fileSelections[folderIndex][fileIndex]}
                            onChange={() => toggleFileSelection(folderIndex, fileIndex)}
                            style={{ marginRight: "8px" }}
                          />
                          {file.type.startsWith("image/") ? (
                            <img
                              src={fileUrl}
                              alt={file.name}
                              style={{
                                maxWidth: "100px",
                                maxHeight: "100px",
                                marginRight: "8px",
                                cursor: "pointer",
                                borderRadius: "4px", // Added for consistency
                              }}
                              onClick={() => {
                                setSelectedPreview(fileUrl);
                                setSelectedFileIndex(
                                  selectedFolders
                                    .slice(0, folderIndex)
                                    .reduce((acc, f) => acc + f.files.length, 0) + fileIndex
                                );
                              }}
                            />
                          ) : file.type.startsWith("video/") ? (
                            <video
                              src={fileUrl}
                              style={{
                                maxWidth: "100px",
                                maxHeight: "100px",
                                marginRight: "8px",
                                cursor: "pointer",
                                borderRadius: "4px", // Added for consistency
                              }}
                              muted
                            >
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <span style={{ marginRight: "8px" }}>
                              {getFileIcon(file, `file-${fileId}`)}
                            </span>
                          )}
                          <span
                            style={{
                              fontSize: "0.8rem",
                              cursor: "pointer",
                              color: selectedPreview === fileUrl ? "#0056D2" : "#000000", // Updated to match v2 blue
                              fontWeight: selectedPreview === fileUrl ? "bold" : "normal",
                            }}
                            onClick={() => {
                              setSelectedPreview(fileUrl);
                              setSelectedFileIndex(
                                selectedFolders
                                  .slice(0, folderIndex)
                                  .reduce((acc, f) => acc + f.files.length, 0) + fileIndex
                              );
                            }}
                          >
                            {file.name}
                          </span>
                          <span
                            style={{ marginLeft: "10px", color: "#007BFF", cursor: "pointer" }} // Updated to match v2 blue
                            onClick={() => handleMediaInfoClick(file)}
                          >
                            Media Info
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p style={{ color: "#000000" }}>No folders selected.</p>
          )}
        </div>

        {/* Right Side - Image/Video Preview and Details */}
        <div style={rightPanelStyle}>
          {selectedPreview ? (
            <>
              {selectedFolders
                .flatMap((folder) => folder.files)
                .find((_, idx) => idx === selectedFileIndex)?.type.startsWith("video/") ? (
                <div style={{ width: "100%", height: "70%", position: "relative" }}>
                  <video
                    key={selectedPreview}
                    ref={videoRef}
                    src={selectedPreview}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      borderRadius: "5px", // Removed border, kept rounded corners
                    }}
                    muted
                    onLoadedMetadata={handleVideoLoadedMetadata}
                    onTimeUpdate={handleTimeUpdate}
                  >
                    Your browser does not support the video tag.
                  </video>
                  {/* Custom Scrollbar with Fast-Forward, Rewind, and Save Frame Buttons */}
                  <div style={videoControlsStyle}>
                    <button
                      onClick={handleRewind}
                      style={videoButtonStyle}
                      title="Rewind 5 seconds"
                    >
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
                    <button
                      onClick={handleFastForward}
                      style={videoButtonStyle}
                      title="Fast-forward 5 seconds"
                    >
                      <FaForward size={20} />
                    </button>
                    <button
                      onClick={handleSaveFrame}
                      style={videoButtonStyle}
                      title="Save frame at current timestamp"
                    >
                      <FaSave size={20} />
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
                    borderRadius: "5px", // Removed border, kept rounded corners
                  }}
                />
              )}
              <div style={previewDetailsStyle}>
                <p>
                  <strong>Name:</strong>{" "}
                  {selectedFolders
                    .flatMap((folder) => folder.files)
                    [selectedFileIndex]?.name || "Unknown"}
                </p>
                <p>
                  <strong>Size:</strong>{" "}
                  {(
                    (selectedFolders.flatMap((folder) => folder.files)[selectedFileIndex]?.size ||
                      0) /
                    (1024 * 1024)
                  ).toFixed(2)}{" "}
                  MB
                </p>
                <p>
                  <strong>Frame:</strong> N/A
                </p>
                <p
                  style={{ color: "#007BFF", cursor: "pointer" }} // Updated to match v2 blue
                  onClick={handleOpenFileClick}
                >
                  Open File
                </p>
              </div>
            </>
          ) : (
            <p style={{ fontSize: "14px", color: "#000000" }}>
              Click an image or video to preview
            </p>
          )}
        </div>
      </div>

      {/* Modal Buttons */}
      <div style={buttonContainerStyle}>
        <button
          onClick={onClose}
          style={cancelButtonStyle}
        >
          Cancel
        </button>
        <button
          onClick={handleFinish}
          style={createButtonStyle}
        >
          Create Database
        </button>
      </div>

      {/* Media Info Modal */}
      {showMediaInfoModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ color: "#000000" }}>Media Info</h3>
            <p style={{ color: "#000000" }}>
              {mediaInfoFile ? `File Name: ${mediaInfoFile.name}` : "No file selected."}
            </p>
            <button
              onClick={() => setShowMediaInfoModal(false)}
              style={modalCloseButtonStyle}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Open File Modal */}
      {showOpenFileModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ color: "#000000" }}>Open File</h3>
            {selectedFolders
              .flatMap((folder) => folder.files)
              [selectedFileIndex]?.type.startsWith("video/") ? (
              <>
                <p style={{ color: "#000000" }}>Frames saved for this video:</p>
                {savedFrames.length > 0 ? (
                  <div style={{ maxHeight: "300px", overflowY: "auto", marginTop: "10px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                      {savedFrames
                        .map((frame, originalIndex) => ({ frame, originalIndex }))
                        .filter(
                          ({ frame }) =>
                            frame.sourceFileId ===
                            `${selectedFolders
                              .flatMap((folder) => folder.files)
                              [selectedFileIndex]?.name}-${selectedFolders
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
                            />
                            <p style={{ fontSize: "0.8rem", color: "#555" }}>
                              {formatTime(frame.timestamp)}
                            </p>
                            <button
                              onClick={() => handleDeleteFrame(originalIndex)}
                              style={deleteFrameButtonStyle}
                              title="Delete frame"
                            >
                              X
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: "0.9rem", color: "#666" }}>No frames saved for this video.</p>
                )}
              </>
            ) : (
              <p style={{ color: "#000000" }}>No frames available for images.</p>
            )}
            <button
              onClick={() => setShowOpenFileModal(false)}
              style={modalCloseButtonStyle}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Hidden canvas for capturing frames */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

// Styles (Updated to match v2 design)
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
  boxShadow: "0 4px 15px rgba(0, 0, 123, 0.2)", // Subtle blue-tinted shadow
};

const blueBarStyle = {
  width: "100%",
  backgroundColor: "#EEF2FF",
  borderRadius: "8px 8px 0 0",
  padding: "10px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between", // Align with v2
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
  ":hover": {
    backgroundColor: "#E0E7FF",
  },
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px",
  width: "100%",
};

const toggleButtonStyle = {
  padding: "6px 12px",
  border: "none",
  borderRadius: "20px", // Updated to match v2 rounded buttons
  cursor: "pointer",
  backgroundColor: "#E0E7FF", // Light blue to match v2
  color: "#0056D2", // Darker blue for contrast
  transition: "background-color 0.3s ease",
  ":hover": {
    backgroundColor: "#D6E0FA", // Slightly lighter blue on hover
  },
};

const filesContainerStyle = {
  maxHeight: "300px",
  overflowY: "auto",
  padding: "10px",
  borderRadius: "4px",
  marginBottom: "10px",
  backgroundColor: "#F9FBFF", // Subtle background to match right panel
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
  justifyContent: "flex-start", // Adjusted to align content better
  backgroundColor: "#F9FBFF", // Lighter background to match v2
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
  color: "#007BFF", // Updated to match v2 blue
  transition: "color 0.3s ease",
  ":hover": {
    color: "#0056D2", // Darker blue on hover
  },
};




const rangeStyle = {
  flex: 1,
  cursor: "pointer",
  accentColor: "#007BFF", // Updated to match v2 blue
};

const previewDetailsStyle = {
  marginTop: "30px", // Reduced margin for better spacing
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
  ":hover": {
    backgroundColor: "#D0D0D0", // Slightly darker gray on hover
  },
};

const createButtonStyle = {
  padding: "8px 16px",
  marginLeft: "10px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#007BFF", // Updated to match v2 blue
  color: "#FFFFFF",
  width: "220px",
  borderRadius: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: "1",
  paddingTop: "6px",
  transition: "background-color 0.3s ease",
  ":hover": {
    backgroundColor: "#0056D2", // Darker blue on hover
  },
};

const buttonContainerStyle = {
  marginTop: "auto",
  display: "flex",
  justifyContent: "flex-end",
  padding: "10px 20px", // Added padding for better spacing
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
  backgroundColor: "white", // Updated to match v2 modal background
  padding: "20px",
  borderRadius: "8px",
  textAlign: "center",
  boxShadow: "0 4px 15px rgba(0, 0, 123, 0.2)", // Added shadow to match v2
  color: "#000000",
};

const modalCloseButtonStyle = {
  padding: "8px 16px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#007BFF", // Updated to match v2 blue
  color: "#FFFFFF",
  borderRadius: "20px",
  transition: "background-color 0.3s ease",
  ":hover": {
    backgroundColor: "#0056D2", // Darker blue on hover
  },
};

const deleteFrameButtonStyle = {
  position: "absolute",
  top: "5px",
  right: "5px",
  background: "rgba(255, 0, 0, 0.7)",
  border: "none",
  borderRadius: "4px",
  width: "20px",
  height: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "white",
  fontSize: "12px",
  fontWeight: "bold",
  padding: "0",
  transition: "background-color 0.3s ease",
  ":hover": {
    background: "rgba(255, 0, 0, 0.9)", // Slightly darker red on hover
  },
};

export default DisplayDataBaseModal;