"use client";
import React, { useState } from "react";
import { Box, Text, Image } from "@chakra-ui/react";
import {
  FaChevronDown,
  FaSearch,
  FaChevronUp,
  FaTh,
  FaBars,
} from "react-icons/fa";
import "./searchResults.css";

const SearchResults = ({ onReturn }) => {
  const [isSearchImagesExpanded, setSearchImagesExpanded] = useState(false);
  const [isMatchesExpanded, setMatchesExpanded] = useState(false);

  const toggleSearchImages = () => setSearchImagesExpanded((prev) => !prev);
  const toggleMatches = () => setMatchesExpanded((prev) => !prev);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const toggleFilter = () => setIsFilterOpen((prev) => !prev);

  const [isGridView, setIsGridView] = useState(false);
  const toggleView = () => setIsGridView((prev) => !prev);

  return (
    <Box className="searchResultsContainer">
      <Box className="searchResultsLeft">
        <Box className="searchResultsContentleft">
          <Box className="headerContent">
            <Box className="leftSection">
              <Image
                src="/images/logos/LeftCaret.png"
                alt="Left arrow"
                className="headerImage"
              />
              <Text className="headerTitle">Search Results</Text>
            </Box>
            <Text className="headerCenter">[No parameters set]</Text>
            <Box className="rightSection">
              <button className="headerButton bookmarkButton buttonIcon"></button>
              <button className="headerButton uploadButton buttonIcon"></button>
            </Box>
          </Box>

          <Box className="leftContentContainer">
            {
              <Box className="searchImageToggleContainer">
                <Box
                  className={`toggleHeader ${
                    isSearchImagesExpanded ? "expanded" : ""
                  }`}
                  onClick={toggleSearchImages}
                >
                  <Text className="toggleLabel">
                    All Search Images <span className="toggleDivider">|</span>
                  </Text>
                  <Box className="caretIcon">
                    {isSearchImagesExpanded ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </Box>
                </Box>
                {isSearchImagesExpanded && (
                  <Box className="toggleContent">
                    {/* You can populate this with dynamic content later */}
                  </Box>
                )}
              </Box> /* <Text className="contentText">Left Div Content</Text> */
            }

            {
              <Box className="allMatchesToggleContainer">
                <Box
                  className={`toggleHeader ${
                    isMatchesExpanded ? "expanded" : ""
                  }`}
                  onClick={toggleMatches}
                >
                  <Text className="toggleLabel">
                    All Matches <span className="toggleDivider">|</span>
                  </Text>
                  <Box className="caretIcon">
                    {isMatchesExpanded ? <FaChevronUp /> : <FaChevronDown />}
                  </Box>
                </Box>
                {isMatchesExpanded && (
                  <Box className="toggleContent">
                    {/* You can populate this with dynamic content later */}
                  </Box>
                )}
              </Box> /* <Text className="contentText">Left Div Content</Text> */
            }

            {/* Scrollable section under All Matches */}
            <Box className="matchesListContainer">
              <Box className="matchesHeader">
                <Text className="resultsLabel">#results</Text>
                <Box className="lookupInputContainer">
                  <FaSearch className="searchInputIcon" />
                  <input
                    type="text"
                    className="lookupInput"
                    placeholder="Look up"
                  />
                </Box>

                <button className="sortButton">
                  <Box className="caretGroup">
                    <FaChevronUp className="sortCaret, sortCaretUp" />
                    <FaChevronDown className="sortCaret, sortCaretDown" />
                  </Box>
                  <Text className="sortLabel">By Confidence</Text>
                </button>

                {/* Filter Button */}
                <Box className="filterDropdownWrapper">
                  <button className="filterButton" onClick={toggleFilter}>
                    <Text className="filterLabel">Filter...</Text>
                    <FaChevronDown className="filterCaret" />
                  </button>

                  {isFilterOpen && (
                    <Box className="filterDropdown">
                      <label className="filterItem">
                        <input type="checkbox" defaultChecked />
                        All Images
                      </label>
                      <label className="filterItem filterChildItem">
                        <input type="checkbox" defaultChecked />
                        PNG
                      </label>
                      <label className="filterItem filterChildItem">
                        <input type="checkbox" defaultChecked />
                        JPG/JPEG
                      </label>
                      <label className="filterItem filterChildItem">
                        <input type="checkbox" defaultChecked />
                        HEIC
                      </label>
                      <label className="filterItem">
                        <input type="checkbox" defaultChecked />
                        All Video
                      </label>
                      <label className="filterItem filterChildItem">
                        <input type="checkbox" defaultChecked />
                        MP4
                      </label>
                      <label className="filterItem filterChildItem">
                        <input type="checkbox" defaultChecked />
                        WAV
                      </label>
                      <label className="filterItem filterChildItem">
                        <input type="checkbox" defaultChecked />
                        MOV
                      </label>
                    </Box>
                  )}
                </Box>

                {/* Group Frames */}
                <label className="groupFramesToggle">
                  <input type="checkbox" className="groupCheckbox" />
                  <span className="checkboxUI" />
                  <Text className="groupLabel">Group Frames</Text>
                </label>

                {/* View Toggle */}
                <Box className="viewToggle" onClick={toggleView}>
                  {isGridView ? (
                    <FaTh className="viewIcon" />
                  ) : (
                    <FaBars className="viewIcon" />
                  )}
                </Box>
              </Box>

              <Box className="matchesScrollArea">
                {/* Sample scroll content */}
                {[...Array(40)].map((_, index) => (
                  <Box key={index} className="matchItem">
                    {/* Match #{index + 1} */}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className="searchResultsContentRight">
          <Box className="headerContent">
            <Text className="rightHeaderTitle">Image Registration</Text>
          </Box>
          <Box className="rightContentContainer">
            {/* <Text className="contentText">Right Div Content</Text> */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SearchResults;
