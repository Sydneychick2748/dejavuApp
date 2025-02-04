

"use client";

import {
  FileUploadDropzone,
  FileUploadList,
  FileUploadRoot,
} from "@/components/ui/file-upload";
import { Box, VStack, Button, Text } from "@chakra-ui/react";
import { useState } from "react";

export default function Dashboard() {
  const [databases, setDatabases] = useState([]);
  const [selectedDatabase, setSelectedDatabase] = useState(null);

  const handleDatabaseUpload = async (acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    // Example: If the database is a JSON file
    if (file.type === "application/json") {
      const fileText = await file.text(); // Read file as text
      const database = JSON.parse(fileText); // Parse JSON
      console.log("Database contents:", database);

      setDatabases((prev) => [
        ...prev,
        { id: Date.now(), name: file.name, content: database },
      ]);
    }

    // Example: If the database is a ZIP file
    if (file.type === "application/zip") {
      console.log("Uploaded ZIP database:", file);
      // Use JSZip to process ZIP files if needed
    }
  };

  const handleLoadExternalDatabase = async (url) => {
    try {
      const response = await fetch(url);
      const database = await response.json(); // Assume JSON format
      console.log("Fetched database:", database);

      setDatabases((prev) => [
        ...prev,
        { id: Date.now(), name: url, content: database },
      ]);
    } catch (error) {
      console.error("Error fetching database:", error);
    }
  };

  return (
    <VStack spacing={6} align="start" w="full" p={4}>
      {/* Load External Database */}
      <Button
        colorScheme="green"
        onClick={() =>
          handleLoadExternalDatabase("https://example.com/database.json")
        }
      >
        Load Database from URL
      </Button>

      {/* Upload Database */}
      <FileUploadRoot
        maxFiles={1}
        accept={{
          "application/json": [".json"],
          "application/zip": [".zip"],
        }}
        onFileChange={({ accepted }) => handleDatabaseUpload(accepted)}
      >
        <FileUploadDropzone
          label="Drag and drop your database file here"
          description="Supports .json, .zip formats"
        />
        <FileUploadList />
      </FileUploadRoot>

      {/* Display Databases */}
      <Box>
        <Text fontSize="lg" fontWeight="bold">
          Databases
        </Text>
        {databases.length === 0 ? (
          <Text>No databases uploaded yet.</Text>
        ) : (
          databases.map((db) => (
            <Button
              key={db.id}
              onClick={() => setSelectedDatabase(db)}
              colorScheme={selectedDatabase?.id === db.id ? "teal" : "gray"}
              variant={selectedDatabase?.id === db.id ? "solid" : "outline"}
              m={1}
            >
              {db.name}
            </Button>
          ))
        )}
      </Box>

      {/* Display Database Contents */}
      {selectedDatabase && (
        <Box w="full">
          <Text fontSize="lg" fontWeight="bold">
            Selected Database: {selectedDatabase.name}
          </Text>
          <pre>{JSON.stringify(selectedDatabase.content, null, 2)}</pre>
        </Box>
      )}
    </VStack>
  );
}
