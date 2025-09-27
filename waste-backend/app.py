from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import os
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# ==============================================================================
# 1. CONFIGURATION AND CONSTANTS
# ==============================================================================

# Path to your saved model file
MODEL_PATH = 'waste_classifier_real_data.h5'

# Model Hyperparameters (must match the training script)
IMG_WIDTH, IMG_HEIGHT = 160, 160 

# Defined Waste Categories (Must match the folder names from the dataset)
CLASS_NAMES = ['battery', 'biological', 'cardboard', 'clothes', 'glass', 
               'metal', 'paper', 'plastic', 'shoes', 'trash']

# Disposal Suggestions Mapping
DISPOSAL_SUGGESTIONS = {
    'plastic': " **Recycle!** Clean plastic containers and place in the designated plastics bin.",
    'metal': " **Recycle!** Tin cans or aluminum foil go into the metal recycling bin.",
    'paper': " **Recycle!** Flatten paper and cardboard and place in the paper recycling bin.",
    'glass': " **Recycle!** Rinse glass containers and place in the glass recycling bin. Handle carefully!",
    'biological': " **Compost!** Food scraps, fruit peels, or yard waste should be composted.",
    'trash': " **General Waste.** This item is non-recyclable or contaminated. Dispose of it in the regular trash bin.",
    'battery': " **Dispose of Properly!** Batteries are hazardous and should be taken to a specialized recycling center.",
    'clothes': " **Donate or Repurpose!** Old clothes and shoes can be donated or recycled at textile collection points.",
    'shoes': " **Donate or Repurpose!** Old clothes and shoes can be donated or recycled at textile collection points.",
    'cardboard': " **Recycle!** Flatten cardboard boxes and place them in the paper recycling bin."
}

# Global model variable
model = None

def load_tensorflow_model():
    """Load the TensorFlow model on startup."""
    global model
    try:
        if os.path.exists(MODEL_PATH):
            model = load_model(MODEL_PATH)
            print(" TensorFlow model loaded successfully.")
        else:
            print(f" Model file not found at {MODEL_PATH}")
            print("Please ensure you have the trained model file in the correct location.")
            model = None
    except Exception as e:
        print(f" Error loading model: {e}")
        model = None

def load_and_preprocess_image(image_data):
    """Loads and preprocesses an image for prediction."""
    try:
        # Convert bytes to PIL Image
        image = Image.open(io.BytesIO(image_data)).convert("RGB")
        
        # Resize image to model input size
        image = image.resize((IMG_WIDTH, IMG_HEIGHT))
        
        # Convert to array and normalize
        img_array = np.array(image) / 255.0
        
        return img_array
    except Exception as e:
        raise Exception(f"Error preprocessing image: {e}")

def classify_waste_tensorflow(image_data):
    """
    Classifies waste using the TensorFlow model.
    """
    if model is None:
        return None, "Model not loaded. Please check server logs."
    
    try:
        # Preprocess the image
        img_array = load_and_preprocess_image(image_data)
        
        # Add batch dimension for model input
        img_input = np.expand_dims(img_array, axis=0)
        
        # Predict Class
        predictions = model.predict(img_input, verbose=0)
        predicted_class_index = np.argmax(predictions)
        confidence = np.max(predictions)
        
        # Map index to class name and get suggestion
        predicted_class_name = CLASS_NAMES[predicted_class_index]
        suggestion = DISPOSAL_SUGGESTIONS.get(predicted_class_name, DISPOSAL_SUGGESTIONS['trash'])
        
        return predicted_class_name, suggestion, float(confidence)
        
    except Exception as e:
        return None, f"Classification error: {e}", 0.0

@app.route('/classify-image', methods=['POST'])
def classify_image():
    """API endpoint for image classification."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        # Read image data
        image_data = file.read()
        
        # Classify the image
        category, suggestion, confidence = classify_waste_tensorflow(image_data)
        
        if category is not None:
            return jsonify({
                'label': category,
                'score': confidence,
                'suggestion': suggestion
            })
        else:
            return jsonify({'error': suggestion}), 500
            
    except Exception as e:
        return jsonify({'error': f'Processing error: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'model_path': MODEL_PATH
    })

if __name__ == '__main__':
    # Load the model on startup
    load_tensorflow_model()
    
    # Start the Flask app
    app.run(host='0.0.0.0', port=5000, debug=True)
