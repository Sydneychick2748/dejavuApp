"use client";

import { VStack } from "@chakra-ui/react";
import SearchFor from "./search-for/searchFor"; // :white_check_mark: Correct import
import SearchParams from "./search-params/searchParams";
import UploadFiles from "./upload-files/UploadFiles";
import { ImageProvider } from "@/contexts/ImageContext"; // :white_check_mark: Import the correct ImageContext
import "./dashboard.css";
import "../globals.css";
export default function Dashboard() {
  return (
    <ImageProvider> {/* :white_check_mark: Wrap everything inside ImageProvider */}
      <VStack spacing={6} align="start" w="full" p={4}>
        <UploadFiles />
        <SearchFor />
        <SearchParams />
      </VStack>
    </ImageProvider>
  );
}







