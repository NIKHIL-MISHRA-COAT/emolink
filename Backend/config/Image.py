import sys
import cv2
import numpy as np

import tensorflow as tf

print("Reached python")  # Indicate that the script has been reached successfully

# Load the trained model
model = tf.keras.models.load_model('config/imageclassifier.h5')

def preprocess_image(image_path):
    """
    Preprocesses the image data for prediction.

    Args:
        image_path (str): The path to the image file.

    Returns:
        np.array or None: Preprocessed image data or None if an error occurs.
    """
    try:
        # Read the image from file
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError("Failed to read image")
    except Exception as e:
        print("Error loading image:", e)
        return None
    
    # Resize the image
    resized_img = cv2.resize(img, (256, 256))
    # Convert image to float32 and normalize
    normalized_img = resized_img.astype(np.float32) / 255.0
    # Expand dimensions to match model input shape
    expanded_img = np.expand_dims(normalized_img, axis=0)
    return expanded_img

def predict_image(image_path):
    """
    Performs prediction on the preprocessed image data.

    Args:
        image_path (str): The path to the image file.

    Returns:
        str: The predicted label ('Sad' or 'Happy') or an error message.
    """
    preprocessed_img = preprocess_image(image_path)
    if preprocessed_img is None:
        return "Error: Failed to preprocess image"

    try:
        predictions = model.predict(preprocessed_img)
        return "Sad" if predictions[0] > 0.5 else "Happy"
    except Exception as e:
        print("Error predicting image:", e)
        return "Error: Failed to predict image"

# Check if image path is provided as an argument
if len(sys.argv) != 2:
    print("Usage: python image.py <image_path>")
    sys.exit(1)

# Read image path from command-line argument
image_path = sys.argv[1]

# Perform prediction on the image data
prediction = predict_image(image_path)
print(prediction)  # Print the prediction result to stdout
