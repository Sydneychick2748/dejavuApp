// Fetch all databases
export async function getDatabases() {
    return fetchData("databases");
  }
  
  // Add a file to a specific database
  export async function uploadFile(databaseId, file) {
    return fetchData(`databases/${databaseId}/files`, {
      method: "POST",
      body: JSON.stringify(file),
    });
  }
  