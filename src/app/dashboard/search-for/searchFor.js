
// "use client";

// import { useContext } from "react";
// import { ImageContext } from "@/contexts/ImageContext";
// import { Box, Image, Text, Button } from "@chakra-ui/react";

// export default function SearchFor() {
//   const { selectedImage } = useContext(ImageContext);

//   return (
//     <Box>
//       <Text fontSize="lg" fontWeight="bold" mb={2}>Search for...</Text>
      
//       <Box
//         border="2px solid blue"
//         p={2}
//         borderRadius="md"
//         textAlign="center"
//         bg="gray.50"
//       >
//         {selectedImage ? (
//           <Image src={selectedImage} alt="Selected" boxSize="200px" borderRadius="md" />
//         ) : (
//           <Text>No image selected</Text>
//         )}
//       </Box>

//       <Button mt={2} colorScheme="blue">Manual Mask</Button>
//       <Button mt={2} colorScheme="blue">Isolate Subject</Button>
//       <Button mt={2} colorScheme="blue">Create Search Object</Button>
//       <Button mt={2} colorScheme="blue">Add to Object Family</Button>
//     </Box>
//   );
// }
"use client";
import { useState } from "react";

export default function SearchFor() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [response, setResponse] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    // Create a preview URL for the selected file and display it immediately
    const previewUrl = URL.createObjectURL(file);
    setImageUrl(previewUrl);
    console.log(":rocket: Selected file:", file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image first!");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      console.log(":rocket: Sending image to FastAPI...");
      // Note: Updated endpoint to match your backend route
      const res = await fetch("http://127.0.0.1:8000/process-image", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error(`Upload failed with status: ${res.status}`);
      }
      const data = await res.json();
      console.log(":white_check_mark: Response from FastAPI:", data);
      setResponse(data.message);
      if (data.filename) {
        // Construct the URL for the processed image.
        const processedUrl = `http://127.0.0.1:8000/get-image/${encodeURIComponent(data.filename)}`;
        console.log(`:loudspeaker: Processed image URL: ${processedUrl}`);
        // Replace the preview image with the processed image.
        setImageUrl(processedUrl);
      }
    } catch (error) {
      console.error(":x: Error:", error);
      setResponse(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h1 style={{ color: "black" }}>Upload an Image</h1>
      <input
        style={{ color: "black" }}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      {selectedFile && <p>Selected file: {selectedFile.name}</p>}
      <button onClick={handleUpload} style={{ color: "black" }}>
       Isolate subject
      </button>
      {response && <p>FastAPI Response: {response}</p>}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Uploaded or Processed"
          style={{ maxWidth: "200px", marginTop: "10px" }}
          onError={(e) => console.error("❌ Image failed to load:", e)}
        />
      )}
    </div>
  );
}
