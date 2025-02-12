"use client";

import { useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Input,
  Button,
  Link,
  HStack,
  Image,
  Text,
} from "@chakra-ui/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setSuccessMessage("Login successful! Redirecting...");
      setErrorMessage("");
      // Redirect user after login (replace with your dashboard page)
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } else {
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
              <Input
                type="email"
                name="email"
                placeholder="Email*"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                borderColor="gray.300"
                autoComplete="email"
              />

              <Input
                type="password"
                name="password"
                placeholder="Password*"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                borderColor="gray.300"
                autoComplete="current-password"
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
