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




















// export default DisplayDataBaseModal;
// "use client";
// import React from "react";
// import { FaFolder } from "react-icons/fa";

// const DisplayDataBaseModal = ({ onClose, onNext, selectedFolder }) => {
//   return (
//     <div className="modal" style={modalStyle}>
//       <h3>Display Database</h3>
//       {selectedFolder ? (
//         <>
//           <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
//             <FaFolder size={32} style={{ marginRight: "8px" }} />
//             <div>
//               <div>
//                 <strong>{selectedFolder.folderName}</strong>
//               </div>
//               <div style={{ fontSize: "0.9rem", color: "#555" }}>
//                 {selectedFolder.files.length} file{selectedFolder.files.length !== 1 ? "s" : ""}
//               </div>
//             </div>
//           </div>
//           <p>Folder details are shown above.</p>
//         </>
//       ) : (
//         <p>No folder selected.</p>
//       )}
//       <div style={{ marginTop: "20px" }}>
//         <button onClick={onClose} style={buttonStyle}>
//           Close
//         </button>
//         <button onClick={onNext} style={buttonStyle}>
//           Finish
//         </button>
//       </div>
//     </div>
//   );
// };

// const modalStyle = {
//   position: "fixed",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   padding: "20px",
//   backgroundColor: "white",
//   border: "1px solid #ccc",
//   borderRadius: "8px",
//   zIndex: 1000,
// };

// const buttonStyle = {
//   padding: "8px 16px",
//   marginRight: "10px",
// };

// export default DisplayDataBaseModal;
"use client";
import React, { useState } from "react";
import { FaFolder, FaFileImage, FaFileVideo, FaFileAlt } from "react-icons/fa";

const DisplayDataBaseModal = ({ onClose, onNext, selectedFolders }) => {
  // State to track folder selections (all folders initially checked)
  const [folderSelections, setFolderSelections] = useState(
    selectedFolders.reduce((acc, _, index) => {
      acc[index] = true; // All folders start checked
      return acc;
    }, {})
  );

  // State to track selected files per folder
  const [fileSelections, setFileSelections] = useState(
    selectedFolders.reduce((acc, folder, folderIndex) => {
      acc[folderIndex] = folder.files.reduce((fileAcc, _, fileIndex) => {
        fileAcc[fileIndex] = true; // All files start checked
        return fileAcc;
      }, {});
      return acc;
    }, {})
  );

  // State for media info modal
  const [showMediaInfoModal, setShowMediaInfoModal] = useState(false);
  const [mediaInfoFile, setMediaInfoFile] = useState(null);

  // Toggles a folder selection and its files
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

  // Toggles an individual file selection inside a folder
  const toggleFileSelection = (folderIndex, fileIndex) => {
    setFileSelections((prev) => ({
      ...prev,
      [folderIndex]: {
        ...prev[folderIndex],
        [fileIndex]: !prev[folderIndex][fileIndex],
      },
    }));
  };

  // Expands the folders to show files
  const [expanded, setExpanded] = useState({});

  const toggleExpanded = (folderIndex) => {
    setExpanded((prev) => ({
      ...prev,
      [folderIndex]: !prev[folderIndex],
    }));
  };

  // Opens Media Info Modal
  const handleMediaInfoClick = (file) => {
    setMediaInfoFile(file);
    setShowMediaInfoModal(true);
  };

  // Function to collect selected files and send them back
  const handleFinish = () => {
    const selectedFiles = selectedFolders.flatMap((folder, folderIndex) => {
      return folder.files.filter((_, fileIndex) => fileSelections[folderIndex][fileIndex]);
    });

    onNext(selectedFiles); // Send selected images to parent
  };

  // Helper function to get an icon based on file type
  const getFileIcon = (file) => {
    if (file.type.startsWith("image/")) return <FaFileImage />;
    if (file.type.startsWith("video/")) return <FaFileVideo />;
    return <FaFileAlt />;
  };


// State to track selected image for preview
const [selectedImage, setSelectedImage] = useState(null);



return (
  <div className="modal" style={modalStyle}>
    <h3>Display Database</h3>

    <div style={{ display: "flex", width: "100%", height: "300px" }}>
      {/* Left Side - Folders and Images */}
      <div style={leftPanelStyle}>
        {selectedFolders && selectedFolders.length > 0 ? (
          selectedFolders.map((folder, folderIndex) => (
            <div key={folderIndex} style={{ marginBottom: "10px" }}>
              <div style={headerStyle}>
                <input
                  type="checkbox"
                  checked={folderSelections[folderIndex]}
                  onChange={() => toggleFolderSelection(folderIndex)}
                  style={{ marginRight: "8px" }}
                />
                <FaFolder size={32} style={{ marginRight: "8px" }} />
                <div>
                  <strong>{folder.folderName}</strong>
                  <div style={{ fontSize: "0.9rem", color: "#555" }}>
                    {folder.files.length} file{folder.files.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              <button onClick={() => toggleExpanded(folderIndex)} style={toggleButtonStyle}>
                {expanded[folderIndex] ? "Hide Files" : "Show Files"}
              </button>

              {expanded[folderIndex] && (
                <div style={filesContainerStyle}>
                  {folder.files.map((file, fileIndex) => {
                    const imageUrl = URL.createObjectURL(file);
                    return (
                      <div
                        key={fileIndex}
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
                            src={imageUrl}
                            alt={file.name}
                            style={{
                              maxWidth: "100px",
                              maxHeight: "100px",
                              marginRight: "8px",
                              cursor: "pointer",
                            }}
                            onClick={() => setSelectedImage(imageUrl)} // ✅ Show clicked image on right
                          />
                        ) : (
                          <span style={{ marginRight: "8px" }}>{getFileIcon(file)}</span>
                        )}
                        <span
                          style={{
                            fontSize: "0.8rem",
                            cursor: "pointer",
                            color: selectedImage === imageUrl ? "blue" : "black",
                            fontWeight: selectedImage === imageUrl ? "bold" : "normal",
                          }}
                          onClick={() => setSelectedImage(imageUrl)} // ✅ Click name to preview image
                        >
                          {file.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No folders selected.</p>
        )}
      </div>

      {/* Right Side - Image Preview */}
      <div style={rightPanelStyle}>
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Selected Preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
        ) : (
          <p style={{ fontSize: "14px", color: "#666" }}>Click an image to preview</p>
        )}
      </div>
    </div>

    {/* Modal Buttons */}
    <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
      <button onClick={onClose} style={buttonStyle}>
        Close
      </button>
      <button onClick={handleFinish} style={buttonStyle}>
        Finish
      </button>
    </div>
  </div>
);
};
// Styles
const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  padding: "20px",
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  borderRadius: "8px",
  zIndex: 1000,
};
const headerStyle = { display: "flex", alignItems: "center", marginBottom: "10px" };
const toggleButtonStyle = { padding: "6px 12px", marginBottom: "10px" };
const filesContainerStyle = {
  maxHeight: "300px",
  overflowY: "auto",
  border: "1px solid #ddd",
  padding: "10px",
  borderRadius: "4px",
  marginBottom: "10px",
};

const leftPanelStyle = {
  flex: 1,
  padding: "10px",
  borderRight: "1px solid #ddd",
  overflowY: "auto",
};

const rightPanelStyle = {
  flex: 1,
  padding: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f9f9f9",
};
const fileItemStyle = { display: "flex", alignItems: "center", marginBottom: "8px" };
const buttonStyle = { padding: "8px 16px", marginRight: "10px" };

export default DisplayDataBaseModal;
