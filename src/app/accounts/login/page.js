'use client';

import {
  Box,
  Heading,
  VStack,
  Input,
  Button,
  Link,
  HStack,
  Image,
} from '@chakra-ui/react';

export default function Login() {
  return (
    <Box
      w="100%"
      minH="100vh"
      bg="gray.50"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <HStack
        spacing={8}
        w="90%"
        maxW="800px"
        p={8}
        bg="white"
        borderRadius="lg"
        boxShadow="md"
      >
        {/* Form Section */}
        <Box w="60%" p={6}>
          {/* Page Title */}
          <Heading as="h1" size="xl" color="blue.600" textAlign="center" mb={4}>
            LOG IN
          </Heading>

          {/* Form */}
          <form>
            <VStack spacing={4}>
              {/* Email */}
              <Input
                type="email"
                name="email"
                placeholder="Email*"
                required
                borderColor="gray.300"
                autoComplete="email"
              />

              {/* Password */}
              <Input
                type="password"
                name="password"
                placeholder="Password*"
                required
                borderColor="gray.300"
                autoComplete="current-password"
              />

              {/* Forgot Password */}
              <Link href="/forgot-password" color="blue.500" alignSelf="flex-start">
                Forgot Password?
              </Link>

              {/* Submit Button */}
              <Button type="submit" colorScheme="green" w="100%">
                Submit
              </Button>
            </VStack>
          </form>
        </Box>

        {/* Image Section */}
        <Box w="40%" display="flex" justifyContent="center" alignItems="center">
          <Image
            src="/images/logos/dvai-icon.png"
            alt="Company Logo"
            width="150px"
            height="150px"
          />
        </Box>
      </HStack>
    </Box>
  );
}
