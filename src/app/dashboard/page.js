// "use client";

// import React, { useState } from "react";
// import { Flex, Box } from "@chakra-ui/react";
// import SearchFor from "./search-for/searchFor";
// import SearchParams from "./search-params/searchParams";
// import UploadFiles from "./upload-files/UploadFiles";
// import { ImageProvider } from "@/contexts/ImageContext";
// import "./dashboard.css";
// import "../globals.css";

// export default function Dashboard() {
//   const [activeBox, setActiveBox] = useState(null);

//   return (
//     <ImageProvider>
//       <Flex
//         h="100vh"
//         w="full"
//         p={4}
//         bg="gray.100"
//         direction={{ base: "column", md: "column", lg: "row" }}
//         gap={4}
//       >
//         {/* Left Section (Upload Files) */}
//         <Box
//           className="uploadFilesBox"
//           flex="0 0 40%"
//           bg={activeBox === "upload" ? "#e7eaee" : "#f1f1f1"}
//           borderRadius="lg"
//           shadow="md"
//           transition="background 0.3s ease"
//           onMouseEnter={() => setActiveBox("upload")}
//           onMouseLeave={() => setActiveBox(null)}
//         >
//           <Box
//             className="uploadSearchWithin"
//             width="100%"
//             bg={activeBox === "upload" ? "#0b2856" : "#d6d6d6"}
//             p="10px 20px"
//             fontSize="16px"
//             fontWeight="600"
//             color="white"
//             borderTopRightRadius="10px"
//             borderTopLeftRadius="10px"
//             transition="background 0.3s ease"
//           >
//             Search Within...
//           </Box>
//           <UploadFiles />
//         </Box>

//         {/* Right Section (Search & Parameters) */}
//         <Flex direction="column" flex="0 0 60%" gap={4}>
//           {/* Top Right (Search for Image) */}
//           <Box
//             className="searchForBox"
//             flex="0 0 40%"
//             bg={activeBox === "searchFor" ? "#e7eaee" : "#f1f1f1"}
//             borderRadius="lg"
//             shadow="md"
//             transition="background 0.3s ease"
//             onMouseEnter={() => setActiveBox("searchFor")}
//             onMouseLeave={() => setActiveBox(null)}
//           >
//             {/* Header with Buttons */}
//             <Flex
//               align="center"
//               justify="space-between"
//               bg={activeBox === "searchFor" ? "#0b2856" : "#d6d6d6"}
//               p="10px 20px"
//               fontSize="16px"
//               fontWeight="600"
//               color="white"
//               borderTopRightRadius="10px"
//               borderTopLeftRadius="10px"
//               transition="background 0.3s ease"
//             >
//               <Box>Search For...</Box>
//               <Flex gap={2}>
//                 <Box
//                   as="button"
//                   bg="white"
//                   fontWeight={300}
//                   color={activeBox === "searchFor" ? "#0B2856" : "#808080"} // Dark blue when active, grey otherwise
//                   border="1px solid white"
//                   borderRadius="8px"
//                   p="4px 8px"
//                   _hover={{
//                     bg: "white",
//                     color: "#FF4444", // Red on hover
//                   }}
//                   onClick={() => console.log("Remove All clicked")}
//                 >
//                   Remove All
//                 </Box>
//                 <Box
//                   as="button"
//                   bg="white"
//                   fontWeight={300}
//                   color={activeBox === "searchFor" ? "#0B2856" : "#808080"} // Dark blue when active, grey otherwise
//                   border="1px solid white"
//                   borderRadius="8px"
//                   p="4px 8px"
//                   _hover={{
//                     bg: "white",
//                     color: activeBox === "searchFor" ? "#4a88ff" : "#0B2856", // Lighter blue on hover when active, dark blue otherwise
//                   }}
//                   onClick={() => console.log("Object Library clicked")}
//                 >
//                   Object Library
//                 </Box>
//               </Flex>
//             </Flex>
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
      <Flex justify="flex-end" p={2} gap={2}>
      <button
        onClick={() => console.log("Info clicked")}
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          border: "none",
          backgroundColor: "#d6d6d6",
          backgroundImage: `url('/images/logos/DB Info.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          cursor: "pointer",
        }}
      ></button>
      </Flex>
      <Flex
        h="100vh"
        w="full"
        p={4}
        bg="gray.100"
        direction={{ base: "column", md: "column", lg: "row" }}
        gap={4}
      >
        {/* Left Section (Upload Files) */}
        <Box
          className="uploadFilesBox"
          flex="0 0 40%"
          bg={activeBox === "upload" ? "#e7eaee" : "#f1f1f1"}
          borderRadius="lg"
          shadow="md"
          transition="background 0.3s ease"
          onMouseEnter={() => setActiveBox("upload")}
          onMouseLeave={() => setActiveBox(null)}
        >
          <Box
            className="uploadSearchWithin"
            width="100%"
            bg={activeBox === "upload" ? "#0b2856" : "#d6d6d6"}
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
          <Box
            className="searchForBox"
            flex="0 0 40%"
            bg={activeBox === "searchFor" ? "#e7eaee" : "#f1f1f1"}
            borderRadius="lg"
            shadow="md"
            transition="background 0.3s ease"
            onMouseEnter={() => setActiveBox("searchFor")}
            onMouseLeave={() => setActiveBox(null)}
            // width={"98%"}
          >
            {/* Header with Buttons */}
            <Flex
              align="center"
              justify="space-between"
              bg={activeBox === "searchFor" ? "#0b2856" : "#d6d6d6"}
              p="10px 20px"
              fontSize="16px"
              fontWeight="600"
              color="white"
              borderTopRightRadius="10px"
              borderTopLeftRadius="10px"
              transition="background 0.3s ease"
            >
              <Box>Search For...</Box>
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
                    color: activeBox === "searchFor" ? "#4a88ff" : "#0B2856",
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
      </Flex>
    </ImageProvider>
  );
}
