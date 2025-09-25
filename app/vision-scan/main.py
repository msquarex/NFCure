import torch
from torchvision import transforms
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import sys, os

# Add repo path
sys.path.append(r"M:\assignments\SIH-2\NFCure\app\vision-scan\retinaapi")

import model  # your Retinal_blindness_detection_Pytorch repo

# ================== Setup ================== #
app = FastAPI(title="Retinal Blindness Detection API")

# Allow CORS (frontend ↔ backend communication)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev, restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Classes
classes = ['No DR', 'Mild', 'Moderate', 'Severe', 'Proliferative DR']

# Transforms
test_transforms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=(0.485, 0.456, 0.406),
                         std=(0.229, 0.224, 0.225))
])

# Load trained model
weights_path = r"M:\assignments\SIH-2\NFCure\app\vision-scan\retinaapi\classifier.pt"
model_ft = model.load_model(weights_path)
model_ft.eval()

# ================== Routes ================== #
@app.get("/")
def root():
    return {"message": "Retinal Blindness Detection API is running 🚀"}


@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        img_tensor = test_transforms(image).unsqueeze(0)

        with torch.no_grad():
            outputs = model_ft(img_tensor)
            _, pred_idx = torch.max(outputs, 1)
            pred_class = classes[pred_idx.item()]

        return {
            "filename": file.filename,
            "prediction": pred_class,
        }

    except Exception as e:
        return {"error": str(e)}
