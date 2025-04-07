"use client";
import React, { useContext, useState, useRef, useEffect, useMemo } from "react";
import CanvasDraw from "react-canvas-draw";
import { ImageContext } from "@/contexts/ImageContext";
import { FaPlus, FaTimes, FaUpload } from "react-icons/fa";
import { Box } from "@chakra-ui/react";
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
  const [selectedModalImage, setSelectedModalImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
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
  const [response, setResponse] = useState("");
  const [isMaskEditorOpen, setIsMaskEditorOpen] = useState(false);
  const [currentBoxId, setCurrentBoxId] = useState(null);
  const [showFileInfoModal, setShowFileInfoModal] = useState(false);
  const [showOpenFileModal, setShowOpenFileModal] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
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
            fileType: selectedFile.type,
          };
        } else {
          console.error(`Box with ID ${boxId} not found in boxes!`);
        }
        console.log(
          `Setting selectedImage for box ${boxId} to: ${selectedModalImage}`
        );
        console.log(
          `Selected file for box ${boxId}: ${selectedFile.name}, ${selectedFile.size} bytes`
        );
        return newBoxes;
      });
      if (!selectedFile.type.startsWith("video/") && !selectedFile.name.startsWith("Frame_")) {
        handleImageComposite(selectedModalImage, boxId);
      }
      setBoxes((prevBoxes) => {
        const newBoxes = [
          ...JSON.parse(JSON.stringify(prevBoxes)),
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
        ];
        console.log(
          `Closed modal for box ${boxId}, new box added with ID ${Date.now()}. Current boxes:`,
          newBoxes
        );
        return newBoxes;
      });
    } else {
      console.warn(
        "No image selected! selectedModalImage or selectedFile is null."
      );
    }
    setIsModalOpen(false);
    setSelectedModalImage(null);
    setSelectedFile(null);
    setUploadedImages([]);
    setSelectedImagePreview(null);
  };

  const handleImageUploadModal = (event) => {
    const files = Array.from(event.target.files).filter((file) =>
      file.type.startsWith("image/")
    );
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setUploadedImages((prev) => [...prev, ...newImages]);
    if (newImages.length > 0 && !selectedImagePreview) {
      setSelectedImagePreview(newImages[0].url);
      setSelectedModalImage(newImages[0].url);
      setSelectedFile(newImages[0].file);
    }
  };

  const handleSelectImage = (image) => {
    setSelectedImagePreview(image.url);
    setSelectedModalImage(image.url);
    setSelectedFile(image.file);
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
        <div style={modalStyle}>
          <div style={blueBarStyle}>
            <h3 style={{ color: "black", margin: 0, fontSize: 15 }}>
              Select a Search Image
            </h3>
            <button
              onClick={() => handleCloseModal(currentBoxId)}
              style={modalOpenButtonStyle}
            >
              ×
            </button>
          </div>
          <div style={modalContentStyle}>
            <div style={modalLeftPanelStyle}>
              <label style={uploadButtonStyle}>
                <FaUpload /> Upload Image
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUploadModal}
                  style={{ display: "none" }}
                />
              </label>
              {uploadedImages.length > 0 ? (
                uploadedImages.map((image, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "5px",
                      cursor: "pointer",
                      backgroundColor: selectedImagePreview === image.url ? "#E0E7FF" : "transparent",
                      color: selectedImagePreview === image.url ? "#0056D2" : "#000",
                    }}
                    onClick={() => handleSelectImage(image)}
                  >
                    {image.file.name}
                  </div>
                ))
              ) : (
                <p style={{ color: "#000", marginTop: "10px" }}>
                  No images uploaded yet.
                </p>
              )}
            </div>
            <div style={modalRightPanelStyle}>
              {selectedImagePreview ? (
                <img
                  src={selectedImagePreview}
                  alt="Selected Image"
                  style={{ maxWidth: "100%", maxHeight: "80%", objectFit: "contain", borderRadius: "5px" }}
                />
              ) : (
                <p style={{ color: "#000" }}>Select an image to preview</p>
              )}
            </div>
          </div>
          <div style={buttonContainerStyle}>
            <button onClick={() => handleCloseModal(currentBoxId)} style={cancelButtonStyle}>
              Cancel
            </button>
            <button
              onClick={() => handleCloseModal(currentBoxId)}
              style={openButtonStyle}
              disabled={!selectedImagePreview}
            >
              Open
            </button>
          </div>
        </div>
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

// Modal Styles
const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  borderRadius: "8px",
  zIndex: 1000,
  width: "900px",
  height: "500px",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 4px 15px rgba(0, 0, 123, 0.2)",
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

const modalContentStyle = {
  display: "flex",
  flex: 1,
  padding: "10px",
};

const modalLeftPanelStyle = {
  flex: 1,
  padding: "10px",
  overflowY: "auto",
  borderRight: "1px solid #ddd",
};

const modalRightPanelStyle = {
  flex: 1,
  padding: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#F9FBFF",
};

const modalOpenButtonStyle = {
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

const uploadButtonStyle = {
  padding: "8px 16px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#E0E7FF",
  color: "#0056D2",
  borderRadius: "20px",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  transition: "background-color 0.3s ease",
};

const openButtonStyle = {
  padding: "8px 16px",
  marginLeft: "10px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#007BFF",
  color: "#FFFFFF",
  width: "220px",
  borderRadius: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: "1",
  paddingTop: "6px",
  transition: "background-color 0.3s ease",
};

const cancelButtonStyle = {
  padding: "8px 16px",
  marginLeft: "10px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#E8E8E8",
  color: "black",
  width: "220px",
  borderRadius: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: "1",
  paddingTop: "6px",
  transition: "background-color 0.3s ease",
};

const buttonContainerStyle = {
  marginTop: "auto",
  display: "flex",
  justifyContent: "flex-end",
  padding: "10px 20px",
};

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