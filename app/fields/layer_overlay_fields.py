from flask.ext.restful import fields

layer_overlay_fields = dict(
    id=fields.Integer,
    layer_id=fields.Integer,
    json_content=fields.String,
    date_created=fields.DateTime("iso8601"),
    date_modified=fields.DateTime("iso8601")
)