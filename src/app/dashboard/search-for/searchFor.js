
"use client";

import { useContext } from "react";
import { ImageContext } from "@/contexts/ImageContext";
import { Box, Image, Text, Button } from "@chakra-ui/react";

export default function SearchFor() {
  const { selectedImage } = useContext(ImageContext);

  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" mb={2}>Search for...</Text>
      
      <Box
        border="2px solid blue"
        p={2}
        borderRadius="md"
        textAlign="center"
        bg="gray.50"
      >
        {selectedImage ? (
          <Image src={selectedImage} alt="Selected" boxSize="200px" borderRadius="md" />
        ) : (
          <Text>No image selected</Text>
        )}
      </Box>

      <Button mt={2} colorScheme="blue">Manual Mask</Button>
      <Button mt={2} colorScheme="blue">Isolate Subject</Button>
      <Button mt={2} colorScheme="blue">Create Search Object</Button>
      <Button mt={2} colorScheme="blue">Add to Object Family</Button>
    </Box>
  );
}
