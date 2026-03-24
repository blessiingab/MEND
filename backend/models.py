from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, Float, ForeignKey, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

class UserType(enum.Enum):
    youth = "youth"
    therapist = "therapist"
    mentor = "mentor"

class SessionType(enum.Enum):
    video = "video"
    voice = "voice"
    text = "text"

class BookingStatus(enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    completed = "completed"
    cancelled = "cancelled"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    user_type = Column(Enum(UserType), nullable=False)
    age = Column(Integer)
    location = Column(String)
    bio = Column(Text)
    avatar = Column(String)  # URL or path
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    assessments = relationship("Assessment", back_populates="user")
    therapy_bookings = relationship("TherapyBooking", back_populates="user")
    stories = relationship("Story", back_populates="user")
    story_comments = relationship("StoryComment", back_populates="user")
    career_assessments = relationship("CareerAssessment", back_populates="user")

class Therapist(Base):
    __tablename__ = "therapists"

    id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    specialty = Column(String)
    rating = Column(Float, default=0.0)
    sessions_count = Column(Integer, default=0)
    emoji = Column(String)  # Single emoji
    available_slots = Column(JSON)  # List of available time slots
    languages = Column(JSON)  # List of languages spoken
    is_verified = Column(Boolean, default=False)

    # Relationship back to user
    user = relationship("User")

class Mentor(Base):
    __tablename__ = "mentors"

    id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    title = Column(String)
    specialty = Column(String)
    industry = Column(String)
    mentee_connections = Column(Integer, default=0)

    # Relationship back to user
    user = relationship("User")

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    answers = Column(JSON, nullable=False)  # Store assessment answers as JSON
    overall_score = Column(Float)
    recommendation = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    user = relationship("User", back_populates="assessments")

class TherapyBooking(Base):
    __tablename__ = "therapy_bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    therapist_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    scheduled_date = Column(DateTime(timezone=True), nullable=False)
    session_type = Column(Enum(SessionType), nullable=False)
    status = Column(Enum(BookingStatus), default=BookingStatus.pending)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="therapy_bookings", foreign_keys=[user_id])
    therapist = relationship("User", foreign_keys=[therapist_id])

class Story(Base):
    __tablename__ = "stories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    emoji = Column(String)
    tags = Column(JSON)  # List of tags
    is_anonymous = Column(Boolean, default=False)
    likes_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="stories")
    comments = relationship("StoryComment", back_populates="story")

class StoryComment(Base):
    __tablename__ = "story_comments"

    id = Column(Integer, primary_key=True, index=True)
    story_id = Column(Integer, ForeignKey("stories.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    story = relationship("Story", back_populates="comments")
    user = relationship("User", back_populates="story_comments")

class CareerAssessment(Base):
    __tablename__ = "career_assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    results = Column(JSON, nullable=False)  # Store assessment results as JSON
    score = Column(Float)  # Percentage score
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    user = relationship("User", back_populates="career_assessments")

class JobPosting(Base):
    __tablename__ = "job_postings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    level = Column(String)  # Entry, Mid, Senior
    location = Column(String)
    description = Column(Text)
    url = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    icon = Column(String)  # Emoji
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())