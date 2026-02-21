from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    profiles = relationship("CorpusProfile", back_populates="owner")

class CorpusProfile(Base):
    __tablename__ = "corpus_profiles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    age = Column(Integer, default=30)
    wage = Column(Float, default=125000)
    inflation = Column(Float, default=5.5)
    
    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="profiles")
    
    transactions = relationship("Transaction", back_populates="profile", cascade="all, delete-orphan")
    rules = relationship("Rule", back_populates="profile", cascade="all, delete-orphan")

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, nullable=False)
    amount = Column(Float, nullable=False)
    
    profile_id = Column(Integer, ForeignKey("corpus_profiles.id"))
    profile = relationship("CorpusProfile", back_populates="transactions")

class Rule(Base):
    __tablename__ = "rules"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, nullable=False) # 'Q', 'P', 'K'
    value = Column(Float, nullable=True) # fixed for Q, extra for P
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    
    profile_id = Column(Integer, ForeignKey("corpus_profiles.id"))
    profile = relationship("CorpusProfile", back_populates="rules")
