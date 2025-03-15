"use client";
import React, { useContext, useState, useRef, useEffect } from "react";
import CanvasDraw from "react-canvas-draw";
import { ImageContext } from "@/contexts/ImageContext";
import { FaPlus } from "react-icons/fa"; // Importing the plus icon
import "./SearchFor.css";
import ImageSelectModal from "../modals/image-select-modal/imageSelectModal";


// Composite the image onto a white background at 500×500.
async function compositeImageOnWhite(imageUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 500;
      canvas.height = 500;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Draw the image scaled to 500×500.
      ctx.drawImage(img, 0, 0, 500, 500);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = (err) => reject(err);
    img.src = imageUrl;
  });
}

// Convert red strokes in the mask to a binary mask (black background, white strokes).
async function convertRedMaskToBinary(maskDataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 500;
      canvas.height = 500;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, 500, 500);
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
  // const { selectedImage, selectedFileInfo } = useContext(ImageContext);
  const [imageUrl, setImageUrl] = useState("");
  const [baseImageUrl, setBaseImageUrl] = useState("");
  const [response, setResponse] = useState("");
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  // Control whether the full-size mask editor modal is open.
  const [isMaskEditorOpen, setIsMaskEditorOpen] = useState(false);
  const canvasRef = useRef(null);
  
  //  const [isModalOpen, setIsModalOpen] = useState(false);
  //  const { finalSelectedImages } = useContext(ImageContext); // ✅ Get final images
  const { selectedImage, setSelectedImage, uploadedFiles, selectedFileInfo,finalSelectedImages } = useContext(ImageContext);

    
  
  // When selectedImage changes, load it and composite it onto a 500×500 white canvas.
  useEffect(() => {
    if (!selectedImage) return;
    const tempImg = new Image();
    tempImg.onload = () => {
      setImgWidth(tempImg.width);
      setImgHeight(tempImg.height);
      compositeImageOnWhite(selectedImage)
        .then((compositedUrl) => {
          setImageUrl(compositedUrl);
          setBaseImageUrl(compositedUrl);
        })
        .catch((error) => {
          console.error("Error compositing image on white:", error);
          setImageUrl(selectedImage);
          setBaseImageUrl(selectedImage);
        });
    };
    tempImg.src = selectedImage;
  }, [selectedImage]);

  const fileSizeMB = selectedFileInfo?.size
    ? `${(selectedFileInfo.size / (1024 * 1024)).toFixed(2)} MB`
    : "0 MB";

  // "Isolate Subject": Send the current base image to FastAPI for background removal.
  const handleIsolateSubject = async () => {
    if (!baseImageUrl) {
      alert("No image selected!");
      return;
    }
    try {
      const imageRes = await fetch(baseImageUrl);
      const imageBlob = await imageRes.blob();
      const formData = new FormData();
      formData.append("file", imageBlob, "base.png");
      console.log(":rocket: Sending image to FastAPI for isolation...");
      const res = await fetch("http://127.0.0.1:8000/process-image", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`Upload failed with status: ${res.status}`);
      const data = await res.json();
      console.log(":white_check_mark: Response from FastAPI:", data);
      setResponse(data.message);
      if (data.filename) {
        const processedUrl = `http://127.0.0.1:8000/get-image/${encodeURIComponent(
          data.filename
        )}`;
        setImageUrl(processedUrl);
        setBaseImageUrl(processedUrl);
      }
    } catch (error) {
      console.error(":x: Error:", error);
      setResponse(`Error: ${error.message}`);
    }
  };
  
  // Open the mask editor modal.
  const openMaskEditor = () => {
    setIsMaskEditorOpen(true);
  };

  // "Manual Mask": Applies the drawn mask using FastAPI, then updates the image.
  // NOTE: We do NOT close the modal here so that the user can apply additional masks.
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
    // Clear the canvas for the next drawing round.
    canvasRef.current.clear();
    try {
      const imageRes = await fetch(baseImageUrl);
      const imageBlob = await imageRes.blob();
      const maskRes = await fetch(processedMaskDataUrl);
      const maskBlob = await maskRes.blob();
      const formData = new FormData();
      formData.append("image", imageBlob, "base.png");
      formData.append("mask", maskBlob, "mask.png");
      console.log(":rocket: Sending image and processed mask to FastAPI...");
      const res = await fetch("http://127.0.0.1:8000/remove-area", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`Upload failed with status: ${res.status}`);
      const data = await res.json();
      console.log(":white_check_mark: Response from FastAPI:", data);
      setResponse(data.message);
      if (data.filename) {
        const processedUrl = `http://127.0.0.1:8000/get-image/${encodeURIComponent(
          data.filename
        )}`;
        setImageUrl(processedUrl);
        setBaseImageUrl(processedUrl);
      }
      // Modal remains open to allow further mask editing.
    } catch (error) {
      console.error(":x: Error:", error);
      setResponse(`Error: ${error.message}`);
    }
  };


  // const { selectedImage, setSelectedImage, uploadedFiles, selectedFileInfo,finalSelectedImages } = useContext(ImageContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModalImage, setSelectedModalImage] = useState(null); // Temporary state for modal selection


  const handleOpenModal = () => {
    if (finalSelectedImages.length > 0) {
      setIsModalOpen(true);
    } else {
      alert("You must complete the upload process before clicking!");
    }
  };

  const handleCloseModal = () => {
    if (selectedModalImage) {
      setSelectedImage(selectedModalImage); // ✅ Update dashboard image only when closing modal
    }
    setIsModalOpen(false);
  };

  

return (
  <div style={{ padding: "20px", color: "black" }}>
    {/* Top Bar */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      <h1>Search For</h1>
    </div>

    {/* Ternary: Show + Box & Buttons Until Image is Selected */}
    {!selectedImage ? (
      <div style={{ padding: "20px", color: "black" }}>
        {/* + Box (Click to Open Modal) */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "20px" }}>
          <div
            style={{
              width: "250px",
              height: "250px",
              backgroundColor: "#f3f3f3",
              border: "2px dashed #999",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",cursor: finalSelectedImages.length > 0 ? "pointer" : "not-allowed", // ✅ Disable if dashboard is empty
              opacity: finalSelectedImages.length > 0 ? 1 : 0.5, // ✅ Dim if empty
            }}
            onClick={handleOpenModal}
          >
           
          
            <FaPlus size={50} color="#999" />
          </div>
        </div>
        {/* <ImageSelectModal isOpen={isModalOpen}onClose={()=>setIsModalOpen(false)} /> */}
        {isModalOpen && (
  <div
    style={{
      position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#fff",
            padding: "20px",
            border: "1px solid #ccc",
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            zIndex: 1000,
            display: "flex",
            width: "500px", // Adjust modal width
            height: "300px", // Adjust modal height
    }}
  >
      {/* Left SIDE: Selected Image Preview */}
          <div style={{ flex: 1, padding: "10px", borderRight: "1px solid #ddd", overflowY: "auto" }}>
            <h3>Select an Image</h3>
            {finalSelectedImages.length > 0 ? (
              finalSelectedImages.map((file, index) => {
                const imageUrl = URL.createObjectURL(file);
                return (
                  <p
                    key={index}
                    style={{
                      fontSize: "16px",
                      marginBottom: "5px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      color: selectedImage === imageUrl ? "blue" : "black", // Highlight selected
                    }}
                    onClick={() => setSelectedModalImage(imageUrl)} // ✅ Show image in modal first // ✅ Set image globally in context
                  >
                    {file.name}
                  </p>
                );
              })
            ) : (
              <p>No images uploaded yet.</p>
            )}
          </div>

          {/* RIGHT SIDE: Selected Image Preview */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
           {selectedModalImage ? (
        <img
          src={selectedModalImage}
          alt="Selected Preview"
          style={{
            width: "150px", // Make image slightly bigger
            height: "150px",
            objectFit: "contain",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
            ) : (
              <p style={{ fontSize: "14px", color: "#666" }}>Click a name to preview</p>
            )}
          </div>

    {/* Close Button */}
    <button
            onClick={handleCloseModal} // ✅ Only updates global state when modal closes
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              padding: "5px 10px",
              background: "red",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            open
          </button>
        </div>
      )}
   

        {/* Buttons Outside the Box (to the right) */}


        <div
          style={{
            marginLeft: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <button
  style={{
    backgroundColor: "#3083F9",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
  }}
  onClick={handleOpenModal} // ✅ SAME FUNCTION AS +
>
  Select Image
</button>
{/* The Modal */}
{isModalOpen && (
  <div
    style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "#fff",
      padding: "20px",
      border: "1px solid #ccc",
      boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
      zIndex: 1000,
      display: "flex",
      width: "500px",
      height: "300px",
    }}
  >
    {/* Left Side: Image Names */}
    <div style={{ flex: 1, padding: "10px", borderRight: "1px solid #ddd", overflowY: "auto" }}>
      <h3>Select an Image</h3>
      {finalSelectedImages.length > 0 ? (
        finalSelectedImages.map((file, index) => {
          const imageUrl = URL.createObjectURL(file);
          return (
            <p
              key={index}
              style={{
                fontSize: "16px",
                marginBottom: "5px",
                fontWeight: "bold",
                cursor: "pointer",
                color: selectedModalImage === imageUrl ? "blue" : "black",
              }}
              onClick={() => setSelectedModalImage(imageUrl)}
            >
              {file.name}
            </p>
          );
        })
      ) : (
        <p>No images uploaded yet.</p>
      )}
    </div>

    {/* Right Side: Selected Image Preview */}
    <div
      style={{
        flex: 1,
        padding: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {selectedModalImage ? (
        <img
          src={selectedModalImage}
          alt="Selected Preview"
          style={{
            width: "150px",
            height: "150px",
            objectFit: "contain",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      ) : (
        <p style={{ fontSize: "14px", color: "#666" }}>Click a name to preview</p>
      )}
    </div>

    {/* Open Button */}
    <button
      onClick={handleCloseModal}
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        padding: "5px 10px",
        background: "red",
        color: "white",
        border: "none",
        cursor: "pointer",
      }}
    >
      Open
    </button>
  </div>
)}

          <button
            style={{
              backgroundColor: "#3083F9",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Select Object
          </button>
        </div>

       
        
 
      </div>
    ) : (
      <>
       
        <div style={{ display: "flex", gap: "20px" }}>
         
          {/* Left Column: Selected Image */}
          <div
            style={{
              width: "250px",
              height: "250px",
              border: "1px solid #ccc",
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Selected"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            ) : null}
          </div>

          {/* Right Column: Info & Action Buttons */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <p>
              <strong>{selectedFileInfo?.name || "UnknownFile.jpg"}</strong>
              {fileSizeMB}
            </p>
            <button
              onClick={handleIsolateSubject}
              style={{ width: "150px", padding: "8px", color: "black" }}
            >
              Isolate Subject
            </button>
            <button
              onClick={openMaskEditor}
              style={{ width: "150px", padding: "8px", color: "black" }}
            >
              Manual Mask
            </button>
            <button
              style={{ width: "150px", padding: "8px", color: "black" }}
            >
              Create New Object
            </button>
            <button
              style={{ width: "150px", padding: "8px", color: "black" }}
            >
              Add to Object Family
            </button>
          </div>
        </div>

        {/* Manual Mask Editor Modal */}
        {isMaskEditorOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div style={{ backgroundColor: "white", padding: "20px" }}>
              <h2>Manual Mask Editor</h2>
              <div
                style={{
                  position: "relative",
                  width: "500px",
                  height: "500px",
                  backgroundColor: "white",
                }}
              >
                <img
                  src={imageUrl}
                  alt="For Masking"
                  style={{
                    position: "absolute",
                    width: "500px",
                    height: "500px",
                    objectFit: "contain",
                    border: "1px solid #ccc",
                    zIndex: 1,
                  }}
                />
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
              <div
                style={{ marginTop: "10px", display: "flex", gap: "10px" }}
              >
                <button
                  onClick={handleManualMask}
                  style={{ width: "150px", padding: "8px", color: "black" }}
                >
                  Apply Mask
                </button>
                <button
                  onClick={() => setIsMaskEditorOpen(false)}
                  style={{ width: "150px", padding: "8px", color: "black" }}
                >
                  Close Editor
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )}
  </div>
);
}
