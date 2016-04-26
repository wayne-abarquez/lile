from flask.ext.restful import fields
# from copy import copy

success_fields = dict(
    status=fields.String,
    message=fields.String,
)

layer_file_fields = dict(
    id=fields.Integer,
    file_path=fields.String,
    geojson=fields.String,
    date_created=fields.DateTime("iso8601"),
    date_modified=fields.DateTime("iso8601")
)

layer_file_create_fields = dict(
    status=fields.String,
    message=fields.String,
    layer_file=fields.Nested(layer_file_fields, allow_null=False)
)

# solar_complete_fields = copy(solar_fields)
# solar_complete_fields['panels'] = fields.Nested(solar_panel_fields)
# solar_complete_fields['photos'] = fields.Nested(solar_file_fields)
