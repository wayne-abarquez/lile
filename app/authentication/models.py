from app import db
from app.models import BaseModel, OrmObject, Person
from flask.ext.login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
import datetime


class Employees(Person):
    designation = db.Column(db.String, nullable=False)


class AccountStatusType:
    ACTIVE = 1
    SUSPENDED = 0


class RoleType:
    ADMIN = "ADMIN"
    PM = "PM"  # Project Manager
    AM = "AM"  # Account Manager
    EMPLOYEE = "EMPLOYEE"

    @staticmethod
    def get_rolename(name):
        return {
            RoleType.ADMIN: 'Admin',
            RoleType.PM: 'Project Manager',
            RoleType.AM: 'Account Manager',
            RoleType.EMPLOYEE: 'Employee'
        }[name]


class Roles(db.Model, OrmObject):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)

    def get_rolename(self):
        return RoleType.get_rolename(self.name)


class Users(BaseModel, UserMixin):
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
    emp_id = db.Column(db.Integer, db.ForeignKey('employees.id'))
    username = db.Column(db.String(50), nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    account_status = db.Column(db.Integer, default=AccountStatusType.ACTIVE)
    account_created_datetime = db.Column(db.DateTime, default=db.func.current_timestamp())
    last_login_datetime = db.Column(db.DateTime)

    role = db.relationship(Roles, foreign_keys=role_id)
    employee = db.relationship(Employees, foreign_keys=emp_id)

    @property
    def employee_name(self):
        if self.employee is not None:
            return self.employee.fullname
        return ''

    @property
    def password(self):
        raise AttributeError('password: write-only field')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def authenticate(self, password):
        return check_password_hash(self.password_hash, password)

    def update_login_time(self):
        self.last_login_datetime = datetime.datetime.now()
        db.session.commit()

    def is_admin(self):
        return self.role.name == RoleType.ADMIN

    @staticmethod
    def get_by_username(username):
        return Users.query.filter_by(username=username).first()

    def __repr__(self):
        return "<User '{}'>".format(self.username)
