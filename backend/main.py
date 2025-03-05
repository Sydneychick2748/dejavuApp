
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
import shutil
import os
# Import rembg for background removal
from rembg import remove
app = FastAPI()
# Enable CORS so that your frontend (http://localhost:3000) can access the API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Specify your frontend URL
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
# Directory to store uploaded and processed images.
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
def remove_background_rembg(input_path: str, output_path: str) -> str:
    """
    Reads the image from input_path, uses rembg to remove the background,
    and writes the processed image to output_path.
    The output image will be in PNG format with the background removed.
    """
    try:
        # Read the image as bytes.
        with open(input_path, 'rb') as i:
            input_data = i.read()
        # Remove the background using rembg.
        output_data = remove(input_data)
        # Write the processed image (PNG) to the output path.
        with open(output_path, 'wb') as o:
            o.write(output_data)
        return output_path
    except Exception as e:
        raise ValueError(f"Error in background removal: {e}")
@app.post("/process-image")
async def process_image(file: UploadFile = File(...)):
    """
    Receives an image upload, uses rembg to remove its background,
    and returns the filename of the processed image.
    """
    # Save the uploaded file.
    file_location = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    # Define the processed image filename.
    processed_filename = f"processed_{os.path.splitext(file.filename)[0]}.png"
    processed_file = os.path.join(UPLOAD_FOLDER, processed_filename)
    try:
        remove_background_rembg(file_location, processed_file)
        print(f":white_check_mark: Processed image saved at {processed_file}")
        return {"filename": processed_filename, "message": f"Processing successful: {file.filename}"}
    except Exception as e:
        print(f":x: Error processing image: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)
@app.get("/get-image/{image_name}")
async def get_image(image_name: str):
    """
    Serves the requested image from the uploads folder.
    """
    file_path = os.path.join(UPLOAD_FOLDER, image_name)
    if os.path.exists(file_path):
        ext = image_name.split('.')[-1].lower()
        media_type = "image/png"  # Default to PNG.
        if ext in ["jpg", "jpeg"]:
            media_type = "image/jpeg"
        elif ext == "gif":
            media_type = "image/gif"
        return FileResponse(file_path, media_type=media_type)
    return JSONResponse(content={"error": "File not found"}, status_code=404)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)