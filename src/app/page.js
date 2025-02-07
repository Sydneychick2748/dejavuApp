import { Box, Button, Heading, Text, Image, VStack, HStack } from "@chakra-ui/react";

const styles = {
  backgroundBox: {
    width: "100%",
    minHeight: "100vh", // Ensures it takes at least the full height of the viewport
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column", // Stack items vertically
    backgroundImage: "url('/images/background/DejaVuBackground.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    padding: "20px", // Optional padding to prevent content from touching the edges
  },
  welcomeImage: {
    width: "75%", // Adjust width
    height: "50vh", // Maintain aspect ratio
    position: "relative", // Allows free movement
    top: "50px", // Move down from the top
    left: "175px", // Move right from the left
    objectFit: "contain", // Ensures the image scales properly
  },
  headingWelcome: {
    fontSize: "3.5rem",
    color: "#00264A",
    fontFamily: "'Poppins', sans-serif",
    fontWeight: "100",
    textAlign: "left", // Align text to the right
    marginBottom: "-140px",
    marginRight: "900px", // Pushes it to the right if inside a flex/grid container
  },
  textStyle: {
    fontSize: "30px",
    color: "#00264A",
    fontWeight: "500", // Optional: Adjust thickness
    position: "relative", // Allows precise movement
    top: "-120px", // Move up/down (lower value moves it up)
    left: "375px", // Move left/right (higher value moves it right)
  },
};



export default function Home() {
  return (
    <Box style={styles.backgroundBox}>
      <VStack spacing={6} textAlign="center">
        {/* Titles */}
        <Heading as="h1" style={styles.headingWelcome}>
          Welcome to
        </Heading>

        {/* Welcome logo section Image Section */}
        <Box >
          <Image
            src="/images/logos/DVAI-Logo-Horizontal-Dark.png"
            alt="Welcome page Logo"
            style={styles.welcomeImage} 
          />
        </Box>

        {/* <Heading as="h1" style ={styles.headingDejavu}>
          DejaVuAI
        </Heading> */}

        <Text style={styles.textStyle} >
          Trace The Untraceable
        </Text>

        {/* Image Section
        <Box w="40%" display="flex" justifyContent="center" alignItems="center">
          <Image
            src="/images/logos/dvai-icon.png"
            alt="Company Logo"
            // width="0"
            // height="150px"
          />
        </Box> */}

        {/* Buttons */}
        {/* HStack arranges items horizontally  */}rum DejaVuAI
        <HStack spacing={4}>
          <Button>Log In</Button>
          <Button size="lg">Sign Up</Button>
          <Button className="btn-home">Let's Get Started</Button>
       </HStack>
      </VStack>
    </Box>
  );
}
