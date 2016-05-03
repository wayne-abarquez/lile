from flask.ext.restful import Resource, abort, marshal_with, marshal
from flask import request
from app.fields.screenshot_file_fields import *
from app import rest_api
from app.services import screenshot_file_service
from app.resources.file_resource import ScreenshotUploadResource
import logging

log = logging.getLogger(__name__)


class ScreenshotFileResource(ScreenshotUploadResource):
    """
    Resource for ScreenshotFileResource Resource
    """

    def post(self):
        """ POST /api/screenshots """
        uploaded_file = request.files['file']
        log.debug("POST Upload ScreenshotFileResource request : {0}".format(uploaded_file))
        if uploaded_file:
            pdf_url = screenshot_file_service.upload(uploaded_file)
            result = dict(status=200, message="OK", url=pdf_url)
            return marshal(result, screenshot_file_create_fields)
        else:
            abort(400, message="Invalid parameters")


rest_api.add_resource(ScreenshotFileResource, '/api/screenshots')
