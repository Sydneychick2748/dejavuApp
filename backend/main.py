
# from fastapi import FastAPI, File, UploadFile
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import FileResponse, JSONResponse
# import shutil
# import os
# # Import rembg for background removal
# from rembg import remove
# app = FastAPI()
# # Enable CORS so that your frontend (http://localhost:3000) can access the API.
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],  # Specify your frontend URL
#     allow_credentials=True,
#     allow_methods=["GET", "POST"],
#     allow_headers=["*"],
# )
# # Directory to store uploaded and processed images.
# UPLOAD_FOLDER = "uploads"
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# def remove_background_rembg(input_path: str, output_path: str) -> str:
#     """
#     Reads the image from input_path, uses rembg to remove the background,
#     and writes the processed image to output_path.
#     The output image will be in PNG format with the background removed.
#     """
#     try:
#         # Read the image as bytes.
#         with open(input_path, 'rb') as i:
#             input_data = i.read()
#         # Remove the background using rembg.
#         output_data = remove(input_data)
#         # Write the processed image (PNG) to the output path.
#         with open(output_path, 'wb') as o:
#             o.write(output_data)
#         return output_path
#     except Exception as e:
#         raise ValueError(f"Error in background removal: {e}")
# @app.post("/process-image")
# async def process_image(file: UploadFile = File(...)):
#     """
#     Receives an image upload, uses rembg to remove its background,
#     and returns the filename of the processed image.
#     """
#     # Save the uploaded file.
#     file_location = os.path.join(UPLOAD_FOLDER, file.filename)
#     with open(file_location, "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)
#     # Define the processed image filename.
#     processed_filename = f"processed_{os.path.splitext(file.filename)[0]}.png"
#     processed_file = os.path.join(UPLOAD_FOLDER, processed_filename)
#     try:
#         remove_background_rembg(file_location, processed_file)
#         print(f":white_check_mark: Processed image saved at {processed_file}")
#         return {"filename": processed_filename, "message": f"Processing successful: {file.filename}"}
#     except Exception as e:
#         print(f":x: Error processing image: {e}")
#         return JSONResponse(content={"error": str(e)}, status_code=500)
# @app.get("/get-image/{image_name}")
# async def get_image(image_name: str):
#     """
#     Serves the requested image from the uploads folder.
#     """
#     file_path = os.path.join(UPLOAD_FOLDER, image_name)
#     if os.path.exists(file_path):
#         ext = image_name.split('.')[-1].lower()
#         media_type = "image/png"  # Default to PNG.
#         if ext in ["jpg", "jpeg"]:
#             media_type = "image/jpeg"
#         elif ext == "gif":
#             media_type = "image/gif"
#         return FileResponse(file_path, media_type=media_type)
#     return JSONResponse(content={"error": "File not found"}, status_code=404)
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="127.0.0.1", port=8000)

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
import shutil
import os
import cv2
import numpy as np
from rembg import remove  # For background removal

app = FastAPI()

# Enable CORS so your frontend (http://localhost:3000) can access the API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Directory to store uploaded and processed images.
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ----------------------------
# REMBG BACKGROUND REMOVAL
# ----------------------------
def remove_background_rembg(input_path: str, output_path: str) -> str:
    """
    Uses rembg to remove the background of the image.
    """
    try:
        with open(input_path, 'rb') as i:
            input_data = i.read()
        output_data = remove(input_data)
        with open(output_path, 'wb') as o:
            o.write(output_data)
        return output_path
    except Exception as e:
        raise ValueError(f"Error in background removal: {e}")

@app.post("/process-image")
async def process_image(file: UploadFile = File(...)):
    """
    Endpoint to isolate the subject by removing the background with rembg.
    """
    file_location = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    processed_filename = f"processed_{os.path.splitext(file.filename)[0]}.png"
    processed_file = os.path.join(UPLOAD_FOLDER, processed_filename)
    try:
        remove_background_rembg(file_location, processed_file)
        print(f":white_check_mark: Processed image saved at {processed_file}")
        return {"filename": processed_filename, "message": f"Processing successful: {file.filename}"}
    except Exception as e:
        print(f":x: Error processing image: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)

# ----------------------------
# MANUAL MASK / REMOVE AREA
# ----------------------------
def fill_mask(mask):
    """
    If the mask contains only an outline, find contours and fill them.
    Returns a binary mask where the desired area is completely white.
    """
    _, thresh = cv2.threshold(mask, 127, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if contours:
        cv2.drawContours(thresh, contours, -1, 255, thickness=cv2.FILLED)
    return thresh

def remove_masked_area(image_path: str, mask_path: str, output_path: str) -> str:
    """
    Reads an image and a mask, fills the mask if it is just an outline,
    and then makes the area indicated by the filled mask transparent.
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
    if image.shape[2] == 3:
        image = cv2.cvtColor(image, cv2.COLOR_BGR2BGRA)
    # Set alpha to 0 (transparent) where mask is white.
    image[mask_filled == 255, 3] = 0
    cv2.imwrite(output_path, image)
    return output_path

@app.post("/remove-area")
async def remove_area(
    image: UploadFile = File(...),
    mask: UploadFile = File(...)
):
    """
    Receives an image and a mask file (which may only contain an outline),
    fills in the mask, then removes (makes transparent) the indicated area.
    Returns the processed image filename.
    """
    try:
        image_path = os.path.join(UPLOAD_FOLDER, image.filename)
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        mask_filename = f"mask_{image.filename}"
        mask_path = os.path.join(UPLOAD_FOLDER, mask_filename)
        with open(mask_path, "wb") as buffer:
            shutil.copyfileobj(mask.file, buffer)
        output_filename = f"edited_{os.path.splitext(image.filename)[0]}.png"
        output_path = os.path.join(UPLOAD_FOLDER, output_filename)
        remove_masked_area(image_path, mask_path, output_path)
        print(f":white_check_mark: Processed image saved at {output_path}")
        return {"filename": output_filename, "message": "Processing successful"}
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
        return FileResponse(file_path, media_type="image/png")
    return JSONResponse(content={"error": "File not found"}, status_code=404)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
