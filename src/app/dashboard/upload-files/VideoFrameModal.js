import React, { useState, useEffect, useRef } from "react";
import { FaBackward, FaForward, FaSave, FaCheck, FaTimes } from "react-icons/fa";

// Modal for video frame selection
const VideoFrameModal = ({ file, fileUrl, videoId, onClose, onFrameSelect }) => {
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [savedFrames, setSavedFrames] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const debounceTimer = useRef(null); // For debouncing fetch

  // Preload the video URL and fetch saved frames with debouncing
  useEffect(() => {
    setIsLoading(true);
    const fetchSavedFrames = async () => {
      try {
        const response = await fetch(`http://localhost:8000/get-saved-frames/${videoId}`);
        const data = await response.json();
        if (data.frames) {
          setSavedFrames(data.frames);
        }
      } catch (error) {
        console.error("Error fetching saved frames:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the fetch request to avoid multiple rapid calls
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(fetchSavedFrames, 100);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [videoId]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("loadedmetadata", handleVideoLoadedMetadata);
      videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("loadedmetadata", handleVideoLoadedMetadata);
        videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, []);

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
      const canvas = canvasRef.current;
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSeek = (event) => {
    const newTime = parseFloat(event.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleFastForward = () => {
    if (videoRef.current) {
      const newTime = Math.min(videoRef.current.currentTime + 5, videoDuration);
      setCurrentTime(newTime);
      videoRef.current.currentTime = newTime;
    }
  };

  const handleRewind = () => {
    if (videoRef.current) {
      const newTime = Math.max(videoRef.current.currentTime - 5, 0);
      setCurrentTime(newTime);
      videoRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleSaveFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    const fileName = `frame-${formatTime(currentTime).replace(":", "-")}.jpg`;
    const frameFile = dataURLtoFile(dataUrl, fileName);

    // Save the frame to the backend
    try {
      const formData = new FormData();
      formData.append("video_id", videoId);
      formData.append("timestamp", currentTime);
      formData.append("frame_data", frameFile, fileName);

      const response = await fetch("http://localhost:8000/save-frame/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save frame");
      }

      const data = await response.json();
      setSavedFrames((prev) => [...prev, data.frame]);
    } catch (error) {
      console.error("Error saving frame:", error);
    }
  };

  const handleFrameSelect = (frame) => {
    onFrameSelect({
      fileUrl: frame.url,
      fileName: `Frame_${formatTime(frame.timestamp)}`,
      fileSize: frame.size_bytes,
      fileType: "image/jpeg",
    });
    onClose();
  };

  const handleDeleteFrame = async (timestamp) => {
    try {
      // Send a DELETE request to the backend to remove the frame
      const response = await fetch(`http://localhost:8000/delete-frame/${videoId}/${timestamp}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete frame");
      }

      // Update the local state to remove the frame
      setSavedFrames((prev) => prev.filter((frame) => frame.timestamp !== timestamp));
    } catch (error) {
      console.error("Error deleting frame:", error);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        borderRadius: "8px",
        zIndex: 1000,
        width: "600px",
        height: "400px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 4px 15px rgba(0, 0, 123, 0.2)",
      }}
    >
      <div
        style={{
          width: "100%",
          backgroundColor: "#EEF2FF",
          borderRadius: "8px 8px 0 0",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: "40px",
        }}
      >
        <h3 style={{ color: "black", margin: 0, fontSize: "15px" }}>
          Select a Frame from {file.name}
        </h3>
        <button
          onClick={onClose}
          style={{
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
          }}
        >
          ×
        </button>
      </div>
      <div
        style={{
          display: "flex",
          flex: 1,
          padding: "10px",
          flexDirection: "column",
          backgroundColor: "#F9FBFF",
          overflow: "hidden",
        }}
      >
        {isLoading ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              color: "#666",
            }}
          >
            Loading...
          </div>
        ) : (
          <>
            <div
              style={{
                width: "100%",
                height: "200px",
                position: "relative",
              }}
            >
              <video
                ref={videoRef}
                src={fileUrl}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: "5px",
                }}
                muted
              >
                Your browser does not support the video tag.
              </video>
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  padding: "5px 0",
                }}
              >
                <button
                  onClick={handleRewind}
                  title="Rewind 5 seconds"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "5px",
                    display: "flex",
                    alignItems: "center",
                    color: "#007BFF",
                    transition: "color 0.3s ease",
                  }}
                >
                  <FaBackward size={16} />
                </button>
                <span style={{ color: "#000000", fontSize: "12px" }}>{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={videoDuration || 0}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  style={{
                    flex: 1,
                    cursor: "pointer",
                    accentColor: "#007BFF",
                  }}
                />
                <span style={{ color: "#000000", fontSize: "12px" }}>{formatTime(videoDuration)}</span>
                <button
                  onClick={handleFastForward}
                  title="Fast-forward 5 seconds"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "5px",
                    display: "flex",
                    alignItems: "center",
                    color: "#007BFF",
                    transition: "color 0.3s ease",
                  }}
                >
                  <FaForward size={16} />
                </button>
                <button
                  onClick={handleSaveFrame}
                  title="Save frame at current timestamp"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "5px",
                    display: "flex",
                    alignItems: "center",
                    color: "#007BFF",
                    transition: "color 0.3s ease",
                  }}
                >
                  <FaSave size={16} />
                </button>
              </div>
            </div>
            {savedFrames.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  maxHeight: "100px",
                  overflowY: "auto",
                  marginTop: "10px",
                  gap: "10px",
                  padding: "5px 0",
                  flexWrap: "wrap",
                }}
              >
                {savedFrames.map((frame, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      position: "relative",
                      padding: "5px",
                    }}
                  >
                    <img
                      src={frame.url}
                      alt={`Saved frame at ${formatTime(frame.timestamp)}`}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleFrameSelect(frame)}
                    />
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: "#555",
                        marginLeft: "5px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatTime(frame.timestamp)}
                    </span>
                    <button
                      onClick={() => handleFrameSelect(frame)}
                      title="Select this frame"
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "25px",
                        backgroundColor: "#007BFF",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontSize: "12px",
                        transition: "background-color 0.3s ease",
                      }}
                    >
                      <FaCheck size={12} />
                    </button>
                    <button
                      onClick={() => handleDeleteFrame(frame.timestamp)}
                      title="Delete this frame"
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        backgroundColor: "#FF0000",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontSize: "12px",
                        transition: "background-color 0.3s ease",
                      }}
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p
                style={{
                  fontSize: "12px",
                  color: "#666",
                  marginTop: "10px",
                  textAlign: "center",
                }}
              >
                No frames saved yet. Use the "Save Frame" button to capture frames.
              </p>
            )}
          </>
        )}
      </div>
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          justifyContent: "flex-end",
          padding: "10px 20px",
        }}
      >
        <button
          onClick={onClose}
          style={{
            padding: "8px 16px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#E0E7FF",
            color: "#0056D2",
            borderRadius: "20px",
            transition: "background-color 0.3s ease",
          }}
        >
          Cancel
        </button>
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default VideoFrameModal;