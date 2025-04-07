


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
import zipfile
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
FRAME_DIR = "frames"
SAVED_FRAMES_DIR = "saved_frames"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(FRAME_DIR, exist_ok=True)
os.makedirs(SAVED_FRAMES_DIR, exist_ok=True)

app.mount("/frames", StaticFiles(directory="frames"), name="frames")
app.mount("/saved_frames", StaticFiles(directory="saved_frames"), name="saved_frames")

def remove_background_rembg(input_path: str, output_path: str) -> str:
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

def ensure_solid_background(frame_path: str) -> str:
    """
    Ensure the frame has a solid white background using OpenCV.
    """
    try:
        img = cv2.imread(frame_path, cv2.IMREAD_UNCHANGED)
        if img is None:
            raise ValueError("Failed to read frame image.")

        # If the image has an alpha channel (4 channels), composite it onto a white background
        if len(img.shape) == 3 and img.shape[2] == 4:
            white_bg = np.ones((img.shape[0], img.shape[1], 3), dtype=np.uint8) * 255
            alpha = img[:, :, 3] / 255.0
            for c in range(3):
                white_bg[:, :, c] = (white_bg[:, :, c] * (1 - alpha) + img[:, :, c] * alpha).astype(np.uint8)
            cv2.imwrite(frame_path, white_bg)
        else:
            # If no alpha channel, just save the image as-is (should already be RGB)
            cv2.imwrite(frame_path, img)
        return frame_path
    except Exception as e:
        raise ValueError(f"Error ensuring solid background: {e}")

@app.post("/process-image")
async def process_image(file: UploadFile = File(...)):
    file_location = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
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
        mask_filename = f"mask_{image.filename}_{int(time.time())}"
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
    save_frames: bool = Form(True)
):
    try:
        video_id = str(uuid.uuid4())
        base_filename = os.path.basename(file.filename)
        video_path = Path(UPLOAD_FOLDER) / f"{video_id}_{base_filename}"
        with video_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Ensure the frames directory and subdirectory exist
        frame_output_dir = Path(FRAME_DIR) / video_id
        frame_output_dir.mkdir(parents=True, exist_ok=True)

        transcoded_video = frame_output_dir / "transcoded.mp4"
        try:
            stream = ffmpeg.input(str(video_path))
            stream = ffmpeg.output(
                stream,
                str(transcoded_video),
                vcodec="libx264",
                acodec="copy",
                pix_fmt="yuv420p",
                colorspace="bt709",
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
        total_frames = metadata["total_frames"]
        frame_rate = metadata["frame_rate"]

        frames = []
        if timestamps:
            timestamps_list = [float(t.strip()) for t in timestamps.split(",") if t.strip()]
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
                        strict=-2
                    )
                    ffmpeg.run(stream, capture_stderr=True)

                    # Post-process the frame to ensure a solid background
                    ensure_solid_background(str(frame_filename))

                    frame_stat = os.stat(frame_filename)
                    frame_info = {
                        "timestamp": ts,
                        "frame_number": int(ts * frame_rate),
                        "size_bytes": frame_stat.st_size,
                        "resolution": f"{metadata['width']}x{metadata['height']}",
                        "url": f"http://localhost:8000/frames/{video_id}/frame_{ts:.3f}.jpg"
                    }
                    frames.append(frame_info)
                except ffmpeg.Error as e:
                    print(f"Failed to extract frame at timestamp {ts}: {e.stderr.decode()}")
                    continue
        else:
            # Extract exactly 10 unique frames by frame number
            num_frames_to_extract = 10
            if total_frames <= 0:
                raise Exception("Total frames is invalid")
            if total_frames < num_frames_to_extract:
                num_frames_to_extract = total_frames

            # Calculate frame indices to extract evenly spaced frames
            frame_interval = max(1, total_frames // (num_frames_to_extract + 1))
            frame_indices = [frame_interval * (i + 1) for i in range(num_frames_to_extract)]

            for i, frame_index in enumerate(frame_indices):
                frame_filename = frame_output_dir / f"frame_{i:03d}.jpg"
                try:
                    # Extract frame by frame number
                    stream = ffmpeg.input(str(transcoded_video))
                    stream = ffmpeg.output(
                        stream,
                        str(frame_filename),
                        vf=f"select='eq(n\\,{frame_index})'",
                        vframes=1,
                        format="image2",
                        update=1,
                        strict=-2
                    )
                    ffmpeg.run(stream, capture_stderr=True)

                    # Post-process the frame to ensure a solid background
                    ensure_solid_background(str(frame_filename))

                    frame_stat = os.stat(frame_filename)
                    # Calculate timestamp based on frame index
                    timestamp = frame_index / frame_rate
                    frame_info = {
                        "timestamp": round(timestamp, 2),
                        "frame_number": i + 1,
                        "size_bytes": frame_stat.st_size,
                        "resolution": f"{metadata['width']}x{metadata['height']}",
                        "url": f"http://localhost:8000/frames/{video_id}/frame_{i:03d}.jpg"
                    }
                    frames.append(frame_info)
                except ffmpeg.Error as e:
                    print(f"Failed to extract frame at index {frame_index}: {e.stderr.decode()}")
                    continue

        video_path.unlink()
        transcoded_video.unlink()

        return JSONResponse(content={
            "video_id": video_id,
            "video_metadata": metadata,
            "frames": frames
        })
    except Exception as e:
        print("Error in /extract-frames endpoint:")
        traceback.print_exc()
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/save-frame/")
async def save_frame(
    video_id: str = Form(...),
    timestamp: float = Form(...),
    frame_data: UploadFile = File(...)
):
    try:
        # Ensure the saved frames directory for this video exists
        saved_frame_dir = Path(SAVED_FRAMES_DIR) / video_id
        saved_frame_dir.mkdir(parents=True, exist_ok=True)

        # Save the frame
        frame_filename = saved_frame_dir / f"saved_frame_{timestamp:.3f}.jpg"
        with frame_filename.open("wb") as buffer:
            shutil.copyfileobj(frame_data.file, buffer)

        # Post-process the frame to ensure a solid background
        ensure_solid_background(str(frame_filename))

        frame_stat = os.stat(frame_filename)
        frame_info = {
            "timestamp": timestamp,
            "size_bytes": frame_stat.st_size,
            "url": f"http://localhost:8000/saved_frames/{video_id}/saved_frame_{timestamp:.3f}.jpg"
        }

        return JSONResponse(content={
            "message": "Frame saved successfully",
            "frame": frame_info
        })
    except Exception as e:
        print("Error in /save-frame endpoint:")
        traceback.print_exc()
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/get-saved-frames/{video_id}")
async def get_saved_frames(video_id: str):
    try:
        saved_frame_dir = Path(SAVED_FRAMES_DIR) / video_id
        if not saved_frame_dir.exists():
            return JSONResponse(content={"frames": []})

        frames = []
        for frame_file in saved_frame_dir.glob("saved_frame_*.jpg"):
            timestamp_str = frame_file.stem.replace("saved_frame_", "")
            timestamp = float(timestamp_str)
            frame_stat = os.stat(frame_file)
            frame_info = {
                "timestamp": timestamp,
                "size_bytes": frame_stat.st_size,
                "url": f"http://localhost:8000/saved_frames/{video_id}/{frame_file.name}"
            }
            frames.append(frame_info)

        frames.sort(key=lambda x: x["timestamp"])  # Sort by timestamp
        return JSONResponse(content={"frames": frames})
    except Exception as e:
        print("Error in /get-saved-frames endpoint:")
        traceback.print_exc()
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/save-database")
async def save_database(
    main_folder_name: str = Form(...),
    subfolders: list[UploadFile] = File(...)
):
    temp_dir = Path("temp_database")
    try:
        temp_dir.mkdir(exist_ok=True)
        main_folder_path = temp_dir / main_folder_name
        main_folder_path.mkdir(exist_ok=True)

        for subfolder_file in subfolders:
            subfolder_name, file_name = os.path.split(subfolder_file.filename)
            subfolder_path = main_folder_path / subfolder_name
            subfolder_path.mkdir(exist_ok=True, parents=True)
            file_path = subfolder_path / file_name
            with file_path.open("wb") as buffer:
                shutil.copyfileobj(subfolder_file.file, buffer)

        zip_filename = f"{main_folder_name}.zip"
        zip_path = temp_dir / zip_filename
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
            for root, _, files in os.walk(main_folder_path):
                for file in files:
                    file_path = Path(root) / file
                    arcname = str(file_path.relative_to(temp_dir))
                    zipf.write(file_path, arcname)

        response = FileResponse(
            path=zip_path,
            filename=zip_filename,
            media_type="application/zip",
            headers={
                "Content-Disposition": f"attachment; filename=\"{zip_filename}\"",
                "Content-Length": str(os.path.getsize(zip_path)),
            }
        )

        async def cleanup():
            await asyncio.sleep(2)
            if temp_dir.exists():
                shutil.rmtree(temp_dir, ignore_errors=True)
                print(f"Cleaned up {temp_dir}")

        asyncio.create_task(cleanup())
        return response
    except Exception as e:
        print(f"Error saving database: {e}")
        if temp_dir.exists():
            shutil.rmtree(temp_dir, ignore_errors=True)
        return JSONResponse(content={"error": str(e)}, status_code=500)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)