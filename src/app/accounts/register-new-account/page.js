// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Box,
//   Heading,
//   Text,
//   VStack,
//   Button,
//   HStack,
//   Image,
//   Input,
//   Stack,
// } from "@chakra-ui/react";
// import { PasswordInput } from "@/components/ui/password-input";

// const styles = {
//   accountContainer: {
//     width: "100%",
//     minHeight: "85vh",
//     padding: "10px",
//     ml: "-20px",
//     backgroundImage: "url('/images/background/DejaVuBackground.png')",
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     backgroundRepeat: "no-repeat",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     // paddingTop: "10px", // Reduce padding to move up
//   },
// };

// export default function CreateAccount() {
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     confirmEmail: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [errors, setErrors] = useState({
//     emailMatch: "",
//     passwordMatch: "",
//     phoneFormat: "",
//     passwordStrength: "",
//   });

//   const [message, setMessage] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     // Live validation for emails and passwords
//     if (name === "confirmEmail") {
//       setErrors((prev) => ({
//         ...prev,
//         emailMatch: value !== formData.email ? "❌ Emails do not match!" : "",
//       }));
//     }

//     if (name === "confirmPassword") {
//       setErrors((prev) => ({
//         ...prev,
//         passwordMatch:
//           value !== formData.password ? "❌ Passwords do not match!" : "",
//       }));
//     }

//     if (name === "phone") {
//       const phoneRegex = /^(\(\d{3}\)\d{3}-\d{4}|\d{3}-\d{3}-\d{4})$/;
//       setErrors((prev) => ({
//         ...prev,
//         phoneFormat: phoneRegex.test(value)
//           ? ""
//           : "❌ Invalid phone format! Use (XXX)XXX-XXXX or XXX-XXX-XXXX",
//       }));
//     }

//     if (name === "password") {
//       const passwordRegex =
//         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//       setErrors((prev) => ({
//         ...prev,
//         passwordStrength: passwordRegex.test(value)
//           ? ""
//           : "❌ Password must be at least 8 characters long and include uppercase, lowercase, a number, and a symbol.",
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     // Final validation before sending
//     if (formData.email !== formData.confirmEmail) {
//       setErrors((prev) => ({ ...prev, emailMatch: "❌ Emails do not match!" }));
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       setErrors((prev) => ({
//         ...prev,
//         passwordMatch: "❌ Passwords do not match!",
//       }));
//       return;
//     }

//     if (errors.phoneFormat || errors.passwordStrength) {
//       return; // Prevent submission if there are validation errors
//     }

//     console.log("Submitting data:", formData); // Debugging

//     try {
//       const response = await fetch("/api/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         console.error("Signup Error:", data.message);
//         setMessage("❌ " + (data.message || "Something went wrong"));
//       } else {
//         console.log("Signup Success:", data);
//         setMessage("✅ Account created successfully! Redirecting to login...");

//         // Redirect to login page after 2 seconds
//         setTimeout(() => {
//           router.push("/accounts/login");
//         }, 2000);
//       }
//     } catch (error) {
//       console.error("Network error:", error);
//       setMessage("❌ Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <Box style={styles.accountContainer}>
//       <Stack
//         spacing={{ base: 4, md: 8 }}
//         w="90%"
//         maxW="800px"
//         align="center"
//         justifyContent="center"
//         //  wrap="nowrap" // Prevents unintended wrapping on larger screens
//         direction={{ base: "column", md: "row" }} // Stacks on mobile, row on desktop
//       >
//         {/* Form Section */}
//         <Box
//           w={{ base: "100%", md: "60%" }} // Full width on mobile, 60% on larger screens
//           // p={0}
//           textAlign="left"
//         >
//           <Heading
//             as="h1"
//             size="2xl"
//             color="black"
//             fontWeight="500"
//             textAlign="left"
//             // mb={0}
//           >
//             CREATE AN ACCOUNT
//           </Heading>

//           <Text
//             color="red.500"
//             fontSize="md"
//             fontWeight="600"
//             textAlign="left"
//             mb={2}
//           >
//             PLEASE FILL OUT ALL FIELDS*
//           </Text>

//           {message && (
//             <Text color={message.startsWith("❌") ? "red.500" : "green.500"}>
//               {message}
//             </Text>
//           )}

//           <form onSubmit={handleSubmit}>
//             <VStack spacing={4} w="100%">
//               <Input
//                 name="firstName"
//                 placeholder="First Name*"
//                 onChange={handleChange}
//                 required
//                 bg="white"
//                 color="black"
//                 mb={4} // Adds extra spacing below
//                 p={4} // Increased padding for better appearance
//                 borderRadius="full" // Fully rounded borders
//                 border="1px solid #0F60F9" // Subtle border
//               />
//               <Input
//                 name="lastName"
//                 placeholder="Last Name*"
//                 onChange={handleChange}
//                 required
//                 bg="white"
//                 color="black"
//                 borderRadius="full" // Fully rounded borders
//                 mb={4} // Adds extra spacing below
//                 p={4} // Increased padding for better appearance
//                 border="1px solid #0F60F9" // Subtle border
//               />
//               <Input
//                 name="email"
//                 type="email"
//                 placeholder="Email*"
//                 onChange={handleChange}
//                 required
//                 bg="white"
//                 color="black"
//                 borderRadius="full" // Fully rounded borders
//                 mb={4} // Adds extra spacing below
//                 p={4} // Increased padding for better appearance
//                 border="1px solid #0F60F9" // Subtle border
//               />
//               <Input
//                 name="confirmEmail"
//                 type="email"
//                 placeholder="Confirm Email*"
//                 onChange={handleChange}
//                 required
//                 bg="white"
//                 color="black"
//                 borderRadius="full" // Fully rounded borders
//                 mb={4} // Adds extra spacing below
//                 p={4} // Increased padding for better appearance
//                 border="1px solid #0F60F9" // Subtle border
//               />
//               {errors.emailMatch && (
//                 <Text color="red.500">{errors.emailMatch}</Text>
//               )}

//               <Input
//                 name="phone"
//                 type="tel"
//                 placeholder="Phone* (XXX)XXX-XXXX or XXX-XXX-XXXX"
//                 onChange={handleChange}
//                 required
//                 bg="white"
//                 color="black"
//                 borderRadius="full" // Fully rounded borders
//                 mb={4} // Adds extra spacing below
//                 p={4} // Increased padding for better appearance
//                 border="1px solid #0F60F9" // Subtle border
//                 autoComplete="tel"
//               />
//               {errors.phoneFormat && (
//                 <Text color="red.500">{errors.phoneFormat}</Text>
//               )}

//               <PasswordInput
//                 name="password"
//                 placeholder="Password*"
//                 onChange={handleChange}
//                 required
//                 bg="white"
//                 color="black"
//                 borderRadius="full" // Fully rounded borders
//                 mb={4} // Adds extra spacing below
//                 p={4} // Increased padding for better appearance
//                 border="1px solid #0F60F9" // Subtle border
//                 autoComplete="new-password"
//               />
//               {errors.passwordStrength && (
//                 <Text color="red.500">{errors.passwordStrength}</Text>
//               )}
//               <PasswordInput
//                 name="confirmPassword"
//                 placeholder="Confirm Password*"
//                 onChange={handleChange}
//                 required
//                 bg="white"
//                 color="black"
//                 borderRadius="full" // Fully rounded borders
//                 mb={4} // Adds extra spacing below
//                 p={4} // Increased padding for better appearance
//                 border="1px solid #0F60F9" // Subtle border
//                 autoComplete="new-password"
//               />
//               {errors.passwordMatch && (
//                 <Text color="red.500">{errors.passwordMatch}</Text>
//               )}

//               <Button
//                 type="submit"
//                 bg="#4D89FF"
//                 color="white"
//                 w="50%"
//                 fontWeight="600"
//                 borderRadius="full"
//                 alignSelf="center"
//                 // mt={{ base: 6, md: 14 }} // Adds space between button & fields
//                 mb={{ base: 6, md: 0 }} // Adds space below the button on mobile
//                 _hover={{ bg: "#3B6CD9" }}
//               >
//                 <Image
//                   src="/images/logos/photon-icon.png"
//                   boxSize="20px"
//                   mr={2}
//                 />
//                 SUBMIT
//               </Button>
//             </VStack>
//           </form>
//         </Box>

//         {/* Image Section */}
//         <Box
//           w={{ base: "100%", md: "40%" }}
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           order={{ base: 2, md: 1 }} // Keeps logo below button on mobile
//           // mt={{ base: 1, md: 0 }} // Slight margin to avoid too much separation
//         >
//           <Image
//             src="/images/logos/dvai-icon.png"
//             alt="Company Logo"
//             maxW={{ base: "100px", md: "200px" }}
//             objectFit="contain"
//           />
//         </Box>
//       </Stack>
//     </Box>
//   );
// }
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./registerNewAccount.css"; // optional for styling

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form validation and submission logic here
    console.log("Form submitted:", formData);
    router.push("/"); // Redirect after success
  };

  return (
    <div className="register-container">
      <form className="register-box" onSubmit={handleSubmit}>
        <h2>Register New Account</h2>

        <div className="name-row">
          <input
            type="text"
            name="firstName"
            placeholder="First name*"
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last name*"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email address*"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="email"
          name="confirmEmail"
          placeholder="Confirm email*"
          value={formData.confirmEmail}
          onChange={handleChange}
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone number*"
          value={formData.phone}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password*"
          value={formData.password}
          onChange={handleChange}
        />
        <small className="password-hint">
          Password must be at least 8 characters and contain at least one number and one special character.
        </small>

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password*"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <p className="disclaimer">
          Photon does not store, transfer, or sell uploaded media files or user data to third parties. Media processed
          by Photon is used to create exclusive searchable pattern data unique to DejaVuAI®-specific solutions – users
          retain any and all rights to media that is uploaded.{" "}
          <a href="#">Learn more about how your data is managed ›</a>
        </p>

        <p className="legal">
          By clicking Agree & Continue, you agree to the Photon{" "}
          <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.
        </p>

        <button type="submit" className="agree-btn">Agree & Continue</button>

        <p className="support-link">
          Questions? <a href="#">Contact support</a>
        </p>
      </form>
    </div>
  );
}

  //   const router = useRouter();

