import io
import sys
import torch
import numpy as np
from PIL import Image
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from torchvision import transforms
from tensorflow import keras

# ================== Retina Setup ================== #
sys.path.append(r"M:\assignments\SIH-2\NFCure\app\vision-scan\retinaapi")
import model as retina_model

retina_classes = ["No DR", "Mild", "Moderate", "Severe", "Proliferative DR"]
retina_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=(0.485, 0.456, 0.406),
                         std=(0.229, 0.224, 0.225))
])
retina_weights = r"M:\assignments\SIH2025\Retinal_blindness_project\classifier.pt"
retina_model_ft = retina_model.load_model(retina_weights)
retina_model_ft.eval()

# ================== Skin Setup ================== #
skin_model_path = r"M:\assignments\SIH2025\skinwala\model.h5"
skin_model = keras.models.load_model(skin_model_path, compile=False)
skin_classes = [
    "Actinic keratoses",
    "Basal cell carcinoma",
    "Benign keratosis-like lesions",
    "Dermatofibroma",
    "Melanoma",
    "Melanocytic nevi",
    "Vascular lesions"
]
SKIN_IMG_SIZE = 224

# ================== FastAPI App ================== #
app = FastAPI(title="Vision Scan API (Retina + Skin)")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Vision Scan API (Retina + Skin) is running 🚀"}

# Retina Prediction
@app.post("/predict/retina/")
async def predict_retina(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        img_tensor = retina_transforms(image).unsqueeze(0)

        with torch.no_grad():
            outputs = retina_model_ft(img_tensor)
            probs = torch.softmax(outputs, 1)[0]
            pred_idx = torch.argmax(probs).item()
            pred_class = retina_classes[pred_idx]

        return {
            "filename": file.filename,
            "prediction": pred_class,
            "confidence": float(probs[pred_idx] * 100),
            "class_probabilities": {
                retina_classes[i]: float(probs[i] * 100) for i in range(len(retina_classes))
            }
        }
    except Exception as e:
        return {"error": str(e)}

# Skin Prediction
@app.post("/predict/skin/")
async def predict_skin(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        img = Image.open(io.BytesIO(contents)).convert("RGB")
        img = img.resize((SKIN_IMG_SIZE, SKIN_IMG_SIZE))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        preds = skin_model.predict(img_array)
        pred_idx = np.argmax(preds, axis=1)[0]
        pred_class = skin_classes[pred_idx]
        confidence = float(np.max(preds)) * 100

        results = {skin_classes[i]: float(preds[0][i]) * 100 for i in range(len(skin_classes))}

        return {
            "filename": file.filename,
            "prediction": pred_class,
            "confidence": confidence,
            "class_probabilities": results
        }
    except Exception as e:
        return {"error": str(e)}
