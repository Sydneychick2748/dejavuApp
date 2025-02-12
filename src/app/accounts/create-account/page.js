'use client';

import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Input,
  Button,
  HStack,
  Image,
} from '@chakra-ui/react';

export default function CreateAccount() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || 'Something went wrong');
    } else {
      setMessage('Account created successfully! You can now log in.');
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
        <Box w="60%" p={6}>
          <Heading as="h1" size="xl" color="blue.600" textAlign="center" mb={4}>
            CREATE AN ACCOUNT
          </Heading>
          {error && <Text color="red.500">{error}</Text>}
          {message && <Text color="green.500">{message}</Text>}
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <Input name="firstName" placeholder="First Name*" onChange={handleChange} required />
              <Input name="lastName" placeholder="Last Name*" onChange={handleChange} required />
              <Input name="email" type="email" placeholder="Email*" onChange={handleChange} required />
              <Input name="phone" placeholder="Phone*" onChange={handleChange} required />
              <Input name="password" type="password" placeholder="Password*" onChange={handleChange} required />
              <Button type="submit" colorScheme="blue" w="100%">
                Submit
              </Button>
            </VStack>
          </form>
        </Box>
        <Box w="40%" display="flex" justifyContent="center" alignItems="center">
          <Image src="/images/logos/dvai-icon.png" alt="Company Logo" width="150px" height="150px" />
        </Box>
      </HStack>
    </Box>
  );
}
