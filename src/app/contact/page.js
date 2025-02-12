"use client";

import {
  Box,
  Heading,
  Text,
  VStack,
  Link,
  Icon,
  HStack,
  Input,
  Button,
} from "@chakra-ui/react";
import { MdEmail } from "react-icons/md";

const styles = {
  contactContainer: {
    width: "100%",
    minHeight: "85vh",
    padding: "20px",
    textAlign: "center",
    backgroundImage: "url('/images/background/DejaVuBackground.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default function Contact() {
  return (
    <Box style={styles.contactContainer}>
      <VStack spacing={8}>
        {/* Page Title */}
        <Heading
          as="h1"
          size={{ base: "xl", md: "2xl", lg: "4xl" }}
          color="blue.600"
          textAlign="center"
          px={4}
        >
          Contact Us
        </Heading>

        {/* Description */}
        <Text
          fontSize={{ base: "md", md: "lg", lg: "xl" }}
          color="gray.700"
          textAlign="center"
          maxW="800px"
          mt={8}
          mx="auto"
          px={4}
          mb={8}
        >
          If you’re interested in the capabilities of our product, would like to
          know more, schedule a demo, or find out what DejaVuAI can do for your
          business, please send us a message so we can get in touch.
        </Text>

        <Box
          w="100%"
          maxW="500px"
          mx="auto"
          p={6}
          bg="gray.50"
          borderRadius="md"
        >
          {/* Native Form */}
          <form>
            <VStack spacing={4}>
              {/* First Name */}
              <Input
                type="text"
                name="first-name"
                placeholder="First Name*"
                required
                borderColor="gray.500" // Darker gray border
                color="gray.800"
                borderRadius="2xl" // Adds border radius
                _hover={{ borderColor: "blue.600" }} // Blue border on hover
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 2px blue.200",
                }} // Blue border and glow on focus
              />

              {/* Last Name */}
              <Input
                type="text"
                name="last-name"
                placeholder="Last Name*"
                required
                borderColor="gray.500" // Darker gray border
                color="gray.800"
                borderRadius="2xl"
                _hover={{ borderColor: "blue.600" }}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 2px blue.200",
                }}
              />

              {/* Email */}
              <Input
                type="email"
                name="email"
                placeholder="Email*"
                required
                borderColor="gray.500" // Darker gray border
                color="gray.800"
                borderRadius="2xl"
                _hover={{ borderColor: "blue.600" }}
                _focus={{
                  borderColor: "blue.500",
                  boxShadow: "0 0 0 2px blue.200",
                }}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                bg="blue.500" 
                color="white" 
                w="full"
                borderRadius="2xl"
                fontWeight="bold" // Makes text bold
                fontSize="lg" // Increases text size
                _hover={{
                  bg: "white", // Turns white on hover
                  color: "blue.500", // Changes text color to blue
                  border: "2px solid", // Adds a blue border
                  borderColor: "blue.500",
                }}
                _focus={{
                  boxShadow: "0 0 0 2px blue.200",
                }}
              >
                SUBMIT
              </Button>
            </VStack>
          </form>
        </Box>

        {/* Contact Email */}
        <VStack spacing={4}>
          <HStack spacing={3} align="center">
            <Icon as={MdEmail} boxSize={6} mt={8} color="blue.500" />{" "}
            {/* Email icon next to text */}
            <Text fontSize="xl" color="black" mt={8} fontWeight="bold">
              Email Us
            </Text>
          </HStack>

          <Link
            href="mailto:support@example.com"
            fontSize="xl"
            fontWeight="bold"
            color="blue.600"
            _hover={{ textDecoration: "underline" }}
          >
            sales@dejavuai.com
          </Link>
        </VStack>
      </VStack>
    </Box>
  );
}
