

// "use client";
// import { color } from "@chakra-ui/system";
// import React, { useState } from "react";
// import { FaFolder } from "react-icons/fa";
// const ImportMediaModal = ({ folderSelections, onClose, onNext }) => {
//   const [selectedIndices, setSelectedIndices] = useState([]);
//   const handleFolderClick = (index, folder) => {
//     console.log("Folder clicked:", folder);
//     setSelectedIndices((prev) =>
//       prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
//     );
//   };
//   const handleNextClick = () => {
//     if (selectedIndices.length > 0) {
//       const selectedFolders = selectedIndices.map((index) => folderSelections[index]);
//       console.log("Selected folders from ImportMediaModal:", selectedFolders);
//       onNext(selectedFolders);
//     }
//   };
//   return (
//     <div className="modal" style={modalStyle}>
//       <div style={blueBarStyle}>
//         <div style={headerStyle}>
//           <h3 style={{ color: "black", margin: 0, fontSize: 15 }}>
//             Import Media
//           </h3>
//           <button onClick={onClose} style={closeButtonStyle}>
//             × {/* Unicode "X" character */}
//           </button>
//         </div>
//       </div>
//       <div style={contentStyle}>
//         <p>Select one or more folders from the list below:</p>
//         <div style={{ marginTop: "10px" }}>
//           {folderSelections && folderSelections.length > 0 ? (
//             <ul style={{ listStyleType: "none", padding: 0 }}>
//               {folderSelections
//                 .filter((folder) => folder)
//                 .map((folder, index) => (
//                   <li
//                     key={index}
//                     onClick={() => handleFolderClick(index, folder)}
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       marginBottom: "8px",
//                       padding: "8px",
//                       border: selectedIndices.includes(index)
//                         ? "2px solid blue"
//                         : "1px solid #ccc",
//                       borderRadius: "4px",
//                       cursor: "pointer",
//                     }}
//                   >
//                     <FaFolder size={24} style={{ marginRight: "8px" }} />
//                     <div>
//                       <div style={{ fontWeight: "bold" }}>
//                         {folder.folderName || "Unnamed Folder"}
//                       </div>
//                       <div style={{ fontSize: "0.9rem", color: "#555" }}>
//                         {folder.files?.length || 0} file
//                         {(folder.files?.length || 0) !== 1 ? "s" : ""}
//                       </div>
//                     </div>
//                   </li>
//                 ))}
//             </ul>
//           ) : (
//             <p>No folder selections available.</p>
//           )}
//         </div>
//         <div style={{ marginTop: "20px" }}>
//           <button
//             onClick={handleNextClick}
//             style={buttonStyle}
//             disabled={selectedIndices.length === 0}
//           >
//             Select
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
// const modalStyle = {
//   position: "fixed",
//   top: "50%",
//   left: "45%",
//   color: "black",
//   transform: "translate(-50%, -50%)",
//   backgroundColor: "white",
//   borderRadius: "8px",
//   zIndex: 1000,
//   display: "block",
//   width: "600px", // Increased from 400px to make it larger
//   height: "45vh", // Optional: Limits height to 80% of viewport height
//   overflowY: "auto", // Optional: Adds scroll if content exceeds maxHeight
// };
// const blueBarStyle = {
//   width: "100%",
//   backgroundColor: "#EEF2FF", // Pure blue - you can adjust this color
//   borderRadius: "8px 8px 0 0", // Rounded only at the top
// };
// const headerStyle = {
//   padding: "10px 20px",
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
// };
// const contentStyle = {
//   padding: "20px",
// };
// const closeButtonStyle = {
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
// };
// const buttonStyle = {
//   padding: "8px 16px",
//   marginRight: "10px"
// };
// export default ImportMediaModal;
// "use client";
// import { color } from "@chakra-ui/system";
// import React, { useState } from "react";
// import { FaFolder } from "react-icons/fa";
// const ImportMediaModal = ({ folderSelections, onClose, onNext }) => {
//   const [selectedIndices, setSelectedIndices] = useState([]);
//   const handleFolderClick = (index, folder) => {
//     console.log("Folder clicked:", folder);
//     setSelectedIndices((prev) =>
//       prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
//     );
//   };
//   const handleNextClick = () => {
//     if (selectedIndices.length > 0) {
//       const selectedFolders = selectedIndices.map(
//         (index) => folderSelections[index]
//       );
//       console.log("Selected folders from ImportMediaModal:", selectedFolders);
//       onNext(selectedFolders);
//     }
//   };
//   // Define button style dynamically based on selectedIndices
//   const dynamicButtonStyle = {
//     padding: "10px 20px",
//     backgroundColor: selectedIndices.length === 0 ? "#ccc" : "#007BFF", // Gray when disabled, blue when enabled
//     color: "white",
//     border: "none",
//     borderRadius: "20px",
//     height: "30px",
//     width: "200px",
//     display: "flex", // Added to control text alignment
//     alignItems: "center", // Centers text vertically
//     justifyContent: "center", // Centers text horizontally
//     lineHeight: "1", // Reduces default line height to move text up slightly
//     paddingTop: "6px", // Adjusts padding to shift text up within button
//     cursor: selectedIndices.length === 0 ? "not-allowed" : "pointer",
//     opacity: selectedIndices.length === 0 ? 0.6 : 1,
//   };
//   return (
//     <div className="modal" style={modalStyle}>
//       <div style={blueBarStyle}>
//         <div style={headerStyle}>
//           <h3 style={{ color: "black", margin: 0, fontSize: 15 }}>
//             Import Media
//           </h3>
//           <button onClick={onClose} style={closeButtonStyle}>
//             × {/* Unicode "X" character */}
//           </button>
//         </div>
//       </div>
//       <div style={contentStyle}>
//         <p>Select one or more folders from the list below:</p>
//         <div style={{ marginTop: "10px" }}>
//           {folderSelections && folderSelections.length > 0 ? (
//             <ul style={{ listStyleType: "none", padding: 0 }}>
//               {folderSelections
//                 .filter((folder) => folder)
//                 .map((folder, index) => (
//                   <li
//                     key={index}
//                     onClick={() => handleFolderClick(index, folder)}
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       marginBottom: "8px",
//                       padding: "8px",
//                       border: selectedIndices.includes(index)
//                         ? "2px solid blue"
//                         : "1px solid #ccc",
//                       borderRadius: "4px",
//                       cursor: "pointer",
//                     }}
//                   >
//                     <FaFolder size={24} style={{ marginRight: "8px" }} />
//                     <div>
//                       <div style={{ fontWeight: "bold" }}>
//                         {folder.folderName || "Unnamed Folder"}
//                       </div>
//                       <div style={{ fontSize: "0.9rem", color: "#555" }}>
//                         {folder.files?.length || 0} file
//                         {(folder.files?.length || 0) !== 1 ? "s" : ""}
//                       </div>
//                     </div>
//                   </li>
//                 ))}
//             </ul>
//           ) : (
//             <p>No folder selections available.</p>
//           )}
//         </div>
//         <div style={buttonContainerStyle}>
//           <button
//             onClick={handleNextClick}
//             style={dynamicButtonStyle}
//             disabled={selectedIndices.length === 0}
//           >
//             Select
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
// const modalStyle = {
//   position: "fixed",
//   top: "50%",
//   left: "45%",
//   transform: "translate(-50%, -50%)",
//   backgroundColor: "white",
//   borderRadius: "8px",
//   color: "black",
//   zIndex: 1000,
//   display: "block",
//   width: "600px", // Increased from 400px to make it larger
//   height: "45vh", // Optional: Limits height to 80% of viewport height
//   overflowY: "auto", // Optional: Adds scroll if content exceeds maxHeight
// };
// const blueBarStyle = {
//   width: "100%",
//   backgroundColor: "#EEF2FF",
//   borderRadius: "8px 8px 0 0",
// };
// const headerStyle = {
//   padding: "10px 20px",
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
// };
// const contentStyle = {
//   padding: "5px 10px",
// };
// const closeButtonStyle = {
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
// };
// const buttonContainerStyle = {
//   marginTop: "150px",
//   display: "flex",
//   justifyContent: "flex-end", // Moves button to the right
// };
// export default ImportMediaModal;

"use client";
import React, { useState } from "react";
import { FaFolder } from "react-icons/fa";

const ImportMediaModal = ({ folderSelections, onClose, onNext }) => {
  const [selectedIndices, setSelectedIndices] = useState([]);

  const handleFolderClick = (index, folder) => {
    console.log("Folder clicked:", folder);
    setSelectedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleNextClick = () => {
    if (selectedIndices.length > 0) {
      const selectedFolders = selectedIndices.map(
        (index) => folderSelections[index]
      );
      console.log("Selected folders from ImportMediaModal:", selectedFolders);
      onNext(selectedFolders);
    }
  };

  // Define button style dynamically based on selectedIndices
  const dynamicButtonStyle = {
    padding: "8px 16px",
    backgroundColor: selectedIndices.length === 0 ? "#ccc" : "#007BFF", // Gray when disabled, blue when enabled
    color: "white",
    border: "none",
    borderRadius: "20px",
    width: "250px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: "1",
    paddingTop: "6px",
    cursor: selectedIndices.length === 0 ? "not-allowed" : "pointer",
    opacity: selectedIndices.length === 0 ? 0.6 : 1,
    transition: "background-color 0.3s ease",
    ":hover": {
      backgroundColor: selectedIndices.length === 0 ? "#ccc" : "#0056D2",
    },
  };

  return (
    <div className="modal" style={modalStyle}>
      <div style={blueBarStyle}>
        <div style={headerStyle}>
          <h3 style={{ color: "black", margin: 0, fontSize: 15 }}>
            Import Media
          </h3>
          <button onClick={onClose} style={closeButtonStyle}>
            ×
          </button>
        </div>
      </div>
      <div style={contentStyle}>
        <p>Select one or more folders from the list below:</p>
        <div style={{ marginTop: "10px" }}>
          {folderSelections && folderSelections.length > 0 ? (
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {folderSelections
                .filter((folder) => folder)
                .map((folder, index) => (
                  <li
                    key={index}
                    onClick={() => handleFolderClick(index, folder)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "8px",
                      padding: "8px",
                      borderRadius: "4px", // Keep rounded corners for a sleek look
                      cursor: "pointer",
                      backgroundColor: selectedIndices.includes(index)
                        ? "#E0E7FF" // Light blue background when selected
                        : "transparent", // No background when unselected
                      transition: "background-color 0.3s ease", // Smooth background transition
                    }}
                  >
                    <FaFolder
                      size={24}
                      style={{ marginRight: "8px", color: "#007BFF" }}
                    />
                    <div>
                      <div
                        style={{
                          fontWeight: selectedIndices.includes(index)
                            ? "bold"
                            : "bold", // Keep bold for folder name
                          color: selectedIndices.includes(index)
                            ? "#0056D2" // Darker blue when selected
                            : "black", // Default black when unselected
                          transition: "color 0.3s ease", // Smooth color transition
                        }}
                      >
                        {folder.folderName || "Unnamed Folder"}
                      </div>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          color: selectedIndices.includes(index)
                            ? "#0056D2" // Darker blue when selected
                            : "#555", // Default gray when unselected
                          transition: "color 0.3s ease", // Smooth color transition
                        }}
                      >
                        {folder.files?.length || 0} file
                        {(folder.files?.length || 0) !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          ) : (
            <p>No folder selections available.</p>
          )}
        </div>
        <div style={buttonContainerStyle}>
          <button
            onClick={handleNextClick}
            style={dynamicButtonStyle}
            disabled={selectedIndices.length === 0}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles (Updated to remove border and highlight text)
const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "45%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  borderRadius: "8px",
  color: "black",
  zIndex: 1000,
  display: "block",
  width: "600px",
  height: "45vh",
  overflowY: "auto",
  boxShadow: "0 4px 15px rgba(0, 0, 123, 0.2)", // Subtle blue-tinted shadow
};

const blueBarStyle = {
  width: "100%",
  backgroundColor: "#EEF2FF",
  borderRadius: "8px 8px 0 0",
};

const headerStyle = {
  padding: "10px 20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const contentStyle = {
  padding: "20px",
  color: "black",
  display: "flex",
  flexDirection: "column",
  minHeight: "300px",
  justifyContent: "space-between",
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

const buttonContainerStyle = {
  marginTop: "auto",
  display: "flex",
  justifyContent: "flex-end",
};

export default ImportMediaModal;
