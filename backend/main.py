# main.py
try:
    import ssl
except ImportError:
    import sys
    sys.modules['ssl'] = None

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr, Field
import joblib
import numpy as np

app = FastAPI()
model = joblib.load("lead_model.pkl")

keywords = {
    'urgent': 10,
    'not interested': -10,
    'call later': -5,
    'just browsing': -15,
    'looking for 3BHK': 5
}

class Lead(BaseModel):
    email: EmailStr
    credit_score: int = Field(ge=300, le=850)
    income: int = Field(ge=0)
    clicks: int = Field(ge=0)
    time_on_site: float = Field(ge=0)
    age_group: str
    family_background: str
    city_tier: str
    comments: str

'''
@app.post("/score")
def score_lead(lead: Lead):
    try:
        le_age = {'18-25': 0, '26-35': 1, '36-50': 2, '51+': 3}
        le_family = {'Single': 0, 'Married': 1, 'Married with Kids': 2}
        le_city = {'T1': 0, 'T2': 1, 'T3': 2}

        X = np.array([[lead.credit_score, lead.income, lead.clicks, lead.time_on_site,
                       le_age[lead.age_group], le_family[lead.family_background], le_city[lead.city_tier]]])

        initial_score = model.predict_proba(X)[0][1] * 100

        # Apply LLM reranker logic
        adjustment = 0
        for word, weight in keywords.items():
            if word in lead.comments.lower():
                adjustment += weight

        reranked_score = max(0, min(100, initial_score + adjustment))

        return {
            "initial_score": round(initial_score, 2),
            "reranked_score": round(reranked_score, 2),
            "comments": lead.comments
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
'''

@app.post("/score")
def score_lead(lead: Lead):
    try:
        print("Incoming request:", lead)

        le_age = {'18-25': 0, '26-35': 1, '36-50': 2, '51+': 3}
        le_family = {'Single': 0, 'Married': 1, 'Married with Kids': 2}
        le_city = {'T1': 0, 'T2': 1, 'T3': 2}

        X = np.array([[lead.credit_score, lead.income, lead.clicks, lead.time_on_site,
                       le_age[lead.age_group], le_family[lead.family_background], le_city[lead.city_tier]]])

        print("Input vector to model:", X)

        initial_score = model.predict_proba(X)[0][1] * 100
        print("Initial score:", initial_score)

        adjustment = sum(weight for word, weight in keywords.items() if word in lead.comments.lower())
        reranked_score = max(0, min(100, initial_score + adjustment))
        print("Final score:", reranked_score)

        return {
            "initial_score": float(round(initial_score, 2)),
            "reranked_score": float(round(reranked_score, 2)),
            "comments": lead.comments
        }

    except Exception as e:
        print("ERROR:", str(e))  # 🔴 Log this to Render logs
        raise HTTPException(status_code=500, detail=str(e))
