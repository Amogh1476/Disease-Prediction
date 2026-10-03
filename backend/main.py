from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

from model_loader import get_model_and_symptoms
from symptom_extractor import extract_symptoms, create_symptom_vector, correct_spelling, SYMPTOM_SYNONYMS
from predictor import predict_disease

app = FastAPI(
    title="AI Medical Symptom Checker API",
    description="Full-stack AI medical symptom checker using Scikit-Learn Random Forest model",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictRequest(BaseModel):
    text: Optional[str] = Field(default="", description="Natural language symptoms input")
    selected_symptoms: Optional[List[str]] = Field(default=[], description="List of explicitly checked symptom column names")


@app.get("/")
def read_root():
    return {"message": "Medical API is running"}


@app.get("/symptoms")
def get_symptoms():
    """
    Returns the list of all 132 symptoms available in the model,
    formatted with display names, categories, and sample synonyms.
    """
    _, symptom_columns = get_model_and_symptoms()

    symptoms_data = []
    for col in symptom_columns:
        display_name = col.replace('_', ' ').replace('  ', ' ').strip().title()
        
        # Categorize symptom based on name
        category = "General"
        col_lower = col.lower()
        if any(w in col_lower for w in ["cough", "breath", "sneezing", "phlegm", "throat", "runny", "sinus", "chest"]):
            category = "Respiratory"
        elif any(w in col_lower for w in ["stomach", "vomit", "nausea", "diarrhoea", "indigestion", "belly", "acid", "ulcer", "constipation", "bowel", "stool"]):
            category = "Digestive"
        elif any(w in col_lower for w in ["skin", "rash", "itch", "pimple", "blackhead", "blister", "peeling", "spot", "ulcer"]):
            category = "Skin & Dermatological"
        elif any(w in col_lower for w in ["headache", "dizzy", "spinning", "sensorium", "balance", "speech", "smell", "vision", "brain"]):
            category = "Neurological"
        elif any(w in col_lower for w in ["joint", "knee", "hip", "muscle", "back", "neck", "limb", "cramp", "walk"]):
            category = "Musculoskeletal"
        elif any(w in col_lower for w in ["urine", "micturition", "peeing", "bladder", "urinary"]):
            category = "Urinary"

        synonyms = SYMPTOM_SYNONYMS.get(col, [display_name.lower()])

        symptoms_data.append({
            "key": col,
            "display_name": display_name,
            "category": category,
            "synonyms": synonyms
        })

    return {
        "count": len(symptoms_data),
        "symptoms": symptoms_data
    }


@app.post("/predict")
def predict(request: PredictRequest):
    """
    Accepts natural language text and/or explicitly checked symptoms.
    Applies rapidfuzz spelling correction, extracts symptoms via NLP, builds 132-dim vector,
    and returns top predictions, recommended specialist, recommendations, and debug info.
    """
    _, symptom_columns = get_model_and_symptoms()

    # 0. Perform rapidfuzz spelling correction on natural language input
    corrected_sentence = correct_spelling(request.text, symptom_columns) if request.text else ""

    # 1. NLP symptom extraction from text
    nlp_detected = extract_symptoms(request.text, symptom_columns) if request.text else []

    # 2. Combine NLP detected symptoms + manually checked symptoms
    manual_checked = request.selected_symptoms or []
    all_detected_set = set(nlp_detected).union(set(manual_checked))

    # Clean and filter to ensure valid keys
    valid_detected = [col for col in symptom_columns if col in all_detected_set]

    # 3. Build 132-dimensional binary vector
    symptom_vector = create_symptom_vector(valid_detected, symptom_columns)

    # 4. Predict top 3 diseases
    prediction_result = predict_disease(symptom_vector, top_k=3)

    return {
        "detected_symptoms": valid_detected,
        "symptom_count": len(valid_detected),
        "predictions": prediction_result["predictions"],
        "recommendations": prediction_result["recommendations"],
        "recommended_specialist": prediction_result.get("recommended_specialist", "General Physician"),
        "disclaimer": prediction_result["disclaimer"],
        "debug": {
            "user_input": request.text or "",
            "corrected_sentence": corrected_sentence,
            "extracted_symptoms": valid_detected,
            "symptom_vector": symptom_vector,
            "symptom_columns": symptom_columns
        }
    }



if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)