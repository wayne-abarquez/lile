from flask.ext.restful import fields

employee_fields = dict(
    id=fields.Integer,
    first_name=fields.String,
    last_name=fields.String,
    middle_name=fields.String,
    fullname=fields.String,
    address=fields.String,
    contact_no=fields.String,
    designation=fields.String
)

role_fields = dict(
    name=fields.String
)

user_fields = dict(
    id=fields.Integer,
    username=fields.String,
    employee_name=fields.String,
    account_status=fields.String,
    account_created_datetime=fields.DateTime("iso8601"),
    last_login_datetime=fields.DateTime("iso8601"),
    employee=fields.Nested(employee_fields, allow_null=False),
    role=fields.Nested(role_fields, allow_null=False)
)
