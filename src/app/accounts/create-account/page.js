"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import Next.js Router
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  HStack,
  Image,
  Input,
} from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input"; // Chakra UI Password Input

export default function CreateAccount() {
  const router = useRouter(); // Initialize router for navigation

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    emailMatch: "",
    passwordMatch: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Live validation for emails and passwords
    if (e.target.name === "confirmEmail") {
      if (e.target.value !== formData.email) {
        setErrors((prev) => ({ ...prev, emailMatch: "❌ Emails do not match!" }));
      } else {
        setErrors((prev) => ({ ...prev, emailMatch: "" }));
      }
    }

    if (e.target.name === "confirmPassword") {
      if (e.target.value !== formData.password) {
        setErrors((prev) => ({ ...prev, passwordMatch: "❌ Passwords do not match!" }));
      } else {
        setErrors((prev) => ({ ...prev, passwordMatch: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Final validation before sending
    if (formData.email !== formData.confirmEmail) {
      setErrors((prev) => ({ ...prev, emailMatch: "❌ Emails do not match!" }));
      console.log("Email mismatch:", formData.email, formData.confirmEmail);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({ ...prev, passwordMatch: "❌ Passwords do not match!" }));
      console.log("Password mismatch:", formData.password, formData.confirmPassword);
      return;
    }

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("Signup Error:", data.message);
      setMessage("❌ " + (data.message || "Something went wrong"));
    } else {
      console.log("Signup Success:", data);
      setMessage("✅ Account created successfully! Redirecting to login...");
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push("/accounts/login");
      }, 2000);
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
            CREATE AN ACCOUNT
          </Heading>

          {message && <Text color={message.startsWith("❌") ? "red.500" : "green.500"}>{message}</Text>}

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <Input name="firstName" placeholder="First Name*" onChange={handleChange} required bg="white" color="black" />
              <Input name="lastName" placeholder="Last Name*" onChange={handleChange} required bg="white" color="black" />
              <Input name="email" type="email" placeholder="Email*" onChange={handleChange} required bg="white" color="black" />
              <Input name="confirmEmail" type="email" placeholder="Confirm Email*" onChange={handleChange} required bg="white" color="black" />
              {errors.emailMatch && <Text color="red.500">{errors.emailMatch}</Text>}
              <Input name="phone" placeholder="Phone*" onChange={handleChange} required bg="white" color="black" />
              <PasswordInput name="password" placeholder="Password*" onChange={handleChange} required bg="white" color="black" />
              <PasswordInput name="confirmPassword" placeholder="Confirm Password*" onChange={handleChange} required bg="white" color="black" />
              {errors.passwordMatch && <Text color="red.500">{errors.passwordMatch}</Text>}
              <Button type="submit" colorScheme="blue" w="100%">
                Submit
              </Button>
            </VStack>
          </form>
        </Box>

        {/* Image Section */}
        <Box w="40%" display="flex" justifyContent="center" alignItems="center">
          <Image src="/images/logos/dvai-icon.png" alt="Company Logo" width="150px" height="150px" />
        </Box>
      </HStack>
    </Box>
  );
}
