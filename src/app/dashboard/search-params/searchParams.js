"use client";

import { Box, Text } from "@chakra-ui/react";
import Simple from "@/components/searchParams/simple/simple";
import SavedSettings from "@/components/searchParams/saved-settings/saved-settings";
import Advanced from "@/components/searchParams/advanced/advanced";
import "./searchParams.css";

export default function SearchParams() {
  return (
    <div className="settings">
      <Box className="headerBox">
        <Text className="searchParamsWording">
          Search Parameters...
        </Text>
        <Box className="infoBox">
          <Text className="infoLetter">
            i
          </Text>
        </Box>
      </Box>
      <div className="simple">
        <Text>Simple</Text>
        <Simple />
      </div>
      <div className="savedSettings">
        <Text>Saved Settings</Text>
        <SavedSettings />
      </div>
      <div className="advanced">
        <Text>Advanced</Text>
        <Advanced />
      </div>
    </div>
  );
}