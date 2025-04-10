// src/imageUploadState.js

// Singleton to store uploaded images globally
const imageUploadState = {
    uploadedImages: [],
  
    getUploadedImages() {
      return this.uploadedImages;
    },
  
    setUploadedImages(images) {
      this.uploadedImages = images;
    },
  
    addUploadedImages(newImages) {
      this.uploadedImages = [...this.uploadedImages, ...newImages];
    },
  
    clearUploadedImages() {
      this.uploadedImages = [];
    },
  };
  
  export default imageUploadState;