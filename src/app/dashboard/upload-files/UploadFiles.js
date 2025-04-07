// "use client";
// import React, { useState, useContext, useEffect } from "react";
// import CreateNewDataBaseModal from "../modals/create-new-database/createNewDataBaseModal"; // Import modal for creating a new database
// import ImportMediaModal from "../modals/create-new-database/importMediaModal"; // Import modal for importing media
// import DisplayDataBaseModal from "../modals/create-new-database/displayDataBaseModal"; // Import modal for displaying the database
// import { ImageContext } from "@/contexts/ImageContext"; // Import context for managing image state
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
// } from "react-icons/fa"; // Import icons for UI elements
// import { Box } from "@chakra-ui/react"; // Import Box component from Chakra UI for layout
// import "./uploadFiles.css"; // Import CSS for styling

// // Reusable button styles (for center buttons)
// const buttonStyle = (bgColor, textColor) => ({
//   padding: "2px 2px", // Set padding for buttons
//   fontSize: "12px", // Set font size for button text
//   cursor: "pointer", // Set cursor to pointer for interactivity
//   backgroundColor: bgColor, // Set background color based on parameter
//   border: "none", // Remove border
//   borderRadius: "20px", // Round the corners
//   color: textColor, // Set text color based on parameter
//   width: "200px", // Set fixed width for buttons
//   margin: "5px 0", // Add vertical margin
//   transition: "background 0.3s ease", // Smooth transition for background color changes
//   textAlign: "center", // Center-align text
//   display: "flex", // Use flexbox for layout
//   justifyContent: "center", // Center content horizontally
//   alignItems: "center", // Center content vertically
// });

// export default function UploadFiles() {
//   // Modal chain states
//   const [showCreateDbModal, setShowCreateDbModal] = useState(false); // State to control visibility of CreateNewDataBaseModal
//   const [showImportMediaModal, setShowImportMediaModal] = useState(false); // State to control visibility of ImportMediaModal
//   const [showDisplayDbModal, setShowDisplayDbModal] = useState(false); // State to control visibility of DisplayDataBaseModal
//   const [showPlusModal, setShowPlusModal] = useState(false); // State to control visibility of the plus icon modal
//   // State for folder selections from CreateNewDataBaseModal
//   const [folderSelections, setFolderSelections] = useState([]); // State to store folder selections from CreateNewDataBaseModal
//   // State for the selected folders from ImportMediaModal
//   const [selectedFolders, setSelectedFolders] = useState([]); // State to store selected folders from ImportMediaModal
//   // State for multiple databases
//   const [databases, setDatabases] = useState([]); // State to store multiple databases
//   const [selectedDatabaseIndex, setSelectedDatabaseIndex] = useState(null); // State to track the currently selected database index
//   // State for Media Info Modal
//   const [showMediaInfoModal, setShowMediaInfoModal] = useState(false); // State to control visibility of Media Info Modal
//   const [mediaInfoFile, setMediaInfoFile] = useState(null); // State to store the file for Media Info Modal
//   // State for frame expansion (only for toggling visibility of saved frames)
//   const [expandedFrames, setExpandedFrames] = useState({}); // State to track which video frames are expanded
//   // Get the setters and state from ImageContext
//   const {
//     setSelectedImage, // Function to set the selected image in context
//     setUploadedFiles, // Function to set uploaded files in context
//     finalSelectedImages, // State for final selected images from context
//     setFinalSelectedImages, // Function to set final selected images in context
//   } = useContext(ImageContext);
//   const [localFinalSelectedImages, setLocalFinalSelectedImages] = useState([]); // Local state for final selected images
//   // Search and UI states
//   const [searchQuery, setSearchQuery] = useState(""); // State for search query input
//   const [isExpanded, setIsExpanded] = useState(false); // State to control search input expansion
//   const [isAscending, setIsAscending] = useState(true); // State to control sort order (ascending/descending)
//   const [isGridView, setIsGridView] = useState(false); // State to toggle between grid and list view
//   // State to track if the Create New Database button is clicked
//   const [isCreateButtonClicked, setIsCreateButtonClicked] = useState(false); // State to track if Create New Database button is clicked

//   // Sync local state with context when it updates
//   useEffect(() => {
//     setFinalSelectedImages(localFinalSelectedImages); // Update context with local final selected images
//   }, [localFinalSelectedImages, setFinalSelectedImages]); // Dependencies: localFinalSelectedImages, setFinalSelectedImages

//   const handleOpenCreateDatabase = () => {
//     // Function to open the CreateNewDataBaseModal
//     setShowCreateDbModal(true); // Show the CreateNewDataBaseModal
//     setShowPlusModal(false); // Hide the plus icon modal
//     setIsCreateButtonClicked(true); // Mark the Create New Database button as clicked
//   };

//   const handleImageClick = (file) => {
//     // Function to handle image click and set it as the selected image
//     const fileUrl = URL.createObjectURL(file); // Create a URL for the file
//     setSelectedImage(fileUrl); // Set the selected image in context
//   };

//   const handleImageUpload = (event) => {
//     // Function to handle image uploads
//     const files = Array.from(event.target.files); // Convert file list to array
//     setUploadedFiles(files); // Set uploaded files in context
//   };

//   const handleMediaInfoClick = (file) => {
//     // Function to handle media info click and show Media Info Modal
//     setMediaInfoFile(file); // Set the file for Media Info Modal
//     setShowMediaInfoModal(true); // Show the Media Info Modal
//   };

//   const handleDisplayDbNext = (data) => {
//     // Function to handle the "Next" action from DisplayDataBaseModal
//     const newDatabase = {
//       name: data.databaseName, // Set database name
//       files: data.files, // Set database files
//       savedFrames: data.savedFrames || [], // Set saved frames, default to empty array
//     };
//     setDatabases((prev) => [...prev, newDatabase]); // Add new database to the list
//     setLocalFinalSelectedImages([
//       ...data.files, // Add database files
//       ...(data.savedFrames || []).map((frame) => frame.file), // Add saved frame files
//     ]);
//     setSelectedDatabaseIndex(databases.length); // Set the selected database index to the new database
//     setShowDisplayDbModal(false); // Hide the DisplayDataBaseModal
//   };

//   const handleDeleteDatabase = (index) => {
//     // Function to delete a database
//     setDatabases((prev) => prev.filter((_, i) => i !== index)); // Remove the database at the given index
//     if (selectedDatabaseIndex === index) {
//       // If the deleted database is the selected one
//       setSelectedDatabaseIndex(null); // Clear the selected database index
//       setLocalFinalSelectedImages([]); // Clear the local final selected images
//     } else if (selectedDatabaseIndex > index) {
//       // If the deleted database is before the selected one
//       setSelectedDatabaseIndex(selectedDatabaseIndex - 1); // Adjust the selected database index
//     }
//     console.log("Database deleted, returning to initial state"); // Log the deletion
//   };

//   const handleExpandFrames = (file) => {
//     // Function to toggle frame expansion for videos
//     if (!file.type.startsWith("video/")) {
//       // Check if the file is a video
//       return; // If not, do nothing
//     }
//     const fileId = `${file.name}-${file.lastModified}`; // Create a unique ID for the file
//     setExpandedFrames((prev) => ({
//       ...prev,
//       [fileId]: !prev[fileId], // Toggle the expanded state for this file
//     }));
//   };

//   const handleSort = () => {
//     // Function to toggle sort order
//     setIsAscending(!isAscending); // Toggle between ascending and descending
//   };

//   const toggleView = () => {
//     // Function to toggle between grid and list view
//     setIsGridView(!isGridView); // Toggle the view state
//   };

//   const formatTime = (time) => {
//     // Function to format time in minutes and seconds
//     const minutes = Math.floor(time / 60); // Calculate minutes
//     const seconds = Math.floor(time % 60); // Calculate seconds
//     return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`; // Format as MM:SS
//   };

//   return (
//     <div className="upload-files-container">
//       {/* Database Tabs Row at the Top */}
//       {databases.length > 0 && (
//         <Box
//           display="flex" // Use flexbox for layout
//           gap="10px" // Set gap between tabs
//           mb="0" // Changed from 10px to 0 to remove space between tabs and gallery
//           flexWrap="wrap" // Allow tabs to wrap
//         >
//           {databases.map((db, index) => (
//             <Box key={index} className="database-tab">
//               <Box
//                 className="database-tab-name"
//                 onClick={() => {
//                   setSelectedDatabaseIndex(index); // Set the selected database index
//                   setLocalFinalSelectedImages([
//                     ...db.files, // Add database files
//                     ...db.savedFrames.map((frame) => frame.file), // Add saved frame files
//                   ]);
//                 }}
//               >
//                 {db.name} {/* Display database name */}
//               </Box>
//               <Box
//                 as="button"
//                 className="database-tab-close"
//                 onClick={() => handleDeleteDatabase(index)} // Delete the database on click
//               >
//                 <FaTimes size={12} /> {/* Close icon */}
//               </Box>
//             </Box>
//           ))}
//           <Box
//             as="button"
//             className="database-tab-add"
//             onClick={() => setShowPlusModal(true)} // Show the plus icon modal on click
//           >
//             <FaPlus /> {/* Plus icon */}
//           </Box>
//         </Box>
//       )}
//       {/* Main UploadFiles Container */}
//       <div className="main-container">
//         {/* Top Navigation: Search and Controls (shown only if no database exists) */}
//         {databases.length === 0 && (
//           <div className="top-navigation">
//             {/* Left side: Search Input & + Button */}
//             <div className="search-container">
//               <button className="add-button" onClick={handleOpenCreateDatabase}>
//                 + {/* Plus button to open CreateNewDataBaseModal */}
//               </button>
//               <div className="search-input-wrapper">
//                 <FaSearch className="search-icon" /> {/* Search icon */}
//                 <input
//                   type="text"
//                   value={searchQuery} // Bind search query state
//                   onChange={(e) => setSearchQuery(e.target.value)} // Update search query on change
//                   onFocus={() => setIsExpanded(true)} // Expand input on focus
//                   onBlur={() => setIsExpanded(false)} // Collapse input on blur
//                   className="search-input"
//                   style={{
//                     width: isExpanded ? "200px" : "120px", // Expand/collapse width
//                     transition: "width 0.3s ease", // Smooth transition
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Right side: Info, Sort, Grid/List Buttons */}
//             <div className="controls-container">
//               <button
//                 className="info-button"
//                 onClick={() => console.log("Info clicked")} // Log info click
//               >
//                 <FaInfoCircle className="info-icon" /> {/* Info icon */}
//               </button>
//               <button className="sort-button" onClick={handleSort}>
//                 <FaArrowUp className="sort-icon" /> {/* Sort up icon */}
//                 <FaArrowDown className="sort-icon" /> {/* Sort down icon */}
//               </button>
//               <button className="toggle-button" onClick={toggleView}>
//                 {isGridView ? (
//                   <FaTh className="toggle-icon" /> // Grid view icon
//                 ) : (
//                   <FaList className="toggle-icon" /> // List view icon
//                 )}
//               </button>
//             </div>
//           </div>
//         )}
//         {/* Center Buttons for Database (shown only if no database exists) */}
//         {databases.length === 0 &&
//           !showCreateDbModal &&
//           !showImportMediaModal &&
//           !showDisplayDbModal &&
//           !showPlusModal && (
//             <div className="center-buttons">
//               <button className="action-button open-database">
//                 Open a Database {/* Button to open a database */}
//               </button>
//               <button className="action-button connect-es-database">
//                 Connect to ES Database {/* Button to connect to ES database */}
//               </button>
//               <button className="action-button connect-live-video" disabled>
//                 Connect to Live Video {/* Disabled button for live video */}
//               </button>
//               <button
//                 className="action-button create-new-database"
//                 style={{
//                   background: isCreateButtonClicked
//                     ? "linear-gradient(to bottom, #2E7D32, #81C784)" // Gradient background when clicked
//                     : undefined,
//                 }}
//                 onClick={handleOpenCreateDatabase} // Open CreateNewDataBaseModal on click
//               >
//                 Create New Database {/* Button to create a new database */}
//               </button>
//             </div>
//           )}
//         {/* + Icon Modal (without Close button) */}
//         {showPlusModal && (
//           <div className="plus-modal">
//             <button
//               className="plus-modal-close"
//               onClick={() => setShowPlusModal(false)} // Close the plus modal on click
//             >
//               × {/* Close button */}
//             </button>
//             <h4 className="plusModalOpendatabase">Open A Database</h4>
//             <h4 className="plusModalConnectEs">Connect To ES Database</h4>
//             <button
//               className="plus-modal-button"
//               onClick={handleOpenCreateDatabase} // Open CreateNewDataBaseModal on click
//             >
//               Create New Database {/* Button to create a new database */}
//             </button>
//             <h4 className="plusModalConnecttoLive">Connect To Live Video</h4>
//           </div>
//         )}
//         {/* STEP 1: Create New Database Modal */}
//         {showCreateDbModal && (
//           <CreateNewDataBaseModal
//             onClose={() => {
//               setShowCreateDbModal(false); // Hide the CreateNewDataBaseModal
//               setIsCreateButtonClicked(false); // Reset the create button state
//             }}
//             onNext={(folders) => {
//               console.log("Received folders in UploadFiles:", folders); // Log the folders data for debugging
//               setFolderSelections(folders); // Set the folder selections state
//               setShowCreateDbModal(false); // Hide the CreateNewDataBaseModal
//               setShowImportMediaModal(true); // Show the ImportMediaModal
//             }}
//           />
//         )}
//         {/* STEP 2: Import Media Modal */}
//         {showImportMediaModal && (
//           <ImportMediaModal
//             folderSelections={folderSelections} // Pass the folder selections to ImportMediaModal
//             onClose={() => setShowImportMediaModal(false)} // Hide the ImportMediaModal on close
//             onNext={(structuredData) => {
//               console.log("Received structuredData in UploadFiles:", structuredData); // Log the structured data for debugging
//               setSelectedFolders(structuredData); // Set the selected folders state
//               setShowImportMediaModal(false); // Hide the ImportMediaModal
//               setShowDisplayDbModal(true); // Show the DisplayDataBaseModal
//             }}
//           />
//         )}
//         {/* STEP 3: Display Database Modal */}
//         {showDisplayDbModal && (
//           <DisplayDataBaseModal
//             onClose={() => setShowDisplayDbModal(false)} // Hide the DisplayDataBaseModal on close
//             onNext={handleDisplayDbNext} // Handle the "Next" action
//             selectedFolders={selectedFolders} // Pass the selected folders to DisplayDataBaseModal
//           />
//         )}
//         {/* Final Gallery Display on Main Page */}
//         {selectedDatabaseIndex !== null && !showDisplayDbModal && (
//           <div className="gallery-container">
//             <h3 className="gallery-title">Final Gallery</h3> {/* Gallery title */}
//             <div className="gallery-items">
//               {databases[selectedDatabaseIndex].files.map((file, index, arr) => {
//                 const fileUrl = URL.createObjectURL(file); // Create a URL for the file
//                 const fileId = `${file.name}-${file.lastModified}`; // Create a unique ID for the file
//                 const isExpanded = expandedFrames[fileId] || false; // Check if the file’s frames are expanded
//                 const associatedFrames = databases[
//                   selectedDatabaseIndex
//                 ].savedFrames.filter((frame) => frame.sourceFileId === fileId); // Get associated frames for the file
//                 return (
//                   <div
//                     key={index}
//                     className="gallery-item"
//                     onClick={() => handleImageClick(file)} // Handle image click
//                   >
//                     <div className="gallery-item-index">
//                       {index + 1} of {arr.length} {/* Display item index */}
//                     </div>
//                     <div className="gallery-item-media">
//                       {file.type.startsWith("image/") ? (
//                         <img
//                           src={fileUrl}
//                           alt={file.name}
//                           className="gallery-image" // Display image if file is an image
//                         />
//                       ) : file.type.startsWith("video/") ? (
//                         <video
//                           src={fileUrl}
//                           className="gallery-video"
//                           muted
//                           loop // Display video if file is a video
//                         >
//                           Your browser does not support the video tag.
//                         </video>
//                       ) : null}
//                     </div>
//                     <div className="gallery-item-details">
//                       <div className="gallery-item-name">{file.name}</div> {/* Display file name */}
//                       <div
//                         className="gallery-item-media-info"
//                         onClick={(e) => {
//                           e.stopPropagation(); // Prevent click from bubbling up
//                           handleMediaInfoClick(file); // Show media info on click
//                         }}
//                       >
//                         Media Info {/* Media info link */}
//                       </div>
//                       {file.type.startsWith("video/") && (
//                         <div
//                           className="gallery-item-expand-frames"
//                           onClick={(e) => {
//                             e.stopPropagation(); // Prevent click from bubbling up
//                             handleExpandFrames(file); // Expand frames on click
//                           }}
//                         >
//                           Expand Frames{" "}
//                           {isExpanded ? <FaChevronUp /> : <FaChevronDown />} {/* Toggle expand/collapse icon */}
//                         </div>
//                       )}
//                       {isExpanded && (
//                         <div className="gallery-item-frames">
//                           {associatedFrames.length > 0 ? (
//                             <div className="gallery-item-frames-list">
//                               {associatedFrames.map((frame, frameIndex) => (
//                                 <div
//                                   key={frameIndex}
//                                   className="gallery-item-frame"
//                                 >
//                                   <img
//                                     src={frame.dataUrl}
//                                     alt={`Frame at ${formatTime(
//                                       frame.timestamp
//                                     )}`}
//                                     className="gallery-frame-image" // Display frame image
//                                   />
//                                   <p className="gallery-frame-timestamp">
//                                     {formatTime(frame.timestamp)} {/* Display frame timestamp */}
//                                   </p>
//                                 </div>
//                               ))}
//                             </div>
//                           ) : (
//                             <p className="gallery-no-frames">
//                               No frames saved for this video. {/* Message if no frames */}
//                             </p>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* Media Info Modal */}
//         {showMediaInfoModal && (
//           <div className="media-info-modal">
//             {/* Light blue header bar */}
//             <div className="media-info-header">
//               <h3>Media Info</h3> {/* Modal title */}
//               <button
//                 className="media-info-modal-close"
//                 onClick={() => setShowMediaInfoModal(false)} // Close the modal on click
//               >
//                 × {/* Close button */}
//               </button>
//             </div>
//             {/* Modal content */}
//             <div className="media-info-content">
//               <p>
//                 {mediaInfoFile
//                   ? `File Name: ${mediaInfoFile.name}`
//                   : "No file selected."} {/* Display file name or placeholder */}
//               </p>
//               <p>File type/Kind: </p> {/* Placeholder for file type */}
//               <p>File Size: </p> {/* Placeholder for file size */}
//               <p>Location: </p> {/* Placeholder for file location */}
//               <p>Created: </p> {/* Placeholder for creation date */}
//               <p>Resolution: </p> {/* Placeholder for resolution */}
//               <p>Duration: </p> {/* Placeholder for duration */}
//               <p>Frames: </p> {/* Placeholder for frames */}
//               <p>Codec: </p> {/* Placeholder for codec */}
//             </div>
//             {/* Footer with buttons */}
//             <div className="media-info-footer">
//               <button className="media-info-button">Open</button> {/* Open button */}
//               <button className="media-info-button">Send</button> {/* Send button */}
//               <button className="media-info-button media-info-close-button">
//                 Close {/* Close button */}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// "use client";
// import React, { useState, useContext, useEffect } from "react";
// import CreateNewDataBaseModal from "../modals/create-new-database/createNewDataBaseModal"; // Import modal for creating a new database
// import ImportMediaModal from "../modals/create-new-database/importMediaModal"; // Import modal for importing media
// import DisplayDataBaseModal from "../modals/create-new-database/displayDataBaseModal"; // Changed to default import
// import { ImageContext } from "@/contexts/ImageContext"; // Import context for managing image state
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
// } from "react-icons/fa"; // Import icons for UI elements
// import { Box } from "@chakra-ui/react"; // Import Box component from Chakra UI for layout
// import "./uploadFiles.css"; // Import CSS for styling

// // Reusable button styles (for center buttons)
// const buttonStyle = (bgColor, textColor) => ({
//   padding: "2px 2px", // Set padding for buttons
//   fontSize: "12px", // Set font size for button text
//   cursor: "pointer", // Set cursor to pointer for interactivity
//   backgroundColor: bgColor, // Set background color based on parameter
//   border: "none", // Remove border
//   borderRadius: "20px", // Round the corners
//   color: textColor, // Set text color based on parameter
//   width: "200px", // Set fixed width for buttons
//   margin: "5px 0", // Add vertical margin
//   transition: "background 0.3s ease", // Smooth transition for background color changes
//   textAlign: "center", // Center-align text
//   display: "flex", // Use flexbox for layout
//   justifyContent: "center", // Center content horizontally
//   alignItems: "center", // Center content vertically
// });

// export default function UploadFiles() {
//   // Modal chain states
//   const [showCreateDbModal, setShowCreateDbModal] = useState(false); // State to control visibility of CreateNewDataBaseModal
//   const [showImportMediaModal, setShowImportMediaModal] = useState(false); // State to control visibility of ImportMediaModal
//   const [showDisplayDbModal, setShowDisplayDbModal] = useState(false); // State to control visibility of DisplayDataBaseModal
//   const [showPlusModal, setShowPlusModal] = useState(false); // State to control visibility of the plus icon modal
//   // State for folder selections from CreateNewDataBaseModal
//   const [folderSelections, setFolderSelections] = useState([]); // State to store folder selections from CreateNewDataBaseModal
//   // State for the selected folders from ImportMediaModal
//   const [selectedFolders, setSelectedFolders] = useState([]); // State to store selected folders from ImportMediaModal
//   // State for multiple databases
//   const [databases, setDatabases] = useState([]); // State to store multiple databases
//   const [selectedDatabaseIndex, setSelectedDatabaseIndex] = useState(null); // State to track the currently selected database index
//   // State for Media Info Modal
//   const [showMediaInfoModal, setShowMediaInfoModal] = useState(false); // State to control visibility of Media Info Modal
//   const [mediaInfoFile, setMediaInfoFile] = useState(null); // State to store the file for Media Info Modal
//   // State for frame expansion (only for toggling visibility of saved frames)
//   const [expandedFrames, setExpandedFrames] = useState({}); // State to track which video frames are expanded
//   // Get the setters and state from ImageContext
//   const {
//     setSelectedImage, // Function to set the selected image in context
//     setUploadedFiles, // Function to set uploaded files in context
//     finalSelectedImages, // State for final selected images from context
//     setFinalSelectedImages, // Function to set final selected images in context
//   } = useContext(ImageContext);
//   const [localFinalSelectedImages, setLocalFinalSelectedImages] = useState([]); // Local state for final selected images
//   // Search and UI states
//   const [searchQuery, setSearchQuery] = useState(""); // State for search query input
//   const [isExpanded, setIsExpanded] = useState(false); // State to control search input expansion
//   const [isAscending, setIsAscending] = useState(true); // State to control sort order (ascending/descending)
//   const [isGridView, setIsGridView] = useState(false); // State to toggle between grid and list view
//   // State to track if the Create New Database button is clicked
//   const [isCreateButtonClicked, setIsCreateButtonClicked] = useState(false); // State to track if Create New Database button is clicked

//   // Sync local state with context when it updates
//   useEffect(() => {
//     setFinalSelectedImages(localFinalSelectedImages); // Update context with local final selected images
//   }, [localFinalSelectedImages, setFinalSelectedImages]); // Dependencies: localFinalSelectedImages, setFinalSelectedImages

//   const handleOpenCreateDatabase = () => {
//     // Function to open the CreateNewDataBaseModal
//     setShowCreateDbModal(true); // Show the CreateNewDataBaseModal
//     setShowPlusModal(false); // Hide the plus icon modal
//     setIsCreateButtonClicked(true); // Mark the Create New Database button as clicked
//   };

//   const handleImageClick = (file) => {
//     // Function to handle image click and set it as the selected image
//     const fileUrl = URL.createObjectURL(file); // Create a URL for the file
//     setSelectedImage(fileUrl); // Set the selected image in context
//   };

//   const handleImageUpload = (event) => {
//     // Function to handle image uploads
//     const files = Array.from(event.target.files); // Convert file list to array
//     setUploadedFiles(files); // Set uploaded files in context
//   };

//   const handleMediaInfoClick = (file) => {
//     // Function to handle media info click and show Media Info Modal
//     setMediaInfoFile(file); // Set the file for Media Info Modal
//     setShowMediaInfoModal(true); // Show the Media Info Modal
//   };

//   const handleDisplayDbNext = (data) => {
//     // Function to handle the "Next" action from DisplayDataBaseModal
//     const newDatabase = {
//       name: data.databaseName, // Set database name
//       files: data.files, // Set database files
//       savedFrames: data.savedFrames || [], // Set saved frames, default to empty array
//     };
//     setDatabases((prev) => [...prev, newDatabase]); // Add new database to the list
//     setLocalFinalSelectedImages([
//       ...data.files, // Add database files
//       ...(data.savedFrames || []).map((frame) => frame.file), // Add saved frame files
//     ]);
//     setSelectedDatabaseIndex(databases.length); // Set the selected database index to the new database
//     setShowDisplayDbModal(false); // Hide the DisplayDataBaseModal
//   };

//   const handleDeleteDatabase = (index) => {
//     // Function to delete a database
//     setDatabases((prev) => prev.filter((_, i) => i !== index)); // Remove the database at the given index
//     if (selectedDatabaseIndex === index) {
//       // If the deleted database is the selected one
//       setSelectedDatabaseIndex(null); // Clear the selected database index
//       setLocalFinalSelectedImages([]); // Clear the local final selected images
//     } else if (selectedDatabaseIndex > index) {
//       // If the deleted database is before the selected one
//       setSelectedDatabaseIndex(selectedDatabaseIndex - 1); // Adjust the selected database index
//     }
//     console.log("Database deleted, returning to initial state"); // Log the deletion
//   };

//   const handleExpandFrames = (file) => {
//     // Function to toggle frame expansion for videos
//     if (!file.type.startsWith("video/")) {
//       // Check if the file is a video
//       return; // If not, do nothing
//     }
//     const fileId = `${file.name}-${file.lastModified}`; // Create a unique ID for the file
//     setExpandedFrames((prev) => ({
//       ...prev,
//       [fileId]: !prev[fileId], // Toggle the expanded state for this file
//     }));
//   };

//   const handleSort = () => {
//     // Function to toggle sort order
//     setIsAscending(!isAscending); // Toggle between ascending and descending
//   };

//   const toggleView = () => {
//     // Function to toggle between grid and list view
//     setIsGridView(!isGridView); // Toggle the view state
//   };

//   const formatTime = (time) => {
//     // Function to format time in minutes and seconds
//     const minutes = Math.floor(time / 60); // Calculate minutes
//     const seconds = Math.floor(time % 60); // Calculate seconds
//     return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`; // Format as MM:SS
//   };

//   return (
//     <div className="upload-files-container">
//       {/* Database Tabs Row at the Top */}
//       {databases.length > 0 && (
//         <Box
//           display="flex" // Use flexbox for layout
//           gap="10px" // Set gap between tabs
//           mb="0" // Changed from 10px to 0 to remove space between tabs and gallery
//           flexWrap="wrap" // Allow tabs to wrap
//         >
//           {databases.map((db, index) => (
//             <Box key={index} className="database-tab">
//               <Box
//                 className="database-tab-name"
//                 onClick={() => {
//                   setSelectedDatabaseIndex(index); // Set the selected database index
//                   setLocalFinalSelectedImages([
//                     ...db.files, // Add database files
//                     ...db.savedFrames.map((frame) => frame.file), // Add saved frame files
//                   ]);
//                 }}
//               >
//                 {db.name} {/* Display database name */}
//               </Box>
//               <Box
//                 as="button"
//                 className="database-tab-close"
//                 onClick={() => handleDeleteDatabase(index)} // Delete the database on click
//               >
//                 <FaTimes size={12} /> {/* Close icon */}
//               </Box>
//             </Box>
//           ))}
//           <Box
//             as="button"
//             className="database-tab-add"
//             onClick={() => setShowPlusModal(true)} // Show the plus icon modal on click
//           >
//             <FaPlus /> {/* Plus icon */}
//           </Box>
//         </Box>
//       )}
//       {/* Main UploadFiles Container */}
//       <div className="main-container">
//         {/* Top Navigation: Search and Controls (shown only if no database exists) */}
//         {databases.length === 0 && (
//           <div className="top-navigation">
//             {/* Left side: Search Input & + Button */}
//             <div className="search-container">
//               <button className="add-button" onClick={handleOpenCreateDatabase}>
//                 + {/* Plus button to open CreateNewDataBaseModal */}
//               </button>
//               <div className="search-input-wrapper">
//                 <FaSearch className="search-icon" /> {/* Search icon */}
//                 <input
//                   type="text"
//                   value={searchQuery} // Bind search query state
//                   onChange={(e) => setSearchQuery(e.target.value)} // Update search query on change
//                   onFocus={() => setIsExpanded(true)} // Expand input on focus
//                   onBlur={() => setIsExpanded(false)} // Collapse input on blur
//                   className="search-input"
//                   style={{
//                     width: isExpanded ? "200px" : "120px", // Expand/collapse width
//                     transition: "width 0.3s ease", // Smooth transition
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Right side: Info, Sort, Grid/List Buttons */}
//             <div className="controls-container">
//               <button
//                 className="info-button"
//                 onClick={() => console.log("Info clicked")} // Log info click
//               >
//                 <FaInfoCircle className="info-icon" /> {/* Info icon */}
//               </button>
//               <button className="sort-button" onClick={handleSort}>
//                 <FaArrowUp className="sort-icon" /> {/* Sort up icon */}
//                 <FaArrowDown className="sort-icon" /> {/* Sort down icon */}
//               </button>
//               <button className="toggle-button" onClick={toggleView}>
//                 {isGridView ? (
//                   <FaTh className="toggle-icon" /> // Grid view icon
//                 ) : (
//                   <FaList className="toggle-icon" /> // List view icon
//                 )}
//               </button>
//             </div>
//           </div>
//         )}
//         {/* Center Buttons for Database (shown only if no database exists) */}
//         {databases.length === 0 &&
//           !showCreateDbModal &&
//           !showImportMediaModal &&
//           !showDisplayDbModal &&
//           !showPlusModal && (
//             <div className="center-buttons">
//               <button className="action-button open-database">
//                 Open a Database {/* Button to open a database */}
//               </button>
//               <button className="action-button connect-es-database">
//                 Connect to ES Database {/* Button to connect to ES database */}
//               </button>
//               <button className="action-button connect-live-video" disabled>
//                 Connect to Live Video {/* Disabled button for live video */}
//               </button>
//               <button
//                 className="action-button create-new-database"
//                 style={{
//                   background: isCreateButtonClicked
//                     ? "linear-gradient(to bottom, #2E7D32, #81C784)" // Gradient background when clicked
//                     : undefined,
//                 }}
//                 onClick={handleOpenCreateDatabase} // Open CreateNewDataBaseModal on click
//               >
//                 Create New Database {/* Button to create a new database */}
//               </button>
//             </div>
//           )}
//         {/* + Icon Modal (without Close button) */}
//         {showPlusModal && (
//           <div className="plus-modal">
//             <button
//               className="plus-modal-close"
//               onClick={() => setShowPlusModal(false)} // Close the plus modal on click
//             >
//               × {/* Close button */}
//             </button>
//             <h4 className="plusModalOpendatabase">Open A Database</h4>
//             <h4 className="plusModalConnectEs">Connect To ES Database</h4>
//             <button
//               className="plus-modal-button"
//               onClick={handleOpenCreateDatabase} // Open CreateNewDataBaseModal on click
//             >
//               Create New Database {/* Button to create a new database */}
//             </button>
//             <h4 className="plusModalConnecttoLive">Connect To Live Video</h4>
//           </div>
//         )}
//         {/* STEP 1: Create New Database Modal */}
//         {showCreateDbModal && (
//           <CreateNewDataBaseModal
//             onClose={() => {
//               setShowCreateDbModal(false); // Hide the CreateNewDataBaseModal
//               setIsCreateButtonClicked(false); // Reset the create button state
//             }}
//             onNext={(folders) => {
//               console.log("Received folders in UploadFiles:", folders); // Log the folders data for debugging
//               setFolderSelections(folders); // Set the folder selections state
//               setShowCreateDbModal(false); // Hide the CreateNewDataBaseModal
//               setShowImportMediaModal(true); // Show the ImportMediaModal
//             }}
//           />
//         )}
//         {/* STEP 2: Import Media Modal */}
//         {showImportMediaModal && (
//           <ImportMediaModal
//             folderSelections={folderSelections} // Pass the folder selections to ImportMediaModal
//             onClose={() => setShowImportMediaModal(false)} // Hide the ImportMediaModal on close
//             onNext={(structuredData) => {
//               console.log("Received structuredData in UploadFiles:", structuredData); // Log the structured data for debugging
//               setSelectedFolders(structuredData); // Set the selected folders state
//               setShowImportMediaModal(false); // Hide the ImportMediaModal
//               setShowDisplayDbModal(true); // Show the DisplayDataBaseModal
//             }}
//           />
//         )}
//         {/* STEP 3: Display Database Modal */}
//         {showDisplayDbModal && (
//           <DisplayDataBaseModal
//             onClose={() => setShowDisplayDbModal(false)} // Hide the DisplayDataBaseModal on close
//             onNext={handleDisplayDbNext} // Handle the "Next" action
//             selectedFolders={selectedFolders} // Pass the selected folders to DisplayDataBaseModal
//           />
//         )}
//         {/* Final Gallery Display on Main Page */}
//         {selectedDatabaseIndex !== null && !showDisplayDbModal && (
//           <div className="gallery-container">
//             <h3 className="gallery-title">Final Gallery</h3> {/* Gallery title */}
//             <div className="gallery-items">
//               {databases[selectedDatabaseIndex].files.map((file, index, arr) => {
//                 const fileUrl = URL.createObjectURL(file); // Create a URL for the file
//                 const fileId = `${file.name}-${file.lastModified}`; // Create a unique ID for the file
//                 const isExpanded = expandedFrames[fileId] || false; // Check if the file’s frames are expanded
//                 const associatedFrames = databases[
//                   selectedDatabaseIndex
//                 ].savedFrames.filter((frame) => frame.sourceFileId === fileId); // Get associated frames for the file
//                 return (
//                   <div
//                     key={index}
//                     className="gallery-item"
//                     onClick={() => handleImageClick(file)} // Handle image click
//                   >
//                     <div className="gallery-item-index">
//                       {index + 1} of {arr.length} {/* Display item index */}
//                     </div>
//                     <div className="gallery-item-media">
//                       {file.type.startsWith("image/") ? (
//                         <img
//                           src={fileUrl}
//                           alt={file.name}
//                           className="gallery-image" // Display image if file is an image
//                         />
//                       ) : file.type.startsWith("video/") ? (
//                         <video
//                           src={fileUrl}
//                           className="gallery-video"
//                           muted
//                           loop // Display video if file is a video
//                         >
//                           Your browser does not support the video tag.
//                         </video>
//                       ) : null}
//                     </div>
//                     <div className="gallery-item-details">
//                       <div className="gallery-item-name">{file.name}</div> {/* Display file name */}
//                       <div
//                         className="gallery-item-media-info"
//                         onClick={(e) => {
//                           e.stopPropagation(); // Prevent click from bubbling up
//                           handleMediaInfoClick(file); // Show media info on click
//                         }}
//                       >
//                         Media Info {/* Media Info link */}
//                       </div>
//                       {file.type.startsWith("video/") && (
//                         <div
//                           className="gallery-item-expand-frames"
//                           onClick={(e) => {
//                             e.stopPropagation(); // Prevent click from bubbling up
//                             handleExpandFrames(file); // Expand frames on click
//                           }}
//                         >
//                           Expand Frames{" "}
//                           {isExpanded ? <FaChevronUp /> : <FaChevronDown />} {/* Toggle expand/collapse icon */}
//                         </div>
//                       )}
//                       {isExpanded && (
//                         <div className="gallery-item-frames">
//                           {associatedFrames.length > 0 ? (
//                             <div className="gallery-item-frames-list">
//                               {associatedFrames.map((frame, frameIndex) => (
//                                 <div
//                                   key={frameIndex}
//                                   className="gallery-item-frame"
//                                 >
//                                   <img
//                                     src={frame.dataUrl}
//                                     alt={`Frame at ${formatTime(
//                                       frame.timestamp
//                                     )}`}
//                                     className="gallery-frame-image" // Display frame image
//                                   />
//                                   <p className="gallery-frame-timestamp">
//                                     {formatTime(frame.timestamp)} {/* Display frame timestamp */}
//                                   </p>
//                                 </div>
//                               ))}
//                             </div>
//                           ) : (
//                             <p className="gallery-no-frames">
//                               No frames saved for this video. {/* Message if no frames */}
//                             </p>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* Media Info Modal */}
//         {showMediaInfoModal && (
//           <div className="media-info-modal">
//             {/* Light blue header bar */}
//             <div className="media-info-header">
//               <h3>Media Info</h3> {/* Modal title */}
//               <button
//                 className="media-info-modal-close"
//                 onClick={() => setShowMediaInfoModal(false)} // Close the modal on click
//               >
//                 × {/* Close button */}
//               </button>
//             </div>
//             {/* Modal content */}
//             <div className="media-info-content">
//               <p>
//                 {mediaInfoFile
//                   ? `File Name: ${mediaInfoFile.name}`
//                   : "No file selected."} {/* Display file name or placeholder */}
//               </p>
//               <p>File type/Kind: </p> {/* Placeholder for file type */}
//               <p>File Size: </p> {/* Placeholder for file size */}
//               <p>Location: </p> {/* Placeholder for file location */}
//               <p>Created: </p> {/* Placeholder for creation date */}
//               <p>Resolution: </p> {/* Placeholder for resolution */}
//               <p>Duration: </p> {/* Placeholder for duration */}
//               <p>Frames: </p> {/* Placeholder for frames */}
//               <p>Codec: </p> {/* Placeholder for codec */}
//             </div>
//             {/* Footer with buttons */}
//             <div className="media-info-footer">
//               <button className="media-info-button">Open</button> {/* Open button */}
//               <button className="media-info-button">Send</button> {/* Send button */}
//               <button className="media-info-button media-info-close-button">
//                 Close {/* Close button */}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }








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
import "./uploadFiles.css";

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

  const { setSelectedImage, setUploadedFiles, finalSelectedImages, setFinalSelectedImages } = useContext(ImageContext);
  const [localFinalSelectedImages, setLocalFinalSelectedImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAscending, setIsAscending] = useState(true);
  const [isGridView, setIsGridView] = useState(false);
  const [isCreateButtonClicked, setIsCreateButtonClicked] = useState(false);

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
    };
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

  const handleExpandFrames = async (file) => {
    if (!file.type.startsWith("video/")) return;
    const fileId = `${file.name}-${file.lastModified}`;
    const isCurrentlyExpanded = expandedFrames[fileId] || false;

    setExpandedFrames((prev) => ({
      ...prev,
      [fileId]: !prev[fileId],
    }));

    if (!isCurrentlyExpanded && !frameData[fileId]) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("http://localhost:8000/extract-frames/", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) throw new Error("Failed to fetch frames");
        const data = await response.json();
        setFrameData((prev) => ({
          ...prev,
          [fileId]: data.frames,
        }));
      } catch (error) {
        console.error("Error fetching frames:", error);
        setFrameData((prev) => ({
          ...prev,
          [fileId]: [],
        }));
      }
    }
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
            <div className="gallery-items">
              {databases[selectedDatabaseIndex].files.map((file, index, arr) => {
                const fileUrl = URL.createObjectURL(file);
                const fileId = `${file.name}-${file.lastModified}`;
                const isExpanded = expandedFrames[fileId] || false;
                return (
                  <div
                    key={index}
                    className="gallery-item"
                    onClick={() => handleImageClick(file)}
                  >
                    <div className="gallery-item-index">{index + 1} of {arr.length}</div>
                    <div className="gallery-item-media">
                      {file.type.startsWith("image/") ? (
                        <img src={fileUrl} alt={file.name} className="gallery-image" />
                      ) : file.type.startsWith("video/") ? (
                        <video src={fileUrl} className="gallery-video" muted loop>
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
                          Expand Frames {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                      )}
                      {isExpanded && (
                        <div className="gallery-item-frames">
                          {frameData[fileId] && frameData[fileId].length > 0 ? (
                            <div className="gallery-item-frames-list">
                              {frameData[fileId].map((frame, frameIndex) => (
                                <div key={frameIndex} className="gallery-item-frame">
                                  <img
                                    src={frame.url}
                                    alt={`Frame at ${formatTime(frame.timestamp)}`}
                                    className="gallery-frame-image"
                                  />
                                  <p className="gallery-frame-timestamp">{formatTime(frame.timestamp)}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="gallery-no-frames">Loading frames or no frames available.</p>
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
      </div>
    </div>
  );
}