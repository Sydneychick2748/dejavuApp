const API_URL = "http://localhost:3001"; // ✅ Mock JSON Server URL

// ✅ Save database & selected files
export async function saveDatabase(databaseName, selectedFiles) {
  try {
    const response = await fetch(`${API_URL}/databases`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: databaseName,
        files: selectedFiles.map((file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
        })),
      }),
    });

    if (!response.ok) throw new Error("Failed to save database.");
    return await response.json(); // ✅ Return saved data
  } catch (error) {
    console.error("Error saving database:", error);
    return null;
  }
}

// ✅ Fetch saved databases
export async function getDatabases() {
  try {
    const response = await fetch(`${API_URL}/databases`);
    if (!response.ok) throw new Error("Failed to fetch databases.");
    return await response.json();
  } catch (error) {
    console.error("Error fetching databases:", error);
    return [];
  }
}
