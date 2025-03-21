"use client";


import React, { useState } from 'react';

import { Box, Text, Button } from "@chakra-ui/react";

import Simple from "@/components/searchParams/simple/simple";
import SavedSettings from "@/components/searchParams/saved-settings/saved-settings";
import Advanced from "@/components/searchParams/advanced/advanced";

import "./searchParams.css";



export default function SettingsPanel() {
  const [activeTab, setActiveTab] = useState("Simple");



  return (
    <div className="settings">
     
      <div className="container2">
      {/* Left Sidebar */}
        <div className="sidebar">
          <ul>
            <li 
              className={activeTab === "Simple" ? "active" : ""}
              onClick={() => setActiveTab("Simple")}
            >
              Simple
            </li>
            <li 
              className={activeTab === "SavedSettings" ? "active" : ""}
              onClick={() => setActiveTab("SavedSettings")}
            >
              Saved Settings
            </li>
            <li 
              className={activeTab === "Advanced" ? "active" : ""}
              onClick={() => setActiveTab("Advanced")}
            >
              Advanced
            </li>
          </ul>
        </div>

        {/* Right Content Box */}
        <div className="content2">
          {activeTab === "Simple" && <Simple />}
          {activeTab === "SavedSettings" && <SavedSettings />}
          {activeTab === "Advanced" && <Advanced />}
        </div>
      </div>
    </div>
  );
}





  