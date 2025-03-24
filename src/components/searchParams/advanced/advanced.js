"use client";

import { Text, Box, CheckboxGroup, Fieldset, Button } from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import React, { useState, useEffect } from 'react';
import "./advanced.css";

export default function Advanced() {
    const defaultValue = 8;
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
        <div className="advancedOptions">
            <div className="resolutionSlider">
                <Slider 
                    aria-label='resolution level' 
                    size="lg" 
                    label="Resolution Level" 
                    variant="solid" 
                    colorPalette="blue" 
                    min={1} 
                    max={12} 
                    step={1} 
                    marks={[
                        {value: 1, label: "1"},
                        {value: 2, label: "2"},
                        {value: 3, label: "3"},
                        {value: 4, label: "4"},
                        {value: 5, label: "5"},
                        {value: 6, label: "6"},
                        {value: 7, label: "7"},
                        {value: 8, label: "8"},
                        {value: 9, label: "9"},
                        {value: 10, label: "10"},
                        {value: 11, label: "11"},
                        {value: 12, label: "12"}
                    ]} 
                    thumbSize={{ width: 0.25, height: 1 }}
                    defaultValue={[defaultValue]}
                    value={[value]}
                    onValueChange={handleSliderChange}
                />
            </div>
            <div className="optionsCheckboxes">
                <div className="firstSet">
                    <Fieldset.Root>
                        <CheckboxGroup name="framework">
                            <div className="firstSetInner">
                                <Fieldset.Content>
                                    <Checkbox 
                                        _checked={{"& .chakra-checkbox__control": { background: "#4A87FB" }}} 
                                        value="no-rotation"
                                    >No rotation</Checkbox>
                                    <Checkbox
                                        _checked={{"& .chakra-checkbox__control": { background: "#4A87FB" }}} 
                                        value="multiples"
                                    >Multiples of 90</Checkbox>
                                    <Checkbox
                                        _checked={{"& .chakra-checkbox__control": { background: "#4A87FB" }}} 
                                        value="arbitrary-rotation"
                                    >Arbitrary rotation</Checkbox>
                                </Fieldset.Content>
                            </div>
                        </CheckboxGroup>
                    </Fieldset.Root>
                </div>
                <div className="secondSet">
                    <Fieldset.Root>
                        <CheckboxGroup name="framework">
                            <Fieldset.Content>
                                <Checkbox 
                                    _checked={{"& .chakra-checkbox__control": { background: "#4A87FB" }}}  
                                    value="mirrored"
                                >Mirrored</Checkbox>
                                <Checkbox
                                    _checked={{"& .chakra-checkbox__control": { background: "#4A87FB" }}}  
                                    value="thorough"
                                >Thorough</Checkbox>
                                <Checkbox
                                    _checked={{"& .chakra-checkbox__control": { background: "#4A87FB" }}}  
                                    value="high-sensitivity"
                                >High Sensitivity</Checkbox>
                            </Fieldset.Content>
                        </CheckboxGroup>
                    </Fieldset.Root>
                </div>
                <div className="saveParametersText">
                    <Checkbox
                        _checked={{"& .chakra-checkbox__control": { background: "#4A87FB" }}}
                        value="default"
                        checked={checked}
                        onCheckedChange={(e) => setChecked(!!e.checked)}
                    >Default</Checkbox>
                    <Button className="saveParametersButton" variant="plain">
                        Save Parameters
                    </Button>
                </div>
            </div>
        </div>
    );
}