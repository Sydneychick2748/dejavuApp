// 

"use client";
import React, { useState, useContext, useEffect } from "react";
import CreateNewDataBaseModal from "../modals/create-new-database/createNewDataBaseModal";
import ImportMediaModal from "../modals/create-new-database/importMediaModal";
import DisplayDataBaseModal from "../modals/create-new-database/displayDataBaseModal";
import { ImageContext } from "@/contexts/ImageContext";
import { FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";

// Reusable button styles
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

const headerButtonStyle = {
  padding: "4px 8px",
  fontSize: "12px",
  cursor: "pointer",
  backgroundColor: "transparent",
  border: "1px solid white",
  borderRadius: "4px",
  color: "white",
  _hover: { bg: "rgba(255, 255, 255, 0.2)" },
};

export default function UploadFiles() {
  // Modal chain states
  const [showCreateDbModal, setShowCreateDbModal] = useState(false);
  const [showImportMediaModal, setShowImportMediaModal] = useState(false);
  const [showDisplayDbModal, setShowDisplayDbModal] = useState(false);
  const [showPlusModal, setShowPlusModal] = useState(false);

  // State for folder selections and databases
  const [folderSelections, setFolderSelections] = useState([]);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [databases, setDatabases] = useState([]);
  const [selectedDatabaseIndex, setSelectedDatabaseIndex] = useState(null);

  // State for Media Info and frame expansion
  const [showMediaInfoModal, setShowMediaInfoModal] = useState(false);
  const [mediaInfoFile, setMediaInfoFile] = useState(null);
  const [isFramesExpanded, setIsFramesExpanded] = useState(false);

  // Image context and local state
  const { setSelectedImage, setUploadedFiles, finalSelectedImages, setFinalSelectedImages } = useContext(ImageContext);
  const [localFinalSelectedImages, setLocalFinalSelectedImages] = useState([]);

  // Search and UI states
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAscending, setIsAscending] = useState(true);
  const [items, setItems] = useState(["Banana", "Apple", "Cherry", "Date"]);
  const [isGridView, setIsGridView] = useState(false);

  // State to track if the Create New Database button is clicked
  const [isCreateButtonClicked, setIsCreateButtonClicked] = useState(false);

  // Sync local state with context
  useEffect(() => {
    setFinalSelectedImages(localFinalSelectedImages);
  }, [localFinalSelectedImages, setFinalSelectedImages]);

  // Handle image and database operations
  const handleImageClick = (file) => {
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
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
  };

  // UI interaction handlers
  const handleSort = () => {
    setIsAscending(!isAscending);
    // Add sorting logic for items if needed
  };

  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  const handleOpenCreateDatabase = () => {
    setShowCreateDbModal(true);
    setShowPlusModal(false);
  };

  const handleCombinedClick = () => {
    handleOpenCreateDatabase();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "90%",
        height: "650px",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
        paddingBottom: "40px",
        marginTop: "30px",
        marginLeft: "30px",
        
      }}
    >
      {/* Top Navigation: Search and Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "10px",
        }}
      >
        {/* Left side: Search Input & + Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={handleOpenCreateDatabase}
            style={{
              width: "30px",
              height: "30px",
              fontSize: "40px",
              fontWeight: "300",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#d6d6d6",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: "2",
              paddingBottom: "5px",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#a9d096")} // Green on hover
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#d6d6d6")} // Back to original on mouse out
          >
            +
          </button>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onBlur={() => setIsExpanded(false)}
            style={{
              width: isExpanded ? "200px" : "120px",
              padding: "8px 8px 8px 30px",
              transition: "width 0.3s ease",
              height: "30px",
              borderRadius: "20px",
              border: "none",
              backgroundColor: "#d6d6d6",
              outline: "none",
              boxShadow: "none",
              backgroundImage: "url('/images/logos/searchIcon.png')",
              backgroundSize: "20px 20px",
              backgroundPosition: "10px center",
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>

        {/* Right side: Info, Sort, Grid/List Buttons */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}>
          <button
            onClick={() => console.log("Info clicked")}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "#d6d6d6",
              backgroundImage: `url('/images/logos/DB Info.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              cursor: "pointer",
            }}
          ></button>
          <button
            onClick={handleSort}
            style={{
              width: "70px",
              height: "30px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "7px",
              backgroundColor: "#d6d6d6",
              cursor: "pointer",
              paddingRight: "30px",
              paddingLeft: "0px",
              paddingTop: "0px",
              gap: "3px",
            }}
          >
            <img
              src="/images/logos/upCaretIcon.png"
              alt="Up Arrow"
              style={{ width: "12px", height: "12px", objectFit: "contain" }}
            />
            <img
              src="/images/logos/downCareticon.png"
              alt="Down Arrow"
              style={{ width: "12px", height: "12px", objectFit: "contain" }}
            />
          </button>
          <button
            onClick={toggleView}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              padding: "px 10px",
              borderRadius: "5px",
              width: "45px",
              height: "30px",
              cursor: "pointer",
            }}
          >
            <img
              src={
                isGridView
                  ? "/images/logos/Toggle Grid.png"
                  : "/images/logos/toggle list.png"
              }
              alt={isGridView ? "Grid View" : "List View"}
              style={{ width: "25px", height: "25px", objectFit: "contain" }}
            />
          </button>
        </div>
      </div>

      {/* Center Buttons for Database */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "5px",
          marginTop: "250px",
        }}
      >
        {!databases.length &&
          !showCreateDbModal &&
          !showImportMediaModal &&
          !showDisplayDbModal &&
          !showPlusModal && (
            <>
              <button
                style={buttonStyle("#4a88ff", "white")}
                onMouseOver={(e) => (e.currentTarget.style.background = "#2a6cd3")}
                onMouseOut={(e) => (e.currentTarget.style.background = "#4a88ff")}
              >
                Open a Database
              </button>
              <button
                style={buttonStyle("#4a88ff", "white")}
                onMouseOver={(e) => (e.currentTarget.style.background = "#2a6cd3")}
                onMouseOut={(e) => (e.currentTarget.style.background = "#4a88ff")}
              >
                Connect to ES Database
              </button>
              <button 
                style={buttonStyle("#4a88ff", "white")} 
                disabled
              >
                Connect to Live Video
              </button>
              <button
                style={{
                  ...buttonStyle("#a9d096", "white"),
                  background: isCreateButtonClicked
                    ? "linear-gradient(to bottom, #2E7D32, #81C784)"
                    : "#a9d096",
                  transition: "background 0.3s ease",
                }}
                onMouseOver={(e) => {
                  if (!isCreateButtonClicked) {
                    e.currentTarget.style.background = "#7fa763";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isCreateButtonClicked) {
                    e.currentTarget.style.background = "#a9d096";
                  }
                }}
                onClick={handleOpenCreateDatabase}
              >
                Create New Database
              </button>
            </>        
            
          )}
        {databases.length > 0 && (
          <div style={{ marginTop: "10px" }}>
            {databases.map((db, index) => (
              <div
                key={index}
                style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}
              >
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
                    background: "#FF4444",
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
        {/* <button
          style={buttonStyle("#4a88ff", "white")}
          onMouseOver={(e) => (e.currentTarget.style.background = "#2a6cd3")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#4a88ff")}
        >
          Open a database
        </button>
        <button
          style={buttonStyle("#4a88ff", "white")}
          onMouseOver={(e) => (e.currentTarget.style.background = "#2a6cd3")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#4a88ff")}
        >
          Connect to ES database
        </button>
        <button style={buttonStyle("#4a88ff", "white")} disabled>
          Connect to live video
        </button>
        <button
          style={buttonStyle("#a9d096", "white")}
          onMouseOver={(e) => (e.currentTarget.style.background = "#7fa763")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#a9d096")}
          onClick={handleCombinedClick}
        >
          Create new database
        </button> */}

        {/* Modals */}
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
        {showDisplayDbModal && (
          <DisplayDataBaseModal
            onClose={() => setShowDisplayDbModal(false)}
            onNext={handleDisplayDbNext}
            selectedFolders={selectedFolders}
          />
        )}
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

        {/* Final Gallery Display */}
        {selectedDatabaseIndex !== null && !showDisplayDbModal && (
          <div style={{ marginTop: "30px" }}>
            <h3>Final Gallery</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {databases[selectedDatabaseIndex].files.map((file, index, arr) => {
                const imageUrl = URL.createObjectURL(file);
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
                    <div style={{ width: "60px", textAlign: "center", fontWeight: "bold" }}>
                      {index + 1} of {arr.length}
                    </div>
                    <div>
                      <img
                        src={imageUrl}
                        alt={file.name}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          marginRight: "10px",
                        }}
                      />
                    </div>
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
                      <div
                        style={{ fontSize: "0.9rem", color: "#555", cursor: "pointer", marginTop: "5px" }}
                        onClick={() => setIsFramesExpanded(!isFramesExpanded)}
                      >
                        Expand Frames {isFramesExpanded ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                      {isFramesExpanded && (
                        <div style={{ marginTop: "5px", padding: "5px", background: "#f9f9f9" }}>
                          <p>Placeholder for frame details (e.g., Frame 001, Frame 002, ...)</p>
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
      </div>
    </div>
  );
}