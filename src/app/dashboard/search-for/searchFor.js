"use client";
import { useContext } from "react";
import { ImageContext } from "@/contexts/ImageContext"; // :white_check_mark: Import the correct context
import { Box, Image, Text } from "@chakra-ui/react";
export default function SearchFor() {
  const { selectedImage } = useContext(ImageContext); // :white_check_mark: Use the context
  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold">Search For Image</Text>
      {selectedImage ? (
        <Image src={selectedImage} alt="Selected" boxSize="300px" borderRadius="md" />
      ) : (
        <Text>No image selected</Text>
      )}
    </Box>
  );
}