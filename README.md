# 🏙️ Airbnb Room Type Classifier
 
> Predict whether an NYC Airbnb listing is an entire home, a private room, or a shared room — from just its price, location, and booking stats.
 
**🔗 Live demo:** [airbnb-room-type-classifier-1.onrender.com](https://airbnb-room-type-classifier-1.onrender.com)
 
---
 
## Overview
 
This project trains a machine learning model on the [NYC Airbnb 2019 dataset](http://insideairbnb.com/) to classify a listing's room type from its numeric and categorical attributes (location, price, reviews, availability, host listing count, borough, and neighbourhood). It ships as a **FastAPI** backend serving a scikit-learn pipeline, paired with a lightweight **HTML/CSS/JS** frontend where anyone can enter a listing's details and get a live prediction with class probabilities.
 
## Key Features
 
- 🤖 **Trained ML pipeline** — Random Forest classifier (tuned via `RandomizedSearchCV`), with preprocessing (imputation, scaling, one-hot encoding) baked into a single `scikit-learn` `Pipeline`, serialized with `joblib`
- ⚡ **FastAPI backend** — a `/predict` endpoint with request validation via Pydantic, returning the predicted room type and per-class probabilities
- 🖥️ **Interactive web UI** — a form for all 10 input features, with borough → neighbourhood autocomplete and live probability bars
- 🌐 **CORS-enabled API** — ready to be called from any frontend origin
- 📊 **~85% accuracy / 0.73 macro F1** on held-out test data (see [Model Performance](#model-performance))
## Screenshot
 
![App screenshot placeholder](docs/screenshot.png)
<!-- Replace docs/screenshot.png with an actual screenshot of the UI -->
 
## Tech Stack
 
| Layer | Technology |
|---|---|
| Backend API | Python, FastAPI, Uvicorn |
| ML / Data | scikit-learn, pandas, NumPy, joblib |
| Validation | Pydantic |
| Frontend | HTML5, CSS3, vanilla JavaScript |
| Model dev | Jupyter Notebook |
| Deployment | Render |
 
## Model Performance
 
| Model | Accuracy | Macro F1 |
|---|---|---|
| Logistic Regression | 0.659 | 0.522 |
| Decision Tree | 0.782 | 0.647 |
| **Random Forest (final)** | **0.851** | **0.715** |
| Gradient Boosting | 0.850 | 0.705 |
 
Final tuned model on the held-out test set: **Accuracy 0.855**, **Macro F1 0.734**.
 
Full training, comparison, and tuning steps are in [`Airbnb_Room_Type_Classification.ipynb`](Airbnb_Room_Type_Classification.ipynb).
 
## Project Structure
 
```
Airbnb-Room-Type-Classifier/
├── main.py                                  # FastAPI app & /predict endpoint
├── Model_Pipeline.pkl                       # Trained scikit-learn pipeline (preprocessing + model)
├── Airbnb_Room_Type_Classification.ipynb    # Data exploration, training & evaluation
├── AB_NYC_2019.csv                          # Training dataset
├── index.html                               # Frontend UI
├── script.js                                # Frontend logic (calls the API)
├── style.css                                # Frontend styling
├── requirements.txt                         # Python dependencies
└── README.md
```
 
## Getting Started (run it in 5 minutes)
 
### Prerequisites
 
- Python 3.9+
- pip
### 1. Clone the repo
 
```bash
git clone https://github.com/Sahilattar/Airbnb-Room-Type-Classifier.git
cd Airbnb-Room-Type-Classifier
```
 
### 2. Create a virtual environment (recommended)
 
```bash
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
```
 
### 3. Install dependencies
 
```bash
pip install -r requirements.txt
```
 
### 4. Start the API server
 
```bash
uvicorn main:app --reload
```
 
The API will be running at `http://127.0.0.1:8000`. You can check it's alive at `http://127.0.0.1:8000/` and view interactive API docs at `http://127.0.0.1:8000/docs`.
 
### 5. Open the frontend
 
Open `index.html` directly in your browser (double-click it, or serve it with any static server). By default the UI calls the deployed live API — to point it at your local server instead, open the app's settings panel and set the API base URL to `http://127.0.0.1:8000`.
 
That's it — fill in the listing details and click **Predict room type**.
 
## API Usage
 
**POST** `/predict`
 
```bash
curl -X POST https://airbnb-room-type-classifier-1.onrender.com/predict \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 40.7128,
    "longitude": -74.0060,
    "price": 150,
    "minimum_nights": 3,
    "number_of_reviews": 24,
    "reviews_per_month": 1.2,
    "calculated_host_listings_count": 2,
    "availability_365": 180,
    "neighbourhood_group": "Manhattan",
    "neighbourhood": "Chelsea"
  }'
```
 
**Response:**
 
```json
{
  "Predicted_room_type": "Entire home/apt",
  "Probability": [0.71, 0.24, 0.05]
}
```
 
## Dataset
 
Trained on the public [NYC Airbnb Open Data (2019)](http://insideairbnb.com/) dataset, included in this repo as `AB_NYC_2019.csv`.
 
## License
 
No license specified yet — consider adding one (e.g. MIT) if you plan to share or accept contributions.
