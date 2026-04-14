# 🌞 Solar Panel Defect Detection System

An end-to-end deep learning system for detecting defects in solar panels using image classification. The project includes a trained MobileNetV2 model, optimized ONNX inference, a FastAPI backend, and a deployed frontend for real-time predictions.

---

## 🚀 Demo

* 🎥 Demo Video: [Watch Demo](https://github.com/snehpatel38/solar-panel-defect-classification/blob/main/demo/solar-defect-demo.mp4)

---

## 🧠 Problem Statement

Solar panels are prone to various defects such as dust accumulation, bird droppings, and physical damage, which reduce efficiency. Manual inspection is slow and expensive.

This project automates defect detection using AI, enabling faster and scalable monitoring.

---

## 🏗️ System Architecture

```
Frontend (React / Vercel)
        ↓
FastAPI Backend (Render)
        ↓
ONNX Runtime
        ↓
MobileNetV2 Model
```

---

## 🧩 Features

* 🔍 Image-based defect classification
* ⚡ Fast inference using ONNX Runtime
* 📦 Dockerized backend
* 🌐 Live deployed API
* 🖥️ Simple frontend for image upload
* 🚀 Quantized model for optimized performance

---

## 🧪 Classes Detected

* Bird-drop
* Clean
* Dusty
* Electrical-Damage
* Physical-Damage
* Snow-Covered

---

## ⚙️ Tech Stack

### 🔹 Machine Learning

* PyTorch (training)
* ONNX (model export)
* ONNX Runtime (inference)

### 🔹 Backend

* FastAPI
* Uvicorn

### 🔹 Frontend

* React

### 🔹 Deployment

* Render (Backend)
* Vercel (Frontend)
* Docker

---

## 📊 Model Details

* Architecture: MobileNetV2
* Input Size: 224 × 224
* Output Classes: 6
* Optimization: Dynamic Quantization (INT8)

---

## 📦 Installation (Local Setup)

### 1. Clone repository

```bash
git clone https://github.com/your-username/solar-defect-api.git
cd solar-defect-api
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Run API

```bash
uvicorn app:app --reload
```

### 4. Open Swagger UI

```
http://127.0.0.1:8000/docs
```

---

## 🐳 Docker Setup

### Build

```bash
docker build -t solar-defect-api .
```

### Run

```bash
docker run -p 8000:8000 solar-defect-api
```

---

## 🔌 API Usage

### Endpoint

```
POST /predict
```

### Request

* Form-data:

  * `file`: image file (jpg/png)

### Response

```json
{
  "prediction": "Dusty",
  "confidence": 92.3
}
```

---

## ⚡ Performance

* Optimized ONNX inference
* Reduced model size via quantization
* Low latency API response

---

## 📁 Project Structure

```
.
├── app.py
├── solar_quant.onnx
├── requirements.txt
├── Dockerfile
├── frontend/
└── README.md
```

---

## 📌 Future Improvements

* Grad-CAM visualization
* Batch inference support
* Real-time drone inspection integration
* Model accuracy improvements

---

## 👤 Author

**Sneh Patel**

* GitHub: https://github.com/your-username
* LinkedIn: (Add your profile)

---

## ⭐ Acknowledgements

* ONNX Runtime team
* PyTorch community
* Open-source contributors

---
