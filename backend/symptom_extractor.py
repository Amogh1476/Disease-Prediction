import re
from typing import List, Dict, Tuple

# Comprehensive dictionary mapping natural language phrases, synonyms, and variations
# to exact column names present in symptom_columns.pkl
SYMPTOM_SYNONYMS: Dict[str, List[str]] = {
    "itching": ["itching", "itchy", "scratchy skin", "body itch", "skin itch"],
    "skin_rash": ["skin rash", "rash", "red spots on skin", "skin breakouts", "skin eruptions"],
    "nodal_skin_eruptions": ["nodal skin eruptions", "skin bumps", "nodules on skin", "lumps on skin"],
    "continuous_sneezing": ["continuous sneezing", "sneezing", "sneezing non stop", "constant sneezing"],
    "shivering": ["shivering", "shivers", "body trembling", "shaking from cold"],
    "chills": ["chills", "feeling cold", "cold shivers", "chilly feeling"],
    "joint_pain": ["joint pain", "pain in joints", "aching joints", "joint aches"],
    "stomach_pain": ["stomach pain", "stomach ache", "belly pain", "abdominal pain", "tummy ache", "stomach hurts", "pain in stomach"],
    "acidity": ["acidity", "heartburn", "acid reflux", "sour stomach", "stomach burn"],
    "ulcers_on_tongue": ["ulcers on tongue", "tongue ulcers", "mouth sores", "canker sores"],
    "muscle_wasting": ["muscle wasting", "muscle loss", "shrinking muscles", "muscle weakness"],
    "vomiting": ["vomiting", "throwing up", "vomit", "puking", "threw up", "throw up", "emesis"],
    "burning_micturition": ["burning micturition", "burning urination", "pain when peeing", "burning sensation when urinating", "burn while peeing"],
    "spotting_ urination": ["spotting urination", "blood in urine", "spotting urine", "urinary spotting"],
    "fatigue": ["fatigue", "tiredness", "exhaustion", "extreme fatigue", "feeling tired", "drained", "no energy"],
    "weight_gain": ["weight gain", "gaining weight", "put on weight", "unexplained weight gain"],
    "anxiety": ["anxiety", "anxious", "nervousness", "panic", "feeling fearful"],
    "cold_hands_and_feets": ["cold hands and feet", "cold hands and feets", "cold limbs", "chilly feet", "cold fingers"],
    "mood_swings": ["mood swings", "moody", "emotional changes", "irritability swings"],
    "weight_loss": ["weight loss", "losing weight", "lost weight", "unexplained weight loss"],
    "restlessness": ["restlessness", "restless", "unable to sit still", "fidgety"],
    "lethargy": ["lethargy", "lethargic", "sluggishness", "feeling lazy", "drowsiness"],
    "patches_in_throat": ["patches in throat", "white patches in throat", "sore throat patches", "throat lesions"],
    "irregular_sugar_level": ["irregular sugar level", "high blood sugar", "fluctuating sugar", "diabetes sugar spike", "low blood sugar"],
    "cough": ["cough", "coughing", "dry cough", "persistent cough", "hacking cough"],
    "high_fever": ["high fever", "fever", "high temperature", "running a fever", "body hot", "pyrexia", "feverish"],
    "sunken_eyes": ["sunken eyes", "hollow eyes", "dark sunken eyes", "dehydrated eyes"],
    "breathlessness": ["breathlessness", "shortness of breath", "can't breathe", "cannot breathe", "difficulty breathing", "gasping for air", "trouble breathing"],
    "sweating": ["sweating", "excessive sweating", "perspiration", "profuse sweating", "sweats"],
    "dehydration": ["dehydration", "dehydrated", "excessive thirst", "parched throat"],
    "indigestion": ["indigestion", "upset stomach", "dyspepsia", "bad digestion", "bloated stomach"],
    "headache": ["headache", "head pain", "head hurts", "throbbing head", "migraine", "pain in head"],
    "yellowish_skin": ["yellowish skin", "yellow skin", "jaundice skin", "pale yellow skin"],
    "dark_urine": ["dark urine", "brown urine", "deep yellow urine", "dark colored urine"],
    "nausea": ["nausea", "nauseous", "feeling sick", "queasy", "sick to stomach"],
    "loss_of_appetite": ["loss of appetite", "no appetite", "don't feel like eating", "not hungry", "reduced appetite"],
    "pain_behind_the_eyes": ["pain behind the eyes", "eye pain", "pain behind eyes", "throbbing behind eyes"],
    "back_pain": ["back pain", "backache", "lower back pain", "upper back pain", "spine pain"],
    "constipation": ["constipation", "constipated", "hard stool", "difficulty passing stool", "irregular bowel"],
    "abdominal_pain": ["abdominal pain", "cramps in abdomen", "lower belly pain", "lower abdominal pain"],
    "diarrhoea": ["diarrhoea", "diarrhea", "loose motion", "watery stool", "loose stools", "frequent motions"],
    "mild_fever": ["mild fever", "slight fever", "low grade fever", "warm body"],
    "yellow_urine": ["yellow urine", "bright yellow urine", "yellowish urine"],
    "yellowing_of_eyes": ["yellowing of eyes", "yellow eyes", "icteric eyes", "jaundice eyes"],
    "acute_liver_failure": ["acute liver failure", "liver failure", "hepatic failure"],
    "fluid_overload": ["fluid overload", "fluid retention", "water retention", "body swelling"],
    "swelling_of_stomach": ["swelling of stomach", "stomach swelling", "distended stomach", "bloated belly"],
    "swelled_lymph_nodes": ["swelled lymph nodes", "swollen lymph nodes", "swollen glands", "gland swelling"],
    "malaise": ["malaise", "feeling unwell", "general discomfort", "feeling sick overall"],
    "blurred_and_distorted_vision": ["blurred and distorted vision", "blurred vision", "cloudy vision", "blurry vision", "distorted vision"],
    "phlegm": ["phlegm", "mucus", "thick phlegm", "throat phlegm", "sputum"],
    "throat_irritation": ["throat irritation", "scratchy throat", "sore throat", "itchy throat", "throat pain"],
    "redness_of_eyes": ["redness of eyes", "red eyes", "bloodshot eyes", "eye redness"],
    "sinus_pressure": ["sinus pressure", "sinus pain", "clogged sinuses", "facial pressure"],
    "runny_nose": ["runny nose", "running nose", "nasal discharge", "rhinorrhea"],
    "congestion": ["congestion", "nasal congestion", "stuffy nose", "blocked nose"],
    "chest_pain": ["chest pain", "pain in chest", "chest pressure", "chest tightness", "heart pain"],
    "weakness_in_limbs": ["weakness in limbs", "weak legs", "weak arms", "limb weakness"],
    "fast_heart_rate": ["fast heart rate", "rapid heartbeat", "tachycardia", "racing heart", "heart beating fast"],
    "pain_during_bowel_movements": ["pain during bowel movements", "painful defecation", "pain passing stool"],
    "pain_in_anal_region": ["pain in anal region", "anal pain", "rectal pain"],
    "bloody_stool": ["bloody stool", "blood in stool", "rectal bleeding", "bloody motion"],
    "irritation_in_anus": ["irritation in anus", "anal itching", "anal irritation"],
    "neck_pain": ["neck pain", "stiff neck", "pain in neck", "neck stiffness"],
    "dizziness": ["dizziness", "dizzy", "lightheaded", "lightheadedness", "feeling faint", "giddiness"],
    "cramps": ["cramps", "muscle cramps", "stomach cramps", "leg cramps"],
    "bruising": ["bruising", "bruises", "easy bruising", "black and blue marks"],
    "obesity": ["obesity", "overweight", "excessive body fat"],
    "swollen_legs": ["swollen legs", "leg swelling", "swelling in legs", "edema in legs"],
    "swollen_blood_vessels": ["swollen blood vessels", "varicose veins", "bulging veins"],
    "puffy_face_and_eyes": ["puffy face and eyes", "face swelling", "puffy eyes", "facial puffiness"],
    "enlarged_thyroid": ["enlarged thyroid", "goiter", "thyroid swelling", "swollen thyroid"],
    "brittle_nails": ["brittle nails", "breaking nails", "weak nails"],
    "swollen_extremeties": ["swollen extremeties", "swollen hands", "swollen feet", "extremity swelling"],
    "excessive_hunger": ["excessive hunger", "increased hunger", "polyphagia", "always hungry"],
    "extra_marital_contacts": ["extra marital contacts", "unprotected sex", "multiple sexual partners"],
    "drying_and_tingling_lips": ["drying and tingling lips", "dry lips", "chapped lips", "tingling lips"],
    "slurred_speech": ["slurred speech", "difficulty speaking", "speech slurring", "mumbled speech"],
    "knee_pain": ["knee pain", "pain in knee", "joint knee pain"],
    "hip_joint_pain": ["hip joint pain", "hip pain", "pain in hip"],
    "muscle_weakness": ["muscle weakness", "weak muscles", "loss of muscle strength"],
    "stiff_neck": ["stiff neck", "neck stiffness", "rigid neck"],
    "swelling_joints": ["swelling joints", "swollen joints", "joint swelling"],
    "movement_stiffness": ["movement stiffness", "stiff movements", "body stiffness"],
    "spinning_movements": ["spinning movements", "vertigo", "room spinning"],
    "loss_of_balance": ["loss of balance", "unbalanced", "off balance", "losing balance"],
    "unsteadiness": ["unsteadiness", "unsteady", "shaky feet", "wobbly walking"],
    "weakness_of_one_body_side": ["weakness of one body side", "one sided weakness", "hemiparesis", "left side weakness", "right side weakness"],
    "loss_of_smell": ["loss of smell", "cannot smell", "no smell", "anosmia"],
    "bladder_discomfort": ["bladder discomfort", "bladder pressure", "discomfort in bladder"],
    "foul_smell_of urine": ["foul smell of urine", "smelly urine", "foul urine odor", "stinky urine"],
    "continuous_feel_of_urine": ["continuous feel of urine", "constant urge to pee", "frequent urge to urinate"],
    "passage_of_gases": ["passage of gases", "gas", "flatulence", "farting", "passing gas", "bloating gas"],
    "internal_itching": ["internal itching", "inside itching", "deep itching"],
    "toxic_look_(typhos)": ["toxic look", "typhoid look", "toxic appearance", "severely ill appearance"],
    "depression": ["depression", "depressed", "feeling down", "feeling hopeless", "low mood"],
    "irritability": ["irritability", "irritable", "easily annoyed", "short tempered"],
    "muscle_pain": ["muscle pain", "myalgia", "body ache", "body pain", "aching muscles", "muscle soreness"],
    "altered_sensorium": ["altered sensorium", "confusion", "disorientation", "altered consciousness", "mental confusion"],
    "red_spots_over_body": ["red spots over body", "red spots on body", "skin spots", "petechiae"],
    "belly_pain": ["belly pain", "abdominal ache", "tummy pain"],
    "abnormal_menstruation": ["abnormal menstruation", "irregular periods", "heavy periods", "menstrual irregularity"],
    "dischromic _patches": ["dischromic patches", "discolored skin patches", "skin discoloration", "skin patches"],
    "watering_from_eyes": ["watering from eyes", "watery eyes", "tearing eyes", "excessive tearing"],
    "increased_appetite": ["increased appetite", "eating more", "high appetite"],
    "polyuria": ["polyuria", "frequent urination", "peeing a lot", "excessive urination", "constant peeing"],
    "family_history": ["family history", "genetic history", "hereditary condition"],
    "mucoid_sputum": ["mucoid sputum", "mucus cough", "phlegmy cough"],
    "rusty_sputum": ["rusty sputum", "brownish phlegm", "rusty colored cough"],
    "lack_of_concentration": ["lack of concentration", "brain fog", "poor focus", "cannot concentrate"],
    "visual_disturbances": ["visual disturbances", "vision changes", "seeing spots", "flashing lights"],
    "receiving_blood_transfusion": ["receiving blood transfusion", "blood transfusion history", "got blood transfusion"],
    "receiving_unsterile_injections": ["receiving unsterile injections", "unsterile needle", "dirty needle injection"],
    "coma": ["coma", "unconscious", "unconsciousness", "loss of consciousness"],
    "stomach_bleeding": ["stomach bleeding", "gastrointestinal bleeding", "bleeding in stomach", "vomiting blood"],
    "distention_of_abdomen": ["distention of abdomen", "swollen abdomen", "abdominal swelling", "distended belly"],
    "history_of_alcohol_consumption": ["history of alcohol consumption", "heavy drinking", "alcohol history", "frequent drinking"],
    "fluid_overload.1": ["fluid overload secondary", "severe fluid retention"],
    "blood_in_sputum": ["blood in sputum", "coughing up blood", "hemoptysis", "bloody phlegm"],
    "prominent_veins_on_calf": ["prominent veins on calf", "visible calf veins", "bulging leg veins"],
    "palpitations": ["palpitations", "heart pounding", "fluttering heart", "heart fluttering"],
    "painful_walking": ["painful walking", "pain while walking", "difficulty walking", "limping due to pain"],
    "pus_filled_pimples": ["pus filled pimples", "pus pimples", "pustules", "acne with pus"],
    "blackheads": ["blackheads", "comedones", "blackhead pimples"],
    "scurring": ["scurring", "skin scarring", "acne scars"],
    "skin_peeling": ["skin peeling", "peeling skin", "flaking skin", "desquamation"],
    "silver_like_dusting": ["silver like dusting", "silvery scales", "flaky silver skin", "psoriasis scales"],
    "small_dents_in_nails": ["small dents in nails", "pitting nails", "nail pitting", "dented nails"],
    "inflammatory_nails": ["inflammatory nails", "swollen nail beds", "nail inflammation"],
    "blister": ["blister", "blisters", "skin blisters", "fluid filled bumps"],
    "red_sore_around_nose": ["red sore around nose", "nasal sores", "redness around nose"],
    "yellow_crust_ooze": ["yellow crust ooze", "crusty skin", "oozing yellow fluid", "impetigo crusts"]
}


def clean_text(text: str) -> str:
    """Lowercase text and clean special punctuation for robust pattern matching."""
    if not text:
        return ""
    text = text.lower().strip()
    # Replace hyphens/underscores with space
    text = re.sub(r'[-_]', ' ', text)
    # Remove excessive whitespace
    text = re.sub(r'\s+', ' ', text)
    return text


def extract_symptoms(text: str, symptom_columns: List[str]) -> List[str]:
    """
    Given natural language text, extracts matched symptom keys matching symptom_columns.pkl.
    Uses multi-word phrase matching and boundary regex.
    """
    cleaned_input = clean_text(text)
    if not cleaned_input:
        return []

    detected_symptoms = set()

    # 1. Match phrases from SYMPTOM_SYNONYMS
    for symptom_key, phrases in SYMPTOM_SYNONYMS.items():
        if symptom_key in symptom_columns or any(col.strip() == symptom_key.strip() for col in symptom_columns):
            for phrase in phrases:
                cleaned_phrase = clean_text(phrase)
                pattern = r'\b' + re.escape(cleaned_phrase) + r'\b'
                if re.search(pattern, cleaned_input):
                    detected_symptoms.add(symptom_key)
                    break

    # 2. Fallback: match direct column names (replacing underscores with spaces)
    for col in symptom_columns:
        col_clean = clean_text(col)
        if len(col_clean) > 3:
            pattern = r'\b' + re.escape(col_clean) + r'\b'
            if re.search(pattern, cleaned_input):
                detected_symptoms.add(col)

    # Return list maintaining original column casing/formatting from symptom_columns
    result = []
    for col in symptom_columns:
        if col in detected_symptoms:
            result.append(col)
    return result


def create_symptom_vector(detected_symptoms: List[str], symptom_columns: List[str]) -> List[int]:
    """
    Creates a 132-dimensional binary vector (0 or 1) matching symptom_columns.
    """
    vector = [0] * len(symptom_columns)
    detected_set = set(detected_symptoms)

    for idx, col in enumerate(symptom_columns):
        if col in detected_set:
            vector[idx] = 1

    return vector
