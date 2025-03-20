
"use client";
import React, { useContext, useState, useRef, useEffect } from "react";
import CanvasDraw from "react-canvas-draw";
import { ImageContext } from "@/contexts/ImageContext";
import { FaPlus, FaTimes } from "react-icons/fa";
import { Box } from "@chakra-ui/react"; // Import Chakra UI Box
import "./SearchFor.css";

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

// Helper function to convert a data URL to a File object
function dataURLtoFile(dataUrl, filename) {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export default function SearchFor() {
  // Access finalSelectedImages and fileFrames from ImageContext
  const { finalSelectedImages, fileFrames } = useContext(ImageContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModalImage, setSelectedModalImage] = useState(null); // Temporary state for modal selection
  const [selectedFile, setSelectedFile] = useState(null); // Store the selected file object
  const [boxes, setBoxes] = useState([
    { id: Date.now(), selectedImage: null, imageUrl: null, baseImageUrl: null, imgWidth: 0, imgHeight: 0, fileName: "", fileSize: 0 },
  ]);
  const [response, setResponse] = useState("");
  const [isMaskEditorOpen, setIsMaskEditorOpen] = useState(false);
  const [currentBoxId, setCurrentBoxId] = useState(null); // Track which box is being edited
  const [showFileInfoModal, setShowFileInfoModal] = useState(false); // State for File Info Modal
  const [showOpenFileModal, setShowOpenFileModal] = useState(false); // State for Open File Modal
  const canvasRef = useRef(null);

  // Log boxes state changes for debugging
  useEffect(() => {
    console.log("Boxes state changed:", boxes.map(box => ({ id: box.id, selectedImage: box.selectedImage, fileName: box.fileName })));
  }, [boxes]);

  // Log fileFrames to verify its contents
  useEffect(() => {
    console.log("fileFrames from ImageContext:", fileFrames);
  }, [fileFrames]);

  // Composite each box's image when selected
  const handleImageComposite = (imageUrl, boxId) => {
    console.log(`Starting image composite for box ${boxId} with image: ${imageUrl}`);
    const tempImg = new Image();
    tempImg.onload = () => {
      compositeImageOnWhite(imageUrl)
        .then((compositedUrl) => {
          setBoxes((prevBoxes) => {
            const newBoxes = JSON.parse(JSON.stringify(prevBoxes));
            const boxIndex = newBoxes.findIndex((box) => box.id === boxId);
            if (boxIndex !== -1) {
              newBoxes[boxIndex] = {
                ...newBoxes[boxIndex],
                imageUrl: compositedUrl,
                baseImageUrl: compositedUrl,
                imgWidth: tempImg.width,
                imgHeight: tempImg.height,
              };
            }
            console.log(`Composited image for box ${boxId}: ${compositedUrl}`);
            console.log("Updated boxes after composite:", newBoxes);
            return newBoxes;
          });
        })
        .catch((error) => {
          console.error("Error compositing image on white:", error);
          setBoxes((prevBoxes) => {
            const newBoxes = JSON.parse(JSON.stringify(prevBoxes));
            const boxIndex = newBoxes.findIndex((box) => box.id === boxId);
            if (boxIndex !== -1) {
              newBoxes[boxIndex] = {
                ...newBoxes[boxIndex],
                imageUrl: imageUrl,
                baseImageUrl: imageUrl,
                imgWidth: tempImg.width,
                imgHeight: tempImg.height,
              };
            }
            console.log(`Fallback to original image for box ${boxId}: ${imageUrl}`);
            console.log("Updated boxes after composite fallback:", newBoxes);
            return newBoxes;
          });
        });
    };
    tempImg.src = imageUrl;
  };

  // Open the modal and store the boxId
  const handleOpenModal = (boxId) => {
    if (finalSelectedImages.length > 0) {
      setCurrentBoxId(boxId); // Store the boxId
      setIsModalOpen(true);
      console.log(`Opening modal for box ${boxId}`);
    } else {
      alert("You must complete the upload process before clicking!");
    }
  };

  // Close the modal and apply the selected image or frame to the box
  const handleCloseModal = (boxId) => {
    console.log("handleCloseModal called with boxId:", boxId);
    console.log("selectedModalImage:", selectedModalImage);
    console.log("selectedFile:", selectedFile);
    console.log("Current boxes:", boxes);

    if (selectedModalImage && selectedFile) {
      setBoxes((prevBoxes) => {
        const newBoxes = JSON.parse(JSON.stringify(prevBoxes));
        const boxIndex = newBoxes.findIndex((box) => box.id === boxId);
        if (boxIndex !== -1) {
          newBoxes[boxIndex] = {
            ...newBoxes[boxIndex],
            selectedImage: selectedModalImage,
            fileName: selectedFile.name,
            fileSize: selectedFile.size,
          };
        } else {
          console.error(`Box with ID ${boxId} not found in boxes!`);
        }
        console.log(`Setting selectedImage for box ${boxId} to: ${selectedModalImage}`);
        console.log(`Selected file for box ${boxId}: ${selectedFile.name}, ${selectedFile.size} bytes`);
        return newBoxes;
      });
      handleImageComposite(selectedModalImage, boxId);
      setBoxes((prevBoxes) => {
        const newBoxes = [
          ...JSON.parse(JSON.stringify(prevBoxes)),
          { id: Date.now(), selectedImage: null, imageUrl: null, baseImageUrl: null, imgWidth: 0, imgHeight: 0, fileName: "", fileSize: 0 },
        ];
        console.log(`Closed modal for box ${boxId}, new box added with ID ${Date.now()}. Current boxes:`, newBoxes);
        return newBoxes;
      });
    } else {
      console.warn("No image or frame selected! selectedModalImage or selectedFile is null.");
    }
    setIsModalOpen(false);
    setSelectedModalImage(null);
    setSelectedFile(null);
  };

  const handleIsolateSubject = async (boxId) => {
    console.log(`Isolating subject for box ${boxId}`);
    const box = boxes.find((box) => box.id === boxId);
    if (!box) {
      console.error(`Box with ID ${boxId} not found in boxes:`, boxes);
      alert("Box not found!");
      return;
    }
    if (!box.baseImageUrl) {
      console.error(`No baseImageUrl for box ${boxId}:`, box);
      alert("No image selected!");
      return;
    }
    console.log(`Sending baseImageUrl for box ${boxId}: ${box.baseImageUrl}`);
    try {
      const imageRes = await fetch(box.baseImageUrl);
      const imageBlob = await imageRes.blob();
      const formData = new FormData();
      formData.append("file", imageBlob, "base.png");
      console.log(`:rocket: Sending image to FastAPI for isolation for box ${boxId}...`);
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
        setBoxes((prevBoxes) => {
          const newBoxes = JSON.parse(JSON.stringify(prevBoxes));
          const boxIndex = newBoxes.findIndex((box) => box.id === boxId);
          if (boxIndex !== -1) {
            newBoxes[boxIndex] = {
              ...newBoxes[boxIndex],
              imageUrl: processedUrl,
              baseImageUrl: processedUrl,
            };
          }
          console.log(`Updated box ${boxId} with processed image: ${processedUrl}`);
          console.log("Updated boxes after isolate:", newBoxes);
          return newBoxes;
        });
      }
    } catch (error) {
      console.error(":x: Error:", error);
      setResponse(`Error: ${error.message}`);
    }
  };

  const openMaskEditor = (boxId) => {
    setCurrentBoxId(boxId);
    setIsMaskEditorOpen(true);
    console.log(`Opening mask editor for box ${boxId}, currentBoxId set to: ${boxId}`);
  };

  const handleManualMask = async () => {
    console.log(`Applying mask for box ${currentBoxId}`);
    const box = boxes.find((box) => box.id === currentBoxId);
    if (!box) {
      alert("Box not found!");
      console.error(`Box with ID ${currentBoxId} not found in boxes:`, boxes);
      return;
    }
    if (!box.baseImageUrl) {
      alert("No image available for masking!");
      console.error(`No baseImageUrl for box ${currentBoxId}:`, box);
      return;
    }
    console.log(`Sending baseImageUrl for box ${currentBoxId}: ${box.baseImageUrl}`);
    if (!canvasRef.current) {
      alert("Drawing canvas not ready.");
      console.error("Canvas ref not ready:", canvasRef.current);
      return;
    }
    const rawMaskDataUrl = canvasRef.current.getDataURL("png");
    const processedMaskDataUrl = await convertRedMaskToBinary(rawMaskDataUrl);
    canvasRef.current.clear();
    try {
      const imageRes = await fetch(box.baseImageUrl);
      const imageBlob = await imageRes.blob();
      const maskRes = await fetch(processedMaskDataUrl);
      const maskBlob = await maskRes.blob();
      const formData = new FormData();
      formData.append("image", imageBlob, "base.png");
      formData.append("mask", maskBlob, "mask.png");
      console.log(`:rocket: Sending image and processed mask to FastAPI for box ${currentBoxId}...`);
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
        setBoxes((prevBoxes) => {
          const newBoxes = JSON.parse(JSON.stringify(prevBoxes));
          const boxIndex = newBoxes.findIndex((box) => box.id === currentBoxId);
          if (boxIndex !== -1) {
            newBoxes[boxIndex] = {
              ...newBoxes[boxIndex],
              imageUrl: processedUrl,
              baseImageUrl: processedUrl,
            };
          }
          console.log(`Updated box ${currentBoxId} with processed image: ${processedUrl}`);
          console.log("Updated boxes after manual mask:", newBoxes);
          return newBoxes;
        });
      }
    } catch (error) {
      console.error(":x: Error:", error);
      setResponse(`Error: ${error.message}`);
    }
  };

  const handleRemoveBox = (boxId) => {
    setBoxes((prevBoxes) => {
      const newBoxes = prevBoxes.filter((box) => box.id !== boxId);
      console.log(`Removed box with ID ${boxId}. Remaining boxes:`, newBoxes);
      return newBoxes;
    });
  };

  return (
    <div style={{ padding: "20px", color: "black" }}>
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

      <div style={{ padding: "20px", color: "black" }}>
        {/* Outer container for all boxes */}
        <Box
          border="1px solid #ccc"
          borderRadius="5px"
          padding="10px"
          maxHeight="500px"
          overflowY="auto"
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "20px" }}>
            {boxes.map((box) => (
              <Box
                key={box.id}
                bg="gray.300" // Slightly darker grey for the outer rectangle
                borderRadius="5px"
                padding="10px"
                display="flex"
                alignItems="center"
                gap="20px"
              >
                {!box.selectedImage ? (
                  <Box
                    width="250px"
                    height="150px" // Rectangle dimensions
                    bg="gray.200" // Grey background
                    _hover={{ bg: "blue.100" }} // Light blue on hover
                    border="2px dashed #999"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    cursor={finalSelectedImages.length > 0 ? "pointer" : "not-allowed"}
                    opacity={finalSelectedImages.length > 0 ? 1 : 0.5}
                    onClick={() => handleOpenModal(box.id)}
                  >
                    <FaPlus size={50} color="white" /> {/* White + icon */}
                  </Box>
                ) : (
                  <div style={{ display: "flex", gap: "20px", position: "relative" }}>
                    <div
                      style={{
                        width: "250px",
                        height: "250px",
                        border: "1px solid #ccc",
                      }}
                    >
                      {box.imageUrl ? (
                        <img
                          src={box.imageUrl}
                          alt={`Selected for box ${box.id}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      ) : null}
                    </div>

                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <p>
                        <strong>{box.fileName || "UnknownFile.jpg"}</strong>
                        <br />
                        {box.fileSize ? `${(box.fileSize / (1024 * 1024)).toFixed(2)} MB` : "0 MB"}
                      </p>
                      <p
                        style={{ color: "#3083F9", cursor: "pointer" }}
                        onClick={() => setShowFileInfoModal(true)}
                      >
                        File Info
                      </p>
                      <p
                        style={{ color: "#3083F9", cursor: "pointer" }}
                        onClick={() => setShowOpenFileModal(true)}
                      >
                        Open File
                      </p>
                      <button
                        onClick={() => handleIsolateSubject(box.id)}
                        style={{ width: "150px", padding: "8px", color: "black" }}
                      >
                        Isolate Subject
                      </button>
                      <button
                        onClick={() => openMaskEditor(box.id)}
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
                      <button
                        onClick={() => handleRemoveBox(box.id)}
                        style={{
                          position: "absolute",
                          top: "-10px",
                          right: "-10px",
                          background: "red",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  </div>
                )}

                {!box.selectedImage && (
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
                      onClick={() => handleOpenModal(box.id)}
                    >
                      Select Image
                    </button>
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
                )}

                {/* Modal for selecting images or frames */}
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
                    {/* Left Side: Image and Frame Names */}
                    <div
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRight: "1px solid #ddd",
                        overflowY: "auto",
                      }}
                    >
                      <h3>Select an Image or Frame</h3>
                      {finalSelectedImages.length > 0 ? (
                        finalSelectedImages.flatMap((file, index) => {
                          // Generate a unique file ID for videos
                          const fileId = `${file.name}-${file.lastModified}`;
                          console.log(`Processing file: ${file.name}, type: ${file.type}, fileId: ${fileId}`);

                          // Check if the file is a video
                          if (file.type.startsWith("video/")) {
                            // Get the frames for this video from fileFrames
                            const frames = fileFrames[fileId]?.frames || [];
                            console.log(`Frames for ${file.name} (fileId: ${fileId}):`, frames);

                            // If no frames are available, show a placeholder
                            if (frames.length === 0) {
                              return (
                                <p
                                  key={`${fileId}-no-frames`}
                                  style={{
                                    fontSize: "14px",
                                    marginBottom: "5px",
                                    color: "gray",
                                  }}
                                >
                                  No frames available for {file.name}
                                </p>
                              );
                            }

                            // Map each frame to a selectable item
                            return frames.map((frame, frameIndex) => {
                              // Convert the frame data URL to a File object
                              const frameFile = dataURLtoFile(
                                frame,
                                `${file.name}-frame-${frameIndex + 1}.jpg`
                              );
                              const frameUrl = URL.createObjectURL(frameFile);
                              console.log(`Frame ${frameIndex + 1} for ${file.name}: ${frameUrl}`);

                              return (
                                <p
                                  key={`${fileId}-frame-${frameIndex}`}
                                  style={{
                                    fontSize: "16px",
                                    marginBottom: "5px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    color: selectedModalImage === frameUrl ? "blue" : "black",
                                  }}
                                  onClick={() => {
                                    console.log(`Selected frame ${frameIndex + 1} for ${file.name}: ${frameUrl}`);
                                    setSelectedModalImage(frameUrl);
                                    setSelectedFile(frameFile); // Store the frame as a File object
                                  }}
                                >
                                  {`${file.name} - Frame ${frameIndex + 1}`}
                                </p>
                              );
                            });
                          } else {
                            // Handle images (non-videos)
                            const imageUrl = URL.createObjectURL(file);
                            console.log(`Image: ${file.name}, URL: ${imageUrl}`);

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
                                onClick={() => {
                                  console.log(`Selected image: ${file.name}, URL: ${imageUrl}`);
                                  setSelectedModalImage(imageUrl);
                                  setSelectedFile(file); // Store the file object
                                }}
                              >
                                {file.name}
                              </p>
                            );
                          }
                        })
                      ) : (
                        <p>No images or frames available.</p>
                      )}
                    </div>

                    {/* Right Side: Selected Image/Frame Preview */}
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
                      onClick={() => handleCloseModal(currentBoxId)}
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
              </Box>
            ))}
          </div>
        </Box>
      </div>

      {showFileInfoModal && (
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
          }}
        >
          <h3>File Info</h3>
          <p>I am a modal for file info</p>
          <button onClick={() => setShowFileInfoModal(false)}>Close</button>
        </div>
      )}

      {showOpenFileModal && (
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
          }}
        >
          <h3>Open File</h3>
          <p>I am a modal for open files</p>
          <button onClick={() => setShowOpenFileModal(false)}>Close</button>
        </div>
      )}

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
              {boxes.find((box) => box.id === currentBoxId)?.imageUrl ? (
                <img
                  src={boxes.find((box) => box.id === currentBoxId).imageUrl}
                  alt={`For Masking box ${currentBoxId}`}
                  style={{
                    position: "absolute",
                    width: "500px",
                    height: "500px",
                    objectFit: "contain",
                    border: "1px solid #ccc",
                    zIndex: 1,
                  }}
                />
              ) : (
                <p>No image available for masking</p>
              )}
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
    </div>
  );
}