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
} from '@chakra-ui/react';
import { MdEmail } from 'react-icons/md';

export default function Contact() {
  return (
    <Box w="100%" p={6} textAlign="center" bg="gray.50" minH="100vh">
      <VStack spacing={8}>
        {/* Page Title */}
        <Heading as="h1" size="xl" color="blue.600">
          Contact Us
        </Heading>

        {/* Description */}
        <Text fontSize="lg" color="gray.700">
          If you’re interested in the capabilities of our product, would like to know more, schedule a demo, or find
          out what DejaVuAI can do for your business, please send us a message so we can get in touch.
        </Text>

        <Box w="100%" maxW="500px" mx="auto" p={6} bg="gray.50" borderRadius="md">
      <Heading as="h1" size="lg" textAlign="center" mb={6}>
        Contact Us
      </Heading>

      {/* Native Form */}
      <form>
        <VStack spacing={4}>
          {/* First Name */}
          <Input
            type="text"
            name="first-name"
            placeholder="First Name*"
            required
            borderColor="gray.300"
          />

          {/* Last Name */}
          <Input
            type="text"
            name="last-name"
            placeholder="Last Name*"
            required
            borderColor="gray.300"
          />

          {/* Email */}
          <Input
            type="email"
            name="email"
            placeholder="Email*"
            required
            borderColor="gray.300"
          />

          {/* Submit Button */}
          <Button type="submit" colorScheme="blue" w="full">
            Submit
          </Button>
        </VStack>
      </form>
      </Box>
        

        {/* Contact Email */}
        <VStack spacing={4}>
          <HStack spacing={3} align="center">
         
            <Text fontSize="lg" color="black" fontWeight="bold">
              Email Us
            </Text>
          </HStack>
          <Icon as={MdEmail} boxSize={8} color="blue.500" />
          <Link
            href="mailto:support@example.com"
            fontSize="lg"
            fontWeight="bold"
            color="blue.600"
            _hover={{ textDecoration: 'underline' }}
          >

            sales@dejavuai.com
          </Link>
        </VStack>
      </VStack>
    </Box>
  );
}