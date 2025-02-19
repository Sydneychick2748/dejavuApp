"use client";

import { Text } from "@chakra-ui/react";

import { Box } from "@chakra-ui/react";

// import React, { useState } from 'react';
import "./saved-settings.css";


export default function SavedSettings() {
    // const [value, setValue] = React.useState(50);
    // const [endValue, setEndValue] = React.useState(10);


  return (
    <div>
        <div className="pastList">
            <div className="choices">
                <Box className="grey">
                    <Text>Fast with rotation</Text>
                </Box>
                <Box className="white">
                    <Text>Fast level 6 search</Text>
                </Box>
                <Box className="grey">
                    <Text>Level 10 no rotation</Text>
                </Box>
                <Box className="white">
                    <Text>Fast search with rotation</Text>
                </Box>
                <Box className="grey">
                    <Text>Thorough level 8 search, high sensitivity</Text>
                </Box>
                <Box className="white">
                    <Text>Mona Lisa</Text>
                </Box>
                <Box className="grey">
                    <Text>Whatever, just find the thing</Text>
                </Box>
            </div>
        </div>
    </div>
    
  );
}

// onChangeEnd={setPrevious}

// onChangeEnd={(val) => console.log(val)} 