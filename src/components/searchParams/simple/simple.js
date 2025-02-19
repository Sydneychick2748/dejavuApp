"use client";

import { Text } from "@chakra-ui/react";
import { Slider } from "@/components/ui/slider";
import { Box } from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox"
import React, { useState } from 'react';
import "./simple.css";


export default function Simple() {
    const [value, setValue] = React.useState(50);
    const [endValue, setEndValue] = React.useState(10);

    const [checked, setChecked] = useState(false)

  return (
    
    <div className="slider">
        <div className="fastThoroughSlider">
            <Box className="fastThoroughBoxes">
                <Text>Fast</Text>
            </Box>
            <Slider aria-label='fast-to-thorough-slider' size="lg" label="blankety-blank slider" variant="solid" colorPalette="purple" marks={[{value:10, label: "previous"}, {value:70, label: "default"}]} thumbSize={{ width:2, height:4 }} defaultValue={[40]} onChangeEnd={setEndValue} />
            <Box className="fastThoroughBoxes">
                <Text>Thorough</Text>
            </Box>
            <Text>{endValue}</Text>
        </div>
        <div className="defaultCheckbox">
            <Checkbox 
                checked={checked}
                onCheckedChange={(e) => setChecked(!!e.checked)}>
                Set as Default
            </Checkbox>
        </div>
    </div>
    
  );
}

// onChangeEnd={setPrevious}

// onChangeEnd={(val) => console.log(val)} 