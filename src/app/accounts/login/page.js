"use client";

import { useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Button,
  Link,
  HStack,
  Image,
  Text,
  Input,
  Flex,
} from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input"; // Using Chakra's PasswordInput

const styles = {
  loginContainer: {
    width: "100%",
    minHeight: "85vh",
    padding: "20px",
    backgroundImage: "url('/images/background/DejaVuBackground.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "80px", // Reduce padding to move up
  },
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Attempting login with:", { email, password });

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("Login Response:", data);

    if (response.ok) {
      setSuccessMessage("Login successful! Redirecting...");
      setErrorMessage("");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } else {
      setErrorMessage(data.message);
      setSuccessMessage("");
    }
  };

  return (
    <Box style={styles.loginContainer}>
      <Flex
        direction={{ base: "column", md: "row" }} // Stacks on small screens
        align="center"
        justify="center"
        w="90%"
        maxW="1000px"
        p={{ base: 4, md: 8 }}
      >
        {/* Form Section */}
        <Box w={{ base: "100%", md: "50%" }} p={2}>
          <Flex direction="column" align="flex-start" w="100%">
            <Heading
              as="h1"
              size="2xl"
              color="#012649"
              textAlign="left"
              fontFamily="'Poppins', sans-serif"
              fontWeight="600"
              mb={4}
            >
              LOG IN
            </Heading>
          </Flex>

          {errorMessage && <Text color="red.500">{errorMessage}</Text>}
          {successMessage && <Text color="green.500">{successMessage}</Text>}

          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              {/* Email Input */}
              <Input
                type="email"
                name="email"
                placeholder="Email*"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                border="2px solid blue"
                borderRadius="full"
                bg="white"
                color="black"
                _placeholder={{ color: "gray.600" }}
                p={5}
                autoComplete="email"
              />

              <PasswordInput
                name="password"
                placeholder="Password*"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                border="2px solid blue"
                borderRadius="full"
                bg="white"
                color="black"
                _placeholder={{ color: "gray.600" }}
                p={6}
                autoComplete="new-password"
              />

              <Link
                href="/forgot-password"
                color="black"
                fontWeight="500"
                alignSelf="flex-start"
                mt="20px"
              >
                Forgot Password?
              </Link>

              <Button
                type="submit"
                bg="#4D89FF"
                color="white"
                w="50%"
                fontWeight="600"
                borderRadius="full"
                alignSelf="center"
                mt="150px" // Moves button further down
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

        {/* Image Section */}
        <Box
          w={{ base: "100%", md: "40%" }}
          display="flex"
          justifyContent="center"
          alignItems="center" // Fix alignment issue
        >
          <Image
            src="/images/logos/dvai-icon.png"
            alt="Company Logo"
            maxW={{ base: "150px", md: "100%" }} // Set a smaller max width for mobile
            objectFit="contain"
          />
        </Box>
      </Flex>
    </Box>
  );
}

