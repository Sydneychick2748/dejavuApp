"use client";
import React from "react";

const CreateNewDataBaseModal = ({ onClose, onNext }) => {
  return (
    <div className="modal" style={modalStyle}>
      <h3>Create New Database</h3>
      <p>This is the Create New Database modal content.</p>
      <button onClick={onClose}>Close</button>
      <button onClick={onNext}>Next</button>
    </div>
  );
};

// Simple inline styles for the modal (adjust as needed)
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

export default CreateNewDataBaseModal;
