import onnxruntime as ort
import numpy as np
from fastapi import FastAPI, File, UploadFile
from PIL import Image
import io

app = FastAPI()

# ---- CONFIG ----
MODEL_PATH = "solar_defect_model.onnx"

CLASS_NAMES = [
    "Bird-drop",
    "Clean",
    "Dusty",
    "Electrical-Damage",
    "Physical-Damage",
    "Snow-Covered"
]

IMG_SIZE = 224

# ---- LOAD MODEL ----
session = ort.InferenceSession(MODEL_PATH, providers=["CPUExecutionProvider"])
input_name = session.get_inputs()[0].name
output_name = session.get_outputs()[0].name

# ---- PREPROCESS FUNCTION ----
def preprocess(image):
    image = image.resize((224, 224))

    # Convert to float32 immediately
    image = np.array(image).astype(np.float32) / 255.0

    mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
    std = np.array([0.229, 0.224, 0.225], dtype=np.float32)

    image = (image - mean) / std

    image = np.transpose(image, (2, 0, 1))

    image = np.expand_dims(image, axis=0)

    return image.astype(np.float32)


# ---- HEALTH CHECK ----
@app.get("/")
def home():
    return {"message": "Solar Defect Detection API Running"}

# ---- PREDICTION ENDPOINT ----
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Read image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        # Preprocess
        input_tensor = preprocess(image)

        # Inference
        outputs = session.run([output_name], {input_name: input_tensor})

        # Softmax
        exp_scores = np.exp(outputs[0])
        probs = exp_scores / np.sum(exp_scores, axis=1, keepdims=True)

        pred_idx = int(np.argmax(probs))
        confidence = float(probs[0][pred_idx])

        return {
            "prediction": CLASS_NAMES[pred_idx],
            "confidence": round(confidence * 100, 2)
        }

    except Exception as e:
        return {"error": str(e)}