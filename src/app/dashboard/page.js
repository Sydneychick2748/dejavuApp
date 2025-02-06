"use client";
import { VStack, Text, Input } from "@chakra-ui/react";
import UploadFiles from "./upload-files/UploadFiles"; // ✅ Correct import
import "./dashboard.css";

export default function Dashboard() {
  return (
    <VStack spacing={6} align="start" w="full" p={4}>
     
      <UploadFiles />
    </VStack>
  );
}
