from app import db
from app.home.models import LayerFile, LayerOverlay
from app.exceptions.layer_file import *
import logging
import json

log = logging.getLogger(__name__)


def create_overlay(layerid, data):
    # Prepare Data
    layer_file = LayerFile.query.get(layerid)

    if layer_file is None:
        raise LayerFileNotFoundError("LayerFile id={0} not found".format(layerid))

    json_data = json.dumps(data)

    layer_overlay = LayerOverlay(layer_id=layerid, json_content=json_data)
    layer_file.overlay.append(layer_overlay)
    db.session.commit()

    return layer_file


def update_overlay(layerid, data):
    # Prepare Data
    layer_file = LayerFile.query.get(layerid)

    if layer_file is None:
        raise LayerFileNotFoundError("LayerFile id={0} not found".format(layerid))

    json_data = json.dumps(data)

    if len(layer_file.overlay) > 0:
        layer_file.overlay[0].json_content = json_data
        db.session.commit()

    return layer_file
