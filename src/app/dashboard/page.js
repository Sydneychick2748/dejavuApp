
"use client";
import React, { useState } from "react";
import { Flex, Box, Button } from "@chakra-ui/react";
import SearchFor from "./search-for/searchFor";
import SearchParams from "./search-params/searchParams";
import UploadFiles from "./upload-files/UploadFiles";
import Results from "../dashboard/search-results/searchResults";
import { ImageProvider } from "@/contexts/ImageContext";

import "../globals.css";
import "./dashboard.css";

export default function Dashboard() {
  const [activeBox, setActiveBox] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const startSearch = () => {
    console.log("Look, I am searching!");
    setShowResults(true);
  };

  const handleReturn = () => {
    setShowResults(false);
  };

  return (
    <ImageProvider>
      {showResults ? (
        <Results onReturn={handleReturn} />
      ) : (
        <>
          <Flex justify="flex-end" p={1} gap={2} w="100vw">
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
            />
          </Flex>
          <Box
            display="flex"
            h="100vh"
            maxW="100vw"
            p={1}
            bg="f1f1f1"
            direction={{ base: "column", md: "column", lg: "row" }}
            gap={4}
          >
            {/* Left Section: UploadFiles */}
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
                p="14px 20px"
                height="52px"
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
            <Flex direction="column" flex="0 0 59%" gap={4}>
              {/* Top Right (Search for Image) */}
              <Box
                className="searchForBox"
                flex={{ base: "0 0 100%", lg: "0 0 31%" }}
                w="100%"
                maxW="100%"
                bg={activeBox === "searchFor" ? "#E7EAEE" : "#F1F1F1"}
                borderRadius="lg"
                shadow="md"
                transition="background 0.3s ease"
                onMouseEnter={() => setActiveBox("searchFor")}
                onMouseLeave={() => setActiveBox(null)}
              >
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
              <Box
                className="searchParamsBox"
                flex="1"
                bg={activeBox === "searchParams" ? "#E7EAEE" : "#F1F1F1"}
                borderRadius="lg"
                shadow="md"
                transition="background 0.3s ease"
                onMouseEnter={() => setActiveBox("searchParams")}
                onMouseLeave={() => setActiveBox(null)}
              >
                <Box
                  width="100%"
                  bg={activeBox === "searchParams" ? "#0B2856" : "#D6D6D6"}
                  p="14px 20px"
                  height="52px"
                  fontSize="16px"
                  fontWeight="600"
                  color="white"
                  borderTopRightRadius="10px"
                  borderTopLeftRadius="10px"
                  transition="background 0.3s ease"
                >
                  Search Parameters
                </Box>
                <Box p={4}>
                  <SearchParams />
                </Box>
              </Box>
              {/* Search Button */}
              <div className="search">
                <Button variant="solid" size="xl" onClick={startSearch}>
                  Search
                </Button>
              </div>
            </Flex>
          </Box>
        </>
      )}
    </ImageProvider>
  );
}
