from flask.ext.restful import fields
# from copy import copy

success_fields = dict(
    status=fields.String,
    message=fields.String,
)

layer_file_fields = dict(
    id=fields.Integer,
    layer_name=fields.String,
    file_path=fields.String,
    src=fields.String,
    date_created=fields.DateTime("iso8601"),
    date_modified=fields.DateTime("iso8601")
)

layer_file_create_fields = dict(
    status=fields.String,
    message=fields.String,
    layer_file=fields.Nested(layer_file_fields, allow_null=False)
)
