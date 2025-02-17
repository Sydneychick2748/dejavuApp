import { useSearchParams } from "next/navigation";
import { Box, Image, Text } from "@chakra-ui/react";

export default function SearchFor() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("image");

  return (
    <Box textAlign="center" mt={10}>
      {imageUrl ? (
        <Image 
          src={decodeURIComponent(imageUrl)} 
          alt="Selected Image" 
          maxW="500px" 
          borderRadius="md"
        />
      ) : (
        <Text fontSize="lg" color="red.500">No image selected.</Text>
      )}
    </Box>
  );
}
