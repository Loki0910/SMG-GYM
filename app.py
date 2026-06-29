from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///gym.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)
db = SQLAlchemy(app)


# ---------------- DATABASE MODELS ----------------
class Member(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20))
    plan = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(120))
    message = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ---------------- ROUTES ----------------
@app.route('/')
def home():
    return render_template('index.html')


# Get all membership plans
@app.route('/api/plans')
def get_plans():
    plans = [
        {"id": 1, "name": "Strength<br>Training", "price": 1000, "features":
            ["Admission fee: ₹500", "Gym Access", "Locker Room", "Strength Training Classes", "Diet Plan"], "popular": False},
        {"id": 2, "name": "Cardio +<br>Strength", "price": 1500, "features":
            ["Admission fee: ₹500", "All Basic Features", "Strength Training & Cardio Classes", "Personal Trainer", "Diet Plan"], "popular": True},
    ]
    return jsonify(plans)


# Get trainers
@app.route('/api/trainers')
def get_trainers():
    trainers = [
        {"name": "Alex Carter", "role": "Strength Coach", "exp": "8 yrs"},
        {"name": "Maya Singh", "role": "Yoga & Flexibility", "exp": "6 yrs"},
        {"name": "Sara Lee", "role": "Nutritionist", "exp": "5 yrs"},
    ]
    return jsonify(trainers)


# Join / Register member
@app.route('/api/join', methods=['POST'])
def join():
    data = request.get_json()
    if not data.get('name') or not data.get('email'):
        return jsonify({"success": False, "message": "Name and email required"}), 400

    member = Member(
        name=data['name'],
        email=data['email'],
        phone=data.get('phone', ''),
        plan=data.get('plan', '')
    )
    db.session.add(member)
    db.session.commit()
    return jsonify({"success": True, "message": f"Welcome {member.name}! 🎉 You joined the {member.plan} plan."})


# Contact form
@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.get_json()
    msg = Contact(
        name=data.get('name'),
        email=data.get('email'),
        message=data.get('message')
    )
    db.session.add(msg)
    db.session.commit()
    return jsonify({"success": True, "message": "Message sent! We'll reply soon. 💪"})


# Admin: view members (simple)
@app.route('/api/members')
def members():
    all_members = Member.query.all()
    return jsonify([
        {"id": m.id, "name": m.name, "email": m.email,
         "plan": m.plan, "joined": m.created_at.strftime('%Y-%m-%d')}
        for m in all_members
    ])


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)