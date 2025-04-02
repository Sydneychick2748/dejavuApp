"use client";
import React, { useState } from "react";
import { FaFolder, FaTimes, FaDownload, FaArrowRight, FaFolderOpen } from "react-icons/fa";

// ImportMediaModal component to display and manage imported media folders
const ImportMediaModal = ({ folderSelections, onClose, onNext }) => {
  // State to manage the list of subfolders, initialized with folderSelections from props
  const [subFolders, setSubFolders] = useState(
    folderSelections?.mainFolder?.subFolders || []
  );

  // Function to remove a folder at the given index
  const handleRemoveFolder = (index) => {
    setSubFolders((prev) => prev.filter((_, i) => i !== index)); // Filter out the folder at the specified index
  };

  // Function to handle the "Save Database" button click, creating a ZIP file
  const handleSaveClick = async () => {
    if (subFolders.length === 0) {
      alert("Please keep at least one subfolder in your database."); // Alert if no subfolders are present
      return;
    }

    // Prepare the structured data for saving
    const structuredData = {
      mainFolder: {
        name: folderSelections.mainFolder.name, // Main folder name from folderSelections
        subFolders: subFolders, // List of subfolders
      },
    };

    try {
      // Create FormData to send to the backend
      const formData = new FormData();
      formData.append("main_folder_name", structuredData.mainFolder.name); // Add main folder name to FormData

      // Recursively collect all files from the folder structure
      const collectFiles = (folders, currentPath = "") => {
        folders.forEach((folder) => {
          const folderPath = currentPath ? `${currentPath}/${folder.name}` : folder.name; // Build the folder path
          // Add files at this level
          folder.files.forEach((file, fileIndex) => {
            formData.append(
              "subfolders",
              file,
              `${folderPath}/${file.name}` // Add file to FormData with its path
            );
          });
          // Recurse into subfolders
          if (folder.subFolders && folder.subFolders.length > 0) {
            collectFiles(folder.subFolders, folderPath); // Recursively collect files from subfolders
          }
        });
      };

      collectFiles(subFolders); // Collect all files into FormData

      // Send the FormData to the backend
      const response = await fetch("http://localhost:8000/save-database", {
        method: "POST",
        body: formData, // Send FormData with files
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save database: ${response.status} - ${errorText}`); // Throw error if response is not OK
      }

      // Handle the ZIP file download
      const blob = await response.blob(); // Get the response as a blob
      const url = window.URL.createObjectURL(blob); // Create a URL for the blob
      const link = document.createElement("a"); // Create a link element
      link.href = url; // Set the link href to the blob URL
      link.download = `${structuredData.mainFolder.name}.zip`; // Set the download filename
      document.body.appendChild(link); // Add the link to the DOM
      link.click(); // Trigger the download
      document.body.removeChild(link); // Remove the link from the DOM
      window.URL.revokeObjectURL(url); // Revoke the blob URL

      console.log("Database saved successfully:", structuredData); // Log success
      alert(
        `Database "${structuredData.mainFolder.name}" downloaded as a ZIP file! Choose your save location in the browser prompt (or find it in Downloads), then unzip to access the folder.` // Alert user of successful download
      );
    } catch (error) {
      console.error("Detailed error saving database:", error); // Log error
      alert(`Failed to save the database: ${error.message}`); // Alert user of error
    }
  };

  // Function to handle the "Next" button click, proceeding to the next modal
  const handleNextClick = () => {
    if (subFolders.length === 0) {
      alert("Please keep at least one subfolder in your database."); // Alert if no subfolders are present
      return;
    }

    // Prepare the structured data for the next modal
    const structuredData = {
      mainFolder: {
        name: folderSelections.mainFolder.name, // Main folder name
        subFolders: subFolders, // List of subfolders
      },
    };

    console.log("Proceeding to next modal with:", structuredData); // Log the data being passed
    onNext(structuredData); // Call the onNext callback with the structured data
  };

  // Function to style buttons dynamically based on disabled state
  const dynamicButtonStyle = (isDisabled) => ({
    padding: "8px 16px", // Set padding for buttons
    backgroundColor: isDisabled ? "#ccc" : "#007BFF", // Gray if disabled, blue if enabled
    color: "white", // White text color
    border: "none", // No border
    borderRadius: "20px", // Rounded corners
    width: "250px", // Fixed width
    height: "30px", // Fixed height
    display: "flex", // Flexbox layout
    alignItems: "center", // Center vertically
    justifyContent: "center", // Center horizontally
    lineHeight: "1", // Line height for text
    paddingTop: "6px", // Adjust padding for alignment
    cursor: isDisabled ? "not-allowed" : "pointer", // Cursor style based on disabled state
    opacity: isDisabled ? 0.6 : 1, // Opacity based on disabled state
    transition: "background-color 0.3s ease", // Smooth background color transition
    margin: "0 10px", // Horizontal margin between buttons
  });

  // Calculate folder and file counts recursively
  const calculateFolderStats = (folders) => {
    let folderCount = folders.length; // Count of top-level folders
    let subFolderCount = 0; // Count of subfolders
    let fileCount = 0; // Count of files

    folders.forEach((folder) => {
      fileCount += folder.files?.length || 0; // Add files at this level
      if (folder.subFolders && folder.subFolders.length > 0) {
        const subStats = calculateFolderStats(folder.subFolders); // Recursively calculate stats for subfolders
        subFolderCount += subStats.folderCount; // Add subfolder count
        fileCount += subStats.fileCount; // Add file count from subfolders
      }
    });

    return { folderCount, subFolderCount, fileCount }; // Return the calculated stats
  };

  const { folderCount, subFolderCount, fileCount } = calculateFolderStats(subFolders); // Calculate stats for subfolders

  // Handle case where folderSelections or mainFolder is not provided
  if (!folderSelections || !folderSelections.mainFolder) {
    return (
      <div className="modal" style={modalStyle}>
        <div style={blueBarStyle}>
          <div style={headerStyle}>
            <h3 style={{ color: "black", margin: 0, fontSize: 15 }}>
              Import Media {/* Modal title */}
            </h3>
            <button onClick={onClose} style={closeButtonStyle}>
              × {/* Close button */}
            </button>
          </div>
        </div>
        <div style={contentStyle}>
          <p>Error: No valid folder selections provided.</p> {/* Error message */}
        </div>
      </div>
    );
  }

  return (
    <div className="modal" style={modalStyle}>
      <div style={blueBarStyle}>
        <div style={headerStyle}>
          <h3 style={{ color: "black", margin: 0, fontSize: 15 }}>
            Import Media {/* Modal title */}
          </h3>
          <button onClick={onClose} style={closeButtonStyle}>
            × {/* Close button */}
          </button>
        </div>
      </div>
      <div style={contentStyle}>
        {/* Main Folder Section */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "10px", height: "24px" }}>
          <FaFolder size={24} style={{ color: "#FFD700", marginRight: "8px", flexShrink: 0 }} /> {/* Main folder icon */}
          <span style={{ lineHeight: "24px" }}>
            Main Folder:{" "}
            <strong>
              {folderSelections.mainFolder.name} {/* Display main folder name */}
            </strong>
          </span>
        </div>
        {/* Subfolders Section */}
        <p>
          Subfolders in your database ({folderCount} folders, {subFolderCount} subfolders, {fileCount} files) (click X to remove): {/* Display folder stats */}
        </p>
        <div style={{ marginTop: "10px", maxHeight: "150px", overflowY: "auto" }}>
          {subFolders.length > 0 ? (
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {subFolders.map((subFolder, index) => {
                // Calculate total files for this folder, including subfolders
                const subStats = calculateFolderStats(subFolder.subFolders || []);
                const totalFiles = (subFolder.files?.length || 0) + subStats.fileCount;
                return (
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
                    /> {/* Top-level folder icon */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "bold", color: "black" }}>
                        {subFolder.name || "Unnamed Subfolder"} {/* Folder name */}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "#555" }}>
                        {totalFiles} file{totalFiles !== 1 ? "s" : ""} {/* Display total file count */}
                        {subFolder.subFolders?.length > 0 && (
                          <span>
                            , {subFolder.subFolders.length} subfolder{subFolder.subFolders.length !== 1 ? "s" : ""} {/* Display subfolder count */}
                          </span>
                        )}
                      </div>
                      {/* Render subfolders if they exist */}
                      {subFolder.subFolders?.length > 0 && (
                        <ul style={{ listStyleType: "none", padding: 0, marginLeft: "20px" }}>
                          {subFolder.subFolders.map((nestedFolder, nestedIndex) => (
                            <li
                              key={nestedIndex}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "8px",
                                padding: "8px",
                                borderRadius: "4px",
                              }}
                            >
                              <FaFolderOpen
                                size={20}
                                style={{ marginRight: "8px", color: "#0056D2" }}
                              /> {/* Subfolder icon */}
                              <div>
                                <div>{nestedFolder.name}</div> {/* Subfolder name */}
                                <div style={{ fontSize: "0.8rem", color: "#555" }}>
                                  {nestedFolder.files?.length || 0} file{nestedFolder.files?.length !== 1 ? "s" : ""} {/* Subfolder file count */}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {/* X button only for top-level folder */}
                    <FaTimes
                      size={20}
                      style={{ color: "#FF4444", cursor: "pointer", marginLeft: "8px" }}
                      onClick={() => handleRemoveFolder(index)} // Remove the entire folder on click
                    />
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No subfolders remaining. Add more or proceed with an empty database.</p> // Message if no subfolders
          )}
        </div>

        {/* Action Buttons */}
        <div style={buttonContainerStyle}>
          <button
            onClick={handleSaveClick} // Save database on click
            style={dynamicButtonStyle(subFolders.length === 0)} // Style based on disabled state
            disabled={subFolders.length === 0} // Disable if no subfolders
          >
            <FaDownload style={{ marginRight: "8px" }} /> {/* Download icon */}
            Save Database {/* Button text */}
          </button>
          <button
            onClick={handleNextClick} // Proceed to next modal on click
            style={dynamicButtonStyle(subFolders.length === 0)} // Style based on disabled state
            disabled={subFolders.length === 0} // Disable if no subfolders
          >
            Next {/* Button text */}
            <FaArrowRight style={{ marginLeft: "8px" }} /> {/* Arrow right icon */}
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles (unchanged)
const modalStyle = {
  position: "fixed", // Fixed position for modal
  top: "50%", // Center vertically
  left: "45%", // Center horizontally
  transform: "translate(-50%, -50%)", // Adjust for centering
  backgroundColor: "white", // White background
  borderRadius: "8px", // Rounded corners
  color: "black", // Black text
  zIndex: 1000, // High z-index to appear above other elements
  display: "block", // Block display
  width: "600px", // Fixed width
  height: "55vh", // Fixed height
  overflowY: "auto", // Scrollable if content overflows
  boxShadow: "0 4px 15px rgba(0, 0, 123, 0.2)", // Subtle shadow
};

const blueBarStyle = {
  width: "100%", // Full width
  backgroundColor: "#EEF2FF", // Light blue background
  borderRadius: "8px 8px 0 0", // Rounded top corners
};

const headerStyle = {
  padding: "10px 20px", // Padding for header
  display: "flex", // Flexbox layout
  justifyContent: "space-between", // Space between title and close button
  alignItems: "center", // Center vertically
};

const contentStyle = {
  padding: "20px", // Padding for content
  color: "black", // Black text
  display: "flex", // Flexbox layout
  flexDirection: "column", // Column layout
  minHeight: "400px", // Minimum height
  justifyContent: "space-between", // Space between sections
};

const closeButtonStyle = {
  width: "24px", // Fixed width
  height: "24px", // Fixed height
  backgroundColor: "white", // White background
  borderRadius: "50%", // Circular shape
  border: "none", // No border
  color: "black", // Black text
  fontSize: "16px", // Font size
  fontWeight: "400", // Font weight
  display: "flex", // Flexbox layout
  alignItems: "center", // Center vertically
  justifyContent: "center", // Center horizontally
  cursor: "pointer", // Pointer cursor
  padding: 0, // No padding
  transition: "background-color 0.3s ease", // Smooth background transition
};

const buttonContainerStyle = {
  marginTop: "auto", // Push to bottom
  display: "flex", // Flexbox layout
  justifyContent: "flex-end", // Align buttons to the right
};

const summaryStyle = {
  display: "flex", // Flexbox layout
  alignItems: "center", // Center items vertically
  marginBottom: "8px", // Space between items
};

export default ImportMediaModal;