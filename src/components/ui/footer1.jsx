// import { Box, Heading } from "@chakra-ui/react";

// export default function Footer1() {
//     return (
//         <Box as="footer" className="headerFooter1-gradient footer">
//             <Heading as="h1" size="lg">
//             </Heading>
//         </Box>
//     );
// }

const Footer1 = () => {
    return (
      <footer style={{ padding: '1rem', textAlign: 'center', backgroundColor: '#f3f3f3' }}>
        <p>© {new Date().getFullYear()} DejaVuAI. All rights reserved.</p>
      </footer>
    );
  };
  
  export default Footer1;
  