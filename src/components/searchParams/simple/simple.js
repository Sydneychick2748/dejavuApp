"use client";

import { SliderTrack, SliderThumb } from "@chakra-ui/react";
import { Text, Box } from "@chakra-ui/react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import React, { useState, useEffect } from 'react';
import "./simple.css";

export default function Simple() {
    const defaultValue = 70;
    const [value, setValue] = useState(defaultValue);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (checked) {
            setValue(defaultValue);
            // Uncheck the box after setting the default value
            // Using setTimeout to ensure the slider visually updates first
            setTimeout(() => {
                setChecked(false);
            }, 100); // Small delay to allow slider animation to complete
        }
    }, [checked]);

    const handleSliderChange = (newValue) => {
        if (!checked) {
            setValue(newValue[0]);
        }
    };

    return (
        <div className="sliderDiv">
            <div className="fastThoroughSlider">
                <div className="fastThoroughBoxes">
                    <Box>
                        <Text>Fast</Text>
                    </Box>
                </div>
                <div className="slider">
                    <Slider 
                        aria-label='fast-to-thorough-slider' 
                        size="lg" 
                        variant="solid" 
                        marks={[{value: 10, label: "previous"}, {value: 70, label: "default"}]} 
                        defaultValue={[defaultValue]}
                        value={[value]}
                        onValueChange={handleSliderChange}
                    >
                        <SliderTrack bg='purple' />
                        <SliderThumb boxSize={6}>
                            <Box />
                        </SliderThumb>
                    </Slider>
                </div>
                <div className="fastThoroughBoxes">
                    <Box>
                        <Text>Thorough</Text>
                    </Box>
                </div>
                <div className="defaultCheckbox">
                    <Checkbox 
                        checked={checked}
                        colorPalette="blue"
                        onCheckedChange={(e) => setChecked(!!e.checked)}
                    >
                        Default
                    </Checkbox>
                </div>
            </div>
        </div>
    );
}