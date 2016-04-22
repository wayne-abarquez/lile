from flask.ext.script import Manager, prompt_bool
from flask.ext.migrate import Migrate, MigrateCommand

from app import app
from app import db
# Dont forget to import Sqlalchemy models here
# ex from app.home.models import Solar


manager = Manager(app)
migrate = Migrate(app, db)

manager.add_command('db', MigrateCommand)


@manager.command
def initdb():
    db.create_all()
    print "Initialized the Database"


@manager.command
def dropdb():
    if prompt_bool("Are you sure you want to Drop your Database?"):
        db.drop_all()
        print "Database Dropped"


if __name__ == '__main__':
    manager.run()
