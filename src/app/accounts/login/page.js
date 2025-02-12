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
} from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input"; // Using Chakra's PasswordInput

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Attempting login with:", { email, password });

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("Login Response:", data);

    if (response.ok) {
      setSuccessMessage("✅ Login successful! Redirecting...");
      setErrorMessage("");
      setTimeout(() => {
        window.location.href = "/dashboard"; // Redirects to dashboard
      }, 2000);
    } else {
      console.log("❌ Login failed:", data.message);
      setErrorMessage(data.message);
      setSuccessMessage("");
    }
  };

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
          <Heading as="h1" size="xl" color="blue.600" textAlign="center" mb={4}>
            LOG IN
          </Heading>

          {errorMessage && <Text color="red.500">{errorMessage}</Text>}
          {successMessage && <Text color="green.500">{successMessage}</Text>}

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              {/* Email Input - Now with White Background and Black Text */}
              <Input
                type="email"
                name="email"
                placeholder="Email*"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                borderColor="gray.300"
                bg="white"
                color="black"
                _placeholder={{ color: "gray.600" }} // Placeholder text color
                autoComplete="email"
              />

              {/* Chakra UI Password Input with Visibility Toggle - Fixed Text Colors */}
              <PasswordInput
                name="password"
                placeholder="Password*"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                bg="white"
                color="black"
                _placeholder={{ color: "gray.600" }}
              />

              <Link href="/forgot-password" color="blue.500" alignSelf="flex-start">
                Forgot Password?
              </Link>

              <Button type="submit" colorScheme="green" w="100%">
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
