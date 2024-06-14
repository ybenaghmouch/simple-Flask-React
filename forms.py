from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, TextAreaField, DateTimeField, SelectField, FloatField, IntegerField
from wtforms.validators import DataRequired, Email, EqualTo, Length, Optional

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')

class RegisterForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=2, max=150)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6, max=150)])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    weight = FloatField('Weight (kg)', validators=[DataRequired()])
    height = FloatField('Height (cm)', validators=[DataRequired()])
    age = IntegerField('Age', validators=[DataRequired()])
    gender = SelectField('Gender', choices=[('male', 'Male'), ('female', 'Female')], validators=[DataRequired()])
    activity_level = SelectField('Activity Level', choices=[('sedentary', 'Sedentary'), ('light', 'Light'), ('moderate', 'Moderate'), ('active', 'Active'), ('very_active', 'Very Active')], validators=[DataRequired()])
    submit = SubmitField('Register')

class TaskForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired()])
    description = TextAreaField('Description', validators=[DataRequired()])
    start_time = DateTimeField('Start Time', format='%Y-%m-%d %H:%M', validators=[DataRequired()])
    end_time = DateTimeField('End Time', format='%Y-%m-%d %H:%M', validators=[DataRequired()])
    repeat_interval = SelectField('Repeat Interval', choices=[('none', 'None'), ('daily', 'Daily'), ('weekly', 'Weekly')], validators=[Optional()])
    submit = SubmitField('Save')

class SettingsForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=2, max=150)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    weight = FloatField('Weight (kg)', validators=[DataRequired()])
    height = FloatField('Height (cm)', validators=[DataRequired()])
    age = IntegerField('Age', validators=[DataRequired()])
    gender = SelectField('Gender', choices=[('male', 'Male'), ('female', 'Female')], validators=[DataRequired()])
    activity_level = SelectField('Activity Level', choices=[('sedentary', 'Sedentary'), ('light', 'Light'), ('moderate', 'Moderate'), ('active', 'Active'), ('very_active', 'Very Active')], validators=[DataRequired()])
    cuisine_type = StringField('Preferred Cuisine Type', validators=[Optional(), Length(max=50)])  # New field for cuisine type
    password = PasswordField('New Password', validators=[Optional(), Length(min=6, max=150)])
    confirm_password = PasswordField('Confirm New Password', validators=[Optional(), EqualTo('password')])
    cuisine_type = SelectField('Preferred Cuisine Type', choices=[
        ('american', 'American'),
        ('asian', 'Asian'),
        ('british', 'British'),
        ('caribbean', 'Caribbean'),
        ('central_europe', 'Central Europe'),
        ('chinese', 'Chinese'),
        ('eastern_europe', 'Eastern Europe'),
        ('french', 'French'),
        ('indian', 'Indian'),
        ('italian', 'Italian'),
        ('japanese', 'Japanese'),
        ('kosher', 'Kosher'),
        ('mediterranean', 'Mediterranean'),
        ('mexican', 'Mexican'),
        ('middle_eastern', 'Middle Eastern'),
        ('nordic', 'Nordic'),
        ('south_american', 'South American'),
        ('south_east_asian', 'South East Asian')
    ], validators=[Optional()])
    submit = SubmitField('Update')

