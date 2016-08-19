from app import db
from app.utils.orm_object import OrmObject


# Define a base model for other database tables to inherit
class BaseModel(db.Model, OrmObject):
    __abstract__ = True

    id = db.Column(db.Integer, primary_key=True)
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    date_modified = db.Column(db.DateTime, default=db.func.current_timestamp(),
                              onupdate=db.func.current_timestamp())


class Person(BaseModel):
    __abstract__ = True

    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    middle_name = db.Column(db.String)
    address = db.Column(db.String)
    contact_no = db.Column(db.String)

    @property
    def fullname(self):
        return self.first_name + ' ' + self.last_name
