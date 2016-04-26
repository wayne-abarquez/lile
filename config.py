import os

base_dir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    DEBUG = False
    TESTING = False
    SECRET_KEY = 'lile-2016'
    WTF_CSRF_ENABLED = True
    WTF_CSRF_SECRET_KEY = 'lile-2016'
    LOG_FILENAME = '/var/www/lile/logs/app.log'
    STATIC_FOLDER = '/var/www/lile/client/static'
    TEMPLATES_FOLDER = '/var/www/lile/client/templates'
    TMP_DIR = '/var/www/lile/tmp'
    UPLOAD_FOLDER = '/var/www/lile/client/static/uploads/layers'
    ALLOWED_LAYER_FILE_EXTENSIONS = set(['kml']) # kmz maybe?
    SQLALCHEMY_DATABASE_URI = 'postgresql://demouser:youcantguess@localhost:5432/lile'
    SQLALCHEMY_TRACK_MODIFICATIONS = True


class DevelopmentConfig(Config):
    DEBUG = True


class TestingConfig(Config):
    TESTING = True
    WTF_CSRF_ENABLED = False


class ProductionConfig(Config):
    pass

config_by_name = dict(
    dev=DevelopmentConfig,
    test=TestingConfig,
    prod=ProductionConfig
)