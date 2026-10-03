import pandas as pd
import numpy as np
from typing import List, Dict, Any
from model_loader import get_model_and_symptoms

# Disease explanations, severity mapping, and recommended medical specialists
DISEASE_METADATA: Dict[str, Dict[str, Any]] = {
    "Fungal infection": {
        "severity": "Low",
        "description": "A fungal skin or nail infection causing itching, redness, or peeling.",
        "precautions": ["Keep the affected area clean and dry", "Use prescribed antifungal cream", "Avoid sharing personal items like towels"],
        "recommended_specialist": "Dermatologist"
    },
    "Allergy": {
        "severity": "Low to Moderate",
        "description": "An immune system reaction to a substance such as pollen, food, or dust.",
        "precautions": ["Avoid known allergens", "Take antihistamines if prescribed", "Stay indoors during high pollen days"],
        "recommended_specialist": "Allergist / Immunologist"
    },
    "GERD": {
        "severity": "Moderate",
        "description": "Gastroesophageal reflux disease occurs when stomach acid frequently flows back into the esophagus.",
        "precautions": ["Avoid spicy and greasy foods", "Do not lie down immediately after meals", "Eat smaller, more frequent meals"],
        "recommended_specialist": "Gastroenterologist"
    },
    "Chronic cholestasis": {
        "severity": "Moderate to High",
        "description": "Reduction or stoppage of bile flow from the liver.",
        "precautions": ["Consult a gastroenterologist", "Follow a low-fat diet", "Avoid alcohol consumption"],
        "recommended_specialist": "Hepatologist / Gastroenterologist"
    },
    "Drug Reaction": {
        "severity": "Moderate to High",
        "description": "An adverse reaction or allergy to a specific medication.",
        "precautions": ["Discontinue suspect medication immediately under doctor guidance", "Seek medical evaluation", "Keep a list of known drug allergies"],
        "recommended_specialist": "Dermatologist / Allergist"
    },
    "Peptic ulcer diseae": {
        "severity": "Moderate to High",
        "description": "Sores that develop on the lining of the stomach, lower esophagus, or small intestine.",
        "precautions": ["Avoid NSAIDs and aspirin without medical advice", "Avoid alcohol and smoking", "Eat bland, non-spicy foods"],
        "recommended_specialist": "Gastroenterologist"
    },
    "AIDS": {
        "severity": "High to Critical",
        "description": "A chronic, potentially life-threatening condition caused by the human immunodeficiency virus (HIV).",
        "precautions": ["Seek immediate specialist consultation", "Adhere strictly to antiretroviral therapy (ART)", "Practice safe health measures"],
        "recommended_specialist": "Infectious Disease Specialist"
    },
    "Diabetes ": {
        "severity": "High",
        "description": "A group of diseases that result in too much sugar in the blood (high blood glucose).",
        "precautions": ["Monitor blood sugar levels regularly", "Maintain a balanced low-glycemic diet", "Exercise daily and stay hydrated"],
        "recommended_specialist": "Endocrinologist"
    },
    "Gastroenteritis": {
        "severity": "Moderate",
        "description": "An intestinal infection marked by watery diarrhea, abdominal cramps, nausea, and fever.",
        "precautions": ["Drink oral rehydration solutions (ORS)", "Eat light, bland foods (BRAT diet)", "Get plenty of rest"],
        "recommended_specialist": "Gastroenterologist / General Physician"
    },
    "Bronchial Asthma": {
        "severity": "Moderate to High",
        "description": "A condition in which your airways narrow and swell and may produce extra mucus.",
        "precautions": ["Keep inhaler accessible at all times", "Avoid respiratory triggers like smoke and dust", "Seek emergency care if breathing becomes severely difficult"],
        "recommended_specialist": "Pulmonologist"
    },
    "Hypertension ": {
        "severity": "High",
        "description": "High blood pressure condition that can increase risk of heart disease and stroke.",
        "precautions": ["Reduce sodium intake", "Monitor blood pressure regularly", "Engage in regular aerobic exercise"],
        "recommended_specialist": "Cardiologist"
    },
    "Migraine": {
        "severity": "Moderate",
        "description": "A neurological condition that can cause severe throbbing pain or a pulsing sensation.",
        "precautions": ["Rest in a dark, quiet room", "Stay hydrated and manage stress", "Take prescribed migraine medication"],
        "recommended_specialist": "Neurologist"
    },
    "Cervical spondylosis": {
        "severity": "Moderate",
        "description": "Age-related wear and tear affecting the spinal disks in your neck.",
        "precautions": ["Maintain proper neck posture", "Perform gentle neck exercises", "Use an ergonomic pillow"],
        "recommended_specialist": "Orthopedist / Neurologist"
    },
    "Paralysis (brain hemorrhage)": {
        "severity": "Critical",
        "description": "Loss of muscle function caused by bleeding in the brain, requiring urgent emergency care.",
        "precautions": ["Call emergency medical services immediately (911 / 112)", "Do not delay medical evaluation", "Keep the patient calm and comfortable"],
        "recommended_specialist": "Neurologist / Emergency Physician"
    },
    "Jaundice": {
        "severity": "High",
        "description": "A yellow discoloration of the skin, mucous membranes, and eyes caused by elevated bilirubin.",
        "precautions": ["Consult a liver specialist promptly", "Avoid alcohol and fatty foods", "Drink plenty of clean water"],
        "recommended_specialist": "Hepatologist / Gastroenterologist"
    },
    "Malaria": {
        "severity": "High",
        "description": "A mosquito-borne disease caused by a parasite, causing fever, chills, and flu-like illness.",
        "precautions": ["Seek medical blood testing immediately", "Take prescribed antimalarial medication", "Use mosquito nets and repellents"],
        "recommended_specialist": "Infectious Disease Specialist / General Physician"
    },
    "Chicken pox": {
        "severity": "Moderate",
        "description": "A highly contagious viral infection causing an itchy, blister-like rash on the skin.",
        "precautions": ["Isolate to prevent spread", "Apply calamine lotion to reduce itching", "Do not scratch blisters"],
        "recommended_specialist": "General Physician / Pediatrician"
    },
    "Dengue": {
        "severity": "High",
        "description": "A mosquito-borne viral disease causing high fever, severe headache, and muscle/joint pain.",
        "precautions": ["Monitor platelet counts closely", "Stay well-hydrated with fluids and electrolytes", "Avoid NSAIDs like ibuprofen (use paracetamol if advised)"],
        "recommended_specialist": "General Physician / Infectious Disease Specialist"
    },
    "Typhoid": {
        "severity": "High",
        "description": "A bacterial infection caused by Salmonella typhi causing sustained high fever, weakness, and stomach pain.",
        "precautions": ["Complete the full course of prescribed antibiotics", "Drink boiled or bottled water", "Maintain strict hand hygiene"],
        "recommended_specialist": "General Physician / Infectious Disease Specialist"
    },
    "hepatitis A": {
        "severity": "Moderate to High",
        "description": "A highly contagious liver infection caused by the hepatitis A virus.",
        "precautions": ["Get adequate bed rest", "Avoid alcohol completely", "Eat small, high-calorie meals"],
        "recommended_specialist": "Hepatologist / Gastroenterologist"
    },
    "Hepatitis B": {
        "severity": "High",
        "description": "A serious liver infection caused by the hepatitis B virus.",
        "precautions": ["Consult a hepatologist for antiviral therapy", "Avoid alcohol and hepatotoxic drugs", "Inform close contacts for vaccination"],
        "recommended_specialist": "Hepatologist"
    },
    "Hepatitis C": {
        "severity": "High",
        "description": "A viral infection that causes liver inflammation, sometimes leading to serious liver damage.",
        "precautions": ["Seek specialist antiviral treatment", "Avoid alcohol consumption", "Get vaccinated for Hepatitis A and B"],
        "recommended_specialist": "Hepatologist"
    },
    "Hepatitis D": {
        "severity": "High to Critical",
        "description": "A liver disease caused by the hepatitis D virus, occurring only in people infected with Hepatitis B.",
        "precautions": ["Requires specialist medical care", "Strict medical monitoring", "Avoid alcohol"],
        "recommended_specialist": "Hepatologist"
    },
    "Hepatitis E": {
        "severity": "High",
        "description": "A liver disease caused by the hepatitis E virus, mainly transmitted through contaminated drinking water.",
        "precautions": ["Drink clean, purified water", "Ensure complete bed rest", "Avoid alcohol"],
        "recommended_specialist": "Hepatologist"
    },
    "Alcoholic hepatitis": {
        "severity": "High to Critical",
        "description": "Liver inflammation caused by drinking alcohol, requiring immediate medical care and total alcohol cessation.",
        "precautions": ["Stop drinking alcohol completely", "Consult a liver doctor", "Maintain nutritional support"],
        "recommended_specialist": "Hepatologist / Addiction Specialist"
    },
    "Tuberculosis": {
        "severity": "High",
        "description": "A potentially serious infectious bacterial disease that mainly affects the lungs.",
        "precautions": ["Strictly follow prescribed long-term antibiotic course", "Wear a mask to protect others", "Eat a high-protein diet"],
        "recommended_specialist": "Pulmonologist / Infectious Disease Specialist"
    },
    "Common Cold": {
        "severity": "Low",
        "description": "A common viral infection of the nose and throat.",
        "precautions": ["Drink warm fluids", "Get plenty of rest", "Use saline nasal drops for congestion"],
        "recommended_specialist": "General Physician"
    },
    "Pneumonia": {
        "severity": "High",
        "description": "An infection that inflames air sacs in one or both lungs, which may fill with fluid.",
        "precautions": ["Seek medical evaluation for antibiotic or antiviral treatment", "Get plenty of rest and fluids", "Monitor oxygen levels"],
        "recommended_specialist": "Pulmonologist"
    },
    "Dimorphic hemmorhoids(piles)": {
        "severity": "Low to Moderate",
        "description": "Swollen veins in your anus and lower rectum, similar to varicose veins.",
        "precautions": ["Eat high-fiber foods", "Drink plenty of water", "Use warm sitz baths"],
        "recommended_specialist": "Proctologist / General Surgeon"
    },
    "Heart attack": {
        "severity": "Critical",
        "description": "A medical emergency where blood flow to a part of the heart muscle is blocked.",
        "precautions": ["CALL EMERGENCY SERVICES IMMEDIATELY (911 / 112)", "Chew an aspirin if recommended by emergency dispatch", "Keep the person calm and still"],
        "recommended_specialist": "Cardiologist / Emergency Physician"
    },
    "Varicose veins": {
        "severity": "Low to Moderate",
        "description": "Gnarled, enlarged veins, most commonly appearing in the legs and feet.",
        "precautions": ["Elevate legs when resting", "Wear compression stockings", "Avoid sitting or standing for long periods"],
        "recommended_specialist": "Vascular Surgeon / Dermatologist"
    },
    "Hypothyroidism": {
        "severity": "Moderate",
        "description": "A condition in which the thyroid gland doesn't produce enough of certain crucial hormones.",
        "precautions": ["Take daily thyroid hormone replacement as prescribed", "Get periodic TSH blood tests", "Maintain a balanced diet"],
        "recommended_specialist": "Endocrinologist"
    },
    "Hyperthyroidism": {
        "severity": "Moderate to High",
        "description": "The production of too much of the hormone thyroxine by the thyroid gland.",
        "precautions": ["Follow medical advice for antithyroid medications", "Limit excess iodine intake", "Monitor heart rate"],
        "recommended_specialist": "Endocrinologist"
    },
    "Hypoglycemia": {
        "severity": "Moderate to High",
        "description": "An abnormally low level of blood glucose (sugar).",
        "precautions": ["Consume fast-acting carbohydrates immediately (juice, glucose tablets)", "Recheck blood sugar in 15 minutes", "Consult doctor to adjust medication"],
        "recommended_specialist": "Endocrinologist / Diabetologist"
    },
    "Osteoarthristis": {
        "severity": "Moderate",
        "description": "The most common form of arthritis, affecting millions of people worldwide due to joint cartilage wear.",
        "precautions": ["Perform low-impact exercises (swimming, walking)", "Maintain a healthy weight", "Use physical therapy"],
        "recommended_specialist": "Rheumatologist / Orthopedist"
    },
    "Arthritis": {
        "severity": "Moderate",
        "description": "Inflammation of one or more joints, causing pain and stiffness that can worsen with age.",
        "precautions": ["Perform gentle joint mobility exercises", "Apply warm or cold compresses", "Take prescribed anti-inflammatory medication"],
        "recommended_specialist": "Rheumatologist"
    },
    "(vertigo) Paroxysmal  Positional Vertigo": {
        "severity": "Moderate",
        "description": "Brief episodes of mild to intense dizziness triggered by specific changes in head position.",
        "precautions": ["Avoid sudden head movements", "Sit down immediately when dizzy", "Consult a doctor for Epley maneuver exercises"],
        "recommended_specialist": "ENT Specialist / Neurologist"
    },
    "Acne": {
        "severity": "Low",
        "description": "A skin condition that occurs when hair follicles become plugged with oil and dead skin cells.",
        "precautions": ["Wash face gently twice daily with mild cleanser", "Avoid squeezing or popping pimples", "Use non-comedogenic skincare products"],
        "recommended_specialist": "Dermatologist"
    },
    "Urinary tract infection": {
        "severity": "Moderate",
        "description": "An infection in any part of your urinary system — your kidneys, ureters, bladder, and urethra.",
        "precautions": ["Drink plenty of water to flush bacteria", "Take full course of prescribed antibiotics", "Avoid caffeine and alcohol"],
        "recommended_specialist": "Urologist / Nephrologist"
    },
    "Psoriasis": {
        "severity": "Moderate",
        "description": "A skin disease that causes a rash with itchy, scaly patches, most commonly on knees, elbows, trunk and scalp.",
        "precautions": ["Moisturize skin regularly", "Avoid skin injuries and stress triggers", "Use topical treatments as directed by dermatologist"],
        "recommended_specialist": "Dermatologist"
    },
    "Impetigo": {
        "severity": "Low to Moderate",
        "description": "A highly contagious bacterial skin infection causing sores and blisters.",
        "precautions": ["Keep sores clean and covered", "Wash hands frequently", "Use prescribed topical or oral antibiotics"],
        "recommended_specialist": "Dermatologist"
    }
}


def predict_disease(symptom_vector: List[int], top_k: int = 3) -> Dict[str, Any]:
    """
    Given a 132-dim binary symptom vector, predicts top diseases using disease_model.pkl.
    Maps metadata including severity, description, precautions, and recommended specialist.
    """
    model, symptom_columns = get_model_and_symptoms()

    # Convert to DataFrame with feature names to suppress sklearn warning
    vector_df = pd.DataFrame([symptom_vector], columns=symptom_columns)

    # Predict probabilities
    probabilities = model.predict_proba(vector_df)[0]
    classes = model.classes_

    # Zip and sort descending by probability
    disease_probs = sorted(zip(classes, probabilities), key=lambda x: x[1], reverse=True)

    top_predictions = []
    top_specialist = "General Physician"

    for idx, (disease_raw, prob) in enumerate(disease_probs[:top_k]):
        disease_name = str(disease_raw).strip()
        prob_val = float(prob)

        meta = DISEASE_METADATA.get(disease_raw, {
            "severity": "Moderate",
            "description": f"Condition characterized by specified symptoms.",
            "precautions": ["Consult a medical professional for evaluation", "Monitor symptoms closely"],
            "recommended_specialist": "General Physician"
        })

        specialist = meta.get("recommended_specialist", "General Physician")
        if idx == 0:
            top_specialist = specialist

        top_predictions.append({
            "disease": disease_name,
            "probability": round(prob_val, 4),
            "percentage": f"{round(prob_val * 100, 1)}%",
            "severity": meta["severity"],
            "description": meta["description"],
            "precautions": meta["precautions"],
            "recommended_specialist": specialist
        })

    # Standard recommendations
    general_recommendations = [
        "Drink plenty of water and stay hydrated",
        "Get adequate rest and avoid strenuous physical exertion",
        "Monitor your symptoms closely and note any changes",
        "Consult a qualified healthcare professional for formal diagnosis and treatment"
    ]

    disclaimer = (
        "This application is for educational and informational purposes only and is NOT a replacement "
        "for professional medical advice, diagnosis, or treatment. If you are experiencing a medical "
        "emergency, please call your local emergency services (e.g., 911 or 112) immediately."
    )

    return {
        "predictions": top_predictions,
        "recommendations": general_recommendations,
        "recommended_specialist": top_specialist,
        "disclaimer": disclaimer
    }

