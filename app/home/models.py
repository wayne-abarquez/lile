from app import db
from app.utils.orm_object import OrmObject
from app.models import BaseModel
from geoalchemy2 import Geometry
from flask import url_for
import os


class LayerFile(BaseModel):
    file_path = db.Column(db.Text, nullable=False)

    def __init__(self, *args, **kwargs):
        super(LayerFile, self).__init__(*args, **kwargs)
        self.src = self.get_url()
        print '__init__ is called from layer_file'

    def get_url(self):
        file_split_array = self.file_path.split('/')
        filename = file_split_array[len(file_split_array)-1]
        return url_for('static', _external=True, filename='uploads/layers/' + filename)
