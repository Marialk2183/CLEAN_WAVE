import tensorflow as tf
import numpy as np
import os
import matplotlib.pyplot as plt
import shap 
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array

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

# Disposal Suggestions Mapping (Abbreviated for brevity)
DISPOSAL_SUGGESTIONS = {
    'plastic': "♻️ **Recycle!** Clean plastic containers...",
    'metal': "⚙️ **Recycle!** Tin cans or aluminum foil...",
    'paper': "📜 **Recycle!** Flatten paper and cardboard...",
    'glass': "🍷 **Recycle!** Rinse glass containers...",
    'organic': "🍎 **Compost!** Food scraps, fruit peels...",
    'trash': "🗑️ **General Waste.** This item is non-recyclable...",
    'battery': "🔋 **Dispose of Properly!** Batteries are hazardous...",
    'clothes': "👕 **Donate or Repurpose!** Old clothes and shoes...",
    'shoes': "👟 **Donate or Repurpose!** Old clothes and shoes...",
    'cardboard': "📦 **Recycle!** Flatten cardboard boxes..."
}

# SHAP-specific configuration
BACKGROUND_SIZE = 10 
# 🛑 IMPORTANT: UPDATE THIS PATH 🛑 
# This image is used as the baseline for SHAP calculations.
BACKGROUND_IMAGE_PATH = 'C:\\Users\\maria\\Downloads\\garbage-dataset\\plastic\\plastic_1.jpg' 

# ==============================================================================
# 2. HELPER FUNCTIONS (Load & Preprocess)
# ==============================================================================

def load_and_preprocess_image(image_path):
    """Loads and preprocesses a single image for prediction."""
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image file not found at: {image_path}")

    img = load_img(image_path, target_size=(IMG_WIDTH, IMG_HEIGHT))
    img_array = img_to_array(img)
    img_array /= 255.0 # Normalize for prediction
    return img_array

# ==============================================================================
# 3. CLASSIFICATION FUNCTION
# ==============================================================================

def classify_waste(image_path, model):
    """
    Loads an image, predicts the waste class, and returns the prediction details.
    """
    try:
        img_array = load_and_preprocess_image(image_path)
    except Exception as e:
        return None, str(e), None, None

    # Add batch dimension for model input
    img_input = np.expand_dims(img_array, axis=0)  
    
    # Predict Class
    predictions = model.predict(img_input, verbose=0)
    predicted_class_index = np.argmax(predictions)
    
    # Map index to class name and get suggestion
    predicted_class_name = CLASS_NAMES[predicted_class_index]
    suggestion = DISPOSAL_SUGGESTIONS.get(predicted_class_name, DISPOSAL_SUGGESTIONS['trash'])

    return predicted_class_name, suggestion, img_array, predicted_class_index

# ==============================================================================
# 4. SHAP EXPLANATION FUNCTION
# ==============================================================================

def generate_shap_explanation(model, image_path, class_index, class_name):
    """
    Generates a SHAP explanation for the given image and saves a visualization.
    """
    print(f"\nGenerating SHAP explanation for '{class_name}'...")
    
    try:
        image_to_explain = load_and_preprocess_image(image_path)
        
        # --- Create a simple background set for DeepExplainer ---
        background_img = load_and_preprocess_image(BACKGROUND_IMAGE_PATH)
        # Create a batch of background images
        background = np.repeat(np.expand_dims(background_img, axis=0), BACKGROUND_SIZE, axis=0)

        # 1. Initialize the DeepExplainer
        explainer = shap.DeepExplainer(model, background)

        # 2. Calculate SHAP values
        shap_values = explainer.shap_values(np.expand_dims(image_to_explain, axis=0))

        # 3. Visualize the explanation
        image_for_plot = image_to_explain 

        shap.image_plot(
            shap_values[class_index], 
            image_for_plot, 
            show=False, 
            labels=[f"SHAP for Predicted Class: {class_name.upper()}"]
        )

        # Save the visualization
        output_filename = f"shap_explanation_{class_name}.png"
        plt.savefig(output_filename, bbox_inches='tight')
        plt.close()
        
        print(f"✅ SHAP visualization saved as '{output_filename}'")
        print("💡 Red pixels indicate features contributing positively to the prediction.")
        print("💡 Blue pixels indicate features contributing negatively to the prediction.")
        
    except Exception as e:
        print(f"❌ Could not generate SHAP explanation. Error: {e}")
        print("HINT: Ensure the BACKGROUND_IMAGE_PATH is correct and SHAP is installed ('pip install shap').")


# ==============================================================================
# 5. MAIN EXECUTION BLOCK
# ==============================================================================

if __name__ == "__main__":
    
    # --- Step A: Load the Trained Model ---
    try:
        print("Loading the trained model...")
        trained_model = load_model(MODEL_PATH)
        print("✅ Model loaded successfully.")
    except Exception as e:
        print(f"Error loading model: {e}")
        print("Please ensure you have trained the model and saved it as 'waste_classifier_real_data.h5'")
        exit()

    # --- Step B: Get User Input and Classify ---
    while True:
        # Check for SHAP dependency
        try:
            import shap
        except ImportError:
            print("\n🚨 SHAP library not found. Please install it: 'pip install shap'")
            break

        print("-" * 70)
        image_path = input("Enter the path to the image you want to classify (or 'exit' to quit): ")
        
        if image_path.lower() == 'exit':
            break
            
        # The classify_waste function now returns the preprocessed image and index
        category, disposal_tip, img_array, category_index = classify_waste(image_path, trained_model)
        
        if category is not None:
            print("\n" + "="*50)
            print(f"✅ **CLASSIFIED AS:** {category.upper()}")
            print(f"💡 **DISPOSAL SUGGESTION:** {disposal_tip}")
            print("="*50)
            
            # --- Step C: Generate SHAP Explanation ---
            generate_shap_explanation(trained_model, image_path, category_index, category)

        else:
            print(disposal_tip)