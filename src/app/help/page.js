"use client";

import {
  Box,
  VStack,
  Heading,
  Text,
  HStack,
  Link,
  Icon,
  Image,
} from "@chakra-ui/react";
import { MdChatBubbleOutline } from "react-icons/md";
// import Image from 'next/image';

const styles = {
  helpContainer: {
    width: "100%",
    minHeight: "85vh",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
    backgroundImage:
      "url('/images/logos/DejavuAILogoOpacity.png'), url('/images/background/DejaVuBackground.png')",
    backgroundSize: "550px, cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    padding: "40px",
  },
};

export default function Help() {
  return (
    <Box style={styles.helpContainer}>
      <VStack spacing={4} align="center">
        {/* Header */}
        <Heading
          as="h1"
          size={{ base: "xl", md: "4xl", lg: "6xl" }}
          color="blue.600"
          textAlign="center"
          px={4}
          mt={10} // Moves it up
        >
          HELP/TRAININGS
        </Heading>

        {/* Description */}
        <Text
          fontSize={{ base: "md", md: "xl", lg: "2xl" }}
          color="gray.700"
          textAlign="center"
          fontWeight="500"
          maxW="800px"
          mt={8}
          mx="auto"
          px={4}
          mb={8}
        >
          HERE YOU CAN FIND TUTORIALS THAT WILL HELP YOU NAVIGATE THROUGH THE
          WEBSITE. PLEASE REQUEST A DEMO IF FURTHER ASSISTANCE IS NEEDED.
        </Text>

        {/* Request a Demo Section */}
        <VStack spacing={2} align="center">
          <VStack spacing={2} align="center">
            <HStack spacing={3} align="center" mt={8}>
              <Image
                src="/images/logos/Message.png"
                alt="Demo Request"
                boxSize={{ base: "50px", md: "70px", lg: "90px" }}
              />
              <Text
                fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                fontWeight="500"
                color="black"
                fontFamily="'Poppins', sans-serif"
              >
                REQUEST A DEMO
              </Text>
            </HStack>
            <Link
              href="mailto:sales@dejavuai.com"
              fontSize={{ base: "sm", md: "md", lg: "lg" }}
              fontWeight="500"
              color="black"
              _hover={{ textDecoration: "underline" }}
              mt={-5}
            >
              sales@dejavuai.com
            </Link>
          </VStack>
        </VStack>

        {/* Footer */}
        {/* <Box bg="" w="" py={4} textAlign="" mt={8}>
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
        </Box> */}
      </VStack>
    </Box>
  );
}
