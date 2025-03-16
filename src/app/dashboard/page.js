"use client";

import React, { useState } from "react";
import { Flex, Box } from "@chakra-ui/react";
import SearchFor from "./search-for/searchFor";
import SearchParams from "./search-params/searchParams";
import UploadFiles from "./upload-files/UploadFiles";
import { ImageProvider } from "@/contexts/ImageContext";
import "./dashboard.css";
import "../globals.css";

export default function Dashboard() {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [bgColor, setBgColor] = useState("#f1f1f1"); // Default color

  return (
    <ImageProvider>
      <Flex
        h="100vh"
        w="full"
        p={4}
        bg="gray.100"
        direction={{ base: "column", md: "column", lg: "row" }} // Stack on mobile & tablet, row on desktop
        gap={4}
      >
        {/* Left Section (Upload Files) */}
        <Box
          flex="0 0 40%"
          bg={isButtonClicked ? "#e7eaee" : "#f1f1f1"}
          // p={4}
          borderRadius="lg"
          shadow="md"
          // w={{ base: "100%", lg: "30%" }} // Full width on mobile/tablet, 50% on desktop
        >
          {/* Search Within Parent Container */}
          <div
            style={{
              width: "100%",
              backgroundColor: isButtonClicked ? "#0b2856" : "#d6d6d6", // Change background on click
              padding: "10px 20px",
              fontSize: "16px",
              fontWeight: "600",
              color: "white",
              transition: "background 0.3s ease",
              borderTopRightRadius: "10px", // Rounds only the top-right corner
              mt: "-20px",
            }}
          >
            Search within...
          </div>
          <UploadFiles setIsButtonClicked={setIsButtonClicked} />{" "}
          {/* Pass the function to Update State */}
        </Box>

        {/* Right Section (Search & Parameters) */}
        <Flex
          direction="column"
          flex="0 0 60%"
          gap={4}
          // w={{ base: "100%", lg: "70%" }} // Full width on mobile/tablet, 50% on desktop
        >
          {/* Top Right (Search for Image) */}
          {/* <Box
            style={{
              width: "100%",
              backgroundColor: isButtonClicked ? "#0b2856" : "#d6d6d6", // Change background on click
              padding: "10px 20px",
              fontSize: "16px",
              fontWeight: "600",
              color: "white",
              transition: "background 0.3s ease",
              borderTopRightRadius: "10px", // Rounds only the top-right corner
              mt: "-20px",
            }}
          >
            {/* Top Bar */}
            {/* <div
              style={{
                width: "100%",
                backgroundColor: "#0b2856", // Change background on click
                padding: "10px 20px",
                fontSize: "16px",
                fontWeight: "600",
                color: "white",
                transition: "background 0.3s ease",
                borderTopRightRadius: "10px", // Rounds only the top-right corner
                mt: "0px",
                marginLeft: "-20px", // Adjusted to align with the parent container
              }}
            >
              <h1>Search For</h1>
            </div>
            <SearchFor />
          </Box>  */}

          <Box
          flex="0 0 40%"
          bg={isButtonClicked ? "#e7eaee" : "#f1f1f1"}
          // p={4}
          borderRadius="lg"
          shadow="md"
          // w={{ base: "100%", lg: "30%" }} // Full width on mobile/tablet, 50% on desktop
        >
          {/* Search Within Parent Container */}
          <div
            style={{
              width: "100%",
              backgroundColor: isButtonClicked ? "#0b2856" : "#d6d6d6", // Change background on click
              padding: "10px 20px",
              fontSize: "16px",
              fontWeight: "600",
              color: "white",
              transition: "background 0.3s ease",
              borderTopRightRadius: "10px", // Rounds only the top-right corner
              mt: "-20px",
            }}
          >
            Search For
          </div>
          <SearchFor  />{" "}
          {/* Pass the function to Update State */}
        </Box>

          {/* Bottom Right (Search Parameters) */}
          <Box bg="white" p={4} borderRadius="lg" shadow="md">
            <SearchParams />
          </Box>
        </Flex>
      </Flex>
    </ImageProvider>
  );
}
