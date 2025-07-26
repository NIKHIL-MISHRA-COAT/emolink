import React, { useState, useEffect } from 'react';
import { BsFillXCircleFill, BsCrop,BsX } from 'react-icons/bs';
import axios from 'axios'; // Import Axios for making HTTP requests
import CropImage from './CropImage.js';

const CreateStory = ({onClose}) => {
    const [tempStories, setTempStories] = useState([]);
    const [showStory, setShowStory] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [submitFormData, setSubmitFormData] = useState(null);

    useEffect(() => {
        const formData = new FormData();
        tempStories.forEach((story) => {
            formData.append('stories', story.file);
        });
        setSubmitFormData(formData);
    }, [tempStories]);

    const handleFileChange = async (event) => {
        const files = event.target.files;
        const newTempStories = [...tempStories];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const type = file.type.startsWith('image/') ? 'image' : 'video'; // Determine the type of file
            if (file) {
                const res  = await compressAndSetAspectRatio(file);
                newTempStories.push({
                    id: i,
                    file: file,
                    src: res,
                    type: type, 
                });
              }          
        }
        setTempStories(newTempStories);
        setShowStory(true);
    };
const compressAndSetAspectRatio = async (file) => {
    return new Promise( (resolve) => {
      const image = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const maxWidth = 600; 
      const maxHeight = 600; 
      image.src = URL.createObjectURL(file); 
      image.onload = () => {
        let newWidth = image.width;
        let newHeight = image.height; 

        // uska ratio humare hissab se yaha max--> 1:1 rahega uske andar kaise bhi
        if (newWidth > maxWidth) {
          newWidth = maxWidth;
          newHeight = (maxWidth / image.width) * image.height;
        }

        if (newHeight > maxHeight) {
          newHeight = maxHeight;
          newWidth = (maxHeight / image.height) * image.width;
        }


        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(image, 0, 0, newWidth, newHeight);

        // best quality hai , hum chahey toh quality kam kar sakte hai
        const compressedDataUrl =canvas.toDataURL('image/jpeg',1); 
        
        resolve(compressedDataUrl);
      };
    });
  };
  const closeCreateStory = () => {
    onClose(); // Call the onClose function passed as prop
};
    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('tokenurl');
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
                    Authorization: `Bearer ${token}`,
                },
            };
    
            // Make a POST request to your backend API endpoint to save the stories
            await axios.post('http://localhost:5000/addStory', submitFormData, config);
    
            // Clear the temporary stories and reset the component state
            setTempStories([]);
            setShowStory(false);
            window.location.reload();
        } catch (error) {
            console.error('Error submitting story:', error);
            // Handle error
        }
    };
    
    

    const handleRemoveStory = (id) => {
        const updatedTempStories = tempStories.filter((story) => story.id !== id);
        setTempStories(updatedTempStories);
    };

    // close the story component
    const closeStory = () => {
        setTempStories([]);
        setShowStory(false);
    };

    const handleCropComplete = (croppedImageUrl) => {
        console.log("temp " , croppedImageUrl)
        const updatedTempStories = tempStories.map((story) =>
            story.id === selectedImage.id ? { ...story, src: croppedImageUrl } : story
        );
        console.log(updatedTempStories)

        setTempStories(updatedTempStories);
        setSelectedImage(null);
    };

    return (
        <div className='container container-create-story'>
            <button className="close-btn" onClick={closeCreateStory}>
        <BsX />
      </button>
            <form className='create-story-form'>
                <label htmlFor="fileInput" className="custom-file-input btn">
                    {tempStories.length > 0
                        ? `Add more files (${tempStories.length} selected)`
                        : 'Choose File to add'}
                </label>
                <input id="fileInput" type="file" className='file-input' name="storyfile" accept="image/*, video/*" multiple onChange={handleFileChange} />
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>Post</button>
            </form>

            {showStory && (
                <div className="story-grid">
                    <hr />
                    {tempStories.map((story, i) => ( // Added index i as the second argument
                        <div key={i} className="story-item"> 
                            <div className='remove-icon' onClick={() => handleRemoveStory(story.id)}>
                                <BsFillXCircleFill />
                            </div>
                            {selectedImage && selectedImage.id === story.id ? (
                                <CropImage selectedImage={selectedImage} onCropComplete={handleCropComplete} />
                            ) : (
                                <>
                                    {story.type === 'image' ? (
                                        <>
                                            <img className="story-content" src={story.src} alt={`Story ${i + 1}`} />
                                            <div className='crop-icon' onClick={() => setSelectedImage(story)}>
                                                <BsCrop />
                                            </div>
                                        </>
                                    ) : (
                                        <video className='story-content' controls>
                                            <source src={story.src} type="video/mp4" />
                                        </video>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CreateStory;


