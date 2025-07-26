import React, { useState, useEffect } from 'react';
import './Story.css';
import { BsChevronLeft, BsChevronRight,BsX } from 'react-icons/bs';
import Swal from 'sweetalert2';

const Story = ({ stories,onDeleteImage, onClose }) => {
  const [currentUsernameIndex, setCurrentUsernameIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const email=localStorage.getItem('token');

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentImageIndex < stories[currentUsernameIndex].images.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      } else if (currentUsernameIndex < stories.length - 1) {
        setCurrentUsernameIndex(currentUsernameIndex + 1);
        setCurrentImageIndex(0);
      } else {
        onClose();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentImageIndex, currentUsernameIndex, stories, onClose]);

  const handleNextImage = () => {
    if (currentImageIndex < stories[currentUsernameIndex].images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else if (currentUsernameIndex < stories.length - 1) {
      setCurrentUsernameIndex(currentUsernameIndex + 1);
      setCurrentImageIndex(0);
    } else {
      onClose();
    }
  };

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else if (currentUsernameIndex > 0) {
      setCurrentUsernameIndex(currentUsernameIndex - 1);
      setCurrentImageIndex(stories[currentUsernameIndex - 1].images.length - 1);
    } else {
      onClose();
    }
  };


  const handleDeleteImage = async () => {
    try {
      const currentStory = stories[currentUsernameIndex];
      const imageToDelete = currentStory.images[currentImageIndex];
      await onDeleteImage(imageToDelete);
  
      // Show success message using SweetAlert
      Swal.fire({
        title: 'Story Delete Success',
        text: 'Story deleted',
        icon: 'success',
      });
      
      // Optionally, you can reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 5000); // Reload after 1 second (adjust as needed)
    } catch (error) {
      // Show error message using SweetAlert
      Swal.fire({
        title: 'Story Delete Failed',
        text: error.message, // Access error message directly
        icon: 'error',
      });
      console.error('Error deleting image:', error);
    }
  };
  
  
  


  return (
    <div className="story-container">
<button className="close-btn" onClick={onClose}>
        <BsX />
      </button>

      <div className='prev navi'>
        {(currentImageIndex > 0 || currentUsernameIndex > 0) && (
          <button className='btn btn-primary' onClick={handlePreviousImage}>
            <BsChevronLeft />
          </button>
        )}
      </div>
      <div className='image-cont'>
        <img
          className='image1'
          src={`data:${stories[currentUsernameIndex].images[currentImageIndex].mimetype};base64,${stories[currentUsernameIndex].images[currentImageIndex].path}`}
          alt={stories[currentUsernameIndex].images[currentImageIndex].filename}
        />
        <i className="username">{stories[currentUsernameIndex].username}</i>
        {stories[currentUsernameIndex].username==email && (
          <button className="delete-btn" onClick={handleDeleteImage}>
            Delete
          </button>
        )}
      </div>
      <div className='next navi'>
        {(currentImageIndex < stories[currentUsernameIndex].images.length - 1 || currentUsernameIndex < stories.length - 1) && (
          <button className='btn btn-primary' onClick={handleNextImage}>
            <BsChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default Story;
