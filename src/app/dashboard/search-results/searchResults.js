import React from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";

const SearchResults = ({ onReturn }) => {
  return (
    <Box
      w="100vw" // Full width
      h="100vh" // Full height
      bg="#E7EAEE"
      borderRadius="lg"
      shadow="md"
      p={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Button
        onClick={onReturn}
        mb={4}
        bg="#D6D6D6"
        color="black"
        borderRadius="8px"
        _hover={{ bg: "#C0C0C0" }}
      >
        Return
      </Button>
      <Heading as="h2" size="lg" mb={4}>
        Search Results
      </Heading>
      <Text>This is the results page. Add your search results here.</Text>
    </Box>
  );
};

export default SearchResults;