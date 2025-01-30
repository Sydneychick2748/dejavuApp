'use client';

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  Button,
  Image,
} from '@chakra-ui/react';

export default function CreateAccount() {
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
            CREATE AN ACCOUNT
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

              {/* Phone Number */}
              <Input
                type="tel"
                name="phone"
                placeholder="Phone (xxx) xxx-xxxx*"
                required
                borderColor="gray.300"
                autoComplete="tel"
              />

              {/* Password */}
              <Input
                type="password"
                name="password"
                placeholder="Password*"
                required
                borderColor="gray.300"
                autoComplete="new-password"
              />

              {/* Confirm Password */}
              <Input
                type="password"
                name="confirm-password"
                placeholder="Confirm Password*"
                required
                borderColor="gray.300"
                autoComplete="new-password"
              />

              {/* Submit Button */}
              <Button type="submit" colorScheme="blue" w="100%">
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
