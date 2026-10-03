# AI Medical Symptom Checker & Disease Predictor 🩺🤖

An intelligent, full-stack medical symptom checker powered by a **Random Forest Machine Learning model** and a **FastAPI + React (Vite)** architecture. The system supports natural language symptom descriptions, voice input, interactive symptom selection, and provides top disease predictions with probability confidence scores, medical specialist recommendations, and emergency guidance.

---

## 🌟 Key Features

- **🗣️ Natural Language & Voice Input**: Type or speak your symptoms in plain English (e.g., *"I have a severe headache, high fever, and feeling nauseous"*).
- **🔍 Intelligent NLP Extraction**: Rule-based & dictionary-driven NLP pipeline maps user descriptions to 132 structured clinical symptom columns.
- **Checkbox & Categorized Selection**: Browse and check 132 symptoms grouped by clinical categories (Respiratory, Digestive, Skin, Neurological, etc.).
- **🌲 Random Forest Machine Learning Predictor**: Trained on thousands of clinical records across 41 distinct medical conditions with high validation accuracy.
- **📊 Top-K Probabilistic Ranking**: Returns top 3 candidate disease predictions with calculated percentage confidence scores.
- **👨‍⚕️ Medical Specialist Recommendations**: Suggests appropriate medical specialists (e.g., Cardiologist, Dermatologist, Neurologist) and immediate precautions for each predicted condition.
- **📜 Search & Consultation History**: Persists previous symptom assessments locally for user tracking.
- **⚡ Modern Responsive UI**: Crafted with React 19, Vite, Tailwind CSS v4, Framer Motion animations, and Lucide React icons.

---

## 📁 Project Folder Structure

```text
Disease_Project/
├── backend/
│   ├── main.py                  # FastAPI server entry point & API route handlers
│   ├── model_loader.py          # Singleton loader for ML model (.pkl) & symptom columns
│   ├── predictor.py             # Inference logic, top-k ranking, specialist mapping & precautions
│   ├── symptom_extractor.py     # NLP keyword matching engine & 132-dim binary vector builder
│   └── requirements.txt         # Python dependencies for the backend
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components (Header, VoiceInput, ResultsCard, etc.)
│   │   ├── pages/               # Application pages (HomePage, SymptomCheckerPage, HistoryPage)
│   │   ├── utils/               # API service layer (api.js) & multi-language translations
│   │   ├── App.jsx              # Main app wrapper & tab routing
│   │   ├── main.jsx             # React DOM entrypoint
│   │   └── index.css            # Tailwind CSS imports & global styles
│   ├── package.json             # Frontend dependencies & NPM scripts
│   └── vite.config.js           # Vite dev server configuration
├── models/
│   ├── disease_model.pkl        # Serialized Scikit-Learn Random Forest Classifier model
│   └── symptom_columns.pkl      # Pickled list of 132 training symptom column names
├── data/
│   ├── Training.csv             # 4,920 sample dataset for training (132 symptoms + prognosis label)
│   └── Testing.csv              # 42 test cases for evaluation
├── notebooks/
│   ├── prjct.ipynb              # Primary Jupyter notebook for EDA, model training & evaluation
│   └── fast.ipynb               # Lightweight experimentation notebook
├── .gitignore                   # Files excluded from Git tracking
└── README.md                    # Project documentation
```

---

## 🛠️ Technologies Used

### Backend
- **Python 3.10+**
- **FastAPI**: Modern, high-performance web framework for APIs.
- **Uvicorn**: Lightning-fast ASGI server.
- **Scikit-Learn**: Machine learning library used for training the Random Forest Classifier.
- **Pandas & NumPy**: Data processing and array manipulation.
- **Joblib**: Efficient serialization of ML models and feature column metadata.
- **Pydantic**: Data validation and API request schema enforcement.

### Frontend
- **React 19**: Modern UI component library.
- **Vite 8**: Next-generation frontend build tool and dev server.
- **Tailwind CSS v4**: Utility-first CSS framework for modern styling.
- **Framer Motion**: Smooth animations and UI micro-interactions.
- **Lucide React**: Crisp vector iconography.
- **Web Speech API**: Browser-native speech-to-text recognition for voice input.

---

## 💻 Installation & Setup Guide (Windows)

### Prerequisites
1. **Python 3.10 or higher**: [Download Python](https://www.python.org/downloads/) (Check *"Add Python to PATH"* during setup).
2. **Node.js 18 or higher**: [Download Node.js](https://nodejs.org/).

---

### Step 1: Clone the Repository
```powershell
git clone https://github.com/Amogh1476/Disease_Project.git
cd Disease_Project
```

---

### Step 2: Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```powershell
   cd backend
   ```
2. Create and activate a Python virtual environment (recommended):
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```
3. Install Python dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
4. Start the FastAPI backend server:
   ```powershell
   python main.py
   ```
   *The backend server will start at `http://127.0.0.1:8000`.*
   *API documentation is interactively available at `http://127.0.0.1:8000/docs`.*

---

### Step 3: Frontend Setup
1. Open a new terminal window and navigate to the `frontend` folder:
   ```powershell
   cd Disease_Project\frontend
   ```
2. Install Node.js packages:
   ```powershell
   npm install
   ```
3. Start the Vite development server:
   ```powershell
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

---

## ⚙️ How the ML Model Works & Re-training

The prediction engine relies on two serialized model artifacts located in `models/`:
1. `disease_model.pkl`: Scikit-Learn `RandomForestClassifier` trained on 132 binary symptom attributes across 41 disease prognosis classes.
2. `symptom_columns.pkl`: Ordered list of 132 symptom column names matching the exact input feature structure expected by the model.

### Re-training the Model from Scratch
To retrain the model using the raw dataset:
1. Ensure Jupyter Notebook is installed (`pip install jupyter`).
2. Launch Jupyter Notebook from the project root:
   ```powershell
   jupyter notebook notebooks/prjct.ipynb
   ```
3. Run all cells in `prjct.ipynb`. The notebook will:
   - Read `data/Training.csv` and `data/Testing.csv`.
   - Perform feature engineering & target encoding.
   - Train the `RandomForestClassifier`.
   - Export the updated model artifacts directly to `models/disease_model.pkl` and `models/symptom_columns.pkl`.

---

## 🔁 End-to-End Execution Workflow

```text
  [ User Input ] (Text or Voice) + [ Optional Manual Checkboxes ]
                        │
                        ▼
           [ NLP Symptom Extractor ]
    (Synonym matching & REGEX phrase identification)
                        │
                        ▼
        [ 132-Dimensional Binary Vector ]
      (1 for detected symptoms, 0 for absent)
                        │
                        ▼
         [ Random Forest ML Model ]
      (Calculates class probability array)
                        │
                        ▼
        [ Post-Processing Predictor ]
   (Ranks Top 3, assigns Specialists & Precautions)
                        │
                        ▼
         [ React Frontend Interface ]
    (Interactive Cards, Progress Bars & Consultation History)
```

---

## 📸 Screenshots

*(Add screenshots of your application here after launching!)*

| Home Dashboard | Symptom Checker | Prediction Results |
|:---:|:---:|:---:|
| *(Add Screenshot)* | *(Add Screenshot)* | *(Add Screenshot)* |

---

## 🚫 Files Excluded from GitHub (`.gitignore`)

The following files and directories are automatically ignored to prevent uploading build artifacts, virtual environments, or temporary files:
- `__pycache__/`, `*.pyc` (Python compiled bytecode)
- `node_modules/`, `dist/` (Node packages & production build outputs)
- `.venv/`, `venv/` (Python virtual environments)
- `.ipynb_checkpoints/` (Jupyter notebook autosave checkpoints)
- `.env` (Environment variables)

---

## 🔮 Future Improvements

- **Integration with LLM APIs**: Add AI medical assistant chat powered by Gemini or OpenAI APIs.
- **Multi-language Audio Speech-to-Text**: Support voice recognition in multiple global languages.
- **PDF Diagnostic Summary Export**: Download symptom report as a clean PDF document for doctor visits.
- **Geographic Clinic Locator**: Map nearest hospital and clinic locations based on user GPS coordinates.

---

## ⚠️ Medical Disclaimer

> **IMPORTANT**: This software is built for **educational, demonstration, and research purposes only**. It does **NOT** provide professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions regarding a medical condition. If you think you may have a medical emergency, call your local emergency services immediately.
