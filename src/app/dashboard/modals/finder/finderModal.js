



"use client";
import React, { useState } from "react";
import {
  FaFolder,
  FaImage,
  FaFileAlt,
  FaDownload,
  FaClock,
  FaDesktop,
  FaCubes,
  FaHome,
  FaTimes,
  FaEye, // Icon for "Check Contents"
} from "react-icons/fa";
import "../finder/finderModal.css";

const FinderModal = ({ onClose, onSelectLocation, databaseName, savePath, items }) => {
  const [selectedPath, setSelectedPath] = useState("/Photos");
  const [showContents, setShowContents] = useState(false);

  // Common Finder locations (mock paths)
  const locations = [
    { name: "Photos", path: "/Photos", icon: <FaImage /> },
    { name: "Documents", path: "/Documents", icon: <FaFileAlt /> },
    { name: "Downloads", path: "/Downloads", icon: <FaDownload /> },
    { name: "Recent", path: "/Recent", icon: <FaClock /> },
    { name: "Desktop", path: "/Desktop", icon: <FaDesktop /> },
    { name: "Applications", path: "/Applications", icon: <FaCubes /> },
    { name: "Home", path: "/Users/YourUser", icon: <FaHome /> },
  ];

  const handleLocationClick = (path) => {
    setSelectedPath(path);
    setShowContents(false); // Hide contents when changing location
  };

  const handleSelect = () => {
    onSelectLocation(selectedPath);
    onClose();
  };

  const toggleShowContents = () => {
    setShowContents((prev) => !prev);
  };

  // Construct the full path for display
  const fullPath = savePath ? `${savePath}/${databaseName || "Unnamed Database"}` : selectedPath;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1200,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          width: "600px",
          height: "400px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 4px 15px rgba(0, 0, 123, 0.2)",
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: "#EEF2FF",
            padding: "10px 20px",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ color: "black", margin: 0, fontSize: 15 }}>
            Select Save Location
          </h3>
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
            <FaTimes size={16} />
          </button>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: "flex",
            flex: 1,
            borderTop: "1px solid #ddd",
            borderBottom: "1px solid #ddd",
          }}
        >
          {/* Sidebar with Locations */}
          <div
            style={{
              width: "200px",
              backgroundColor: "#f5f5f5",
              padding: "10px",
              borderRight: "1px solid #ddd",
              overflowY: "auto",
            }}
          >
            {locations.map((location) => (
              <div
                key={location.path}
                className="finder-location-item"
                style={{
                  padding: "8px",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  backgroundColor: selectedPath === location.path ? "#e0e7ff" : "transparent",
                  borderRadius: "4px",
                  marginBottom: "4px",
                }}
                onClick={() => handleLocationClick(location.path)}
              >
                <span style={{ marginRight: "8px" }}>{location.icon}</span>
                <span>{location.name}</span>
              </div>
            ))}
          </div>

          {/* Main Content Area */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Check Contents Button */}
            <button
              onClick={toggleShowContents}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 10px",
                border: "none",
                backgroundColor: "#007BFF",
                color: "white",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              <FaEye size={16} />
              {showContents ? "Hide Contents" : "Check Contents"}
            </button>

            {/* Folder Icon and Path */}
            {!showContents && (
              <>
                <FaFolder size={60} style={{ color: "#FFD700", marginBottom: "10px" }} />
                <p style={{ color: "#000000", fontSize: "16px" }}>
                  Selected Path: <strong>{selectedPath}</strong>
                </p>
                <p style={{ color: "#555", fontSize: "14px" }}>
                  (This is a mock Finder. Folder navigation will be added later.)
                </p>
              </>
            )}

            {/* Folder Contents */}
            {showContents && (
              <div
                style={{
                  width: "100%",
                  padding: "10px",
                  textAlign: "left",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "4px",
                  overflowY: "auto",
                  maxHeight: "calc(100% - 20px)",
                }}
              >
                <h4 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>
                  Folder: {databaseName || "Unnamed Database"}
                </h4>
                <p style={{ margin: "5px 0", fontSize: "14px" }}>
                  <strong>Stored at:</strong> {fullPath}
                </p>
                <p style={{ margin: "5px 0", fontSize: "14px" }}>
                  <strong>Items:</strong>
                </p>
                {items.length > 0 ? (
                  <ul style={{ margin: "0", paddingLeft: "20px", fontSize: "14px" }}>
                    {items.map((item, index) => (
                      <li key={index}>{item.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ margin: "5px 0", fontSize: "14px", color: "#555" }}>
                    No items in this folder.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer with Buttons */}
        <div
          style={{
            padding: "10px 20px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            borderTop: "1px solid #ddd",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              border: "none",
              cursor: "pointer",
              backgroundColor: "#E0E7FF",
              color: "#0056D2",
              borderRadius: "20px",
              transition: "background-color 0.3s ease",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSelect}
            style={{
              padding: "8px 16px",
              border: "none",
              cursor: "pointer",
              backgroundColor: "#2E7D32",
              color: "white",
              borderRadius: "20px",
              transition: "background-color 0.3s ease",
            }}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinderModal;