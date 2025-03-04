


# from fastapi import FastAPI, File, UploadFile
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import FileResponse, JSONResponse
# import shutil
# import os

# app = FastAPI()

# # Enable CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],  # Specify your frontend URL
#     allow_credentials=True,
#     allow_methods=["GET", "POST"],  # Explicitly allow GET and POST
#     allow_headers=["*"],
# )

# UPLOAD_FOLDER = "uploads"
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# @app.post("/upload-image")
# async def upload_image(file: UploadFile = File(...)):
#     file_location = os.path.join(UPLOAD_FOLDER, file.filename)
    
#     # Save the uploaded file
#     with open(file_location, "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)

#     print(f"✅ Image saved at {file_location}")
#     return {"filename": file.filename, "message": f"Upload successful: {file.filename}"}

# @app.get("/get-image/{image_name}")
# async def get_image(image_name: str):
#     file_path = os.path.join(UPLOAD_FOLDER, image_name)
    
#     if os.path.exists(file_path):
#         # Ensure proper media type based on file extension
#         file_extension = image_name.split('.')[-1].lower()
#         media_types = {
#             'png': 'image/png',
#             'jpg': 'image/jpeg',
#             'jpeg': 'image/jpeg',
#             'gif': 'image/gif'
#         }
#         media_type = media_types.get(file_extension, 'image/png')
#         return FileResponse(file_path, media_type=media_type)
#     return JSONResponse(content={"error": "File not found"}, status_code=404)

# from fastapi import FastAPI, File, UploadFile
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import FileResponse, JSONResponse
# import shutil
# import os

# # For image processing and model inference:
# import cv2
# import numpy as np
# import torch

# # Import SAM components from the Segment Anything repository.
# # Install via: pip install git+https://github.com/facebookresearch/segment-anything.git
# from segment_anything import sam_model_registry, SamAutomaticMaskGenerator

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

# # === SAM Model Setup ===
# # Set the checkpoint path to your actual SAM checkpoint.
# SAM_CHECKPOINT = "/Users/owner/Documents/dejavuai-nextjs/backend/sam_vit_h_4b8939.pth"
# MODEL_TYPE = "vit_h"  # Use the appropriate variant (e.g., "vit_h", "vit_b")
# device = "cuda" if torch.cuda.is_available() else "cpu"

# # Load the SAM model and create a mask generator.
# sam = sam_model_registry[MODEL_TYPE](checkpoint=SAM_CHECKPOINT)
# sam.to(device)
# mask_generator = SamAutomaticMaskGenerator(sam)

# def remove_background(input_path: str, output_path: str) -> str:
#     """
#     Loads an image from input_path, uses SAM to generate segmentation masks,
#     selects the mask with the largest area, inverts it so that the object remains
#     and the background is removed (set to white), then saves the processed image
#     to output_path.
#     """
#     image = cv2.imread(input_path)
#     if image is None:
#         raise ValueError("Could not load image for processing.")
    
#     # Generate segmentation masks using SAM.
#     masks = mask_generator.generate(image)
#     if not masks:
#         # If no mask is found, save the original image.
#         cv2.imwrite(output_path, image)
#         return output_path

#     # Select the mask with the largest area.
#     best_mask = max(masks, key=lambda m: m["area"])
#     binary_mask = best_mask["segmentation"].astype(np.uint8)
    
#     # Invert the mask: now, 1 represents the foreground (object) and 0 is background.
#     inverted_mask = 1 - binary_mask
    
#     # Create a 3-channel version of the inverted mask.
#     mask_3ch = np.stack([inverted_mask] * 3, axis=-1)
    
#     # Apply the mask: keep original pixel where mask==1, set to white (255) where mask==0.
#     processed_image = np.where(mask_3ch == 1, image, 255)
    
#     cv2.imwrite(output_path, processed_image)
#     return output_path

# @app.post("/process-image")
# async def process_image(file: UploadFile = File(...)):
#     """
#     Receives an image upload, processes it with SAM to remove the background,
#     and returns the filename of the processed image.
#     """
#     # Save the uploaded file.
#     file_location = os.path.join(UPLOAD_FOLDER, file.filename)
#     with open(file_location, "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)
    
#     # Define the processed image filename.
#     processed_filename = f"processed_{file.filename}"
#     processed_file = os.path.join(UPLOAD_FOLDER, processed_filename)
    
#     try:
#         remove_background(file_location, processed_file)
#         print(f"✅ Processed image saved at {processed_file}")
#         return {"filename": processed_filename, "message": f"Processing successful: {file.filename}"}
#     except Exception as e:
#         print(f"❌ Error processing image: {e}")
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
        print(f"✅ Processed image saved at {processed_file}")
        return {"filename": processed_filename, "message": f"Processing successful: {file.filename}"}
    except Exception as e:
        print(f"❌ Error processing image: {e}")
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
