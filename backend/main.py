
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
import shutil
import os
import cv2
import numpy as np
from rembg import remove
import time
import ffmpeg
import base64
import uuid
from pathlib import Path
from fastapi.staticfiles import StaticFiles
import traceback

app = FastAPI()

# Enable CORS for your frontend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
FRAME_DIR = "frames"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(FRAME_DIR, exist_ok=True)

# Serve static frame files
app.mount("/frames", StaticFiles(directory="frames"), name="frames")

def remove_background_rembg(input_path: str, output_path: str) -> str:
    """
    Uses rembg to remove the background of the image, then composites the result
    over a white background so that there is no transparency.
    """
    try:
        with open(input_path, 'rb') as i:
            input_data = i.read()
        output_data = remove(input_data)
        
        temp_path = output_path.replace(".png", "_temp.png")
        with open(temp_path, 'wb') as o:
            o.write(output_data)
        
        img = cv2.imread(temp_path, cv2.IMREAD_UNCHANGED)
        if img is None:
            raise ValueError("Failed to read temporary image.")
        
        if img.shape[2] == 4:
            white_bg = np.ones((img.shape[0], img.shape[1], 3), dtype=np.uint8) * 255
            alpha = img[:, :, 3] / 255.0
            for c in range(3):
                white_bg[:, :, c] = (white_bg[:, :, c] * (1 - alpha) + img[:, :, c] * alpha).astype(np.uint8)
            cv2.imwrite(output_path, white_bg)
        else:
            cv2.imwrite(output_path, img)
        
        os.remove(temp_path)
        return output_path
    except Exception as e:
        raise ValueError(f"Error in background removal: {e}")

@app.post("/process-image")
async def process_image(file: UploadFile = File(...)):
    """
    Receives an image upload, uses rembg to remove its background,
    composites it over a white background, and returns the processed image filename.
    """
    file_location = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    # Generate a unique filename with timestamp
    timestamp = int(time.time())
    processed_filename = f"processed_{os.path.splitext(file.filename)[0]}_{timestamp}.png"
    processed_file = os.path.join(UPLOAD_FOLDER, processed_filename)
    try:
        remove_background_rembg(file_location, processed_file)
        print(f":white_check_mark: Processed image saved at {processed_file}")
        return {"filename": processed_filename, "message": f"Processing successful: {file.filename}"}
    except Exception as e:
        print(f":x: Error processing image: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)

def fill_mask(mask):
    _, thresh = cv2.threshold(mask, 127, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if contours:
        cv2.drawContours(thresh, contours, -1, 255, thickness=cv2.FILLED)
    return thresh

def remove_masked_area(image_path: str, mask_path: str, output_path: str) -> str:
    """
    Reads an image and a mask, fills in the mask if needed,
    applies a morphological closing operation to smooth the mask edges,
    and then sets the area indicated by the cleaned mask to white.
    """
    image = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)
    if image is None:
        raise ValueError("Could not load image")
    
    mask = cv2.imread(mask_path, cv2.IMREAD_GRAYSCALE)
    if mask is None:
        raise ValueError("Could not load mask")
    
    if mask.shape != image.shape[:2]:
        mask = cv2.resize(mask, (image.shape[1], image.shape[0]))
    
    mask_filled = fill_mask(mask)
    
    kernel = np.ones((3, 3), np.uint8)
    mask_clean = cv2.morphologyEx(mask_filled, cv2.MORPH_CLOSE, kernel)
    
    if image.shape[2] == 3:
        image = cv2.cvtColor(image, cv2.COLOR_BGR2BGRA)
    
    image[mask_clean == 255] = [255, 255, 255, 255]
    
    cv2.imwrite(output_path, image)
    return output_path

@app.post("/remove-area")
async def remove_area(
    image: UploadFile = File(...),
    mask: UploadFile = File(...)
):
    try:
        image_path = os.path.join(UPLOAD_FOLDER, image.filename)
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        mask_filename = f"mask_{image.filename}_{int(time.time())}"  # Unique mask filename
        mask_path = os.path.join(UPLOAD_FOLDER, mask_filename)
        with open(mask_path, "wb") as buffer:
            shutil.copyfileobj(mask.file, buffer)
        output_filename = f"edited_{os.path.splitext(image.filename)[0]}_{int(time.time())}.png"
        output_path = os.path.join(UPLOAD_FOLDER, output_filename)
        remove_masked_area(image_path, mask_path, output_path)
        print(f":white_check_mark: Processed image saved at {output_path}")
        return {"filename": output_filename, "message": "Processing successful"}
    except Exception as e:
        print(f":x: Error processing image: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/get-image/{image_name}")
async def get_image(image_name: str):
    file_path = os.path.join(UPLOAD_FOLDER, image_name)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="image/png")
    return JSONResponse(content={"error": "File not found"}, status_code=404)

# New endpoint for frame extraction
async def get_video_metadata(video_path):
    try:
        probe = ffmpeg.probe(str(video_path), select_streams="v:0")
        video_stream = probe["streams"][0]
        return {
            "duration": float(probe["format"]["duration"]),
            "frame_rate": eval(video_stream["r_frame_rate"]),
            "width": video_stream["width"],
            "height": video_stream["height"],
            "codec": video_stream["codec_name"],
            "total_frames": int(video_stream.get("nb_frames", 0))
        }
    except Exception as e:
        raise Exception(f"Error probing video: {str(e)}")

@app.post("/extract-frames/")
async def extract_frames(
    file: UploadFile = File(...),
    timestamps: str = Form(None),
    save_frames: bool = Form(False)
):
    try:
        video_id = str(uuid.uuid4())
        # Sanitize filename to remove webkitRelativePath and use only the base filename
        base_filename = os.path.basename(file.filename)  # Extracts "20250318_134632.mp4"
        video_path = Path(UPLOAD_FOLDER) / f"{video_id}_{base_filename}"
        with video_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Transcode the video to H.264 to ensure compatibility
        frame_output_dir = Path(FRAME_DIR) / video_id
        frame_output_dir.mkdir(exist_ok=True)
        transcoded_video = frame_output_dir / "transcoded.mp4"
        try:
            stream = ffmpeg.input(str(video_path))
            stream = ffmpeg.output(
                stream,
                str(transcoded_video),
                vcodec="libx264",
                acodec="copy",
                pix_fmt="yuv420p",  # Ensure 8-bit SDR output
                colorspace="bt709",  # Convert to sRGB/BT.709
                color_trc="bt709",
                color_primaries="bt709",
                preset="fast"
            )
            ffmpeg.run(stream, capture_stderr=True)
        except ffmpeg.Error as e:
            print(f"Error transcoding video: {e.stderr.decode()}")
            raise Exception(f"Failed to transcode video: {e.stderr.decode()}")

        metadata = await get_video_metadata(transcoded_video)
        video_duration = metadata["duration"]

        frames = []
        if timestamps:
            timestamps_list = [float(t.strip()) for t in timestamps.split(",") if t.strip()]
            # Filter timestamps to ensure they are within the video duration
            timestamps_list = [ts for ts in timestamps_list if ts <= video_duration]
            for ts in timestamps_list:
                frame_filename = frame_output_dir / f"frame_{ts:.3f}.jpg"
                try:
                    stream = ffmpeg.input(str(transcoded_video), ss=ts)
                    stream = ffmpeg.output(
                        stream,
                        str(frame_filename),
                        vframes=1,
                        format="image2",
                        update=1,
                        strict=-2  # Allow unofficial compliance for MJPEG
                    )
                    ffmpeg.run(stream, capture_stderr=True)

                    frame_stat = os.stat(frame_filename)
                    frame_info = {
                        "timestamp": ts,
                        "frame_number": int(ts * metadata["frame_rate"]),
                        "size_bytes": frame_stat.st_size,
                        "resolution": f"{metadata['width']}x{metadata['height']}"
                    }
                    if save_frames:
                        frame_info["url"] = f"http://localhost:8000/frames/{video_id}/frame_{ts:.3f}.jpg"
                    else:
                        with open(frame_filename, "rb") as f:
                            frame_info["data"] = f"data:image/jpeg;base64,{base64.b64encode(f.read()).decode('utf-8')}"
                    frames.append(frame_info)

                    if not save_frames:
                        frame_filename.unlink()
                except ffmpeg.Error as e:
                    print(f"Failed to extract frame at timestamp {ts}: {e.stderr.decode()}")
                    continue  # Skip this frame and continue with the next
        else:
            frame_pattern = str(frame_output_dir / "frame-%04d.jpg")
            stream = ffmpeg.input(str(transcoded_video))
            stream = ffmpeg.output(
                stream,
                frame_pattern,
                vf="fps=1",
                vsync="vfr",
                start_number=0,
                strict=-2
            )
            ffmpeg.run(stream, capture_stderr=True)

            for i, frame_file in enumerate(sorted(frame_output_dir.glob("frame-*.jpg"))):
                frame_stat = os.stat(frame_file)
                frame_info = {
                    "timestamp": i,
                    "frame_number": i * int(metadata["frame_rate"]),
                    "size_bytes": frame_stat.st_size,
                    "resolution": f"{metadata['width']}x{metadata['height']}"
                }
                if save_frames:
                    frame_info["url"] = f"http://localhost:8000/frames/{video_id}/frame-{i:04d}.jpg"
                else:
                    with open(frame_file, "rb") as f:
                        frame_info["data"] = f"data:image/jpeg;base64,{base64.b64encode(f.read()).decode('utf-8')}"
                frames.append(frame_info)

                if not save_frames:
                    frame_file.unlink()

        video_path.unlink()
        transcoded_video.unlink()
        if not save_frames:
            shutil.rmtree(frame_output_dir)

        return JSONResponse(content={
            "video_metadata": metadata,
            "frames": frames
        })
    except Exception as e:
        import traceback
        print("Error in /extract-frames endpoint:")
        traceback.print_exc()  # Print the full stack trace to the console
        return JSONResponse(content={"error": str(e)}, status_code=500)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)