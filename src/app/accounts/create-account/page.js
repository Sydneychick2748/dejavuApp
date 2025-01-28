'use client';

import {
  Box,
  Heading,
  Text,
  VStack,
  Link,
  Icon,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Image
} from '@chakra-ui/react';

export default function CreateAccount() {
  return (
    <Box w="" minH="" bg="" display="flex" alignItems="center" justifyContent="center">
      <HStack spacing={8} w="90%" maxW="1000px" p={8} bg="white" borderRadius="lg" boxShadow="md">
       
       
          {/* Page Title */}
          <Heading as="h1" size="xl" color="blue.600" textAlign="center">
            CREATE AN ACCOUNT
          </Heading>
          <Text color="red.500" fontWeight="bold" textAlign="center">
            PLEASE FILL OUT ALL FIELDS*
          </Text>

          <Box w="" maxW="" mx="" p={6} bg="" borderRadius="" boxShadow="">
  <Heading as="h1" size="xl" color="blue.600" mb={4}>
    We Would Love to Connect
  </Heading>
  <VStack spacing={4} as="form">
  {/* First Name */}
  <Input
    type="text"
    name="first-name"
    placeholder="First Name*"
    required
    borderColor=""
    autoComplete="given-name" // For first name
  />

  {/* Last Name */}
  <Input
    type="text"
    name="last-name"
    placeholder="Last Name*"
    required
    borderColor=""
    autoComplete="family-name" // For last name
  />

  {/* Email */}
  <Input
    type="email"
    name="email"
    placeholder="Email*"
    required
    borderColor=""
    autoComplete="email" // For email address
  />

  {/* Phone Number */}
  <Input
    type="tel"
    name="phone"
    placeholder="Phone (xxx) xxx-xxxx*"
    required
    borderColor=""
    autoComplete="tel" // For phone number
  />

  {/* Password */}
  <Input
    type="password"
    name="password"
    placeholder="Password*"
    required
    borderColor=""
    autoComplete="new-password" // For new password creation
  />

  {/* Confirm Password */}
  <Input
    type="password"
    name="confirm-password"
    placeholder="Confirm Password*"
    required
    borderColor=""
    autoComplete="new-password" // For confirming new password
  />

  {/* Submit Button */}
  <Button type="submit" colorScheme="blue" w="100%">
    Submit
  </Button>
</VStack>

</Box>

     

        {/* Image Section */}
        <Box w="" display="" justifyContent="" alignItems="">
        <Image
        src="/images/logos/dvai-icon.png" // or "/photon-icon.png" depending on the renamed file
        alt="Company Logo"
        width={100} // Adjust width as needed
        height={100} // Adjust height as needed
      />
        </Box>
      </HStack>
    </Box>
  );
}
