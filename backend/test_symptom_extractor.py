import unittest
import pickle
import os
import sys

# Ensure backend directory is in python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from symptom_extractor import extract_symptoms, correct_spelling
from model_loader import get_model_and_symptoms


class TestSymptomExtractorSpelling(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        _, cls.symptom_columns = get_model_and_symptoms()

    def test_single_word_fevr(self):
        symptoms = extract_symptoms("fevr", self.symptom_columns)
        self.assertIn("high_fever", symptoms)

    def test_single_word_hedache(self):
        symptoms = extract_symptoms("hedache", self.symptom_columns)
        self.assertIn("headache", symptoms)

    def test_single_word_vommiting(self):
        symptoms = extract_symptoms("vommiting", self.symptom_columns)
        self.assertIn("vomiting", symptoms)

    def test_single_word_cof(self):
        symptoms = extract_symptoms("cof", self.symptom_columns)
        self.assertIn("cough", symptoms)

    def test_phrase_stomch_pain(self):
        symptoms = extract_symptoms("stomch pain", self.symptom_columns)
        self.assertIn("stomach_pain", symptoms)

    def test_phrase_joint_pn(self):
        symptoms = extract_symptoms("joint pn", self.symptom_columns)
        self.assertIn("joint_pain", symptoms)

    def test_phrase_cant_brethe(self):
        symptoms = extract_symptoms("cant brethe", self.symptom_columns)
        self.assertIn("breathlessness", symptoms)

    def test_sentence_fevr_and_hedache(self):
        symptoms = extract_symptoms("I have fevr and hedache", self.symptom_columns)
        self.assertIn("high_fever", symptoms)
        self.assertIn("headache", symptoms)

    def test_sentence_vommiting_and_stomch_pain(self):
        symptoms = extract_symptoms("I am vommiting and have stomch pain", self.symptom_columns)
        self.assertIn("vomiting", symptoms)
        self.assertIn("stomach_pain", symptoms)

    def test_sentence_cof_and_chest_pn(self):
        symptoms = extract_symptoms("I have cof and chest pn", self.symptom_columns)
        self.assertIn("cough", symptoms)
        self.assertIn("chest_pain", symptoms)


if __name__ == "__main__":
    unittest.main()
