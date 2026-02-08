from app.db import engine
from sqlalchemy import text

with engine.connect() as connection:
    connection.execute(text("DROP TABLE IF EXISTS user_data CASCADE"))
    connection.commit()
    print("Table user_data dropped")
