"use client";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import "./preferencesModal.css";

const PreferencesModal = ({ onClose }) => {
  const [databaseLocation, setDatabaseLocation] = useState("default"); // "default" or "manual"

  const handleLocationChange = (value) => {
    setDatabaseLocation(value);
  };

  return (
    <div className="preferences-modal-overlay">
      <div className="preferences-modal-container">
        {/* Header */}
        <div className="preferences-modal-header">
          <h3 className="preferences-modal-title">Preferences</h3>
          <button className="preferences-modal-close-button" onClick={onClose}>
            <FaTimes size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="preferences-modal-content">
          <div className="preferences-section">
            <h4 className="preferences-section-title">General</h4>
            <p className="preferences-section-text">TBD</p>
          </div>

          <div className="preferences-section">
            <h4 className="preferences-section-title">Databases</h4>
            <p className="preferences-section-label">New database save location:</p>
            <label className="preferences-section-option">
              <input
                type="radio"
                name="databaseLocation"
                value="default"
                checked={databaseLocation === "default"}
                onChange={() => handleLocationChange("default")}
              />
              <span>Default Photon Directory (recommended)</span>
            </label>
            <label className="preferences-section-option">
              <input
                type="radio"
                name="databaseLocation"
                value="manual"
                checked={databaseLocation === "manual"}
                onChange={() => handleLocationChange("manual")}
              />
              <span>Manual location</span>
            </label>
          </div>

          <div className="preferences-section">
            <h4 className="preferences-section-title">Searching</h4>
            <p className="preferences-section-text">TBD</p>
          </div>

          <div className="preferences-section">
            <h4 className="preferences-section-title">History & Bookmarks</h4>
            <p className="preferences-section-text">TBD</p>
          </div>

          <div className="preferences-section">
            <h4 className="preferences-section-title">Object Library</h4>
            <p className="preferences-section-text">TBD</p>
          </div>
        </div>

        {/* Footer with Close Button */}
        <div className="preferences-modal-footer">
          <button className="preferences-modal-footer-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesModal;