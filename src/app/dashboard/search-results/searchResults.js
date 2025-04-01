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

  const fileInputRef = React.useRef(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log("Selected files:", files);
      // You can do something with the files here
    }
  };

  return (
    <Box className="searchResultsContainer">
      <Box className="searchResultsLeft">
        <Box className="searchResultsContentleft">
          <Box className="headerContent">
            <Box className="leftSection">
              <button className="leftCaretButton" onClick={onReturn}>
                <Image
                  src="/images/logos/LeftCaret.png"
                  alt="Left arrow"
                  className="headerImage"
                />
              </button>
              <Text className="headerTitle">Search Results</Text>
            </Box>
            <Text className="headerCenter">[No parameters set]</Text>
            <Box className="rightSection">
              <button className="headerButton bookmarkButton buttonIcon"></button>
              <button
                className="headerButton uploadButton buttonIcon"
                onClick={handleUploadClick}
              ></button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                multiple
                accept="image/*,video/*" // adjust as needed
              />
            </Box>
          </Box>

          <Box className="leftContentContainer">
            {
              <Box
                className={`searchImageToggleContainer ${
                  isSearchImagesExpanded ? "expanded" : ""
                }`}
              >
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
                    {/* Expanded content goes here */}
                  </Box>
                )}
              </Box>
            }

            {isSearchImagesExpanded && <Box className="searchImageSpacer" />}

            {
              <Box
                className={`allMatchesToggleContainer ${
                  isMatchesExpanded ? "expanded" : ""
                }`}
              >
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
                    {/* Matches content goes here */}
                  </Box>
                )}
              </Box>
            }

            {isMatchesExpanded && <Box className="allMatchesSpacer" />}

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

              <Box
                className={`matchesScrollArea ${
                  isGridView ? "gridView" : "listView"
                }`}
              >
                {[...Array(40)].map((_, index) => (
                  <Box key={index} className="matchItem">
                    <Image
                      src={`/images/sample/sample${(index % 5) + 1}.jpg`} // Sample images for demonstration
                      alt={`Sample ${index}`}
                      className="matchImage"
                    />
                    {!isGridView && (
                      <Text className="matchLabel">Match #{index + 1}</Text>
                    )}
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
            <Box className="imageArea">
              {/* Placeholder for image/canvas if needed */}
              <div className="checkboxBottomRight">
                <label className="filterItem">
                  <input type="checkbox" />
                  Show Matching Area
                </label>
              </div>
            </Box>

            <div className="sliderWrapper">
              <input type="range" className="frameSlider" />
            </div>

            <div className="registrationActions">
              <button className="objectFamilyBtn">Add to Object Family</button>
            </div>

            <div className="bottomMetaBar">
              <span className="filenameText">filename.mp4</span>
              <span className="frameText">Frame # / #</span>
              <span className="moreOptions">More Options</span>
            </div>
            {/* <Text className="contentText">Right Div Content</Text> */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SearchResults;
