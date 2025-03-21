"use client";

import { Slider } from "@/components/ui/slider";
import React, { useState } from 'react';
import "./databaseResolutionLevel.css";


export default function DatabaseResolutionLevel() {
    const [value, setValue] = React.useState(2);
    const [endValue, setEndValue] = React.useState(10);


  return (
    
    <div className="advancedOptions">
        <div className="resolutionSlider">
            <Slider aria-label='database resolution level' size="lg" label="Database Resolution Level:" variant="solid" colorPalette="blue" min={2} max={12} step={1} marks={[{value:2, label: "2"}, {value:3, label: "3"}, {value:4, label: "4"}, {value:5, label: "5"}, {value:6, label: "6"}, {value:7, label: "7"}, {value:8, label: "8"}, {value:9, label: "9"}, {value:10, label: "10"}, {value:11, label: "11"}, {value:12, label: "12"}]} thumbSize={{ width:0.25, height:1}} defaultValue={[2]} />
        </div>
    </div>
    
  );
}