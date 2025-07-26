import React, { useState } from 'react';
import Draggable from 'react-draggable';

const ImageEdit = ({ initialSrc, onResultChange }) => {
  const [text, setText] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDrag = (e, ui) => {
    const { x, y } = position;
    setPosition({ x: x + ui.deltaX, y: y + ui.deltaY });
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSave = () => {
   
    // console.log('Text:', text);
    // console.log('Position:', position);
    
    const resultSrc = processImage(initialSrc, text, position);
    onResultChange(resultSrc);
    // console.log('Result Image:', resultSrc);
  };

  const processImage = (initialSrc, text, position) => {
    const canvas = document.createElement('canvas');
    const image = new Image();
    image.src = initialSrc.src;

    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);

    ctx.font = '20px Arial'; 
    ctx.fillStyle = 'white'; 
    ctx.fillText(text, position.x, position.y);

    // Convert the canvas content to a data URL
    return canvas.toDataURL();
  };

  return (
    <div>
      <img
        src={initialSrc.src}
        alt="Your Image"
        className='story-content'
      />

      <Draggable position={position} onDrag={handleDrag}>
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          style={{
            position: 'absolute',
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
          }}
        />
      </Draggable>

      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default ImageEdit;
