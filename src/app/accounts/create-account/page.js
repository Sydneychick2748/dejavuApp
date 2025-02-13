"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
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
import { PasswordInput } from "@/components/ui/password-input"; 

export default function CreateAccount() {
  const router = useRouter(); 

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
    phoneFormat: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Live validation for emails and passwords
    if (name === "confirmEmail") {
      setErrors((prev) => ({
        ...prev,
        emailMatch: value !== formData.email ? "❌ Emails do not match!" : "",
      }));
    }

    if (name === "confirmPassword") {
      setErrors((prev) => ({
        ...prev,
        passwordMatch: value !== formData.password ? "❌ Passwords do not match!" : "",
      }));
    }

    if (name === "phone") {
      const phoneRegex = /^(\(\d{3}\)\d{3}-\d{4}|\d{3}-\d{3}-\d{4})$/;
      setErrors((prev) => ({
        ...prev,
        phoneFormat: phoneRegex.test(value) ? "" : "❌ Invalid phone format! Use (XXX)XXX-XXXX or XXX-XXX-XXXX",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Final validation before sending
    if (formData.email !== formData.confirmEmail) {
      setErrors((prev) => ({ ...prev, emailMatch: "❌ Emails do not match!" }));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({ ...prev, passwordMatch: "❌ Passwords do not match!" }));
      return;
    }

    if (errors.phoneFormat) {
      return; // Prevent submission if phone is invalid
    }

    console.log("Submitting data:", formData); // Debugging

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Signup Error:", data.message);
        setMessage("❌ " + (data.message || "Something went wrong"));
      } else {
        console.log("Signup Success:", data);
        setMessage("✅ Account created successfully! Redirecting to login...");
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push("/accounts/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Network error:", error);
      setMessage("❌ Something went wrong. Please try again.");
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

              <Input
                name="phone"
                placeholder="Phone* (XXX)XXX-XXXX or XXX-XXX-XXXX"
                onChange={handleChange}
                required
                bg="white"
                color="black"
                autoComplete="tel"
              />
              {errors.phoneFormat && <Text color="red.500">{errors.phoneFormat}</Text>}

              <PasswordInput name="password" placeholder="Password*" onChange={handleChange} required bg="white" color="black" autoComplete="new-password"  />
              <PasswordInput name="confirmPassword" placeholder="Confirm Password*" onChange={handleChange} required bg="white" color="black"  autoComplete="new-password" />
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
