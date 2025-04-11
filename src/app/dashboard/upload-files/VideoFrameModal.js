

import React, { useState, useEffect, useRef } from "react";
import { FaBackward, FaForward, FaTimes, FaPlusCircle, FaInfoCircle } from "react-icons/fa";

const VideoFrameModal = ({ file, fileUrl, onClose, onFrameSelect }) => {
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [savedFrames, setSavedFrames] = useState([]);
  const [totalFrames, setTotalFrames] = useState(0);
  const [resolution, setResolution] = useState("N/A");
  const [showInfo, setShowInfo] = useState(false); // State for info tooltip
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = fileUrl;
      videoRef.current.load();
      console.log("Video reloaded with src =", fileUrl);

      videoRef.current.addEventListener("loadedmetadata", handleVideoLoadedMetadata);
      videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("loadedmetadata", handleVideoLoadedMetadata);
        videoRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [fileUrl]);

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
      const canvas = canvasRef.current;
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      setResolution(`${videoRef.current.videoWidth}x${videoRef.current.videoHeight}`);
      const frameRate = 30; // Assuming 30 fps; adjust if frame rate is available
      setTotalFrames(Math.floor(videoRef.current.duration * frameRate));
      console.log("Video loaded: duration =", videoRef.current.duration, "readyState =", videoRef.current.readyState);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      console.log("Time updated: currentTime =", videoRef.current.currentTime);
    }
  };

  const ensureVideoReady = async () => {
    if (videoRef.current && videoRef.current.readyState < 2) {
      console.log("Waiting for video to be ready...");
      await new Promise((resolve) => {
        videoRef.current.addEventListener("canplay", resolve, { once: true });
      });
      console.log("Video ready: readyState =", videoRef.current.readyState);
    }
  };

  const handleSeek = async (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      if (videoRef.current.readyState < 2) {
        await ensureVideoReady();
      }
      videoRef.current.currentTime = newTime;
      videoRef.current.pause();
      console.log("Range input: newTime =", newTime);
    } else {
      console.error("videoRef.current is not available for seek");
    }
  };

  const handleFastForward = async () => {
    if (videoRef.current) {
      const newTime = Math.min(currentTime + 5, videoDuration);
      setCurrentTime(newTime);
      await ensureVideoReady();
      videoRef.current.currentTime = newTime;
      videoRef.current.pause();
      console.log("Fast-forward: newTime =", newTime);
    } else {
      console.error("videoRef.current is not available for fast-forward");
    }
  };

  const handleRewind = async () => {
    if (videoRef.current) {
      const newTime = Math.max(currentTime - 5, 0);
      setCurrentTime(newTime);
      await ensureVideoReady();
      videoRef.current.currentTime = newTime;
      videoRef.current.pause();
      console.log("Rewind: newTime =", newTime);
    } else {
      console.error("videoRef.current is not available for rewind");
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const formatFrameNumber = (index) => {
    return `Frame ${String(index + 1).padStart(3, "0")}`; // e.g., "Frame 001"
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
    const frameNumber = savedFrames.length + 1; // Incremental frame number
    const fileName = `frame-${frameNumber}-${formatTime(currentTime).replace(":", "-")}.jpg`;
    const frameFile = dataURLtoFile(dataUrl, fileName);

    const frameInfo = {
      url: dataUrl,
      timestamp: currentTime,
      fileName: fileName,
      file: frameFile,
      frameNumber: frameNumber, // Store frame number
    };

    setSavedFrames((prev) => [...prev, frameInfo]);
    console.log("Frame saved:", frameInfo);
  };

  const handleFrameClick = (frame) => {
    onFrameSelect({
      fileUrl: frame.url,
      fileName: frame.fileName,
      file: frame.file,
      fileType: "image/jpeg",
    });
    onClose();
  };

  const toggleInfo = () => {
    setShowInfo((prev) => !prev);
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
        width: "800px",
        height: "500px",
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
          Select a Frame from {file.name} (Total Frames: {totalFrames})
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FaInfoCircle
            size={16}
            style={{ cursor: "pointer", color: "#007BFF" }}
            onClick={toggleInfo}
            title="Frame Selection Info"
          />
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
            <FaTimes size={16} />
          </button>
        </div>
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
        <div
          style={{
            width: "100%",
            height: "50%",
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
              // Removed transform: rotate(180deg) to fix upside-down videos
            }}
            muted
          >
            Your browser does not support the video tag.
          </video>
        </div>
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
            <FaBackward size={20} />
          </button>
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
            <FaForward size={20} />
          </button>
          <button
            onClick={handleSaveFrame}
            title="Save frame at current timestamp"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "5px",
              display: "flex",
              alignItems: "center",
              color: isHovered ? "#90EE90" : "#32CD32",
              transition: "color 0.3s ease",
            }}
          >
            <FaPlusCircle size={20} />
          </button>
        </div>
        <div
          style={{
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            maxHeight: "110px",
            overflowX: "auto",
            overflowY: "hidden",
            whiteSpace: "nowrap",
            backgroundColor: "#fff",
          }}
        >
          {savedFrames.length > 0 ? (
            savedFrames.map((frame, index) => (
              <div
                key={index}
                style={{
                  display: "inline-block",
                  position: "relative",
                  marginRight: "10px",
                  textAlign: "center",
                }}
                onClick={() => handleFrameClick(frame)}
              >
                <img
                  src={frame.url}
                  alt={`Saved frame ${formatFrameNumber(index)} at ${formatTime(frame.timestamp)}`}
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                />
                <div style={{ marginTop: "5px" }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.7rem",
                      color: "#000",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatFrameNumber(index)}
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.7rem",
                      color: "#555",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatTime(frame.timestamp)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p style={{ fontSize: "12px", color: "#666", textAlign: "center" }}>
              No frames saved yet.
            </p>
          )}
        </div>
      </div>
      <div
        style={{
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: "12px", color: "#666" }}>
          <p style={{ margin: "0 0 5px 0" }}>{file ? `File Name: ${file.name}` : "No file selected."}</p>
          <p style={{ margin: "0 0 5px 0" }}>{`File Size: ${((file?.size || 0) / (1024 * 1024)).toFixed(2)} MB`}</p>
          <p style={{ margin: "0 0 5px 0" }}>{`Resolution: ${resolution}`}</p>
          <p style={{ margin: "0 0 5px 0" }}>{`Duration: ${formatTime(videoDuration)}`}</p>
        </div>
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
      {showInfo && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            right: "50px",
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: "5px",
            padding: "10px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            zIndex: 1001,
            fontSize: "12px",
            color: "#333",
            maxWidth: "200px",
          }}
        >
          <p style={{ margin: 0 }}>
            Choose a frame to use: Click on the + icon to save your frame, then click on a frame you wish to view.
          </p>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default VideoFrameModal;