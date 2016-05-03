from flask.ext.restful import Resource
from uuid import uuid4
from werkzeug.utils import secure_filename
from PIL import Image
from app import app
import os
from flask import url_for
import logging

log = logging.getLogger(__name__)

ALLOWED_EXTENSIONS = app.config['ALLOWED_LAYER_FILE_EXTENSIONS']
UPLOAD_FOLDER = app.config['UPLOAD_FOLDER']
SCREENSHOT_UPLOAD_FOLDER = app.config['SCREENSHOT_UPLOAD_FOLDER']
PDF_DOWNLOAD_FOLDER = app.config['PDF_DOWNLOAD_FOLDER']

max_size = [720, 850]

class ScreenshotUploadResource(Resource):
    def copy_file(self, uploaded_file):
        filename = secure_filename(uploaded_file.filename)
        file_path = os.path.join(SCREENSHOT_UPLOAD_FOLDER, filename)
        uploaded_file.save(file_path)
        return {'file_name': filename, 'file_path': file_path}

    def delete_file(self, filename):
        os.remove(os.path.join(os.path.join(SCREENSHOT_UPLOAD_FOLDER, filename)))

    def get_pdf_url(self, filename):
        return url_for('static', _external=True, filename='downloads/pdfs/' + filename)

    def generate_pdf(self, filename, filepath):
        pdf_filename = os.path.splitext(filename)[0] + ".pdf"
        outfile = os.path.join(PDF_DOWNLOAD_FOLDER, pdf_filename)

        img = Image.open(filepath).convert('RGB')
        img.thumbnail(max_size, Image.ANTIALIAS)
        # img.save(outfile, "PDF", resolution=100.0)
        img.save(outfile, "PDF")

        return self.get_pdf_url(pdf_filename)


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
