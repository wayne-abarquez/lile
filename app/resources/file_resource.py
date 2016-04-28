from flask.ext.restful import Resource
from uuid import uuid4
from werkzeug.utils import secure_filename
from app import app
import os
import logging

log = logging.getLogger(__name__)

ALLOWED_EXTENSIONS = app.config['ALLOWED_LAYER_FILE_EXTENSIONS']
UPLOAD_FOLDER = app.config['UPLOAD_FOLDER']


class UploadResource(Resource):
    def allowed_file(self, filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

    def copy_file(self, uploaded_file):
        filename = str(uuid4()) + os.pathsep + secure_filename(uploaded_file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        uploaded_file.save(file_path)
        return {'file_name': filename, 'file_path': file_path}

    def get_file_extension(self, filename):
        return filename.rsplit('.', 1)[1].lower()

    def delete_file(self, filename):
        os.remove(os.path.join(os.path.join(UPLOAD_FOLDER, filename)))
