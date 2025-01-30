'use client';


import { Box, Button, Heading, Text, VStack, HStack,Input } from '@chakra-ui/react';
import Avatar from '@/components/ui/avatar'; // Assuming you're using `@/` alias for `src/`

export default function Profile() {
  return (
    <Box
      w="100%"
      minH="100vh"
      bg="gray.50"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={6}
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
            PROFILE
          </Heading>
          <Text color="red.500" fontWeight="bold" textAlign="center" mb={6}>
            PLEASE FILL OUT ALL FIELDS*
          </Text>

          {/* Form */}
          <form>
            <VStack spacing={4}>
              {/* First Name */}
              <Input
                type="text"
                name="first-name"
                placeholder="First Name*"
                required
                borderColor="gray.300"
                autoComplete="given-name"
              />

              {/* Last Name */}
              <Input
                type="text"
                name="last-name"
                placeholder="Last Name*"
                required
                borderColor="gray.300"
                autoComplete="family-name"
              />

              {/* Email */}
              <Input
                type="email"
                name="email"
                placeholder="Email*"
                required
                borderColor="gray.300"
                autoComplete="email"
              />

              {/* Phone */}
              <Input
                type="tel"
                name="phone"
                placeholder="Phone*"
                required
                borderColor="gray.300"
                autoComplete="tel"
              />

              {/* Address */}
              <Input
                type="text"
                name="address"
                placeholder="Address*"
                required
                borderColor="gray.300"
                autoComplete="street-address"
              />

              {/* Submit Button */}
              <Button type="submit" colorScheme="blue" w="100%">
                Submit
              </Button>
            </VStack>
          </form>
        </Box>

        {/* Avatar Section */}
        <Box w="40%" display="flex" flexDirection="column" alignItems="center">
       
       
          <Text mt={4} color="black" fontWeight="bold">
            + Add Photo
          </Text>
        </Box>
      </HStack>
    </Box>
  );
}

