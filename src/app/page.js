'use client';

import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
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
        <Text fontSize="lg" color="gray.700">
          Trace The Untraceable
        </Text>

        {/* Buttons */}
        <VStack spacing={4}>
          <Button colorScheme="blue" size="lg">
            Log In
          </Button>
          <Button colorScheme="teal" size="lg">
            Sign Up
          </Button>
          <Button colorScheme="purple" size="lg">
            Let's Get Started
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}