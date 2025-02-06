"use client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, VStack, Button, Text, Input, Image, Link } from "@chakra-ui/react";
import { FaCloudUploadAlt } from "react-icons/fa";

export default function UploadFiles() {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [databaseName, setDatabaseName] = useState("");
  const [databases, setDatabases] = useState({});
  const [showMonaLisa, setShowMonaLisa] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Error state

  /**
   * Handles file drop
   * Prevents upload if database name is empty
   */
  const onDrop = (acceptedFiles) => {
    if (!databaseName.trim()) {
      setErrorMessage("Please enter a database name before uploading files.");
      return;
    }

    console.log("Dropped files:", acceptedFiles);

    if (acceptedFiles.length > 0) {
      setShowMonaLisa(true);
      setLoadingMessage("Files are loading...");

      setTimeout(() => {
        setShowMonaLisa(false);
        setLoadingMessage("");
        setFiles([...files, ...acceptedFiles]);
      }, 3000);
    }
  };

  /**
   * Clears error when user types in the database name field
   */
  const handleDatabaseNameChange = (e) => {
    setDatabaseName(e.target.value);
    if (errorMessage) setErrorMessage(""); // Clear error when name is entered
  };

  /**
   * Handles file selection/deselection
   */
  const handleSelectFile = (file) => {
    console.log("Toggling file selection:", file);
    setSelectedFiles((prevSelectedFiles) =>
      prevSelectedFiles.includes(file)
        ? prevSelectedFiles.filter((f) => f !== file)
        : [...prevSelectedFiles, file]
    );
  };

  /**
   * Handles file removal
   */
  const handleRemoveFile = (fileToRemove) => {
    console.log("Removing file:", fileToRemove);
    setFiles(files.filter((file) => file !== fileToRemove));
    setSelectedFiles((prevSelectedFiles) =>
      prevSelectedFiles.filter((file) => file !== fileToRemove)
    );
  };

  /**
   * Saves the database and logs to console
   */
  const handleSaveDatabase = () => {
    if (!databaseName.trim()) {
      setErrorMessage("Database name is required!");
      return;
    }

    if (selectedFiles.length === 0) {
      setErrorMessage("No files selected to save.");
      return;
    }

    setErrorMessage(""); // Clear error message on success

    const newDatabase = {
      ...databases,
      [databaseName]: selectedFiles, // Save only selected files
    };

    setDatabases(newDatabase);

    console.log("Saved Database:", { name: databaseName, files: selectedFiles });

    setDatabaseName("");
    setFiles([]);
    setSelectedFiles([]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <VStack spacing={6} align="start" w="full" p={4}>
      {/* Database Name Input */}
      <form>
        <Text fontSize="lg" fontWeight="bold" color="black">
          Database Name
        </Text>
        <Input
          color="black"
          placeholder="Enter a name for your database"
          value={databaseName}
          onChange={handleDatabaseNameChange}
        />
        {errorMessage && (
          <Text color="red.500" fontSize="sm" mt={2}>
            {errorMessage}
          </Text>
        )}
      </form>

      {/* Drag and Drop Zone */}
      <Box
        {...getRootProps()}
        p={4}
        w="full"
        border="2px dashed"
        borderColor="gray.400"
        borderRadius="md"
        textAlign="center"
        cursor="pointer"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <FaCloudUploadAlt size={40} color="gray" />
        <input {...getInputProps()} />
        <Text color="black" mt={2}>
          Drag and drop files here, or click to select files
        </Text>
      </Box>

      {/* Loading Message and Mona Lisa */}
      {showMonaLisa && (
        <Box textAlign="center" w="full">
          <Text fontSize="lg" color="blue.500" mb={4}>
            {loadingMessage}
          </Text>
          <Image
            src="/images/logos/Mona_Lisa.jpg"
            alt="Loading Mona Lisa"
            boxSize="150px"
            borderRadius="md"
            objectFit="cover"
            mx="auto"
          />
        </Box>
      )}

      {/* Uploaded Files */}
      {!showMonaLisa &&
        files.map((file, index) => (
          <Box
            key={index}
            display="flex"
            alignItems="center"
            w="full"
            p={2}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            mb={2}
          >
            <input
              type="checkbox"
              checked={selectedFiles.includes(file)}
              onChange={() => handleSelectFile(file)}
              style={{ marginRight: "8px", color: "blue" }}
            />

            {file.type.startsWith("image") ? (
              <Image
                src={URL.createObjectURL(file)}
                alt={file.name}
                boxSize="50px"
                borderRadius="md"
                mr={2}
              />
            ) : file.type.startsWith("video") ? (
              <video
                src={URL.createObjectURL(file)}
                controls
                width="50"
                height="50"
                style={{ marginRight: "8px", borderRadius: "4px" }}
              />
            ) : (
              <Text w="full" isTruncated>
                {file.name}
              </Text>
            )}

            <Box flex="1" ml={2}>
              <Text fontWeight="bold" color="gray.500">
                {file.name}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {file.type} - {(file.size / 1024 / 1024).toFixed(2)} MB
              </Text>
              <Link href="#" color="blue.500" fontSize="sm">
                More info
              </Link>
            </Box>

            <Button
              onClick={() => handleRemoveFile(file)}
              ml={2}
              size="sm"
              variant="outline"
              colorScheme="red"
            >
              Remove
            </Button>
          </Box>
        ))}

      {/* Clear All Files Button */}
      {files.length > 0 && (
        <Button onClick={() => setFiles([])} colorScheme="red" variant="outline">
          Clear All Files
        </Button>
      )}

      {/* Selected Files with Current Database */}
      {selectedFiles.length > 0 && (
        <Box mt={4} w="full" p={4} border="1px solid" borderColor="gray.300" borderRadius="md">
          <Text fontSize="lg" fontWeight="bold" color="black" mb={2}>
            Current Database: {databaseName}
          </Text>
          <Text fontWeight="bold" color="blue.500" mb={2}>
            Selected Files:
          </Text>
          {selectedFiles.map((file, index) => (
            <Text key={index} fontSize="sm" color="gray.500">
              {file.name}
            </Text>
          ))}
        </Box>
      )}

      {/* Save Database Button */}
      <Button
        colorScheme="teal"
        variant="solid"
        onClick={handleSaveDatabase}
        disabled={!databaseName.trim() || selectedFiles.length === 0}
      >
        Save Database
      </Button>
    </VStack>
  );
}
