CardioAI

CardioAI is an AI-powered clinical decision support system for cardiovascular risk assessment.

It helps doctors, clinics, and hospitals estimate cardiovascular risk using machine learning and provides clinical recommendations, patient history, and risk interpretation.

Main Features

Cardiovascular risk prediction
Risk probability and risk label
Clinical action plan
Patient history
Patient trajectory monitoring
Doctor, clinic, and hospital plans
Authentication system
Supabase integration
Stripe subscription integration
Technologies Used

Frontend

React
Vite
TypeScript
Tailwind CSS
shadcn/ui
Supabase Auth
👥 Team

Name	GitHub	Role
CHERIFI Khadidja	khadidja20442	Data Preparation Lead
ZIATI Ikhlasse	ikhlasse07	Project Manager & Report Lead
ROUABHI Rania		Model Implementation Lead
BRIK Fatima		Results & Visualization Lead
Dr. Abderrahmane Khiat		Supervisor/Mentor
Backend

FastAPI
Python
scikit-learn
KNN model
Supabase
Project Structure

backend/
frontend/cardioai-heart-guardian-main/
docs/
presentation/
results/
demo/

How to Run the Project Locally
1. Run the Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app:app --reload

The backend will run on:

http://127.0.0.1:8000
2. Run the Frontend
cd frontend/cardioai-heart-guardian-main
npm install
npm run dev

The frontend will run on a local Vite server.

Demo Video

A short demo video is available in the demo/ folder.
It shows how the final application works, including patient data entry, prediction generation, clinical action plan, and patient history.

Documentation

The docs/ folder contains project documentation, model summary, and user guide.

Results

The results/ folder contains evaluation results such as model metrics, confusion matrix, and ROC curve.

Team

CardioAI Project Team
University of Saida Dr. Tahar Moulay