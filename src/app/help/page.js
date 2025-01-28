'use client';

import { Box, VStack, Heading, Text, HStack, Link, Icon, Image } from '@chakra-ui/react';
import { MdChatBubbleOutline } from 'react-icons/md';
// import Image from 'next/image';

export default function Help() {
  return (
    <Box bg="gray.50" w="100%" minH="100vh" p={6}>
      <VStack spacing={8} align="center">
        {/* Header */}
        <Heading as="h1" size="2xl" color="blue.600">
          HELP/TRAININGS
        </Heading>

        {/* Description */}
        <Text fontSize="lg" color="gray.700" textAlign="center">
        HERE YOU CAN FIND TUTORIALS THAT WILL HELP YOU NAVIGATE THROUGH THE WEBSITE. PLEASE REQUEST A DEMO IF FURTHER ASSISTANCE IS NEEDED. THANKS
        </Text>

        {/* Request a Demo Section */}
        <VStack spacing={2} align="center">
          <HStack spacing={3} align="center">
            <Icon as={MdChatBubbleOutline} boxSize={8} color="green.500" />
            <Text fontSize="lg" fontWeight="bold" color="black">
              REQUEST A DEMO
            </Text>
          </HStack>
          <Link href="mailto:sales@dejavuai.com" fontSize="lg" fontWeight="bold" color="blue.600">
            sales@dejavuai.com
          </Link>
        </VStack>

        {/* Footer */}
        <Box bg="" w="" py={4} textAlign="" mt={8}>
          <VStack spacing={2}>
          <Image
        src="/images/logos/photon-icon.png" // or "/photon-icon.png" depending on the renamed file
        alt="Company Logo"
        width={100} // Adjust width as needed
        height={100} // Adjust height as needed
      />
            <Heading as="h2" size="md" color="black">
              THANKS A BUNCH!
            </Heading>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}
