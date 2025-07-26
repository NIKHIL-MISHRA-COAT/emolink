import React, { useState, useeffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const CropImage = ({ selectedImage, onCropComplete }) => {
    const [crop, setCrop] = useState({ unit: '%', width: 0, height: 0, aspect: 1 / 1 });
    const [imageRef, setImageRef] = useState(null);

    const handleImageLoaded = (image) => {
        console.log("handle : ", image)
        setImageRef(image.target);
    };
    const handleCropChange = (newCrop) => {
        setCrop(newCrop);
    };
    const handleCropComplete = (crop) => {

        const croppedImageUrl = getCroppedImg(imageRef, crop);
        onCropComplete(croppedImageUrl);
    };

    const getCroppedImg = (image, crop) => {
        console.log("get : ", image)
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

    return (
        <div className="cropper">

            <ReactCrop

                keepSelection={false}
                locked={false}
                onDragEnd = {false}
                crop={crop}
                onImageLoaded={handleImageLoaded}
                onChange={handleCropChange}
                onComplete={handleCropComplete}>
                <img src={selectedImage.src}
                    onLoad={handleImageLoaded}
                    className='story-content'
                />
            </ReactCrop>
        </div>
    );
};

export default CropImage;
