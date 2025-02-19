"use client";

import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  Image,
} from "@chakra-ui/react";
import Avatar from "@/components/ui/avatar"; // Assuming you're using `@/` alias for `src/`

const styles = {
  profileContainer: {
    width: "100%",
    minHeight: "85vh",
    padding: "10px",
    ml: "-20px",
    backgroundImage: "url('/images/background/DejaVuBackground.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // paddingTop: "10px", // Reduce padding to move up
  },
};

export default function Profile() {
  return (
    <Box style={styles.profileContainer}>
      <HStack
        spacing={8}
        w="90%"
        maxW="800px"
      >
        {/* Form Section */}
        <Box
          w={{ base: "100%", md: "60%" }} // Full width on mobile, 60% on larger screens
          // p={0}
          textAlign="left"
        >
          {/* Page Title */}
          <Heading
            as="h1"
            size="2xl"
            color="black"
            fontWeight="500"
            textAlign="left"
          >
            PROFILE
          </Heading>

          <Text
            color="red.500"
            fontSize="md"
            fontWeight="600"
            textAlign="left"
            mb={2}
          >
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
                bg="white"
                color="black"
                mb={4} // Adds extra spacing below
                p={4} // Increased padding for better appearance
                borderRadius="full" // Fully rounded borders
                border="1px solid #0F60F9" // Subtle border
                autoComplete="given-name"
              />

              {/* Last Name */}
              <Input
                type="text"
                name="last-name"
                placeholder="Last Name*"
                required
                bg="white"
                color="black"
                mb={4} // Adds extra spacing below
                p={4} // Increased padding for better appearance
                borderRadius="full" // Fully rounded borders
                border="1px solid #0F60F9" // Subtle border
                autoComplete="family-name"
              />

              {/* Email */}
              <Input
                type="email"
                name="email"
                placeholder="Email*"
                required
                bg="white"
                color="black"
                mb={4} // Adds extra spacing below
                p={4} // Increased padding for better appearance
                borderRadius="full" // Fully rounded borders
                border="1px solid #0F60F9" // Subtle border
                autoComplete="email"
              />

              {/* Phone */}
              <Input
                type="tel"
                name="phone"
                placeholder="Phone*"
                required
                bg="white"
                color="black"
                mb={4} // Adds extra spacing below
                p={4} // Increased padding for better appearance
                borderRadius="full" // Fully rounded borders
                border="1px solid #0F60F9" // Subtle border
                autoComplete="tel"
              />

              {/* Address */}
              <Input
                type="text"
                name="address"
                placeholder="Address*"
                required
                bg="white"
                color="black"
                mb={4} // Adds extra spacing below
                p={4} // Increased padding for better appearance
                borderRadius="full" // Fully rounded borders
                border="1px solid #0F60F9" // Subtle border
                autoComplete="street-address"
              />

              {/* Submit Button */}
              <Button
                type="submit"
                bg="#4D89FF"
                color="white"
                w="50%"
                fontWeight="600"
                borderRadius="full"
                alignSelf="center"
                // mt={{ base: 6, md: 14 }} // Adds space between button & fields
                mb={{ base: 6, md: 0 }} // Adds space below the button on mobile
                _hover={{ bg: "#3B6CD9" }}
              >
                <Image
                  src="/images/logos/photon-icon.png"
                  boxSize="20px"
                  mr={2}
                />
                SUBMIT
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
