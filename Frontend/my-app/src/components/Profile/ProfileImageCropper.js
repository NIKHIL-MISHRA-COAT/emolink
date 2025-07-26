import React, { useState, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ProfileImageCropper = ({ imgSrc, onComplete }) => {
    const [crop, setCrop] = useState({ unit: '%', width: 50, height: 50,x:25,y:25, aspect: 1 / 1 });
    const [imageRef, setImageRef] = useState(null);
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);

    const handleImageLoaded = (image) => {
        setImageRef(image.target);
        
    };

    const handleCropChange = (newCrop) => {
        console.log(newCrop)
        const aspectRatio = 1;

    const newWidth = Math.min(newCrop.width, newCrop.height * aspectRatio);
    const newHeight = newWidth / aspectRatio;

    setCrop({
        unit: newCrop.unit,
        width: newWidth,
        height: newHeight,
        x: newCrop.x,
        y: newCrop.y,
        aspect: aspectRatio,
    });
    };

    const handleCropComplete = (crop) => {
        const croppedImageUrl = getCroppedImg(imageRef, crop);
        setCroppedImageUrl(croppedImageUrl);
    };

    const getCroppedImg = (image, crop) => {
        if (!image) {
            console.error('Image is null');
            return null;
        }

        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        const croppedImageUrl = canvas.toDataURL('image/jpeg');
        return croppedImageUrl;
    };

    const handleSave = () => {
        onComplete(croppedImageUrl);
    };

    return (
        <div className="Profile-cropper-container">
            <div className='cp'>
                <ReactCrop
                    keepSelection={true}
                    locked={false}
                    onDragEnd={false}
                    crop={crop}
                    onImageLoaded={handleImageLoaded}
                    onChange={handleCropChange}
                    onComplete={handleCropComplete}
                >
                    <img src={imgSrc} onLoad={handleImageLoaded} className='img' alt="Crop" />
                </ReactCrop>
            </div>
            <button onClick={handleSave} className='btn btn-primary'>Save</button>
        </div>
    );
};

export default ProfileImageCropper;
