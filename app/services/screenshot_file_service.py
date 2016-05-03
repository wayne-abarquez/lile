from app.resources.file_resource import ScreenshotUploadResource
from app import app
import logging

log = logging.getLogger(__name__)



def upload(uploaded_file):
    if uploaded_file is not None:
        upload = ScreenshotUploadResource()

        file_dict = upload.copy_file(uploaded_file)

        pdf_url = upload.generate_pdf(file_dict['file_name'], file_dict['file_path'])

        return pdf_url

    return None
