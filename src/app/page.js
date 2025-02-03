<<<<<<< HEAD
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
=======



import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';

>>>>>>> aad5f1dbf04246ace354c31cb8d64870cd2bf7e1
export default function Home() {
  return (
    <Box w="100%" h="100vh" display="flex" justifyContent="center" alignItems="center" bg="gray.50">
      <VStack spacing={6} textAlign="center">
        {/* Titles */}
        <Heading as="h1" size="2xl" color="blue.600">
          Welcome to
        </Heading>
        <Heading as="h1" size="xl" color="black">
          DejaVuAI
        </Heading>
        <Text >
          Trace The Untraceable
        </Text>
        {/* Buttons */}
        <VStack spacing={4}>
          <Button >
            Log In
          </Button>
          <Button  size="lg">
  Sign Up
</Button>


          <Button  className='btn-home'>
            Let's Get Started
          </Button>
          
      <Button variant="solid" bg="teal.500" color="white" _hover={{ bg: "teal.600" }}>
  Let's Get Started
</Button>

        </VStack>
      </VStack>
    </Box>
  );
}