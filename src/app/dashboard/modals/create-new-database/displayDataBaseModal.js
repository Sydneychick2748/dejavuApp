"use client";
import React from "react";

const DisplayDataBaseModal = ({ onClose, onNext }) => {
  return (
    <div className="modal">
      <h3 color="blue">Display Database</h3>
      <p color="blue">Content for displaying database details.</p>
      <button onClick={onClose}>Close</button>
      <button onClick={onNext}>Next</button>
    </div>
  );
};

export default DisplayDataBaseModal;
