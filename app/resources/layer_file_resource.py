from flask.ext.restful import Resource, abort, marshal_with, marshal
from flask import request
from app.fields.layer_file_fields import *
from app import rest_api
from app.services import layer_file_service
from app.resources.file_resource import UploadResource
import logging

log = logging.getLogger(__name__)


class LayerFileResource(UploadResource):
    """
    Resource for LayerFile Resource
    """

    @marshal_with(layer_file_fields)
    def get(self):
        """ GET /api/layer_files """
        return layer_file_service.get_files()

    def post(self):
        """ POST /api/layer_files """
        uploaded_file = request.files['file']
        log.debug("POST Upload LayerFile request : {0}".format(uploaded_file))
        # TODO: Delete previous associated file before saving new one for good housekeeping
        if uploaded_file and self.allowed_file(uploaded_file.filename):
            file = layer_file_service.upload(uploaded_file)
            result = dict(status=200, message="OK", layer_file=file)
            return marshal(result, layer_file_create_fields)
        else:
            abort(400, message="Invalid parameters")

rest_api.add_resource(LayerFileResource, '/api/layer_files')
