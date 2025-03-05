
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
// "use client";
// import { useState } from "react";

// export default function SearchFor() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [response, setResponse] = useState("");
//   const [imageUrl, setImageUrl] = useState("");

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setSelectedFile(file);
//     // Create a preview URL for the selected file and display it immediately
//     const previewUrl = URL.createObjectURL(file);
//     setImageUrl(previewUrl);
//     console.log(":rocket: Selected file:", file);
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) {
//       alert("Please select an image first!");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("file", selectedFile);
//     try {
//       console.log(":rocket: Sending image to FastAPI...");
//       // Note: Updated endpoint to match your backend route
//       const res = await fetch("http://127.0.0.1:8000/process-image", {
//         method: "POST",
//         body: formData,
//       });
//       if (!res.ok) {
//         throw new Error(`Upload failed with status: ${res.status}`);
//       }
//       const data = await res.json();
//       console.log(":white_check_mark: Response from FastAPI:", data);
//       setResponse(data.message);
//       if (data.filename) {
//         // Construct the URL for the processed image.
//         const processedUrl = `http://127.0.0.1:8000/get-image/${encodeURIComponent(data.filename)}`;
//         console.log(`:loudspeaker: Processed image URL: ${processedUrl}`);
//         // Replace the preview image with the processed image.
//         setImageUrl(processedUrl);
//       }
//     } catch (error) {
//       console.error(":x: Error:", error);
//       setResponse(`Error: ${error.message}`);
//     }
//   };

//   return (
//     <div>
//       <h1 style={{ color: "black" }}>Upload an Image</h1>
//       <input
//         style={{ color: "black" }}
//         type="file"
//         accept="image/*"
//         onChange={handleFileChange}
//       />
//       {selectedFile && <p>Selected file: {selectedFile.name}</p>}
//       <button onClick={handleUpload} style={{ color: "black" }}>
//        Isolate subject
//       </button>
//       {response && <p>FastAPI Response: {response}</p>}
//       {imageUrl && (
//         <img
//           src={imageUrl}
//           alt="Uploaded or Processed"
//           style={{ maxWidth: "200px", marginTop: "10px" }}
//           onError={(e) => console.error("❌ Image failed to load:", e)}
//         />
//       )}
//     </div>
//   );
// }
// "use client";
// import { useState, useRef } from "react";
// import CanvasDraw from "react-canvas-draw";

// // This function converts the red brush strokes in the mask to pure white.
// async function convertRedMaskToWhite(maskDataUrl) {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.crossOrigin = "Anonymous"; // helps avoid cross-origin issues
//     img.onload = () => {
//       // Create an offscreen canvas
//       const canvas = document.createElement("canvas");
//       canvas.width = img.width;
//       canvas.height = img.height;
//       const ctx = canvas.getContext("2d");
//       ctx.drawImage(img, 0, 0);
      
//       // Get pixel data
//       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//       const data = imageData.data;
      
//       // Iterate through all pixels
//       for (let i = 0; i < data.length; i += 4) {
//         // Check if this pixel is red (adjust threshold as needed).
//         // This assumes red strokes have high R and low G/B.
//         if (data[i] > 200 && data[i + 1] < 100 && data[i + 2] < 100 && data[i + 3] > 0) {
//           // Set the pixel to white with full opacity.
//           data[i] = 255;     // R
//           data[i + 1] = 255; // G
//           data[i + 2] = 255; // B
//           data[i + 3] = 255; // A
//         }
//       }
      
//       // Put the modified data back into the canvas.
//       ctx.putImageData(imageData, 0, 0);
//       // Resolve with the new data URL.
//       resolve(canvas.toDataURL("image/png"));
//     };
//     img.onerror = (err) => reject(err);
//     img.src = maskDataUrl;
//   });
// }

// export default function SearchFor() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [imageUrl, setImageUrl] = useState("");
//   const [response, setResponse] = useState("");
//   const canvasRef = useRef(null);

//   // Handle file selection and preview.
//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setSelectedFile(file);
//     const previewUrl = URL.createObjectURL(file);
//     setImageUrl(previewUrl);
//     console.log(":rocket: Selected file:", file);
//   };

//   // When the user clicks "Manual Mask", convert the drawing to a proper mask and send it.
//   const handleManualMask = async () => {
//     if (!selectedFile) {
//       alert("Please select an image first!");
//       return;
//     }
//     if (!canvasRef.current) {
//       alert("Drawing canvas not ready.");
//       return;
//     }
    
//     // Get the raw mask from CanvasDraw (which has red strokes)
//     const rawMaskDataUrl = canvasRef.current.getDataURL("png");
    
//     // Convert red strokes to pure white
//     const processedMaskDataUrl = await convertRedMaskToWhite(rawMaskDataUrl);
    
//     // Optionally clear the drawing from the canvas (so the red outline is no longer visible)
//     canvasRef.current.clear();

//     // Convert the processed data URL to a Blob.
//     const resData = await fetch(processedMaskDataUrl);
//     const maskBlob = await resData.blob();

//     // Prepare a FormData object with both the original image and the mask.
//     const formData = new FormData();
//     formData.append("image", selectedFile);
//     formData.append("mask", maskBlob, "mask.png");

//     try {
//       console.log(":rocket: Sending image and processed mask to FastAPI...");
//       const res = await fetch("http://127.0.0.1:8000/remove-area", {
//         method: "POST",
//         body: formData,
//       });
//       if (!res.ok) {
//         throw new Error(`Upload failed with status: ${res.status}`);
//       }
//       const data = await res.json();
//       console.log(":white_check_mark: Response from FastAPI:", data);
//       setResponse(data.message);
//       if (data.filename) {
//         const processedUrl = `http://127.0.0.1:8000/get-image/${encodeURIComponent(data.filename)}`;
//         setImageUrl(processedUrl);
//       }
//     } catch (error) {
//       console.error(":x: Error:", error);
//       setResponse(`Error: ${error.message}`);
//     }
//   };

//   return (
//     <div>
//       <h1 style={{ color: "black" }}>Upload an Image & Draw a Mask</h1>
//       <input type="file" accept="image/*" onChange={handleFileChange} />
//       {selectedFile && <p>Selected file: {selectedFile.name}</p>}
      
//       {imageUrl && (
//         <div style={{ position: "relative", width: "500px", height: "500px" }}>
//           {/* Display the uploaded image as background */}
//           <img
//             src={imageUrl}
//             alt="Uploaded"
//             style={{ position: "absolute", width: "500px", height: "500px", zIndex: 1 }}
//           />
//           {/* Overlay the drawing canvas */}
//           <CanvasDraw
//             ref={canvasRef}
//             brushColor="rgba(255, 0, 0, 1)"  // Strong red for drawing
//             brushRadius={1}
//             canvasWidth={500}
//             canvasHeight={500}
//             style={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               zIndex: 2,
//               backgroundColor: "transparent",
//             }}
//           />
//         </div>
//       )}
//       <button onClick={handleManualMask} style={{ color: "black" }}>
//         Manual Mask
//       </button>
//       {response && <p>FastAPI Response: {response}</p>}
//     </div>
//   );
// }
"use client";
import { useState, useRef } from "react";
import CanvasDraw from "react-canvas-draw";

// Convert red strokes in the mask to pure white.
async function convertRedMaskToWhite(maskDataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        // Check for red pixels (assumes strong red brush strokes)
        if (data[i] > 200 && data[i + 1] < 100 && data[i + 2] < 100 && data[i + 3] > 0) {
          data[i] = 255;     // R
          data[i + 1] = 255; // G
          data[i + 2] = 255; // B
          data[i + 3] = 255; // A
        }
      }
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = (err) => reject(err);
    img.src = maskDataUrl;
  });
}

export default function SearchFor() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [response, setResponse] = useState("");
  const canvasRef = useRef(null);

  // Handle image file selection.
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImageUrl(previewUrl);
    console.log(":rocket: Selected file:", file);
  };

  // "Isolate Subject" uses rembg (/process-image endpoint)
  const handleIsolateSubject = async () => {
    if (!selectedFile) {
      alert("Please select an image first!");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      console.log(":rocket: Sending image to FastAPI for isolation...");
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
        const processedUrl = `http://127.0.0.1:8000/get-image/${encodeURIComponent(data.filename)}`;
        setImageUrl(processedUrl);
      }
    } catch (error) {
      console.error(":x: Error:", error);
      setResponse(`Error: ${error.message}`);
    }
  };

  // "Manual Mask" uses CanvasDraw and sends image + processed mask (/remove-area endpoint)
  const handleManualMask = async () => {
    if (!selectedFile) {
      alert("Please select an image first!");
      return;
    }
    if (!canvasRef.current) {
      alert("Drawing canvas not ready.");
      return;
    }
    
    const rawMaskDataUrl = canvasRef.current.getDataURL("png");
    const processedMaskDataUrl = await convertRedMaskToWhite(rawMaskDataUrl);
    canvasRef.current.clear();
    const resData = await fetch(processedMaskDataUrl);
    const maskBlob = await resData.blob();

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("mask", maskBlob, "mask.png");

    try {
      console.log(":rocket: Sending image and processed mask to FastAPI...");
      const res = await fetch("http://127.0.0.1:8000/remove-area", {
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
        const processedUrl = `http://127.0.0.1:8000/get-image/${encodeURIComponent(data.filename)}`;
        setImageUrl(processedUrl);
      }
    } catch (error) {
      console.error(":x: Error:", error);
      setResponse(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h1 style={{ color: "black" }}>Upload an Image & Apply a Mask</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {selectedFile && <p>Selected file: {selectedFile.name}</p>}
      
      {imageUrl && (
        <div style={{ position: "relative", width: "500px", height: "500px" }}>
          <img
            src={imageUrl}
            alt="Uploaded"
            style={{ position: "absolute", width: "500px", height: "500px", zIndex: 1 }}
          />
          <CanvasDraw
            ref={canvasRef}
            brushColor="rgba(255, 0, 0, 1)"  // Use strong red for drawing
            brushRadius={1}
            canvasWidth={500}
            canvasHeight={500}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 2,
              backgroundColor: "transparent",
            }}
          />
        </div>
      )}
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleIsolateSubject} style={{ marginRight: "10px", color: "black" }}>
          Isolate Subject
        </button>
        <button onClick={handleManualMask} style={{ color: "black" }}>
          Manual Mask
        </button>
      </div>
      {response && <p>FastAPI Response: {response}</p>}
    </div>
  );
}
