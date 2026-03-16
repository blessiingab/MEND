from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import os
from datetime import datetime

app = Flask(__name__, static_folder='../frontend/public', static_url_path='')
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///mend.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key')

db = SQLAlchemy(app)
jwt = JWTManager(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), default='user')  # user, admin
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    profile = db.relationship('UserProfile', backref='user', uselist=False)
    assessments = db.relationship('Assessment', backref='user')
    therapy_sessions = db.relationship('TherapySession', backref='user')
    creative_posts = db.relationship('CreativePost', backref='user')

class UserProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    bio = db.Column(db.Text)
    avatar = db.Column(db.String(200))
    mood_history = db.Column(db.JSON)

class Assessment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False)  # mental_health, career, etc.
    score = db.Column(db.Float)
    results = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class TherapySession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    therapist_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    scheduled_at = db.Column(db.DateTime)
    status = db.Column(db.String(20), default='scheduled')  # scheduled, completed, cancelled
    notes = db.Column(db.Text)

class CreativePost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # story, art
    title = db.Column(db.String(200))
    content = db.Column(db.Text)
    tags = db.Column(db.JSON)
    is_anonymous = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    likes = db.Column(db.Integer, default=0)

class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    company = db.Column(db.String(100))
    description = db.Column(db.Text)
    requirements = db.Column(db.Text)
    location = db.Column(db.String(100))
    salary_range = db.Column(db.String(50))
    posted_at = db.Column(db.DateTime, default=datetime.utcnow)

class Resource(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text)
    category = db.Column(db.String(50))
    type = db.Column(db.String(20))  # article, video, etc.
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    hashed_password = generate_password_hash(data['password'])
    user = User(username=data['username'], email=data['email'], password_hash=hashed_password)
    db.session.add(user)
    db.session.commit()
    
    access_token = create_access_token(identity=user.id)
    return jsonify({'access_token': access_token, 'user': {'id': user.id, 'username': user.username, 'email': user.email}})

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password_hash, data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify({'access_token': access_token, 'user': {'id': user.id, 'username': user.username, 'email': user.email}})
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/profile', methods=['GET', 'PUT'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if request.method == 'GET':
        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'profile': {
                'first_name': user.profile.first_name if user.profile else None,
                'last_name': user.profile.last_name if user.profile else None,
                'bio': user.profile.bio if user.profile else None,
                'avatar': user.profile.avatar if user.profile else None
            } if user.profile else None
        })
    
    data = request.get_json()
    if not user.profile:
        user.profile = UserProfile(user_id=user.id)
    
    user.profile.first_name = data.get('first_name')
    user.profile.last_name = data.get('last_name')
    user.profile.bio = data.get('bio')
    user.profile.avatar = data.get('avatar')
    
    db.session.commit()
    return jsonify({'message': 'Profile updated'})

@app.route('/api/assessments', methods=['GET', 'POST'])
@jwt_required()
def assessments():
    user_id = get_jwt_identity()
    
    if request.method == 'GET':
        assessments = Assessment.query.filter_by(user_id=user_id).all()
        return jsonify([{
            'id': a.id,
            'type': a.type,
            'score': a.score,
            'results': a.results,
            'created_at': a.created_at.isoformat()
        } for a in assessments])
    
    data = request.get_json()
    assessment = Assessment(
        user_id=user_id,
        type=data['type'],
        score=data.get('score'),
        results=data.get('results')
    )
    db.session.add(assessment)
    db.session.commit()
    return jsonify({'id': assessment.id, 'message': 'Assessment saved'})

@app.route('/api/therapy/sessions', methods=['GET', 'POST'])
@jwt_required()
def therapy_sessions():
    user_id = get_jwt_identity()
    
    if request.method == 'GET':
        sessions = TherapySession.query.filter_by(user_id=user_id).all()
        return jsonify([{
            'id': s.id,
            'therapist_id': s.therapist_id,
            'scheduled_at': s.scheduled_at.isoformat() if s.scheduled_at else None,
            'status': s.status,
            'notes': s.notes
        } for s in sessions])
    
    data = request.get_json()
    session = TherapySession(
        user_id=user_id,
        therapist_id=data.get('therapist_id'),
        scheduled_at=datetime.fromisoformat(data['scheduled_at']) if data.get('scheduled_at') else None,
        notes=data.get('notes')
    )
    db.session.add(session)
    db.session.commit()
    return jsonify({'id': session.id, 'message': 'Session booked'})

@app.route('/api/creative/posts', methods=['GET', 'POST'])
@jwt_required()
def creative_posts():
    if request.method == 'GET':
        posts = CreativePost.query.filter_by(is_anonymous=False).all()
        return jsonify([{
            'id': p.id,
            'user_id': p.user_id,
            'type': p.type,
            'title': p.title,
            'content': p.content,
            'tags': p.tags,
            'created_at': p.created_at.isoformat(),
            'likes': p.likes
        } for p in posts])
    
    data = request.get_json()
    user_id = get_jwt_identity()
    post = CreativePost(
        user_id=user_id,
        type=data['type'],
        title=data.get('title'),
        content=data['content'],
        tags=data.get('tags', []),
        is_anonymous=data.get('is_anonymous', False)
    )
    db.session.add(post)
    db.session.commit()
    return jsonify({'id': post.id, 'message': 'Post created'})

@app.route('/api/jobs', methods=['GET'])
def jobs():
    jobs = Job.query.all()
    return jsonify([{
        'id': j.id,
        'title': j.title,
        'company': j.company,
        'description': j.description,
        'requirements': j.requirements,
        'location': j.location,
        'salary_range': j.salary_range,
        'posted_at': j.posted_at.isoformat()
    } for j in jobs])

@app.route('/api/resources', methods=['GET'])
def resources():
    resources = Resource.query.all()
    return jsonify([{
        'id': r.id,
        'title': r.title,
        'content': r.content,
        'category': r.category,
        'type': r.type,
        'created_at': r.created_at.isoformat()
    } for r in resources])

# Admin routes
@app.route('/api/admin/users', methods=['GET'])
@jwt_required()
def admin_users():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    users = User.query.all()
    return jsonify([{
        'id': u.id,
        'username': u.username,
        'email': u.email,
        'role': u.role,
        'created_at': u.created_at.isoformat()
    } for u in users])

@app.route('/')
def index():
    return send_from_directory('../frontend/public', 'dashboard.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('../frontend/public', path)