from .models import Models
from .db.database import engine, get_db

Models.Base.metadata.create_all(bind=engine)