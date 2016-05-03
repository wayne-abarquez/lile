from flask.ext.restful import fields
# from copy import copy

screenshot_file_create_fields = dict(
    status=fields.String,
    message=fields.String,
    url=fields.String
)
