// import { Box, Button, Heading, Text, Image, VStack, HStack, Spacer } from "@chakra-ui/react";
// const styles = {
//   backgroundBox: {
//     width: "100%",
//     minHeight: "85vh",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     flexDirection: "column",
//     backgroundImage: "url('/images/background/DejaVuBackground.png')",
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     backgroundRepeat: "no-repeat",
//     padding: "20px",
//   },
//   // welcomeImage: {
//   //   width: ["65%", "55%", "0%"], // Responsive width: 90% on small screens, 75% on medium, 50% on large
//   //   height: "auto", // Maintain aspect ratio
//   //   objectFit: "contain",
//   //   marginTop: [4, 8, 10], // Adjust margin dynamically
//   // },
//   // headingWelcome: {
//   //   fontSize: ["2xl", "3xl", "4xl"], // Responsive font size
//   //   color: "#00264A",
//   //   fontFamily: "'Poppins', sans-serif",
//   //   fontWeight: "100",
//   //   textAlign: "center", // Center text on smaller screens
//   //   marginBottom: "20px",
//   // },
//   // welcomeSlogan: {
//   //   fontSize: ["lg", "xl", "2xl"], // Adjust text size based on screen size
//   //   color: "#00264A",
//   //   fontWeight: "500",
//   //   textAlign: "right",
//   // },
// };
// export default function Home() {
//   return (
//     <Box style={styles.backgroundBox}>
//       <VStack spacing={6} textAlign="center">
//         {/* Titles */}
//         <Heading
//           as="h1"
//           fontSize={["3xl", "4xl", "5xl"]}
//           color="#00264A"
//           fontFamily="'Poppins', sans-serif"
//           fontWeight="400"
//           textAlign="left"
//           alignSelf="flex-start"
//           width="100%"
//           pl={["10px", "20px", "35px"]}
//           mt={["-20px", "-40px", "-80px"]}
//           pb={["0px", "0px", "10px"]} // Add bottom padding
//         >
//           Welcome to
//         </Heading>
//         {/* Welcome Logo */}
//         <Image
//           src="/images/logos/DVAI-Logo-Horizontal-Dark.png"
//           alt="Welcome page Logo"
//           width={["450px", "700px", "1350px"]}
//           maxWidth="100%"
//           height="auto"
//           objectFit="contain"
//           display="block"
//           mx="auto"
//           mt="10px"
//         />
//         <Text
//           fontSize={["xl", "2xl", "3xl"]}
//           color="#00264A"
//           fontWeight="400"
//           textAlign="right"
//           alignSelf="flex-end"
//           width="100%" // Ensures it takes full width
//           pr={["20px", "40px", "50px"]} // Adjust right padding for positioning
//           pb="40px"
//           mt="-30px"
//         >
//           Trace The Untraceable
//         </Text>
//         {/* Buttons */}
//         <HStack
//           spacing={6}
//           width="100%"
//           maxW="1200px"
//           px={6}
//           flexWrap="wrap" // Allows buttons to wrap on smaller screens
//           justify="space-between" // Spreads buttons apart
//         >
//           <Button
//             className="btn-logIn"
//             size={["sm", "md", "lg"]}
//             ml={["30px", "50px", "80px"]}
//             bg="#4D89FF"
//             color="white"
//             borderRadius="20px"
//             _hover={{ bg: "#3B6CD9" }}
//           >
//             <Image src="/images/logos/photon-icon.png" boxSize="20px" mr={2} />
//             LOG IN
//           </Button>
//           <Button
//             className="btn-signUp"
//             size={["sm", "md", "lg"]}
//             ml={["20px", "40px", "60px"]}
//             bg="#4D89FF"
//             color="white"
//             borderRadius="20px"
//             _hover={{ bg: "#3B6CD9" }}
//           >
//             <Image src="/images/logos/photon-icon.png" boxSize="20px" mr={2} />
//             SIGN UP
//           </Button>
//           <Spacer display={["none", "block"]} /> {/* Keeps spacing */}
//           {/* Adjust width and move LET'S GET STARTED button */}
//           <Button
//             className="btn-letsGetStarted"
//             size={["sm", "md", "lg"]}
//             ml={["50px", "80px", "100px"]}
//             bg="#4D89FF"
//             color="white"
//             borderRadius="20px"
//             _hover={{ bg: "#3B6CD9" }}
//           >
//             <Image src="/images/logos/photon-icon.png" boxSize="20px" mr={2} />
//             LET'S GET STARTED
//           </Button>
//         </HStack>
//       </VStack>
//     </Box>
//   );
// }

"use client";

import Image from "next/image";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  Spacer,
} from "@chakra-ui/react";

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
  welcomeHeading: {
    fontSize: ["3xl", "4xl", "5xl"],
    color: "#00264A",
    fontFamily: "'Poppins', sans-serif",
    fontWeight: "400",
    textAlign: "left",
    alignSelf: "flex-start",
    width: "100%",
    paddingLeft: ["10px", "20px", "35px"],
    marginTop: ["-20px", "-40px", "-80px"],
    paddingBottom: ["0px", "0px", "10px"],
  },
  welcomeSlogan: {
    fontSize: ["xl", "2xl", "3xl"],
    color: "#00264A",
    fontWeight: "400",
    textAlign: "right",
    alignSelf: "flex-end",
    width: "100%",
    paddingRight: ["20px", "40px", "50px"],
    paddingBottom: "40px",
    marginTop: "-30px",
  },
  welcomeButton: {
    background: "#4D89FF",
    color: "white",
    borderRadius: "20px",
    _hover: { background: "#3B6CD9" },
  },
};

export default function Home() {
  return (
    <Box style={styles.backgroundBox}>
      <VStack spacing={6} textAlign="center">
        <Heading as="h1" style={styles.welcomeHeading}>
          Welcome to
        </Heading>
        <Image
          src="/images/logos/DVAI-Logo-Horizontal-Dark.png"
          alt="Welcome page Logo"
          width={1350}
          height={300}
          style={{
            maxWidth: "100%",
            height: "auto",
            objectFit: "contain",
            display: "block",
            margin: "10px auto",
          }}
        />
        <Text style={styles.welcomeSlogan}>Trace The Untraceable</Text>
        <HStack
          spacing={6}
          width="100%"
          maxW="1200px"
          px={6}
          flexWrap="wrap"
          justify="space-between"
        >
          <Button
            style={styles.welcomeButton}
            size={["sm", "md", "lg"]}
            ml={["30px", "50px", "80px"]}
          >
            <Image
              src="/images/logos/photon-icon.png"
              alt="icon"
              width={20}
              height={20}
            />{" "}
            LOG IN
          </Button>
          <Button
            style={styles.welcomeButton}
            size={["sm", "md", "lg"]}
            ml={["20px", "40px", "50px"]}
          >
            <Image
              src="/images/logos/photon-icon.png"
              alt="icon"
              width={20}
              height={20}
            />{" "}
            SIGN UP
          </Button>
          <Spacer display={["none", "block"]} />
          <Button
            style={styles.welcomeButton}
            size={["sm", "md", "lg"]}
            ml={["50px", "80px", "100px"]}
          >
            <Image
              src="/images/logos/photon-icon.png"
              alt="icon"
              width={20}
              height={20}
            />{" "}
            LET'S GET STARTED
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
