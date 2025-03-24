import { Button } from "@chakra-ui/react";
import React from 'react';
import "./searchButton.css";
  const startSearch = () => {
    console.log("Look, I am searching!");
  };
export default function SearchButton() {
    return(
        <div className="search">
            <Button variant="solid" size="xl" onClick={startSearch}>Search</Button>
        </div>
    )
}