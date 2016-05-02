from app.resources.file_resource import UploadResource
from app import db
from app.home.models import LayerFile
from app.exceptions.layer_file import *
import logging

log = logging.getLogger(__name__)


def get_files():
    layers = []
    for layer_file in LayerFile.query.all():
        layer_file.src = layer_file.get_url()
        layers.append(layer_file)
    return layers


def upload(uploaded_file):
    if uploaded_file is not None:
        upload = UploadResource()
        file_dict = upload.copy_file(uploaded_file)

        layer_file = LayerFile(layer_name=file_dict['file_name'], file_path=file_dict['file_path'])
        db.session.add(layer_file)
        db.session.commit()

        return layer_file

    return None


def update(layer_id, data):
    # Prepare Data
    layer_file = LayerFile.query.get(layer_id)

    if layer_file is None:
        raise LayerFileNotFoundError("LayerFile id={0} not found".format(layer_id))

    layer_file.update_from_dict(data, ['id', 'src', 'overlay', 'date_created', 'date_modified'])

    db.session.commit()


def delete(layer_id):
    # Prepare Data
    layer_file = LayerFile.query.get(layer_id)

    if layer_file is None:
        raise LayerFileNotFoundError("LayerFile id={0} not found".format(layer_id))

    db.session.delete(layer_file)
    db.session.commit()

    try:
        file_name = layer_file.get_filename()
        # Delete Physical File
        upload = UploadResource()
        upload.delete_file(file_name)
    except Exception as e:
        pass
    finally:
        return file_name
