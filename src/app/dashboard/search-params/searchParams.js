
"use client";
import React, { useState } from 'react';
import { Box, Text, Button } from "@chakra-ui/react";
import Simple from "@/components/searchParams/simple/simple";
import Advanced from "@/components/searchParams/advanced/advanced";
import "./searchParams.css";
export default function SettingsPanel() {
  const [activeTab, setActiveTab] = useState("Simple");
  return (
    <div className="settings">
      {/* <Box className="headerBox">
        <Text className="searchParamsWording">
          Search Parameters...
        </Text>
        <Box className="infoBox">
          <Text className="infoLetter">
            i
          </Text>
        </Box>
      </Box> */}
      <div className="container2">
        {/* Left Sidebar */}
        <div className="sidebar">
          <ul>
            <li
              className={activeTab === "Simple" ? "active" : "inactive"}
              onClick={() => setActiveTab("Simple")}
            >
              Simple
            </li>
            <li
              className={activeTab === "Advanced" ? "active" : "inactive"}
              onClick={() => setActiveTab("Advanced")}
            >
              Advanced
            </li>
          </ul>
        </div>
        {/* Right Content Box */}
        <div className="content2">
          <div className="panel-container">
            <div className={`panel ${activeTab === "Simple" ? "active" : "inactive"}`}>
              <Simple />
            </div>
            <div className={`panel ${activeTab === "Advanced" ? "active" : "inactive"}`}>
              <Advanced />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
