"use client";
import React from "react";

const ImportMediaModal = ({ onClose }) => {
  return (
    <div className="modal">
      <h3 color="blue">Import Media</h3>
      <p color="blue"> (should be a model)Content for importing media.</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ImportMediaModal;
