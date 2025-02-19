"use client";


import { Text, Box, CheckboxGroup, Fieldset } from "@chakra-ui/react"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider";
import React, { useState } from 'react';
import "./advanced.css";


export default function Advanced() {
    const [value, setValue] = React.useState(50);
    const [endValue, setEndValue] = React.useState(10);

    const [checked, setChecked] = useState(false)

  return (
    
    <div className="slider">
        <div className="fastThoroughSlider">
            <Box className="fastThoroughBoxes">
                <Text>Resolution Level</Text>
            </Box>
            <Slider aria-label='fast-to-thorough-slider' size="lg" label="blankety-blank slider" variant="solid" colorPalette="purple" marks={[{value:10, label: "previous"}, {value:70, label: "default"}]} thumbSize={{ width:2, height:4 }} defaultValue={[40]} onChangeEnd={setEndValue} />
        </div>
        <div className="defaultCheckbox">
            <Fieldset.Root>
                <CheckboxGroup defaultValue={["no-rotation"]} name="framework">
                    <Fieldset.Legend fontSize="sm" mb="2">
                    Rotation
                    </Fieldset.Legend>
                    <Fieldset.Content>
                        <Checkbox value="no-rotation">No rotation</Checkbox>
                        <Checkbox value="multiples">Multiples of 90</Checkbox>
                        <Checkbox value="arbitrary-rotation">Arbitrary rotation</Checkbox>
                    </Fieldset.Content>
                </CheckboxGroup>
            </Fieldset.Root>
        </div>
        <div>
            <Fieldset.Root>
                <CheckboxGroup defaultValue={["mirrored"]} name="framework">
                    <Fieldset.Legend fontSize="sm" mb="2">
                    Other Options
                    </Fieldset.Legend>
                    <Fieldset.Content>
                        <Checkbox value="mirrored">Mirrored</Checkbox>
                        <Checkbox value="thorough">Thorough</Checkbox>
                        <Checkbox value="high-sensitivity">High Sensitivity</Checkbox>
                    </Fieldset.Content>
                </CheckboxGroup>
            </Fieldset.Root>
        </div>
        <div>
            <Text>
                Save Parameters
            </Text>
        </div>
    </div>
    
  );
}