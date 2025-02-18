"use client";
import { VStack } from "@chakra-ui/react";
import SearchFor from "./search-for/searchFor"; // ✅ Correct import
import SearchParams from "./search-params/searchParams";
import UploadFiles from "./upload-files/UploadFiles";
import { ImageProvider } from "@/contexts/ImageContext"; // ✅ Import the correct ImageContext
import "./dashboard.css";
import "../globals.css";
export default function Dashboard() {
  return (
    <ImageProvider> {/* ✅ Wrap everything inside ImageProvider */}
      <VStack spacing={6} align="start" w="full" p={4}>
        <UploadFiles />
        <SearchFor />
        <SearchParams />
      </VStack>
    </ImageProvider>
  );
}







