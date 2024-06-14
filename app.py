from flask import Flask, jsonify, request, abort, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_mail import Mail, Message
from models import User,Task,db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import threading
import time
import requests

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'

# Email configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'kabbarojo2020@gmail.com'
app.config['MAIL_PASSWORD'] = 'xtuw izws jrmz unon'
app.config['MAIL_DEFAULT_SENDER'] = 'kabbarojo2020@gmail.com'

db.init_app(app)
mail = Mail(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        
        return jsonify({"message": "User already exists"}), 400
    
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256', salt_length=16)
    new_user = User(
        username=data['username'],
        email=data['email'],
        password=hashed_password,
        weight=int(data['weight']),
        height=int(data['height']),
        age=int(data['age']),
        gender=data['gender'],
        activity_level=data['activity_level'],
        cuisine_type=None
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Registration successful!"}), 201
@app.route('/api/check_auth', methods=['GET'])
@login_required
def check_auth():
    return jsonify({"message": "User is authenticated", "user": current_user.email}), 200

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password, data['password']):
        login_user(user)
        return jsonify({"message": "Login successful!",
                        "user": {
                            "username": user.username,
                            "email": user.email
                        }}), 200
    else:
        return jsonify({"message": "Login unsuccessful. Check email and password"}), 401

@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logout successful!"}), 200

@app.route('/api/settings', methods=['GET', 'POST'])
@login_required
def settings():
    if request.method == 'POST':
        data = request.get_json()
        current_user.username = data['username']
        current_user.email = data['email']
        current_user.weight = int(data['weight'])
        current_user.height = int(data['height'])
        current_user.age = int(data['age'])
        current_user.gender = data['gender']
        current_user.activity_level = data['activity_level']
        current_user.cuisine_type = data.get('cuisine_type')  # Update cuisine type
        if 'password' in data:
            current_user.password = generate_password_hash(data['password'], method='pbkdf2:sha256', salt_length=16)
        current_user.bmi = current_user.calculate_bmi()
        current_user.daily_caloric_needs = current_user.calculate_caloric_needs()
        db.session.commit()
        return jsonify({"message": "Settings updated successfully!"}), 200
    else:
        user_data = {
            "username": current_user.username,
            "email": current_user.email,
            "weight": current_user.weight,
            "height": current_user.height,
            "age": current_user.age,
            "gender": current_user.gender,
            "activity_level": current_user.activity_level,
            "bmi": current_user.bmi,
            "daily_caloric_needs": current_user.daily_caloric_needs,
            "cuisine_type": current_user.cuisine_type  # Include cuisine type in response
        }
        return jsonify(user_data), 200
    
@app.route('/api/tasks', methods=['GET', 'POST'])
@login_required
def task_list():
    if request.method == 'POST':
        data = request.get_json()
        start_time = datetime.strptime(data['start_time'], '%Y-%m-%dT%H:%M')
        end_time = datetime.strptime(data['end_time'], '%Y-%m-%dT%H:%M')

        if start_time <= datetime.utcnow():
            return jsonify({"message": "Start time must be greater than the current time"}), 400
        if end_time <= start_time:
            return jsonify({"message": "End time must be greater than start time"}), 400

        repeat_interval = data.get('repeat_interval', None)
        task = Task(
            title=data['title'],
            description=data['description'],
            start_time=start_time,
            end_time=end_time,
            user_id=current_user.id,
            repeat_interval=repeat_interval
        )
        db.session.add(task)
        db.session.commit()
        
        return jsonify({
            "message": "Task created successfully!",
            "task": {
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "start_time": task.start_time,
                "end_time": task.end_time,
                "repeat_interval": task.repeat_interval,
                "next_occurrence": task.next_occurrence
            }
        }), 201

    else:
        tasks = Task.query.filter_by(user_id=current_user.id).all()
        task_list = [{
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "start_time": task.start_time,
            "end_time": task.end_time,
            "repeat_interval": task.repeat_interval,
            "next_occurrence": task.next_occurrence
        } for task in tasks]
        return jsonify(task_list), 200


@app.route('/api/task/<int:task_id>', methods=['GET', 'PUT', 'DELETE'])
@login_required
def manage_task(task_id):
    task = Task.query.get_or_404(task_id)
    if task.user_id != current_user.id:
        abort(403)
    
    if request.method == 'PUT':
        data = request.get_json()
        start_time = datetime.strptime(data['start_time'], '%Y-%m-%dT%H:%M:%S')
        end_time = datetime.strptime(data['end_time'], '%Y-%m-%dT%H:%M:%S')
        
        if start_time <= datetime.utcnow():
            return jsonify({"message": "Start time must be greater than the current time"}), 400
        if end_time <= start_time:
            return jsonify({"message": "End time must be greater than start time"}), 400
        
        task.title = data['title']
        task.description = data['description']
        task.start_time = start_time
        task.end_time = end_time
        task.repeat_interval = data.get('repeat_interval')
        task.next_occurrence = task.calculate_next_occurrence()
        db.session.commit()
        return jsonify({
            "message": "Task updated successfully!",
            "task": {
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "start_time": task.start_time,
                "end_time": task.end_time,
                "repeat_interval": task.repeat_interval,
                "next_occurrence": task.next_occurrence
            }
        }), 200
    elif request.method == 'DELETE':
        db.session.delete(task)
        db.session.commit()
        return jsonify({"message": "Task deleted successfully!"}), 200
    else:
        return jsonify({
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "start_time": task.start_time,
            "end_time": task.end_time,
            "repeat_interval": task.repeat_interval,
            "next_occurrence": task.next_occurrence
        }), 200

@app.route('/api/meal_suggestion', methods=['GET'])
@login_required
def meal_suggestion():
    user = current_user
    caloric_needs = user.daily_caloric_needs
    cuisine_type = user.cuisine_type or 'american'
    meals = ['Breakfast', 'Lunch', 'Dinner']
    suggestions = {}

    for meal in meals:
        calories = {
            'Breakfast': caloric_needs * 0.2,
            'Lunch': caloric_needs * 0.4,
            'Dinner': caloric_needs * 0.4
        }[meal]
        
        url = f"https://api.edamam.com/api/recipes/v2?type=public&mealType={meal}&app_id=8d43fed7&app_key=850486e1e8e6d652c4ca6efbe0894894&diet=low-carb&calories=0-{int(calories)}&cuisineType={cuisine_type}"
        
        response = requests.get(url)
        data = response.json()
        if 'hits' in data:
            suggestions[meal] = data['hits']
    
    return jsonify(suggestions), 200

def send_email(subject, recipient, template, **kwargs):
    msg = Message(subject, recipients=[recipient])
    msg.html = render_template(template, **kwargs)
    mail.send(msg)

def check_for_upcoming_tasks():
    with app.app_context():
        print("Task checker started.")
        while True:
            now = datetime.utcnow() + timedelta(hours=1)
            fifteen_minutes_later = now + timedelta(minutes=15)
            print(f"Current time: {now}")
            print(f"Checking for tasks between {now} and {fifteen_minutes_later}")
            
            upcoming_tasks = Task.query.filter(Task.start_time.between(now, fifteen_minutes_later)).all()
            print(f"Found {len(upcoming_tasks)} upcoming tasks.")
            
            for task in upcoming_tasks:
                print(f"Processing task: {task.title} starting at {task.start_time} UTC")
                user = User.query.get(task.user_id)
                if user:
                    print(f"Sending email to {user.email}")
                    send_email(
                        subject='Upcoming Task Reminder',
                        recipient=user.email,
                        template='task_reminder.html',
                        user=user,
                        task=task
                    )
                    print(f"Reminder sent for task: {task.title} to user: {user.email}")
                else:
                    print(f"User not found for task: {task.title}")
            
            print(f"Sleeping for 60 seconds")
            time.sleep(60)  # Check every minute

# Start the background task
threading.Thread(target=check_for_upcoming_tasks, daemon=True).start()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)