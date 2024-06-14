from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime, timedelta

db = SQLAlchemy()

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    weight = db.Column(db.Float, nullable=False)  # in kg
    height = db.Column(db.Float, nullable=False)  # in cm
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    activity_level = db.Column(db.String(20), nullable=False)
    bmi = db.Column(db.Float, nullable=False)
    daily_caloric_needs = db.Column(db.Float, nullable=False)
    cuisine_type = db.Column(db.String(50), nullable=True)  


    def __init__(self, username,cuisine_type, email, password, weight, height, age, gender, activity_level):
        self.username = username
        self.email = email
        self.password = password
        self.weight = weight
        self.height = height
        self.age = age
        self.cuisine_type = cuisine_type
        self.gender = gender
        self.activity_level = activity_level
        self.bmi = self.calculate_bmi()
        self.daily_caloric_needs = self.calculate_caloric_needs()

    def calculate_bmi(self):
        height_m = self.height / 100  # convert height from cm to meters
        return self.weight / (height_m ** 2)

    def calculate_caloric_needs(self):
        if self.gender.lower() == 'male':
            bmr = 10 * self.weight + 6.25 * self.height - 5 * self.age + 5
        else:
            bmr = 10 * self.weight + 6.25 * self.height - 5 * self.age - 161
        
        # Activity factor
        activity_factors = {
            'sedentary': 1.2,
            'light': 1.375,
            'moderate': 1.55,
            'active': 1.725,
            'very_active': 1.9
        }
        
        tdee = bmr * activity_factors[self.activity_level]
        return tdee

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    repeat_interval = db.Column(db.String(20), nullable=True)  # 'daily' or 'weekly'
    next_occurrence = db.Column(db.DateTime, nullable=True)

    def __init__(self, title, description, start_time, end_time, user_id, repeat_interval=None):
        self.title = title
        self.description = description
        self.start_time = start_time
        self.end_time = end_time
        self.user_id = user_id
        self.repeat_interval = repeat_interval
        self.next_occurrence = self.calculate_next_occurrence()

    def calculate_next_occurrence(self):
        if self.repeat_interval == 'daily':
            return self.start_time + timedelta(days=1)
        elif self.repeat_interval == 'weekly':
            return self.start_time + timedelta(weeks=1)
        else:
            return None

    def update_next_occurrence(self):
        if self.repeat_interval == 'daily':
            self.next_occurrence += timedelta(days=1)
        elif self.repeat_interval == 'weekly':
            self.next_occurrence += timedelta(weeks=1)

