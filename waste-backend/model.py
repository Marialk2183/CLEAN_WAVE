import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.preprocessing.image import ImageDataGenerator, load_img, img_to_array
import numpy as np
import os
import shutil
from PIL import Image

# ==============================================================================
# 1. CONFIGURATION AND CONSTANTS
# ==============================================================================

# IMPORTANT: Path Fix. Use double backslashes (\\) or a forward slash (/).
# This prevents Python from interpreting backslashes as escape characters.
DATA_DIR = 'C:\\Users\\maria\\Downloads\\garbage-dataset'

# Model and Data Paths
MODEL_PATH = 'waste_classifier_real_data.h5'

# Model Hyperparameters
IMG_WIDTH, IMG_HEIGHT = 160, 160 # Standard input size for MobileNetV2
BATCH_SIZE = 32
# It's recommended to increase epochs for better accuracy with real data
EPOCHS = 20


# Defined Waste Categories (Must match the folder names in your dataset)
CLASS_NAMES = ['battery', 'biological', 'cardboard', 'clothes', 'glass', 
               'metal', 'paper', 'plastic', 'shoes', 'trash']

# Disposal Suggestions Mapping
DISPOSAL_SUGGESTIONS = {
    'plastic': "♻️ **Recycle!** Clean plastic containers and place in the designated plastics bin.",
    'metal': "⚙️ **Recycle!** Tin cans or aluminum foil go into the metal recycling bin.",
    'paper': "📜 **Recycle!** Flatten paper and cardboard and place in the paper recycling bin.",
    'glass': "🍷 **Recycle!** Rinse glass containers and place in the glass recycling bin. Handle carefully!",
    'organic': "🍎 **Compost!** Food scraps, fruit peels, or yard waste should be composted.",
    'trash': "🗑️ **General Waste.** This item is non-recyclable or contaminated. Dispose of it in the regular trash bin.",
    'battery': "🔋 **Dispose of Properly!** Batteries are hazardous and should be taken to a specialized recycling center.",
    'clothes': "👕 **Donate or Repurpose!** Old clothes and shoes can be donated or recycled at textile collection points.",
    'shoes': "👟 **Donate or Repurpose!** Old clothes and shoes can be donated or recycled at textile collection points.",
    'cardboard': "📦 **Recycle!** Flatten cardboard boxes and place them in the paper recycling bin."
}

# ==============================================================================
# 2. MODEL BUILDING AND TRAINING FUNCTION
# ==============================================================================

def build_and_train_model():
    """
    Sets up the data generators, builds the MobileNetV2 transfer learning model, 
    and trains it using the real dataset from Kaggle.
    """
    
    # 2.1. Data Generator Setup
    print("Setting up data generators...")
    train_datagen = ImageDataGenerator(
        rescale=1./255,             # Normalize pixel values
        validation_split=0.2,       # Split data into training and validation sets
        rotation_range=20,          # Data augmentation techniques
        horizontal_flip=True
    )

    train_generator = train_datagen.flow_from_directory(
        DATA_DIR,
        target_size=(IMG_WIDTH, IMG_HEIGHT),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training'
    )

    validation_generator = train_datagen.flow_from_directory(
        DATA_DIR,
        target_size=(IMG_WIDTH, IMG_HEIGHT),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation'
    )
    
    # 2.2. Model Definition (Transfer Learning)
    print("\nSetting up MobileNetV2 for Transfer Learning...")
    
    # Load the pre-trained MobileNetV2 base model
    base_model = MobileNetV2(
        input_shape=(IMG_WIDTH, IMG_HEIGHT, 3),
        include_top=False, 
        weights='imagenet' 
    )
    base_model.trainable = False # Freeze the pre-trained base layers

    # Build the sequential model with the new classification head
    model = Sequential([
        base_model,
        GlobalAveragePooling2D(), # Condenses the feature map output
        Dense(len(CLASS_NAMES), activation='softmax') # Final output layer
    ])

    model.compile(optimizer='adam',
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])
    
    # 2.3. Training
    print("\nStarting Model Training on the Kaggle dataset...")
    # This will take a significant amount of time due to the large dataset size
    model.fit(
        train_generator,
        epochs=EPOCHS,
        validation_data=validation_generator,
        verbose=1
    )
    
    model.save(MODEL_PATH)
    print(f"\n✅ Model training complete. Saved as '{MODEL_PATH}'")
    return model, train_generator.class_indices

# ==============================================================================
# 3. CLASSIFICATION FUNCTION
# ==============================================================================

def classify_waste(image_path, model, class_indices):
    """
    Loads an image, predicts the waste class, and returns the suggestion.
    """
    
    # 3.1. Load and Preprocess Image
    try:
        img = load_img(image_path, target_size=(IMG_WIDTH, IMG_HEIGHT))
    except FileNotFoundError:
        return "Error", "File not found at specified path."
    
    img_array = img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    img_array /= 255.0 # Rescale/Normalize
    
    # 3.2. Predict Class
    predictions = model.predict(img_array, verbose=0)
    predicted_class_index = np.argmax(predictions)
    
    # Reverse the class indices map to get the class name
    idx_to_class = {v: k for k, v in class_indices.items()}
    predicted_class_name = idx_to_class.get(predicted_class_index, 'trash')

    # 3.3. Get Suggestion
    suggestion = DISPOSAL_SUGGESTIONS.get(predicted_class_name, DISPOSAL_SUGGESTIONS['trash'])

    return predicted_class_name, suggestion

# ==============================================================================
# 4. MAIN EXECUTION BLOCK
# ==============================================================================

if __name__ == "__main__":
    
    # --- Step A: Train Model ---
    # The script will load data from your specified DATA_DIR and train the model
    trained_model, class_indices = build_and_train_model()
    
    # --- Step B: Test Classification on a sample from your dataset ---
    print("\n" + "="*50)
    print("TESTING CLASSIFICATION ON A SAMPLE IMAGE")
    print("="*50)

    # To test, replace the path below with a path to one of the images in your downloaded dataset.
    # Example: 'path/to/your/GarbageClassificationV2/garbage_classification/plastic/plastic1.jpg'
    test_class = 'plastic'
    test_image_name = 'plastic_11.jpg' 
    test_image_path = os.path.join(DATA_DIR, test_class, test_image_name)
    
    if os.path.exists(test_image_path):
        print(f"Attempting to classify image: {test_image_path}")
        category, disposal_tip = classify_waste(test_image_path, trained_model, class_indices)
        
        print(f"\n➡️ **Test Image:** {test_image_name}")
        print("-" * 30)
        print(f"✅ **CLASSIFIED AS:** {category}")
        print(f"💡 **DISPOSAL SUGGESTION:** {disposal_tip}")
        print("-" * 30)
    else:
        print(f"Error: Test image path '{test_image_path}' not found. Please update the path in the script.")
