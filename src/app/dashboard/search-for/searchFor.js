
"use client";
import { useState, useRef } from "react";
import CanvasDraw from "react-canvas-draw";
import "./SearchFor.css";

// Composite the uploaded image onto a white background.
async function compositeImageOnWhite(imageUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = (err) => reject(err);
    img.src = imageUrl;
  });
}

// Convert red strokes in the mask to a binary mask (black background, white strokes)
async function convertRedMaskToBinary(maskDataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] > 200 && data[i + 1] < 100 && data[i + 2] < 100) {
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
          data[i + 3] = 255;
        } else {
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
          data[i + 3] = 255;
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
  // imageUrl is what is displayed in the preview.
  const [imageUrl, setImageUrl] = useState("");
  const [response, setResponse] = useState("");
  // baseImageUrl holds the current processed image for further processing.
  const [baseImageUrl, setBaseImageUrl] = useState("");
  const canvasRef = useRef(null);

  // Handle file selection and composite it on white.
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    try {
      const compositedUrl = await compositeImageOnWhite(previewUrl);
      setImageUrl(compositedUrl);
      setBaseImageUrl(compositedUrl);
      console.log(":rocket: Selected file:", file);
    } catch (error) {
      console.error("Error compositing image on white:", error);
      setImageUrl(previewUrl);
      setBaseImageUrl(previewUrl);
    }
  };

  // "Isolate Subject": use the current base image (processed so far) for background removal.
  const handleIsolateSubject = async () => {
    if (!baseImageUrl) {
      alert("Please select an image first!");
      return;
    }
    // Fetch the current base image as a Blob.
    const imageRes = await fetch(baseImageUrl);
    const imageBlob = await imageRes.blob();
    const formData = new FormData();
    // Use the current base image rather than the original file.
    formData.append("file", imageBlob, "base.png");
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
        // Update baseImageUrl to the new processed image.
        setBaseImageUrl(processedUrl);
      }
    } catch (error) {
      console.error(":x: Error:", error);
      setResponse(`Error: ${error.message}`);
    }
  };

  // "Manual Mask": use the current base image and the drawn mask for masking.
  const handleManualMask = async () => {
    if (!baseImageUrl) {
      alert("No image available for masking!");
      return;
    }
    if (!canvasRef.current) {
      alert("Drawing canvas not ready.");
      return;
    }
    const rawMaskDataUrl = canvasRef.current.getDataURL("png");
    const processedMaskDataUrl = await convertRedMaskToBinary(rawMaskDataUrl);
    canvasRef.current.clear();
    // Fetch the current base image as a Blob.
    const imageRes = await fetch(baseImageUrl);
    const imageBlob = await imageRes.blob();
    // Convert the processed mask data URL to a Blob.
    const maskRes = await fetch(processedMaskDataUrl);
    const maskBlob = await maskRes.blob();
    const formData = new FormData();
    formData.append("image", imageBlob, "base.png");
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
        setBaseImageUrl(processedUrl);
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
        <div style={{ position: "relative", width: "500px", height: "500px", backgroundColor: "white" }}>
          <img
            src={imageUrl}
            alt="Uploaded or Processed"
            className="imageSolid"
            style={{
              position: "absolute",
              width: "500px",
              height: "500px",
              zIndex: 1,
            }}
          />
          {/* Always display the drawing overlay if you want the user to draw a mask */}
          <CanvasDraw
            ref={canvasRef}
            brushColor="rgba(255, 0, 0, 1)"
            brushRadius={3}
            lazyRadius={0}   
            canvasWidth={500}
            canvasHeight={500}
            hideGrid={true}
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
