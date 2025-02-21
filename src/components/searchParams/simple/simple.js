"use client";

import { SliderTrack, SliderThumb } from "@chakra-ui/react";

import { Text, Box } from "@chakra-ui/react";


import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox"
import React, { useState } from 'react';
import "./simple.css";


export default function Simple() {
    const [value, setValue] = React.useState(50);
    const [endValue, setEndValue] = React.useState(10);

    const [checked, setChecked] = useState(false)

  return (
    
    <div className="sliderDiv">
        <div className="fastThoroughSlider">
            <Box className="fastThoroughBoxes">
                <Text>Fast</Text>
            </Box>
            <Slider className="slider" aria-label='fast-to-thorough-slider' size="lg" variant="solid" marks={[{value:10, label: "previous"}, {value:70, label: "default"}]} defaultValue={[40]}>
                <SliderTrack bg='purple' />
                <SliderThumb boxSize={6}>
                    <Box color='tomato' />
                </SliderThumb>
            </Slider>
            <Box className="fastThoroughBoxes">
                <Text>Thorough</Text>
            </Box>
        </div>
        <div className="defaultCheckbox">
            <Checkbox 
                checked={checked}
                colorPalette="blue"
                onCheckedChange={(e) => setChecked(!!e.checked)}>
                Set as Default
            </Checkbox>
        </div>
    </div>
    
  );
}



// function CustomSlider({ defaultValue = 50, previousValue = 30 }) {
//   return (
//     <Box width="300px" p={5}>
//       <Slider defaultValue={defaultValue} min={0} max={100}>
//         {/* Previous Value Marker */}
//         <SliderTrack bg="gray.200">
//           <Box position="absolute" left={`${previousValue}%`} width="5px" height="100%" bg="red.500" />
//           <SliderFilledTrack bg="blue.500" />
//         </SliderTrack>
//         <SliderThumb boxSize={6} bg="green.400" />
//       </Slider>
//     </Box>
//   );
// }

// export default CustomSlider;

// onChangeEnd={setEndValue} 

// onChangeEnd={setPrevious}

// onChangeEnd={(val) => console.log(val)} 