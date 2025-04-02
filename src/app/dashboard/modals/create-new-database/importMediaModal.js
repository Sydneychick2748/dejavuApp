
// "use client";
// import React, { useState, useRef } from "react";
// import { FaFolder, FaTimes, FaDownload } from "react-icons/fa";

// const ImportMediaModal = ({ folderSelections, onClose, onNext }) => {
//   const [subFolders, setSubFolders] = useState(
//     folderSelections?.mainFolder?.subFolders || []
//   ); // Start with all subfolders visible
//   const [saveLocation, setSaveLocation] = useState(null);
//   const saveInputRef = useRef(null);

//   const handleRemoveFolder = (index) => {
//     setSubFolders((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleSaveLocationClick = () => {
//     saveInputRef.current?.click();
//   };

//   const handleSaveLocationChange = (event) => {
//     const files = Array.from(event.target.files);
//     if (files.length > 0) {
//       const directoryPath = files[0].webkitRelativePath.split("/")[0];
//       setSaveLocation(directoryPath); // Store the selected directory name
//     }
//     event.target.value = null; // Reset input for re-selection
//   };

//   const handleSaveClick = () => {
//     if (subFolders.length === 0) {
//       alert("Please keep at least one subfolder in your database.");
//       return;
//     }

//     if (!saveLocation) {
//       alert("Please select a location to save your new database.");
//       return;
//     }

//     const structuredData = {
//       mainFolder: {
//         name: folderSelections.mainFolder.name,
//         subFolders: subFolders,
//       },
//       saveLocation: saveLocation,
//     };

//     console.log("Structured data to save:", structuredData);
//     onNext(structuredData);
//   };

//   const dynamicButtonStyle = {
//     padding: "8px 16px",
//     backgroundColor: subFolders.length === 0 ? "#ccc" : "#007BFF",
//     color: "white",
//     border: "none",
//     borderRadius: "20px",
//     width: "250px",
//     height: "30px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     lineHeight: "1",
//     paddingTop: "6px",
//     cursor: subFolders.length === 0 ? "not-allowed" : "pointer",
//     opacity: subFolders.length === 0 ? 0.6 : 1,
//     transition: "background-color 0.3s ease",
//   };

//   if (!folderSelections || !folderSelections.mainFolder) {
//     return (
//       <div className="modal" style={modalStyle}>
//         <div style={blueBarStyle}>
//           <div style={headerStyle}>
//             <h3 style={{ color: "black", margin: 0, fontSize: 15 }}>
//               Import Media
//             </h3>
//             <button onClick={onClose} style={closeButtonStyle}>
//               ×
//             </button>
//           </div>
//         </div>
//         <div style={contentStyle}>
//           <p>Error: No valid folder selections provided.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="modal" style={modalStyle}>
//       <div style={blueBarStyle}>
//         <div style={headerStyle}>
//           <h3 style={{ color: "black", margin: 0, fontSize: 15 }}>
//             Import Media
//           </h3>
//           <button onClick={onClose} style={closeButtonStyle}>
//             ×
//           </button>
//         </div>
//       </div>
//       <div style={contentStyle}>
//         <p style={{ display: "flex", alignItems: "center" }}>
//           <FaFolder size={24} style={{ color: "#FFD700", marginRight: "8px" }} />
//           Main Folder: <strong style={{ marginLeft: "4px" }}>{folderSelections.mainFolder.name}</strong>
//         </p>
//         <p>Subfolders in your database (click X to remove):</p>
//         <div style={{ marginTop: "10px", maxHeight: "150px", overflowY: "auto" }}>
//           {subFolders.length > 0 ? (
//             <ul style={{ listStyleType: "none", padding: 0 }}>
//               {subFolders.map((subFolder, index) => (
//                 <li
//                   key={index}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     marginBottom: "8px",
//                     padding: "8px",
//                     borderRadius: "4px",
//                   }}
//                 >
//                   <FaFolder size={24} style={{ marginRight: "8px", color: "#007BFF" }} />
//                   <div style={{ flex: 1 }}>
//                     <div style={{ fontWeight: "bold", color: "black" }}>
//                       {subFolder.name || "Unnamed Subfolder"}
//                     </div>
//                     <div style={{ fontSize: "0.9rem", color: "#555" }}>
//                       {subFolder.files?.length || 0} file{subFolder.files?.length !== 1 ? "s" : ""}
//                     </div>
//                   </div>
//                   <FaTimes
//                     size={20}
//                     style={{ color: "#FF4444", cursor: "pointer", marginLeft: "8px" }}
//                     onClick={() => handleRemoveFolder(index)}
//                   />
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>No subfolders remaining. Add more or proceed with an empty database.</p>
//           )}
//         </div>

//         {/* Save Location Input with Icon */}
//         <div style={{ margin: "10px 0" }}>
//           <p>Save your new database to:</p>
//           <div
//             onClick={handleSaveLocationClick}
//             style={{
//               border: "2px dashed #007BFF",
//               borderRadius: "8px",
//               padding: "10px",
//               textAlign: "center",
//               backgroundColor: "#F9FAFB",
//               cursor: "pointer",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <FaDownload size={20} style={{ color: "#007BFF", marginRight: "8px" }} />
//             {saveLocation ? (
//               <span style={{ color: "#0056D2" }}>Save to: {saveLocation}</span>
//             ) : (
//               <span style={{ color: "#555" }}>Click to select save location</span>
//             )}
//           </div>
//           <input
//             type="file"
//             ref={saveInputRef}
//             onChange={handleSaveLocationChange}
//             webkitdirectory="true"
//             directory="true"
//             style={{ display: "none" }}
//           />
//           <div style={{ fontSize: "12px", color: "#555", marginTop: "5px" }}>
//             Select a folder on your computer to save the new database.
//           </div>
//         </div>

//         <div style={buttonContainerStyle}>
//           <button
//             onClick={handleSaveClick}
//             style={dynamicButtonStyle}
//             disabled={subFolders.length === 0}
//           >
//             Save Database
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Styles
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
//   width: "600px",
//   height: "55vh",
//   overflowY: "auto",
//   boxShadow: "0 4px 15px rgba(0, 0, 123, 0.2)",
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
//   padding: "20px",
//   color: "black",
//   display: "flex",
//   flexDirection: "column",
//   minHeight: "400px",
//   justifyContent: "space-between",
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
//   transition: "background-color 0.3s ease",
// };
// const buttonContainerStyle = {
//   marginTop: "auto",
//   display: "flex",
//   justifyContent: "flex-end",
// };

// export default ImportMediaModal;


"use client";
import React, { useState } from "react";
import { FaFolder, FaTimes, FaDownload } from "react-icons/fa";

const ImportMediaModal = ({ folderSelections, onClose, onNext }) => {
  const [subFolders, setSubFolders] = useState(
    folderSelections?.mainFolder?.subFolders || []
  );
  const [saveLocation, setSaveLocation] = useState(null); // Will hold DirectoryHandle

  const handleRemoveFolder = (index) => {
    setSubFolders((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveLocationClick = async () => {
    try {
      if (!window.showDirectoryPicker) {
        alert("Your browser doesn’t support directory selection. Please use Chrome or Edge.");
        return;
      }
      const directoryHandle = await window.showDirectoryPicker();
      setSaveLocation(directoryHandle);
      console.log("Save location selected:", directoryHandle.name);
    } catch (error) {
      console.error("Error selecting save location:", error);
      alert("Failed to select save location. Please try again.");
    }
  };

  const handleSaveClick = async () => {
    if (subFolders.length === 0) {
      alert("Please keep at least one subfolder in your database.");
      return;
    }

    if (!saveLocation) {
      alert("Please select a location to save your new database.");
      return;
    }

    try {
      // Create main folder
      const mainFolderHandle = await saveLocation.getDirectoryHandle(
        folderSelections.mainFolder.name,
        { create: true }
      );

      // Create subfolders and write files
      for (const subFolder of subFolders) {
        const subFolderHandle = await mainFolderHandle.getDirectoryHandle(
          subFolder.name,
          { create: true }
        );
        for (const file of subFolder.files) {
          const fileHandle = await subFolderHandle.getFileHandle(file.name, {
            create: true,
          });
          const writable = await fileHandle.createWritable();
          await writable.write(file);
          await writable.close();
        }
      }

      const structuredData = {
        mainFolder: {
          name: folderSelections.mainFolder.name,
          subFolders: subFolders,
        },
        saveLocation: saveLocation.name, // For logging or passing to next step
      };

      console.log("Database saved successfully:", structuredData);
      onNext(structuredData); // Proceed to next modal
    } catch (error) {
      console.error("Error saving database:", error);
      alert("Failed to save the database. Please try again.");
    }
  };

  const dynamicButtonStyle = {
    padding: "8px 16px",
    backgroundColor: subFolders.length === 0 ? "#ccc" : "#007BFF",
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
    cursor: subFolders.length === 0 ? "not-allowed" : "pointer",
    opacity: subFolders.length === 0 ? 0.6 : 1,
    transition: "background-color 0.3s ease",
  };

  if (!folderSelections || !folderSelections.mainFolder) {
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
          <p>Error: No valid folder selections provided.</p>
        </div>
      </div>
    );
  }

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
        <p style={{ display: "flex", alignItems: "center" }}>
          <FaFolder size={24} style={{ color: "#FFD700", marginRight: "8px" }} />
          Main Folder:{" "}
          <strong style={{ marginLeft: "4px" }}>
            {folderSelections.mainFolder.name}
          </strong>
        </p>
        <p>Subfolders in your database (click X to remove):</p>
        <div style={{ marginTop: "10px", maxHeight: "150px", overflowY: "auto" }}>
          {subFolders.length > 0 ? (
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {subFolders.map((subFolder, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                    padding: "8px",
                    borderRadius: "4px",
                  }}
                >
                  <FaFolder
                    size={24}
                    style={{ marginRight: "8px", color: "#007BFF" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "bold", color: "black" }}>
                      {subFolder.name || "Unnamed Subfolder"}
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#555" }}>
                      {subFolder.files?.length || 0} file
                      {subFolder.files?.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <FaTimes
                    size={20}
                    style={{ color: "#FF4444", cursor: "pointer", marginLeft: "8px" }}
                    onClick={() => handleRemoveFolder(index)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p>No subfolders remaining. Add more or proceed with an empty database.</p>
          )}
        </div>

        {/* Save Location Selection */}
        <div style={{ margin: "10px 0" }}>
          <p>Save your new database to:</p>
          <div
            onClick={handleSaveLocationClick}
            style={{
              border: "2px dashed #007BFF",
              borderRadius: "8px",
              padding: "10px",
              textAlign: "center",
              backgroundColor: "#F9FAFB",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaDownload size={20} style={{ color: "#007BFF", marginRight: "8px" }} />
            {saveLocation ? (
              <span style={{ color: "#0056D2" }}>Save to: {saveLocation.name}</span>
            ) : (
              <span style={{ color: "#555" }}>Click to select save location</span>
            )}
          </div>
          <div style={{ fontSize: "12px", color: "#555", marginTop: "5px" }}>
            Select a folder on your computer to save the new database.
          </div>
        </div>

        <div style={buttonContainerStyle}>
          <button
            onClick={handleSaveClick}
            style={dynamicButtonStyle}
            disabled={subFolders.length === 0}
          >
            Save Database
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles (unchanged)
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
  height: "55vh",
  overflowY: "auto",
  boxShadow: "0 4px 15px rgba(0, 0, 123, 0.2)",
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
  minHeight: "400px",
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
};

const buttonContainerStyle = {
  marginTop: "auto",
  display: "flex",
  justifyContent: "flex-end",
};

export default ImportMediaModal;