from app import db
from app.authentication.models import Employees, Roles, Users
from app.data.entities import employees, roles, users


class SampleData:
    @staticmethod
    def refresh_table(table_name):
        db.session.execute('TRUNCATE "' + table_name + '" RESTART IDENTITY CASCADE')
        db.session.commit()

    @staticmethod
    def generate_users():
        SampleData.load_employees()
        SampleData.load_roles()
        SampleData.load_users()

    @staticmethod
    def load_employees():
        SampleData.refresh_table('employees')

        for data in employees.get_employees():
            emp = Employees.from_dict(data)
            db.session.add(emp)
        db.session.commit()
        print "Emloyees Created"

    @staticmethod
    def load_roles():
        SampleData.refresh_table('roles')

        for data in roles.list:
            role = Roles.from_dict(data)
            db.session.add(role)
        db.session.commit()
        print "Roles Created"

    @staticmethod
    def load_users():
        SampleData.refresh_table('users')

        user_list = []
        employee_list = Employees.query.all()

        for data in users.test_users:
            u = Users.from_dict(data)
            u.password = data['password'] if 'password' in data else users.test_password
            emp = employee_list.pop()
            u.emp_id = emp.id
            user_list.append(u)

        db.session.add_all(user_list)
        db.session.commit()
        print "Users Created"
