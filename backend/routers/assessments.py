from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Assessment
from schemas import Assessment as AssessmentSchema, AssessmentCreate
from main import get_current_user
from models import User

router = APIRouter()

@router.post("/", response_model=AssessmentSchema)
def create_assessment(
    assessment: AssessmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_assessment = Assessment(
        user_id=current_user.id,
        answers=assessment.answers,
        overall_score=assessment.overall_score,
        recommendation=assessment.recommendation
    )
    db.add(db_assessment)
    db.commit()
    db.refresh(db_assessment)
    return db_assessment

@router.get("/", response_model=List[AssessmentSchema])
def read_assessments(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    assessments = db.query(Assessment).filter(Assessment.user_id == current_user.id).offset(skip).limit(limit).all()
    return assessments

@router.get("/{assessment_id}", response_model=AssessmentSchema)
def read_assessment(
    assessment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    assessment = db.query(Assessment).filter(
        Assessment.id == assessment_id,
        Assessment.user_id == current_user.id
    ).first()
    if assessment is None:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return assessment