'use client';

import { Box, Heading, Text, VStack, Link, Icon } from '@chakra-ui/react';
// import { EmailIcon } from '@chakra-ui/icons';

export default function Contact() {
  return (
    <Box w="100%" p={6} textAlign="center">
      <VStack spacing={6}>
        {/* Page Title */}
        <Heading as="h1" size="xl" color="black">
          Contact Us
        </Heading>

        {/* Description */}
        <Text fontSize="lg" color="black">
          Reach out to us for any inquiries or assistance. We’d love to hear from you!
        </Text>

        {/* Contact Email */}
        <VStack spacing={2}>
          <Heading as="h2" size="md" color="black">
            Email Us
          </Heading>
          <Link href="mailto:support@example.com" fontSize="lg" fontWeight="bold" color="blue.500">
            {/* <Icon as={EmailIcon} mr={2} /> */}
            support@example.com
          </Link>
        </VStack>
      </VStack>
    </Box>
  );
}
