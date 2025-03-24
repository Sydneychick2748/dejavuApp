"use client";
import React from "react";

export default function ImageSelectModal({ isOpen, onClose }) {
  if (!isOpen) return null; // Don't render if modal is closed

  return (
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
      <h3>Select an Image</h3>
      <p>This is a simple modal that opens when clicking the `+` box.</p>
      <button onClick={onClose} style={{ marginTop: "10px", padding: "10px" }}>
        Close
      </button>
      <h3>Select an Image</h3>
      <p>This is a simple modal that opens when clicking the `+` box.</p>
      <button onClick={onClose} style={{ marginTop: "10px", padding: "10px" }}>
        Close
      </button>
      <h3>Select an Image</h3>
      <p>This is a simple modal that opens when clicking the `+` box.</p>
      <button onClick={onClose} style={{ marginTop: "10px", padding: "10px" }}>
        Close
      </button>
      <h3>Select an Image</h3>
      <p>This is a simple modal that opens when clicking the `+` box.</p>
      <button onClick={onClose} style={{ marginTop: "10px", padding: "10px" }}>
        Close
      </button>
      
    </div>
  );
}
