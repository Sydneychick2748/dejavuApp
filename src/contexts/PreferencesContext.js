"use client";
import React, { createContext, useState, useEffect, useContext } from "react";

// Create the Preferences Context
const PreferencesContext = createContext();

// Preferences Provider Component
export const PreferencesProvider = ({ children }) => {
  const [databaseLocation, setDatabaseLocation] = useState("default");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch preferences from the backend on mount
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch("http://localhost:8000/user-preferences", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch preferences");
        }

        const data = await response.json();
        setDatabaseLocation(data.databaseLocation || "default");
      } catch (error) {
        console.error("Error fetching preferences:", error);
        setDatabaseLocation("default");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  // Update preferences in the backend
  const updateDatabaseLocation = async (value) => {
    try {
      const response = await fetch("http://localhost:8000/user-preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ databaseLocation: value }),
      });

      if (!response.ok) {
        throw new Error("Failed to update preferences");
      }

      setDatabaseLocation(value);
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  };

  return (
    <PreferencesContext.Provider value={{ databaseLocation, setDatabaseLocation: updateDatabaseLocation, isLoading }}>
      {children}
    </PreferencesContext.Provider>
  );
};

// Custom hook to use the Preferences Context
export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
};

// Custom hook to fetch databaseLocation from the backend (for components outside the provider)
export const useDatabaseLocation = () => {
  const [databaseLocation, setDatabaseLocation] = useState("default");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch("http://localhost:8000/user-preferences", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch preferences");
        }

        const data = await response.json();
        setDatabaseLocation(data.databaseLocation || "default");
      } catch (error) {
        console.error("Error fetching preferences:", error);
        setDatabaseLocation("default");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  return { databaseLocation, isLoading };
};