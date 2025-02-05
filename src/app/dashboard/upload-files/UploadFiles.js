"use client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, VStack, Button, Text, Input, Image } from "@chakra-ui/react";
import { FaCloudUploadAlt } from "react-icons/fa"; // Import upload icon

export default function UploadFiles() {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const onDrop = (acceptedFiles) => {
    const validFiles = acceptedFiles.filter((file) => {
      const mimeType = file.type;
      const validMimeTypes = ["image/*", "video/*", "application/pdf"];
      return validMimeTypes.some((type) => mimeType.match(type));
    });

    console.log("Accepted files:", validFiles);
    setFiles([...files, ...validFiles]);
  };

  const handleRemoveFile = (fileToRemove) => {
    console.log("Removing file:", fileToRemove);
    setFiles(files.filter((file) => file !== fileToRemove));
  };

  const handleSelectFile = (file) => {
    console.log("Selecting/Deselecting file:", file);
    setSelectedFiles((prevSelectedFiles) =>
      prevSelectedFiles.includes(file)
        ? prevSelectedFiles.filter((f) => f !== file)
        : [...prevSelectedFiles, file]
    );
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <VStack spacing={6} align="start" w="full" p={4}>
      {/* Input for Database Name */}
      <form>
        <Text fontSize="lg" fontWeight="bold">
          Database Name
        </Text>
        <Input placeholder="Enter a name for your database" />
      </form>

      {/* Custom Drag and Drop Zone with Icon */}
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
        <FaCloudUploadAlt size={40} color="gray" /> {/* Upload Icon */}
        <input {...getInputProps()} />
        <Text mt={2}>Drag and drop files here, or click to select files</Text>
      </Box>

      {/* Display Uploaded Files as Previews */}
      {files.map((file, index) => (
        <Box key={index} display="flex" alignItems="center" w="full" p={2} border="1px solid" borderColor="gray.200" borderRadius="md" mb={2}>
          <input
            type="checkbox"
            checked={selectedFiles.includes(file)}
            onChange={() => handleSelectFile(file)}
            style={{ marginRight: '8px' }}
          />

          {/* Show Preview for Images & Videos */}
          {file.type.startsWith("image") ? (
            <Image src={URL.createObjectURL(file)} alt={file.name} boxSize="50px" borderRadius="md" mr={2} />
          ) : file.type.startsWith("video") ? (
            <video src={URL.createObjectURL(file)} controls width="50" height="50" style={{ marginRight: "8px", borderRadius: "4px" }} />
          ) : (
            <Text w="full" isTruncated>
              {file.name}
            </Text>
          )}

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

      {/* Display Selected Files */}
      {selectedFiles.length > 0 && (
        <Box mt={4}>
          <Text fontSize="lg" fontWeight="bold">Selected Files:</Text>
          {selectedFiles.map((file, index) => (
            <Text key={index}>{file.name}</Text>
          ))}
        </Box>
      )}
    </VStack>
  );
}
