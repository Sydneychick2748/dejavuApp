"use client"

import { useRouter } from "next/navigation"; // Import useRouter
import { Box, Button, Heading, Text, Image, VStack, HStack, Spacer } from "@chakra-ui/react";


const styles = {
  backgroundBox: {
    width: "100%",
    minHeight: "85vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    backgroundImage: "url('/images/background/DejaVuBackground.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    padding: "20px",
  },
 
};
export default function Home() {
  const router = useRouter(); // Initialize router

  return (
    <Box style={styles.backgroundBox}>
      <VStack spacing={6} textAlign="center">
        {/* Titles */}
        <Heading
          as="h1"
          fontSize={["3xl", "4xl", "5xl"]}
          color="#00264A"
          fontFamily="'Poppins', sans-serif"
          fontWeight="400"
          textAlign="left"
          alignSelf="flex-start"
          width="100%"
          pl={["10px", "20px", "35px"]}
          mt={["-20px", "-40px", "-80px"]}
          pb={["0px", "0px", "10px"]} // Add bottom padding
        >
          Welcome to
        </Heading>
        {/* Welcome Logo */}
        <Image
          src="/images/logos/DVAI-Logo-Horizontal-Dark.png"
          alt="Welcome page Logo"
          width={["450px", "700px", "1350px"]}
          maxWidth="100%"
          height="auto"
          objectFit="contain"
          display="block"
          mx="auto"
          mt="10px"
        />
        <Text
          fontSize={["lg", "xl", "3xl"]}
          color="#00264A"
          fontWeight="400"
          textAlign="right"
          alignSelf="center"
          width="100%" // Ensures it takes full width
          pr={["10px", "40px", "50px"]} // Adjust right padding for positioning
          pb="40px"
          mt="-10px"
        >
          Trace The Untraceable
        </Text>
        {/* Buttons */}
        <HStack
          spacing={6}
          width="100%"
          maxW="1200px"
          px={6}
          flexWrap="wrap" // Allows buttons to wrap on smaller screens
          justify="center" // Spreads buttons apart
        >
          <Button
            className="btn-logIn"
            size={["sm", "md", "lg"]}
            // ml={["30px", "50px", "80px"]}
            bg="#4D89FF"
            color="white"
            borderRadius="20px"
            _hover={{ bg: "#3B6CD9" }}
            onClick={() => router.push("/accounts/login")} // Navigate to login page
          >
            <Image src="/images/logos/photon-icon.png" boxSize="20px" mr={2} />
            LOG IN
          </Button>
          <Button
            className="btn-signUp"
            size={["sm", "md", "lg"]}
            // ml={["20px", "40px", "60px"]}
            bg="#4D89FF"
            color="white"
            borderRadius="20px"
            _hover={{ bg: "#3B6CD9" }}
            onClick={() => router.push("/accounts/create-account")} // Navigate to sign-up page
          >
            <Image src="/images/logos/photon-icon.png" boxSize="20px" mr={2} />
            SIGN UP
          </Button>
          <Spacer display={["none", "block"]} /> {/* Keeps spacing */}
          {/* Adjust width and move LET'S GET STARTED button */}
          <Button
            className="btn-letsGetStarted"
            size={["sm", "md", "lg"]}
            // ml={["50px", "80px", "100px"]}
            bg="#4D89FF"
            color="white"
            borderRadius="20px"
            _hover={{ bg: "#3B6CD9" }}
            onClick={() => router.push("/help")} // Navigate to dashboard
          >
            <Image src="/images/logos/photon-icon.png" boxSize="20px" mr={2} />
            LET'S GET STARTED
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}

