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
    SQLALCHEMY_TRACK_MODIFICATIONS = True


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'postgresql://demouser:youcantguess@localhost:5432/demo'


class TestingConfig(Config):
    TESTING = True
    WTF_CSRF_ENABLED = False
    SQLALCHEMY_DATABASE_URI = 'postgresql://demouser:youcantguess@localhost:5432/demo'


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'postgresql://demouser:youcantguess@localhost:5432/demo'


config_by_name = dict(
    dev=DevelopmentConfig,
    test=TestingConfig,
    prod=ProductionConfig
)