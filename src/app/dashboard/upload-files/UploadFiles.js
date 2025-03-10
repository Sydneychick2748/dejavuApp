


"use client";
import React, { useState } from "react";
import CreateNewDataBaseModal from "../modals/create-new-database/createNewDataBaseModal";
import ImportMediaModal from "../modals/create-new-database/importMediaModal";
import DisplayDataBaseModal from "../modals/create-new-database/displayDataBaseModal";

export default function UploadFiles() {
  const [showCreateDbModal, setShowCreateDbModal] = useState(false);
  const [showImportMediaModal, setShowImportMediaModal] = useState(false);
  const [showDisplayDbModal, setShowDisplayDbModal] = useState(false);

  const handleOpenCreateDatabase = () => {
    console.log("Create New Database button clicked");
    setShowCreateDbModal(true);
  };

  return (
    <div style={{ padding: "20px", color: "black" }}>
      <h2>Upload Files</h2>

      <button
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
        onClick={handleOpenCreateDatabase}
      >
        Create New Database
      </button>

      {/* 1. Create New Database Modal */}
      {showCreateDbModal && (
        <CreateNewDataBaseModal
          onClose={() => {
            console.log("Closing CreateNewDataBaseModal");
            setShowCreateDbModal(false);
          }}
          onNext={() => {
            console.log("Proceeding from CreateNewDataBaseModal to ImportMediaModal");
            setShowCreateDbModal(false);
            setShowImportMediaModal(true);
          }}
        />
      )}

      {/* 2. Import Media Modal */}
      {showImportMediaModal && (
        <ImportMediaModal
          onClose={() => {
            console.log("Closing ImportMediaModal");
            setShowImportMediaModal(false);
          }}
          onNext={() => {
            console.log("Proceeding from ImportMediaModal to DisplayDataBaseModal");
            setShowImportMediaModal(false);
            setShowDisplayDbModal(true);
          }}
        />
      )}

      {/* 3. Display Database Modal (FINAL STEP) */}
      {showDisplayDbModal && (
        <DisplayDataBaseModal
          onClose={() => {
            console.log("Closing DisplayDataBaseModal");
            setShowDisplayDbModal(false);
          }}
          onNext={() => {
            console.log("Finishing DisplayDataBaseModal and returning to UploadFiles UI");
            setShowDisplayDbModal(false);
            // You can do anything else here, e.g., reset states or show a message
          }}
        />
      )}
    </div>
  );
}

