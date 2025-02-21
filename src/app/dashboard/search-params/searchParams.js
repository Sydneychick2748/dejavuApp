"use client";

import React, { useState } from 'react';

import { Box, Text, Button } from "@chakra-ui/react";

import Simple from "@/components/searchParams/simple/simple";
import SavedSettings from "@/components/searchParams/saved-settings/saved-settings";
import Advanced from "@/components/searchParams/advanced/advanced";

import styles from "./searchParams.css";


export default function SettingsPanel() {
  const [activeTab, setActiveTab] = useState("Simple");

  return (
    <div className="settings">
      <Box className="headerBox">
        <Text className="searchParamsWording">
          Search Parameters...
        </Text>
        <Box className="infoBox">
          <Text className="infoLetter">
            i
          </Text>
        </Box>
      </Box>
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





  // AI FIRST ATTEMPT HERE

  // export default function SearchParams() {

  //   const [selectedOption, setSelectedOption] = useState("Simple");

  //   const options = ["Simple", "Saved Settings", "Advanced"];

  //   const renderContent = () => {
  //     switch (selectedOption) {
  //       case "Simple":
  //         return <div className={styles.contentBox}><Simple className="simple" /></div>;
  //       case "Saved Settings":
  //         return <div className={styles.contentBox}><SavedSettings className="savedSettings" /></div>;
  //       case "Advanced":
  //         return <div className={styles.contentBox}><Advanced className="advanced" /></div>;
  //       default:
  //         return null;
  //     }
  //   };

  //   return (
  //     <div className={styles.container2}>
  //       {/* Left Side */}
  //       <div className={styles.sidebar}>
  //         <ul className="optionList">
  //         {options.map((option) => (
  //           <li
  //             key={option}
  //             onClick={() => setSelectedOption(option)}
  //             className={`${styles.optionText}
  //             ${selectedOption === option ? styles.active : ""}`}>
  //             {option}
  //             </li>
  //         ))}
  //         </ul>
  //       </div>


  //       {/* Right Side */}
  //     <div className={styles.contentArea}>
  //     {renderContent()}
  //     </div>
  //   </div>
  //   );
  // }





  // MY ATTEMPT HERE

  // return (
    
  //   <div className="settings">
      // <Box className="headerBox">
      //   <Text className="searchParamsWording">
      //     Search Parameters...
      //   </Text>
      //   <Box className="infoBox">
      //     <Text className="infoLetter">
      //       i
      //     </Text>
      //   </Box>
      // </Box>
  //     <div className="fullBox">
  //       <div className="tabs">
  //         <Button size="xl" colorPalette="blue" variant="plain" className="tab">Simple</Button>
  //         <Button size="xl" colorPalette="blue" variant="plain" className="tab">Saved Settings</Button>
  //         <Button size="xl" colorPalette="blue" variant="plain" className="tab">Advanced</Button>
  //       </div>
  //       <div className="tabOptions">
  //         <Simple className="simple"/>
  //         <SavedSettings className="savedSettings" />
  //         <Advanced className="advanced" />  
  //       </div>
  //     </div>
  //   </div>
  // );
// }


    // const handleClick = () => {
    //   setShowDiv(!showOptions);
    // };