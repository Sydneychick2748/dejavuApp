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
  const [activeBox, setActiveBox] = useState(null);

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
          className="uploadFilesBox"
          flex="0 0 40%"
          bg={activeBox === "upload" ? "#e7eaee" : "#f1f1f1"} // Keep hover color if active          borderRadius="lg"
          shadow="md"
          transition="background 0.3s ease"
          onMouseEnter={() => setActiveBox("upload")}
          onMouseLeave={() => setActiveBox(null)} // Reset when leaving
        >
          {/* Search Within Parent Container */}
          <Box 
            className="uploadSearchWithin"
            width="100%"
            bg={activeBox === "upload" ? "#0b2856" : "#d6d6d6"} // Keep header hover color if active
            p="10px 20px"
            fontSize="16px"
            fontWeight="600"
            color="white"
            borderTopRightRadius="10px"
            transition="background 0.3s ease"
          >
            Search within...
          </Box>
          <UploadFiles />
        </Box>

        {/* Right Section (Search & Parameters) */}
        <Flex direction="column" flex="0 0 60%" gap={4}>
          {/* Top Right (Search for Image) */}

          <Box
          className="searcForBox"
          flex="0 0 40%"
          bg={activeBox === "searchFor" ? "#e7eaee" : "#f1f1f1"} // Keep hover color if active
          borderRadius="lg"
          shadow="md"
          transition="background 0.3s ease"
          onMouseEnter={() => setActiveBox("searchFor")}
          onMouseLeave={() => setActiveBox(null)} // Reset when leaving
            
          >
            {/* Search Within Parent Container */}
            <Box className="uploadSearchFor"
              width="100%"
              bg={activeBox === "searchFor" ? "#0b2856" : "#d6d6d6"} // Keep header hover color if active
              p="10px 20px"
              fontSize="16px"
              fontWeight="600"
              color="white"
              borderTopRightRadius="10px"
              transition="background 0.3s ease"       
            >
              Search For
            </Box>
            <SearchFor />
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
