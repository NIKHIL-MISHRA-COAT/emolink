import pickle
import os
import sys

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Load the TF-IDF vectorizer and the trained model from the same folder
vectorizer_path = os.path.join(script_dir, 'tfidf_vectorizer.sav')
model_path = os.path.join(script_dir, 'trained_model.sav')

with open(vectorizer_path, 'rb') as f:
    vectorizer = pickle.load(f)

with open(model_path, 'rb') as f:
    model = pickle.load(f)

# Preprocess text using the loaded vectorizer
def preprocess_text(text):
    text_transformed = vectorizer.transform([text])
    return text_transformed

# Predict sentiment using the loaded model
def predict_sentiment(text):
    text_transformed = preprocess_text(text)
    prediction = model.predict(text_transformed)
    return prediction[0]

if __name__ == "__main__":
    input_text = sys.argv[1]
    prediction = predict_sentiment(input_text)
    print(prediction)
