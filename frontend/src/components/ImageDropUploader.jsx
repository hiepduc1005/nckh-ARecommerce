import React, { useState } from "react";
import '../assets/styles/components/ImageDropUploader.scss'
const ImageDropUploader = ({ onUpload,imagePreview}) => {
    console.log(imagePreview)
  const [image, setImage] = useState(null);

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(URL.createObjectURL(file));
      onUpload(file); // Gọi callback upload ảnh
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(URL.createObjectURL(file));
      onUpload(file);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    URL.revokeObjectURL(image);
    onUpload(null)
    setImage(null)
    if (e.target.form) {
        e.target.form.reset();
    }
  }

  const displayImage = imagePreview ? (image || `http://localhost:8080${imagePreview}`) : image;

  return (
    <div
      className="drop-zone"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {displayImage ? (
        <div className="image-preview-container">
        <img src={displayImage} alt="Preview" className="image-preview" />
        <button type="button" className="remove-image-btn" onClick={(e) => handleRemoveImage(e)}>
          Remove Image
        </button>
      </div>
      ) : (
        <p>Drag & Drop an image here or click to select</p>
      )}
      <input type="file" onChange={handleFileChange} accept="image/*" className="file-input" />
    </div>
  );
};

export default ImageDropUploader;
