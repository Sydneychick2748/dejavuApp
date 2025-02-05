"use client";
import { VStack, Text, Input } from "@chakra-ui/react";
import UploadFiles from "./upload-files/UploadFiles"; // ✅ Correct import

export default function Dashboard() {
  return (
    <VStack spacing={6} align="start" w="full" p={4}>
      {/* Input for Database Name */}
      <form>
        <Text fontSize="lg" fontWeight="bold">Database Name</Text>
        <Input placeholder="Enter a name for your database" />
      </form>

      {/* ✅ This will now display the UploadFiles component */}
      <UploadFiles />
    </VStack>
  );
}
