from app.resources.file_resource import UploadResource
from app import db
from app.home.models import LayerFile
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
        filepath = upload.copy_file(uploaded_file)
        # file_ext = upload.get_file_extension(filename)

        layer_file = LayerFile(file_path=filepath)
        db.session.add(layer_file)
        db.session.commit()

        return layer_file

    return None


# def update_photo_caption(solar_id, photo_id, new_caption):
#     # Prepare Data
#     solar = Solar.query.get(solar_id)
#     if solar is None:
#         raise SolarNotFoundError("Solar id={0} not found".format(solar_id))
#
#     solar_file = SolarFile.query.get(photo_id)
#     if solar_file is None:
#         raise SolarFileNotFoundError("Solar File id={0} not found".format(photo_id))
#
#     solar_file.caption = new_caption
#     db.session.commit()
#
#     return solar_file
#
#
# def delete_photo(solar_id, photo_id):
#     # Prepare Data
#     solar = Solar.query.get(solar_id)
#     if solar is None:
#         raise SolarNotFoundError("Solar id={0} not found".format(solar_id))
#
#     solar_photo = SolarFile.query.get(photo_id)
#     file_name = solar_photo.file_name
#     # Delete Physical File
#     upload = UploadResource()
#     upload.delete_file(file_name)
#
#     if solar_photo is None:
#         raise SolarFileNotFoundError("Solar Photo id={0} not found".format(photo_id))
#
#     db.session.delete(solar_photo)
#     db.session.commit()
#
#     return file_name