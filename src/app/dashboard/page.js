
"use client";

import { Flex, Box } from "@chakra-ui/react";
import SearchFor from "./search-for/searchFor";
import SearchParams from "./search-params/searchParams";
import UploadFiles from "./upload-files/UploadFiles";
import { ImageProvider } from "@/contexts/ImageContext";
import "./dashboard.css";
import "../globals.css";

export default function Dashboard() {
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
          flex="1"
          bg="white"
          p={4}
          borderRadius="lg"
          shadow="md"
          w={{ base: "100%", lg: "50%" }} // Full width on mobile/tablet, 50% on desktop
        >
          <UploadFiles />
        </Box>

        {/* Right Section (Search & Parameters) */}
        <Flex
          direction="column"
          flex="1"
          gap={4}
          w={{ base: "100%", lg: "50%" }} // Full width on mobile/tablet, 50% on desktop
        >
          {/* Top Right (Search for Image) */}
          <Box bg="white" p={4} borderRadius="lg" shadow="md">
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
