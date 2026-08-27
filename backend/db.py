import pymysql


def get_connection():
    connection = pymysql.connect(
        host="localhost",
        user="root",
        password="12345",
        database="ecommerce_db",
        cursorclass=pymysql.cursors.DictCursor
    )

    return connection