from app import db
from app.utils.orm_object import OrmObject
from app.models import BaseModel
from geoalchemy2 import Geometry
from flask import url_for


class LayerFile(BaseModel):
    file_path = db.Column(db.Text, nullable=False)
    geojson = db.Column(db.Text, nullable=False)

    def __init__(self, *args, **kwargs):
        super(LayerFile, self).__init__(*args, **kwargs)
        self.src = self.get_url()
        print '__init__ is called from layer_file'

    # def __get__(self, instance, owner):
    # print '__get__ from solarFile called'
    #     if instance is None:
    #         return None
    #
    #     instance.src = self.get_url()
    #     return super(SolarFile, self).__get__(instance, owner)

    # def get_url(self):
    #     return url_for('static', _external=True, filename='uploads/' + self.file_name)
