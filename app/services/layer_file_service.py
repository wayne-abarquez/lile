from app.resources.file_resource import UploadResource
from app import db
import logging

log = logging.getLogger(__name__)


# TODO
def upload(uploaded_file):
    if uploaded_file is not None:
        upload = UploadResource()
        filename = upload.copy_file(uploaded_file)
        file_ext = upload.get_file_extension(filename)

        #convert kml file here to geojson

        # solar_file = SolarFile(file_name=filename,
        #                        type=file_ext)
        # solar.files.append(solar_file)
        # db.session.commit()
        # return solar_file

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