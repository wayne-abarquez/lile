from flask.ext.restful import Resource, abort, marshal_with, marshal
from flask import request
from app.fields.layer_file_fields import *
from app import rest_api
from app.services import layer_file_service, layer_overlay_service
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


class LayerFileDetailResource(UploadResource):
    """
    Resource for LayerFile detail Resource
    """

    def put(self, layer_id):
        """ PUT /api/layer_files/:id """
        form_data = request.json
        log.debug("PUT LayerFile request id={0} data = {1}".format(layer_id, form_data))
        try:
            layer_file_service.update(layer_id, form_data)
            result = dict(status=200, message="OK")
            return marshal(result, success_fields)
        except ValueError as err:
            abort(404, message=err.message)

    def delete(self, layer_id):
        """ DELETE /api/layer_files/:id """
        log.debug("Delete LayerFile request id={0}".format(layer_id))
        try:
            layer_file_service.delete(layer_id)
            result = dict(status=200, message="OK")
            return marshal(result, success_fields)
        except ValueError as err:
            abort(404, message=err.message)


class LayerFileOverlaysResource(Resource):
    """
    Resource for LayerFileOverlays Resource
    """

    def post(self, layer_id):
        """ POST /api/layer_files/:id/layer_overlays """
        form_data = request.json
        log.debug("POST LayerFileOverlays request id={0} data = {1}".format(layer_id, form_data))
        try:
            layerfile = layer_overlay_service.create_overlay(layer_id, form_data)
            result = dict(status=200, message="OK", layer_file=layerfile)
            return marshal(result, layer_file_create_fields)
        except ValueError as err:
            abort(404, message=err.message)

    def put(self, layer_id):
        """ PUT /api/layer_files/:id/layer_overlays """
        form_data = request.json
        log.debug("PUT LayerFileOverlays request id={0} data = {1}".format(layer_id, form_data))
        try:
            layerfile = layer_overlay_service.update_overlay(layer_id, form_data)
            result = dict(status=200, message="OK", layer_file=layerfile)
            return marshal(result, layer_file_create_fields)
        except ValueError as err:
            abort(404, message=err.message)


rest_api.add_resource(LayerFileResource, '/api/layer_files')
rest_api.add_resource(LayerFileDetailResource, '/api/layer_files/<int:layer_id>')
rest_api.add_resource(LayerFileOverlaysResource, '/api/layer_files/<int:layer_id>/layer_overlays')
