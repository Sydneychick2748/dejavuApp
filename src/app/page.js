// import { Box, Button, Heading, Text, Image, VStack, HStack, Spacer } from "@chakra-ui/react";

// const styles = {
//   backgroundBox: {
//     width: "100%",
//     minHeight: "100vh", // Ensures it takes at least the full height of the viewport
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     flexDirection: "column", // Stack items vertically
//     backgroundImage: "url('/images/background/DejaVuBackground.png')",
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     backgroundRepeat: "no-repeat",
//     padding: "20px", // Optional padding to prevent content from touching the edges
//   },
//   welcomeImage: {
//     width: "75%", // Adjust width
//     height: "50vh", // Maintain aspect ratio
//     position: "relative", // Allows free movement
//     top: "50px", // Move down from the top
//     left: "175px", // Move right from the left
//     objectFit: "contain", // Ensures the image scales properly
//   },
//   headingWelcome: {
//     fontSize: "3.5rem",
//     color: "#00264A",
//     fontFamily: "'Poppins', sans-serif",
//     fontWeight: "100",
//     textAlign: "left", // Align text to the right
//     marginBottom: "-140px",
//     marginRight: "900px", // Pushes it to the right if inside a flex/grid container
//   },
//   textStyle: {
//     fontSize: "30px",
//     color: "#00264A",
//     fontWeight: "500", // Optional: Adjust thickness
//     position: "relative", // Allows precise movement
//     top: "-120px", // Move up/down (lower value moves it up)
//     left: "375px", // Move left/right (higher value moves it right)
//   },
// };



// export default function Home() {
//   return (
//     <Box style={styles.backgroundBox}>
//       <VStack spacing={6} textAlign="center">
//         {/* Titles */}
//         <Heading as="h1" style={styles.headingWelcome}>
//           Welcome to
//         </Heading>
//         {/* Welcome logo section Image Section */}
//         <Box>
//           <Image
//             src="/images/logos/DVAI-Logo-Horizontal-Dark.png"
//             alt="Welcome page Logo"
//             style={styles.welcomeImage}
//           />
//         </Box>
//         {/* <Heading as="h1" style ={styles.headingDejavu}>
//           DejaVuAI
//         </Heading> */}
//         <Text style={styles.textStyle}>Trace The Untraceable</Text>
//         {/* Image Section
//         <Box w="40%" display="flex" justifyContent="center" alignItems="center">
//           <Image
//             src="/images/logos/dvai-icon.png"
//             alt="Company Logo"
//             // width="0"
//             // height="150px"
//           />
//         </Box> */}
//         {/* Buttons */}
//         {/* HStack arranges items horizontally  */}rum DejaVuAI
//         <HStack spacing={4} width="100%" maxW="1200px" mx="auto" px={6}>
//           <Button className="btn-logIn">
//           <Image src="/images/logos/photon-icon.png" boxSize="20px" mr={2} />  
//             LOG IN
//           </Button>
          
//           <Button className="btn-signUp" size="lg">
//           <Image src="/images/logos/photon-icon.png" boxSize="20px" mr={2} />
//             SIGN UP
//           </Button>

//           <Spacer /> {/* This pushes the last button to the right */}

//           <Button className="btn-letsGetStarted">
//           <Image src="/images/logos/photon-icon.png" boxSize="20px" mr={2} />
//             LET'S GET STARTED
//           </Button>
//         </HStack>
//       </VStack>
//     </Box>
//   );
// }

// ------------------------------------------------------------------------------------------------------------------

import { Box, Button, Heading, Text, Image, VStack, HStack, Spacer } from "@chakra-ui/react";

const styles = {
  backgroundBox: {
    width: "100%",
    minHeight: "100vh",
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
  // welcomeImage: {
  //   width: ["65%", "55%", "0%"], // Responsive width: 90% on small screens, 75% on medium, 50% on large
  //   height: "auto", // Maintain aspect ratio
  //   objectFit: "contain",
  //   marginTop: [4, 8, 10], // Adjust margin dynamically
  // },
  // headingWelcome: {
  //   fontSize: ["2xl", "3xl", "4xl"], // Responsive font size
  //   color: "#00264A",
  //   fontFamily: "'Poppins', sans-serif",
  //   fontWeight: "100",
  //   textAlign: "center", // Center text on smaller screens
  //   marginBottom: "20px",
  // },
  // welcomeSlogan: {
  //   fontSize: ["lg", "xl", "2xl"], // Adjust text size based on screen size
  //   color: "#00264A",
  //   fontWeight: "500",
  //   textAlign: "right",
  // },
};

export default function Home() {
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
          fontSize={["xl", "2xl", "3xl"]}
          color="#00264A"
          fontWeight="400"
          textAlign="right"
          alignSelf="flex-end"
          width="100%" // Ensures it takes full width
          pr={["20px", "40px", "50px"]} // Adjust right padding for positioning
          pb="40px"
          mt="-30px"
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
          justify="space-between" // Spreads buttons apart
        >
          <Button
            className="btn-logIn"
            size={["sm", "md", "lg"]}
            ml={["30px", "50px", "80px"]}
            bg="#4D89FF"
            color="white"
            borderRadius="20px"
            _hover={{ bg: "#3B6CD9" }}         
          >
            <Image src="/images/logos/photon-icon.png" boxSize="20px" mr={2} />
            LOG IN
          </Button>
          <Button
            className="btn-signUp"
            size={["sm", "md", "lg"]}
            ml={["20px", "40px", "60px"]}
            bg="#4D89FF"
            color="white"
            borderRadius="20px"
            _hover={{ bg: "#3B6CD9" }}
          >
            <Image src="/images/logos/photon-icon.png" boxSize="20px" mr={2} />
            SIGN UP
          </Button>
          
          <Spacer display={["none", "block"]} /> {/* Keeps spacing */}

          {/* Adjust width and move LET'S GET STARTED button */}
          
          <Button
            className="btn-letsGetStarted"
            size={["sm", "md", "lg"]}
            ml={["50px", "80px", "100px"]}
            bg="#4D89FF"
            color="white"
            borderRadius="20px"
            _hover={{ bg: "#3B6CD9" }}
          >
            <Image src="/images/logos/photon-icon.png" boxSize="20px" mr={2} />
            LET'S GET STARTED
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
