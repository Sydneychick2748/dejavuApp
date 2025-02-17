<<<<<<< HEAD
"use client";
import { useContext } from "react";
import { ImageContext } from "@/contexts/ImageContext"; // :white_check_mark: Import the correct context
import { Box, Image, Text } from "@chakra-ui/react";
export default function SearchFor() {
  const { selectedImage } = useContext(ImageContext); // :white_check_mark: Use the context
=======

"use client";
import { useContext } from "react";
import { ImageContext } from "@/contexts/ImageContext"; // ✅ Import the correct context
import { Box, Image, Text } from "@chakra-ui/react";

export default function SearchFor() {

  const { selectedImage } = useContext(ImageContext); // ✅ Use the context

>>>>>>> c5e165e3fd0d141db6536c46bc8f3e54cc8bd6b4
  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold">Search For Image</Text>
      {selectedImage ? (
        <Image src={selectedImage} alt="Selected" boxSize="300px" borderRadius="md" />
      ) : (
        <Text>No image selected</Text>
      )}
    </Box>
<<<<<<< HEAD
  );
}
=======

  );
}
>>>>>>> c5e165e3fd0d141db6536c46bc8f3e54cc8bd6b4
