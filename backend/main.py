

# from fastapi import FastAPI, File, UploadFile
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import FileResponse, JSONResponse
# import shutil
# import os
# import cv2
# import numpy as np
# from rembg import remove  # For background removal

# app = FastAPI()

# # Enable CORS for your frontend.
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],
#     allow_credentials=True,
#     allow_methods=["GET", "POST"],
#     allow_headers=["*"],
# )

# UPLOAD_FOLDER = "uploads"
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# def remove_background_rembg(input_path: str, output_path: str) -> str:
#     """
#     Uses rembg to remove the background of the image, then composites the result
#     over a white background so that there is no transparency (no checkered pattern).
#     """
#     try:
#         # Read the input image data
#         with open(input_path, 'rb') as i:
#             input_data = i.read()
#         # Remove background using rembg (this returns a PNG with transparency)
#         output_data = remove(input_data)
        
#         # Save the temporary output with transparency
#         temp_path = output_path.replace(".png", "_temp.png")
#         with open(temp_path, 'wb') as o:
#             o.write(output_data)
        
#         # Load the temporary image with alpha channel (if present)
#         img = cv2.imread(temp_path, cv2.IMREAD_UNCHANGED)
#         if img is None:
#             raise ValueError("Failed to read temporary image.")
        
#         # If image has an alpha channel, composite it over a white background
#         if img.shape[2] == 4:
#             # Create a white background of the same size
#             white_bg = np.ones((img.shape[0], img.shape[1], 3), dtype=np.uint8) * 255
#             # Normalize the alpha channel to range [0,1]
#             alpha = img[:, :, 3] / 255.0
#             # Composite each color channel
#             for c in range(3):
#                 white_bg[:, :, c] = (white_bg[:, :, c] * (1 - alpha) + img[:, :, c] * alpha).astype(np.uint8)
#             cv2.imwrite(output_path, white_bg)
#         else:
#             # If there's no alpha channel, just save the image as-is.
#             cv2.imwrite(output_path, img)
        
#         # Remove the temporary file
#         os.remove(temp_path)
#         return output_path
#     except Exception as e:
#         raise ValueError(f"Error in background removal: {e}")

# @app.post("/process-image")
# async def process_image(file: UploadFile = File(...)):
#     """
#     Receives an image upload, uses rembg to remove its background,
#     composites it over a white background, and returns the processed image filename.
#     """
#     file_location = os.path.join(UPLOAD_FOLDER, file.filename)
#     with open(file_location, "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)
#     processed_filename = f"processed_{os.path.splitext(file.filename)[0]}.png"
#     processed_file = os.path.join(UPLOAD_FOLDER, processed_filename)
#     try:
#         remove_background_rembg(file_location, processed_file)
#         print(f":white_check_mark: Processed image saved at {processed_file}")
#         return {"filename": processed_filename, "message": f"Processing successful: {file.filename}"}
#     except Exception as e:
#         print(f":x: Error processing image: {e}")
#         return JSONResponse(content={"error": str(e)}, status_code=500)

# # ------------------------------
# # Manual Mask Endpoint (unchanged)
# # ------------------------------
# def fill_mask(mask):
#     _, thresh = cv2.threshold(mask, 127, 255, cv2.THRESH_BINARY)
#     contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
#     if contours:
#         cv2.drawContours(thresh, contours, -1, 255, thickness=cv2.FILLED)
#     return thresh

# def remove_masked_area(image_path: str, mask_path: str, output_path: str) -> str:
#     """
#     Reads an image and a mask, fills in the mask if needed,
#     applies a morphological closing operation to smooth the mask edges,
#     and then sets the area indicated by the cleaned mask to white.
#     """
#     # Load the image (preserving alpha if it exists).
#     image = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)
#     if image is None:
#         raise ValueError("Could not load image")
    
#     # Load the mask in grayscale.
#     mask = cv2.imread(mask_path, cv2.IMREAD_GRAYSCALE)
#     if mask is None:
#         raise ValueError("Could not load mask")
    
#     # Resize the mask if its dimensions don't match the image.
#     if mask.shape != image.shape[:2]:
#         mask = cv2.resize(mask, (image.shape[1], image.shape[0]))
    
#     # Fill the mask if it only has an outline.
#     mask_filled = fill_mask(mask)
    
#     # Apply morphological closing to smooth edges and remove thin artifacts.
#     kernel = np.ones((3, 3), np.uint8)
#     mask_clean = cv2.morphologyEx(mask_filled, cv2.MORPH_CLOSE, kernel)
    
#     # Ensure the image has an alpha channel (convert to BGRA if needed).
#     if image.shape[2] == 3:
#         image = cv2.cvtColor(image, cv2.COLOR_BGR2BGRA)
    
#     # Instead of leaving transparency, fill the masked area with white.
#     image[mask_clean == 255] = [255, 255, 255, 255]
    
#     cv2.imwrite(output_path, image)
#     return output_path


# @app.post("/remove-area")
# async def remove_area(
#     image: UploadFile = File(...),
#     mask: UploadFile = File(...)
# ):
#     try:
#         image_path = os.path.join(UPLOAD_FOLDER, image.filename)
#         with open(image_path, "wb") as buffer:
#             shutil.copyfileobj(image.file, buffer)
#         mask_filename = f"mask_{image.filename}"
#         mask_path = os.path.join(UPLOAD_FOLDER, mask_filename)
#         with open(mask_path, "wb") as buffer:
#             shutil.copyfileobj(mask.file, buffer)
#         output_filename = f"edited_{os.path.splitext(image.filename)[0]}.png"
#         output_path = os.path.join(UPLOAD_FOLDER, output_filename)
#         remove_masked_area(image_path, mask_path, output_path)
#         print(f":white_check_mark: Processed image saved at {output_path}")
#         return {"filename": output_filename, "message": "Processing successful"}
#     except Exception as e:
#         print(f":x: Error processing image: {e}")
#         return JSONResponse(content={"error": str(e)}, status_code=500)

# @app.get("/get-image/{image_name}")
# async def get_image(image_name: str):
#     file_path = os.path.join(UPLOAD_FOLDER, image_name)
#     if os.path.exists(file_path):
#         return FileResponse(file_path, media_type="image/png")
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
from rembg import remove
import time

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
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)