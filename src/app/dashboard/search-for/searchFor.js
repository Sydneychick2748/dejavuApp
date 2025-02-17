
"use client";
import { useContext } from "react";
import { ImageContext } from "@/contexts/ImageContext"; // ✅ Import the correct context
import { Box, Image, Text } from "@chakra-ui/react";

export default function SearchFor() {

  const { selectedImage } = useContext(ImageContext); // ✅ Use the context

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
