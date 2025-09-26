from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"])

# Load your actual model and preprocessor
try:
    with open("model/rf_model.pkl", "rb") as f:
        model = pickle.load(f)
    
    with open("model/preprocessing.pkl", "rb") as f:
        preprocessor = pickle.load(f)
    print("Model and preprocessor loaded successfully!")
    
except Exception as e:
    print(f"Error loading model: {e}")
    model = None
    preprocessor = None

def prepare_features_for_model(data):
    """
    Prepare features exactly as your model expects them.
    Based on your training columns:
    ['General_Health', 'Checkup', 'Exercise', 'Skin_Cancer', 'Other_Cancer',
     'Diabetes', 'Arthritis', 'Age_Category', 'Height_(cm)', 'Weight_(kg)', 
     'BMI', 'Smoking_History', 'Alcohol_Consumption', 'Fruit_Consumption', 
     'Green_Vegetables_Consumption', 'FriedPotato_Consumption', 'Sex_Female', 'Sex_Male']
    
    Note: Depression was dropped from features in your model
    """
    
    # Create a DataFrame with the input data
    df = pd.DataFrame([data])
    
    # 1. General_Health mapping (OrdinalEncoder categories)
    health_mapping = {
        'Poor': 0, 'Very Good': 1, 'Good': 2, 'Fair': 3, 'Excellent': 4
    }
    df['General_Health'] = df['General_Health'].map(health_mapping)
    
    # 2. Checkup mapping
    checkup_mapping = {
        'Never': 0,
        'Within the past year': 1,
        'Within the past 2 years': 2,
        'Within the past 5 years': 3,
        '5 or more years ago': 5
    }
    df['Checkup'] = df['Checkup'].map(checkup_mapping)
    
    # 3. Yes/No binary encoding (1 for Yes, 0 for No)
    yesno_columns = ['Exercise', 'Skin_Cancer', 'Other_Cancer', 'Diabetes', 'Arthritis', 'Smoking_History']
    for col in yesno_columns:
        df[col] = df[col].map({'Yes': 1, 'No': 0})
    
    # 4. Age Category mapping
    age_mapping = {
        "18-24": 22, "25-29": 27, "30-34": 32, "35-39": 37, "40-44": 42,
        "45-49": 47, "50-54": 52, "55-59": 57, "60-64": 62, "65-69": 67,
        "70-74": 72, "75-79": 77, "80+": 85
    }
    df['Age_Category'] = df['Age_Category'].map(age_mapping)
    
    # 5. Handle Sex as one-hot encoding
    df['Sex_Female'] = 1 if data.get('Sex') == 'Female' else 0
    df['Sex_Male'] = 1 if data.get('Sex') == 'Male' else 0
    
    # 6. Rename height/weight columns to match your model
    if 'Height_cm' in df.columns:
        df = df.rename(columns={'Height_cm': 'Height_(cm)'})
    if 'Weight_kg' in df.columns:
        df = df.rename(columns={'Weight_kg': 'Weight_(kg)'})
    
    # 7. Ensure all required columns are present in correct order
    required_columns = [
        'General_Health', 'Checkup', 'Exercise', 'Skin_Cancer', 'Other_Cancer',
        'Diabetes', 'Arthritis', 'Age_Category', 'Height_(cm)', 'Weight_(kg)', 
        'BMI', 'Smoking_History', 'Alcohol_Consumption', 'Fruit_Consumption', 
        'Green_Vegetables_Consumption', 'FriedPotato_Consumption', 'Sex_Female', 'Sex_Male'
    ]
    
    # Reorder columns and fill missing with 0
    df = df.reindex(columns=required_columns, fill_value=0)
    
    return df.values

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        print(f"Received data: {data}")
        
        if not data:
            return jsonify({"error": "No data received"}), 400
        
        # Prepare features for your model
        features = prepare_features_for_model(data)
        print(f"Prepared features shape: {features.shape}")
        print(f"Prepared features: {features}")
        
        if model is None:
            # Fallback prediction if model failed to load
            return jsonify({
                "error": "Model not loaded. Please check model files.",
                "prediction": 0,
                "probability": 20.0
            }), 500
        
        # Make prediction using your trained model
        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0]
        
        # probability[0] is chance of no heart disease, probability[1] is chance of heart disease
        heart_disease_probability = probability[1] * 100
        
        result = {
            "prediction": int(prediction),
            "probability": round(heart_disease_probability, 2)
        }
        
        print(f"Prediction result: {result}")
        return jsonify(result)
        
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health_check():
    model_status = "loaded" if model else "not loaded"
    return jsonify({
        "status": "API is running",
        "model_status": model_status
    })

@app.route("/model-info", methods=["GET"])
def model_info():
    if model:
        return jsonify({
            "model_type": str(type(model)),
            "model_loaded": True,
            "expected_features": [
                'General_Health', 'Checkup', 'Exercise', 'Skin_Cancer', 'Other_Cancer',
                'Diabetes', 'Arthritis', 'Age_Category', 'Height_(cm)', 'Weight_(kg)', 
                'BMI', 'Smoking_History', 'Alcohol_Consumption', 'Fruit_Consumption', 
                'Green_Vegetables_Consumption', 'FriedPotato_Consumption', 'Sex_Female', 'Sex_Male'
            ]
        })
    else:
        return jsonify({"model_loaded": False, "error": "Model not loaded"})

if __name__ == "__main__":
    print("Starting Flask server...")
    print("Expected model features match your training data")
    app.run(debug=True, host='0.0.0.0', port=5000)