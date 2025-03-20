
// "use client";

// import { Flex, Box } from "@chakra-ui/react";
// import SearchFor from "./search-for/searchFor";
// import SearchParams from "./search-params/searchParams";
// import UploadFiles from "./upload-files/UploadFiles";
// import { ImageProvider } from "@/contexts/ImageContext";
// import "./dashboard.css";
// import "../globals.css";

// export default function Dashboard() {
//   return (
//     <ImageProvider>
//       <Flex
//         h="100vh"
//         w="full"
//         p={4}
//         bg="gray.100"
//         direction={{ base: "column", md: "column", lg: "row" }} // Stack on mobile & tablet, row on desktop
//         gap={4}
//       >
//         {/* Left Section (Upload Files) */}
//         <Box 
//           flex="0 0 40%"
//           bg="white"
//           p={4}
//           borderRadius="lg"
//           shadow="md"
//           // w={{ base: "100%", lg: "30%" }} // Full width on mobile/tablet, 50% on desktop
//         >
          
//           <UploadFiles />
//         </Box>

//         {/* Right Section (Search & Parameters) */}
//         <Flex
//           direction="column"
//           flex="0 0 60%"
//           gap={4}
//           // w={{ base: "100%", lg: "70%" }} // Full width on mobile/tablet, 50% on desktop
//         >
//           {/* Top Right (Search for Image) */}
//           <Box bg="white" p={4} borderRadius="lg" shadow="md">
//             <SearchFor />
//           </Box>

//           {/* Bottom Right (Search Parameters) */}
//           <Box bg="white" p={4} borderRadius="lg" shadow="md">
//             <SearchParams />
//           </Box>
//         </Flex>
//       </Flex>
//     </ImageProvider>
//   );
// }


"use client";
import React, { useState } from "react";
import { Flex, Box } from "@chakra-ui/react";
import SearchFor from "./search-for/searchFor";
import SearchParams from "./search-params/searchParams";
import UploadFiles from "./upload-files/UploadFiles";
import { ImageProvider } from "@/contexts/ImageContext";
import "./dashboard.css";
import "../globals.css";
export default function Dashboard() {
  const [activeBox, setActiveBox] = useState(null);
  return (
    <ImageProvider>
      <Flex justify="flex-end" p={2} gap={2} w="100vw">
        <button
          onClick={() => console.log("Info clicked")}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#D6D6D6",
            backgroundImage: `url('/images/logos/DB Info.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            cursor: "pointer",
          }}
        ></button>
      </Flex>
      <Box
      display={"flex"}
        h="100vh"
        // w="full"
        maxW="100vw"
        p={4}
        bg="f1f1f1"
        direction={{ base: "column", md: "column", lg: "row" }}
        gap={4}
      >
        {/* Left Section (Upload Files) */}
        <Box
          className="uploadFilesBox"
          flex="0 0 40%"
          bg={activeBox === "upload" ? "#E7EAEE" : "#F1F1F1"}
          borderRadius="lg"
          shadow="md"
          transition="background 0.3s ease"
          onMouseEnter={() => setActiveBox("upload")}
          onMouseLeave={() => setActiveBox(null)}
        >
          <Box
            className="uploadSearchWithin"
            width="100%"
            bg={activeBox === "upload" ? "#0B2856" : "#D6D6D6"}
            p="10px 20px"
            fontSize="16px"
            fontWeight="600"
            color="white"
            borderTopRightRadius="10px"
            borderTopLeftRadius="10px"
            transition="background 0.3s ease"
          >
            Search Within...
          </Box>
          <UploadFiles />
        </Box>
        {/* Right Section (Search & Parameters) */}
        <Flex direction="column" flex="0 0 60%" gap={4}>
          {/* Top Right (Search for Image) */}
          {/* <Box
            className="searchForBox"
            flex="0 0 40%"
            bg={activeBox === "searchFor" ? "#E7EAEE" : "#F1F1F1"}
            borderRadius="lg"
            shadow="md"
            transition="background 0.3s ease"
            onMouseEnter={() => setActiveBox("searchFor")}
            onMouseLeave={() => setActiveBox(null)}
            // width={"98%"}
          > */}
          <Box
            className="searchForBox"
            flex={{ base: "0 0 100%", lg: "0 0 40%" }} // Height in column layout
            w="100%" // Full width of its parent
            maxW="100%" // Prevent exceeding parent
            overflowX="auto" // Allow horizontal scrolling if content overflows
            bg={activeBox === "searchFor" ? "#E7EAEE" : "#F1F1F1"}
            borderRadius="lg"
            shadow="md"
            transition="background 0.3s ease"
            onMouseEnter={() => setActiveBox("searchFor")}
            onMouseLeave={() => setActiveBox(null)}
          >
            {/* Header with Buttons */}
            <Flex
              align="center"
              justify="space-between"
              bg={activeBox === "searchFor" ? "#0B2856" : "#D6D6D6"}
              p="10px 20px"
              fontSize="16px"
              fontWeight="600"
              color="white"
              borderTopRightRadius="10px"
              borderTopLeftRadius="10px"
              transition="background 0.3s ease"
            >
              <Box></Box>
              <Flex gap={2}>
                <Box
                  as="button"
                  bg="white"
                  fontWeight={300}
                  color={activeBox === "searchFor" ? "#0B2856" : "#808080"}
                  border="1px solid white"
                  borderRadius="8px"
                  p="4px 8px"
                  _hover={{
                    bg: "white",
                    color: "#FF4444",
                  }}
                  onClick={() => console.log("Remove All clicked")}
                >
                  Remove All
                </Box>
                <Box
                  as="button"
                  bg="white"
                  fontWeight={300}
                  color={activeBox === "searchFor" ? "#0B2856" : "#808080"}
                  border="1px solid white"
                  borderRadius="8px"
                  p="4px 8px"
                  _hover={{
                    bg: "white",
                    color: activeBox === "searchFor" ? "#4A88FF" : "#0B2856",
                  }}
                  onClick={() => console.log("Object Library clicked")}
                >
                  Object Library
                </Box>
              </Flex>
            </Flex>
            <SearchFor />
          </Box>
          {/* Bottom Right (Search Parameters) */}
          <Box bg="white" p={4} borderRadius="lg" shadow="md">
            <SearchParams />
          </Box>
        </Flex>
      </Box>
    </ImageProvider>
  );
}
