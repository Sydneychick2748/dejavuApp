


"use client";
import React, { useContext, useState, useRef, useEffect, useMemo } from "react";
import CanvasDraw from "react-canvas-draw";
import { ImageContext } from "@/contexts/ImageContext";
import { FaPlus, FaTimes } from "react-icons/fa";
import { Box } from "@chakra-ui/react";
import ImageUploadModal from "./ImageUploadModal";
import "./searchFor.css";

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

// Memoized BoxItem component to prevent unnecessary re-renders
const BoxItem = React.memo(({ box, handleOpenModal, handleIsolateSubject, openMaskEditor, handleRemoveBox, setShowFileInfoModal, setShowOpenFileModal }) => {
  return (
    <Box
      key={box.id}
      bg="gray.300"
      borderRadius="5px"
      padding="10px"
      display="flex"
      alignItems="center"
      gap="20px"
      width="100%"
      marginBottom="10px"
      transition="all 0.3s ease"
    >
      {!box.selectedImage ? (
        <Box
          width="250px"
          height="150px"
          bg="gray.200"
          _hover={{ bg: "blue.100" }}
          border="2px dashed #999"
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          onClick={() => handleOpenModal(box.id)}
        >
          <FaPlus className="plus-icon" />
        </Box>
      ) : (
        <div className="image-content">
          <div className="image-wrapper" style={{ width: "250px", height: "150px", overflow: "hidden" }}>
            {box.imageUrl ? (
              box.fileType.startsWith("video/") ? (
                <video
                  src={box.imageUrl}
                  className="selected-video"
                  muted
                  controls={false}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={box.imageUrl}
                  alt={`Selected for box ${box.id}`}
                  className="selected-image"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )
            ) : (
              <div style={{ width: "100%", height: "100%", backgroundColor: "#ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                Loading...
              </div>
            )}
          </div>
          <div className="image-details">
            <div className="file-info-wrapper">
              <p className="file-info">
                <strong>{box.fileName || "UnknownFile.jpg"}</strong>
                <br />
                {box.fileSize
                  ? `${(box.fileSize / (1024 * 1024)).toFixed(2)} MB`
                  : "0 MB"}
              </p>
              <p
                className="file-info-link"
                onClick={() => setShowFileInfoModal(true)}
              >
                File Info
              </p>
              <p
                className="file-info-link"
                onClick={() => setShowOpenFileModal(true)}
              >
                Open File
              </p>
            </div>
            <div className="buttons-wrapper">
              <button
                onClick={() => handleIsolateSubject(box.id)}
                className="action-button"
              >
                Isolate Subject
              </button>
              <button
                onClick={() => openMaskEditor(box.id)}
                className="action-button"
              >
                Manual Mask
              </button>
              <button className="action-button">Create New Object</button>
              <button className="action-button">Add to Object Family</button>
              <button
                onClick={() => handleRemoveBox(box.id)}
                className="remove-button"
              >
                <FaTimes className="remove-icon" />
              </button>
            </div>
          </div>
        </div>
      )}

      {!box.selectedImage && (
        <div className="placeholder-actions">
          <button
            className="action-button"
            onClick={() => handleOpenModal(box.id)}
          >
            Upload External Image
          </button>
          <button className="action-button">Select Object from Library</button>
        </div>
      )}
    </Box>
  );
});

export default function SearchFor() {
  const { finalSelectedImages, fileFrames, selectedFileInfo } = useContext(ImageContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBoxId, setCurrentBoxId] = useState(null);
  const [response, setResponse] = useState("");
  const [isMaskEditorOpen, setIsMaskEditorOpen] = useState(false);
  const [showFileInfoModal, setShowFileInfoModal] = useState(false);
  const [showOpenFileModal, setShowOpenFileModal] = useState(false);
  const [boxes, setBoxes] = useState([
    {
      id: Date.now(),
      selectedImage: null,
      imageUrl: null,
      baseImageUrl: null,
      imgWidth: 0,
      imgHeight: 0,
      fileName: "",
      fileSize: 0,
      fileType: "",
    },
  ]);
  const [lastProcessedFile, setLastProcessedFile] = useState(null);
  const canvasRef = useRef(null);

  // Debounce the state update to reduce re-renders
  const pendingUpdate = useRef(null);

  useEffect(() => {
    if (selectedFileInfo && selectedFileInfo !== lastProcessedFile) {
      pendingUpdate.current = selectedFileInfo;
      setLastProcessedFile(selectedFileInfo);

      // Debounce the update to batch state changes
      const timer = setTimeout(() => {
        const fileInfo = pendingUpdate.current;
        if (!fileInfo) return;

        // Find the first empty box (the placeholder + box)
        const emptyBoxIndex = boxes.findIndex((box) => !box.selectedImage);

        setBoxes((prevBoxes) => {
          let newBoxes = [...prevBoxes];

          if (emptyBoxIndex !== -1) {
            // Replace the first empty box with the selected file info
            newBoxes[emptyBoxIndex] = {
              id: newBoxes[emptyBoxIndex].id,
              selectedImage: fileInfo.fileUrl,
              imageUrl: fileInfo.fileUrl,
              baseImageUrl: fileInfo.fileUrl,
              fileName: fileInfo.fileName,
              fileSize: fileInfo.fileSize,
              fileType: fileInfo.fileType,
              imgWidth: 0,
              imgHeight: 0,
            };
            // Add a new empty + box at the end
            newBoxes.push({
              id: Date.now(),
              selectedImage: null,
              imageUrl: null,
              baseImageUrl: null,
              imgWidth: 0,
              imgHeight: 0,
              fileName: "",
              fileSize: 0,
              fileType: "",
            });
          } else {
            // If no empty box exists, add the new file and a new empty + box
            newBoxes = [
              ...newBoxes,
              {
                id: Date.now(),
                selectedImage: fileInfo.fileUrl,
                imageUrl: fileInfo.fileUrl,
                baseImageUrl: fileInfo.fileUrl,
                fileName: fileInfo.fileName,
                fileSize: fileInfo.fileSize,
                fileType: fileInfo.fileType,
                imgWidth: 0,
                imgHeight: 0,
              },
              {
                id: Date.now() + 1,
                selectedImage: null,
                imageUrl: null,
                baseImageUrl: null,
                imgWidth: 0,
                imgHeight: 0,
                fileName: "",
                fileSize: 0,
                fileType: "",
              },
            ];
          }
          return newBoxes;
        });

        // Composite the image on a white background (only for non-frame images)
        if (!fileInfo.fileType.startsWith("video/") && !fileInfo.fileName.startsWith("Frame_")) {
          const boxIdToComposite = emptyBoxIndex !== -1 ? boxes[emptyBoxIndex].id : boxes[boxes.length - 2].id;
          handleImageComposite(fileInfo.fileUrl, boxIdToComposite);
        }

        pendingUpdate.current = null;
      }, 100); // Debounce for 100ms

      return () => clearTimeout(timer);
    }
  }, [selectedFileInfo, boxes]);

  useEffect(() => {
    console.log(
      "Boxes state changed:",
      boxes.map((box) => ({
        id: box.id,
        selectedImage: box.selectedImage,
        fileName: box.fileName,
      }))
    );
  }, [boxes]);

  useEffect(() => {
    console.log("fileFrames from ImageContext:", fileFrames);
  }, [fileFrames]);

  const handleImageComposite = (imageUrl, boxId) => {
    console.log(
      `Starting image composite for box ${boxId} with image: ${imageUrl}`
    );
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
            console.log(
              `Fallback to original image for box ${boxId}: ${imageUrl}`
            );
            console.log("Updated boxes after composite fallback:", newBoxes);
            return newBoxes;
          });
        });
    };
    tempImg.src = imageUrl;
  };

  const handleOpenModal = (boxId) => {
    setCurrentBoxId(boxId);
    setIsModalOpen(true);
    console.log(`Opening modal for box ${boxId}`);
  };

  const handleCloseModal = (boxId, imageInfo) => {
    if (imageInfo) {
      setBoxes((prevBoxes) => {
        const newBoxes = JSON.parse(JSON.stringify(prevBoxes));
        const boxIndex = newBoxes.findIndex((box) => box.id === boxId);
        if (boxIndex !== -1) {
          newBoxes[boxIndex] = {
            ...newBoxes[boxIndex],
            selectedImage: imageInfo.fileUrl,
            imageUrl: imageInfo.fileUrl,
            baseImageUrl: imageInfo.fileUrl,
            fileName: imageInfo.fileName,
            fileSize: imageInfo.fileSize,
            fileType: imageInfo.fileType,
            imgWidth: 0,
            imgHeight: 0,
          };
          // Add a new empty + box at the end
          newBoxes.push({
            id: Date.now(),
            selectedImage: null,
            imageUrl: null,
            baseImageUrl: null,
            imgWidth: 0,
            imgHeight: 0,
            fileName: "",
            fileSize: 0,
            fileType: "",
          });
        } else {
          console.error(`Box with ID ${boxId} not found in boxes!`);
        }
        console.log(
          `Setting selectedImage for box ${boxId} to: ${imageInfo.fileUrl}`
        );
        console.log(
          `Selected file for box ${boxId}: ${imageInfo.fileName}, ${imageInfo.fileSize} bytes`
        );
        return newBoxes;
      });
      if (!imageInfo.fileType.startsWith("video/") && !imageInfo.fileName.startsWith("Frame_")) {
        handleImageComposite(imageInfo.fileUrl, boxId);
      }
    } else {
      console.warn("No image selected!");
    }
    setIsModalOpen(false);
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
      console.log(
        `:rocket: Sending image to FastAPI for isolation for box ${boxId}...`
      );
      const res = await fetch("http://127.0.0.1:8000/dashboard/process-image", { // Updated route
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`Upload failed with status: ${res.status}`);
      const data = await res.json();
      console.log(":white_check_mark: Response from FastAPI:", data);
      setResponse(data.message);
      if (data.filename) {
        const processedUrl = `http://127.0.0.1:8000/dashboard/get-image/${encodeURIComponent( // Updated route
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
          console.log(
            `Updated box ${boxId} with processed image: ${processedUrl}`
          );
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
    console.log(
      `Opening mask editor for box ${boxId}, currentBoxId set to: ${boxId}`
    );
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
    console.log(
      `Sending baseImageUrl for box ${currentBoxId}: ${box.baseImageUrl}`
    );
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
      console.log(
        `:rocket: Sending image and processed mask to FastAPI for box ${currentBoxId}...`
      );
      const res = await fetch("http://127.0.0.1:8000/dashboard/remove-area", { // Updated route
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`Upload failed with status: ${res.status}`);
      const data = await res.json();
      console.log(":white_check_mark: Response from FastAPI:", data);
      setResponse(data.message);
      if (data.filename) {
        const processedUrl = `http://127.0.0.1:8000/dashboard/get-image/${encodeURIComponent( // Updated route
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
          console.log(
            `Updated box ${currentBoxId} with processed image: ${processedUrl}`
          );
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
    <div className="search-for-container">
      <div className="content">
        <Box
          border="1px solid #ccc"
          borderRadius="5px"
          padding="10px"
          height="100%"
          overflowY="auto"
          width="100%"
        >
          <div className="boxes-wrapper">
            <Box height="400px" overflowY="auto">
              {boxes.map((box) => (
                <BoxItem
                  key={box.id}
                  box={box}
                  handleOpenModal={handleOpenModal}
                  handleIsolateSubject={handleIsolateSubject}
                  openMaskEditor={openMaskEditor}
                  handleRemoveBox={handleRemoveBox}
                  setShowFileInfoModal={setShowFileInfoModal}
                  setShowOpenFileModal={setShowOpenFileModal}
                />
              ))}
            </Box>
          </div>
        </Box>
      </div>
      {showFileInfoModal && (
        <div style={nestedModalOverlayStyle}>
          <div style={nestedModalContentStyle}>
            <div style={blueBarStyle}>
              <h3 style={{ color: "black", margin: 0, fontSize: 15 }}>File Info</h3>
              <button
                onClick={() => setShowFileInfoModal(false)}
                style={nestedModalCloseButtonStyle}
              >
                ×
              </button>
            </div>
            <div style={nestedModalBodyStyle}>
              <p>I am a modal for file info</p>
            </div>
          </div>
        </div>
      )}
      {showOpenFileModal && (
        <div style={nestedModalOverlayStyle}>
          <div style={nestedModalContentStyle}>
            <div style={blueBarStyle}>
              <h3 style={{ color: "black", margin: 0, fontSize: 15 }}>Open File</h3>
              <button
                onClick={() => setShowOpenFileModal(false)}
                style={nestedModalCloseButtonStyle}
              >
                ×
              </button>
            </div>
            <div style={nestedModalBodyStyle}>
              <p>I am a modal for open files</p>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <ImageUploadModal
          onClose={() => setIsModalOpen(false)}
          onSelect={(imageInfo) => handleCloseModal(currentBoxId, imageInfo)}
        />
      )}
      {isMaskEditorOpen && (
        <div style={maskEditorOverlayStyle}>
          <div style={maskEditorContentStyle}>
            <div style={blueBarStyle}>
              <h3 style={{ color: "black", margin: 0, fontSize: 15 }}>Manual Mask Editor</h3>
              <button
                onClick={() => setIsMaskEditorOpen(false)}
                style={nestedModalCloseButtonStyle}
              >
                ×
              </button>
            </div>
            <div style={maskEditorBodyStyle}>
              <div style={{ position: "relative", width: "500px", height: "500px", backgroundColor: "white" }}>
                {boxes.find((box) => box.id === currentBoxId)?.imageUrl ? (
                  <img
                    src={boxes.find((box) => box.id === currentBoxId).imageUrl}
                    alt={`For Masking box ${currentBoxId}`}
                    style={{
                      position: "absolute",
                      width: "500px",
                      height: "500px",
                      objectFit: "cover",
                      borderRadius: "5px",
                      zIndex: 1,
                    }}
                  />
                ) : (
                  <p style={{ fontSize: "14px", color: "#666" }}>
                    No image available for masking
                  </p>
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
              <div className="canvas-actions">
                <button onClick={handleManualMask} className="action-button">
                  Apply Mask
                </button>
                <button
                  onClick={() => setIsMaskEditorOpen(false)}
                  className="action-button"
                >
                  Close Editor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Nested Modal Styles (File Info and Open File)
const nestedModalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1100,
};

const nestedModalContentStyle = {
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "0 4px 15px rgba(0, 0, 123, 0.2)",
  width: "300px",
  display: "flex",
  flexDirection: "column",
};

const nestedModalBodyStyle = {
  padding: "20px",
  color: "black",
};

const blueBarStyle = {
  width: "100%",
  backgroundColor: "#EEF2FF",
  borderRadius: "8px 8px 0 0",
  padding: "10px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  minHeight: "40px",
};

const nestedModalCloseButtonStyle = {
  width: "24px",
  height: "24px",
  backgroundColor: "white",
  borderRadius: "50%",
  border: "none",
  color: "black",
  fontSize: "16px",
  fontWeight: "400",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  padding: 0,
  transition: "background-color 0.3s ease",
};

// Mask Editor Modal Styles
const maskEditorOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const maskEditorContentStyle = {
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "0 4px 15px rgba(0, 0, 123, 0.2)",
  display: "flex",
  flexDirection: "column",
};

const maskEditorBodyStyle = {
  padding: "20px",
};
