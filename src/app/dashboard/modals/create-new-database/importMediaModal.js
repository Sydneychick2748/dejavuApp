"use client";
import React from "react";

const ImportMediaModal = ({ onClose, onNext }) => {
  return (
    <div className="modal" style={modalStyle}>
      <h3>Import Media</h3>
      <p>This is the Import Media modal content.</p>
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={onClose}
          style={{ padding: "8px 16px", marginRight: "10px" }}
        >
          Close
        </button>
        <button onClick={onNext} style={{ padding: "8px 16px" }}>
          Next
        </button>
      </div>
    </div>
  );
};

const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  padding: "20px",
  backgroundColor: "white",
  border: "1px solid #ccc",
  borderRadius: "8px",
  zIndex: 1000,
};

export default ImportMediaModal;
