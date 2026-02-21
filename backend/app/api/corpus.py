from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.utils.db import get_db
from app.utils.auth import get_current_user
from app.models.database import User, CorpusProfile, Transaction, Rule
from app.models.corpus import CorpusProfileCreate, CorpusProfileSchema

router = APIRouter()

@router.post("/", response_model=CorpusProfileSchema)
def create_profile(
    profile_in: CorpusProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_profile = CorpusProfile(
        name=profile_in.name,
        age=profile_in.age,
        wage=profile_in.wage,
        inflation=profile_in.inflation,
        user_id=current_user.id
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    
    # Add initial transactions
    for tx in profile_in.transactions:
        db_tx = Transaction(**tx.model_dump(), profile_id=new_profile.id)
        db.add(db_tx)
        
    # Add initial rules
    for rule in profile_in.rules:
        db_rule = Rule(**rule.model_dump(), profile_id=new_profile.id)
        db.add(db_rule)
        
    db.commit()
    db.refresh(new_profile)
    return new_profile

@router.get("/", response_model=List[CorpusProfileSchema])
def get_profiles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(CorpusProfile).filter(CorpusProfile.user_id == current_user.id).all()

@router.get("/{profile_id}", response_model=CorpusProfileSchema)
def get_profile(
    profile_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = db.query(CorpusProfile).filter(
        CorpusProfile.id == profile_id,
        CorpusProfile.user_id == current_user.id
    ).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.delete("/{profile_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_profile(
    profile_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = db.query(CorpusProfile).filter(
        CorpusProfile.id == profile_id,
        CorpusProfile.user_id == current_user.id
    ).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    db.delete(profile)
    db.commit()
    return None
