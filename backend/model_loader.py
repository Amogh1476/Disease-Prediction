import os
import joblib

class ModelLoader:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelLoader, cls).__new__(cls)
            cls._instance._load_models()
        return cls._instance

    def _load_models(self):
        # Resolve paths relative to current file / project root
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        model_path = os.path.join(base_dir, "models", "disease_model.pkl")
        columns_path = os.path.join(base_dir, "models", "symptom_columns.pkl")

        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at: {model_path}")
        if not os.path.exists(columns_path):
            raise FileNotFoundError(f"Symptom columns file not found at: {columns_path}")

        print(f"Loading model from: {model_path}")
        self.model = joblib.load(model_path)
        print(f"Loading symptom columns from: {columns_path}")
        self.symptom_columns = joblib.load(columns_path)
        print(f"Successfully loaded model with {len(self.symptom_columns)} symptom columns.")

    def get_model(self):
        return self.model

    def get_symptom_columns(self):
        return self.symptom_columns


# Helper function for quick access
def get_model_and_symptoms():
    loader = ModelLoader()
    return loader.get_model(), loader.get_symptom_columns()
