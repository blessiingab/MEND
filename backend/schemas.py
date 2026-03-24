from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class UserType(str, Enum):
    youth = "youth"
    therapist = "therapist"
    mentor = "mentor"

class SessionType(str, Enum):
    video = "video"
    voice = "voice"
    text = "text"

class BookingStatus(str, Enum):
    pending = "pending"
    confirmed = "confirmed"
    completed = "completed"
    cancelled = "cancelled"

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str
    user_type: UserType
    age: Optional[int] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

# Therapist schemas
class TherapistBase(BaseModel):
    specialty: Optional[str] = None
    emoji: Optional[str] = None
    available_slots: Optional[List[Dict[str, Any]]] = None
    languages: Optional[List[str]] = None

class TherapistCreate(TherapistBase):
    pass

class Therapist(TherapistBase):
    id: int
    rating: float
    sessions_count: int
    is_verified: bool

    class Config:
        from_attributes = True

# Assessment schemas
class AssessmentBase(BaseModel):
    answers: Dict[str, Any]
    overall_score: Optional[float] = None
    recommendation: Optional[str] = None

class AssessmentCreate(AssessmentBase):
    pass

class Assessment(AssessmentBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Therapy Booking schemas
class TherapyBookingBase(BaseModel):
    therapist_id: int
    scheduled_date: datetime
    session_type: SessionType
    notes: Optional[str] = None

class TherapyBookingCreate(TherapyBookingBase):
    pass

class TherapyBookingUpdate(BaseModel):
    status: Optional[BookingStatus] = None
    notes: Optional[str] = None

class TherapyBooking(TherapyBookingBase):
    id: int
    user_id: int
    status: BookingStatus
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

# Story schemas
class StoryBase(BaseModel):
    title: str
    content: str
    emoji: Optional[str] = None
    tags: Optional[List[str]] = None
    is_anonymous: bool = False

class StoryCreate(StoryBase):
    pass

class StoryUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    emoji: Optional[str] = None
    tags: Optional[List[str]] = None
    is_anonymous: Optional[bool] = None

class Story(StoryBase):
    id: int
    user_id: int
    likes_count: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

# Story Comment schemas
class StoryCommentBase(BaseModel):
    content: str

class StoryCommentCreate(StoryCommentBase):
    pass

class StoryComment(StoryCommentBase):
    id: int
    story_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Career Assessment schemas
class CareerAssessmentBase(BaseModel):
    results: Dict[str, Any]
    score: Optional[float] = None

class CareerAssessmentCreate(CareerAssessmentBase):
    pass

class CareerAssessment(CareerAssessmentBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Job Posting schemas
class JobPostingBase(BaseModel):
    title: str
    company: str
    level: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None

class JobPostingCreate(JobPostingBase):
    pass

class JobPosting(JobPostingBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Resource schemas
class ResourceBase(BaseModel):
    title: str
    category: str
    content: str
    icon: Optional[str] = None

class ResourceCreate(ResourceBase):
    pass

class Resource(ResourceBase):
    id: int
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None