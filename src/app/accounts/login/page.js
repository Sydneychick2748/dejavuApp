// "use client";

// import { useState } from "react";
// import {
//   Box,
//   Heading,
//   VStack,
//   Button,
//   Link,
//   HStack,
//   Image,
//   Text,
//   Input,
//   Flex,
// } from "@chakra-ui/react";
// import { PasswordInput } from "@/components/ui/password-input"; // Using Chakra's PasswordInput

// const styles = {
//   loginContainer: {
//     width: "100%",
//     minHeight: "85vh",
//     padding: "20px",
//     textAlign: "center",
//     backgroundImage: "url('/images/background/DejaVuBackground.png')",
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     backgroundRepeat: "no-repeat",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// };

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Attempting login with:", { email, password });

//     const response = await fetch("/api/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await response.json();
//     console.log("Login Response:", data);

//     if (response.ok) {
//       setSuccessMessage("✅ Login successful! Redirecting...");
//       setErrorMessage("");
//       setTimeout(() => {
//         window.location.href = "/dashboard"; // Redirects to dashboard
//       }, 2000);
//     } else {
//       console.log("❌ Login failed:", data.message);
//       setErrorMessage(data.message);
//       setSuccessMessage("");
//     }
//   };

//   return (
//     <Box style={styles.loginContainer}>
//       <HStack
//         spacing={8}
//         w="90%"
//         maxW="800px"
//         p={8}
//         // bg="transparent"
//         borderRadius="lg"
//         // boxShadow="md"
//       >
//         {/* Form Section */}
//         <Box w="60%" p={6}>
//           <Flex
//             direction="column"
//             align="flex-start"
//             p={6}
//             mt={4} // Adds space below navbar
//             w="100%" // Ensures it spans full width
//           >
//             <Heading
//               as="h1"
//               size="2xl"
//               color="#012649"
//               textAlign="left" // Aligns text to the left
//               fontFamily="'Poppins', sans-serif"
//               fontWeight="500"
//             >
//               LOG IN
//             </Heading>
//           </Flex>

//           {errorMessage && <Text color="red.500">{errorMessage}</Text>}
//           {successMessage && <Text color="green.500">{successMessage}</Text>}

//           <form onSubmit={handleSubmit}>
//             <VStack spacing={4}>
//               {/* Email Input - Now with White Background and Black Text */}
//               <Input
//                 type="email"
//                 name="email"
//                 placeholder="Email*"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 borderColor="gray.300"
//                 bg="white"
//                 color="black"
//                 _placeholder={{ color: "gray.600" }} // Placeholder text color
//                 autoComplete="email"
//               />

//               {/* Chakra UI Password Input with Visibility Toggle - Fixed Text Colors */}
//               <PasswordInput
//                 name="password"
//                 placeholder="Password*"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 bg="white"
//                 color="black"
//                 _placeholder={{ color: "gray.600" }}
//                 autoComplete="new-password"
//               />

//               <Link
//                 href="/forgot-password"
//                 color="blue.500"
//                 alignSelf="flex-start"
//               >
//                 Forgot Password?
//               </Link>

//               <Button type="submit" colorScheme="green" w="100%">
//                 Submit
//               </Button>
//             </VStack>
//           </form>
//         </Box>

//         {/* Image Section */}
//         <Box w="40%" display="flex" justifyContent="center" alignItems="center">
//           <Image
//             src="/images/logos/dvai-icon.png"
//             alt="Company Logo"
//             // width="150px"
//             // height="150px"
//           />
//         </Box>
//       </HStack>
//     </Box>
//   );
// }
// ----------------------------------------------------------------------------------------------------------------
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
      setSuccessMessage("✅ Login successful! Redirecting...");
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
              />

              {/* Password Input */}
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
              >
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
          alignItems="center"
        >
          <Image
            src="/images/logos/dvai-icon.png"
            alt="Company Logo"
            maxW="80%"
            mt="40"
          />
        </Box>
      </Flex>
    </Box>
  );
}
