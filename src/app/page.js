import { Box, Button, Heading, Text, Image, VStack } from "@chakra-ui/react";
// import windowSizeCalc from "./windowsizeCalc";

// const headerHeight = document.querySelector('header').offsetHeight;
//     const footerHeight = document.querySelector('footer').offsetHeight;
//     const viewportHeight = window.innerHeight;

//     const windowSizeCalc = viewportHeight - (headerHeight + footerHeight);


const styles = {
  headingWelcome: {
    fontSize: "4.5rem",
    color: "#00264A",
    fontFamily: "'Poppins', sans-serif",
    fontWeight: "100",
    textAlign: "left", // Align text to the right
    marginBottom: "20px",
    marginRight: "auto", // Pushes it to the right if inside a flex/grid container
  },
  imageStyle: {
    width: "100%", // Adjust width
    height: "100vh", // Maintain aspect ratio
    position: "relative", // Allows free movement
    top: "50px", // Move down from the top
    left: "100px", // Move right from the left
  },
  textStyle: {
    fontSize: "30px",
    color: "#00264A",
    fontWeight: "500", // Optional: Adjust thickness
    position: "relative", // Allows precise movement
    top: "-30px", // Move up/down (lower value moves it up)
    left: "300px", // Move left/right (higher value moves it right)
  },
};



export default function Home() {
  return (
    <Box
      w="100%"
      h="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="gray.50"
      bgImage="url('/images/background/DejaVuBackground.png')"
    >
      <VStack spacing={6} textAlign="center">
        {/* Titles */}
        <Heading as="h1" style={styles.headingWelcome}>
          Welcome to
        </Heading>

        {/* Welcome logo section Image Section */}
        <Box>
          <Image
            src="/images/logos/DejavuaiLogoTransparent.png"
            alt="Company Logo"
            styles={styles.imageStyle} 
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

        <VStack spacing={4}>
          
          <Button>Log In</Button>
          <Button size="lg">Sign Up</Button>
          <Button className="btn-home">Let's Get Started</Button>

        </VStack>
      </VStack>
    </Box>
  );
}
