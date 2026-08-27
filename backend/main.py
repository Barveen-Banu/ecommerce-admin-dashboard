from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from db import get_connection

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "E-Commerce API is running successfully!"}


@app.get("/test-db")
def test_db():
    try:
        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("SELECT 1 AS connected")
        result = cursor.fetchone()

        cursor.close()
        connection.close()

        return result

    except Exception as e:
        return {"error": str(e)}


class Product(BaseModel):
    name: str
    description: str
    price: float
    stock: int
    category: str
    image_url: str


@app.post("/products")
def add_product(product: Product):
    connection = get_connection()
    cursor = connection.cursor()

    query = """
        INSERT INTO products
        (name, description, price, stock, category, image_url)
        VALUES (%s, %s, %s, %s, %s, %s)
    """

    cursor.execute(query, (
        product.name,
        product.description,
        product.price,
        product.stock,
        product.category,
        product.image_url
    ))

    connection.commit()

    cursor.close()
    connection.close()

    return {
        "message": "Product added successfully!"
    }
@app.get("/products")
def get_products():
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()

    cursor.close()
    connection.close()

    return products
@app.get("/products/{product_id}")
def get_product(product_id: int):
    connection = get_connection()
    cursor = connection.cursor()

    query = "SELECT * FROM products WHERE id = %s"
    cursor.execute(query, (product_id,))

    product = cursor.fetchone()

    cursor.close()
    connection.close()

    if product is None:
        return {"message": "Product not found"}

    return product
@app.get("/orders")
def get_orders():
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM orders ORDER BY id DESC")
    orders = cursor.fetchall()

    cursor.close()
    connection.close()

    return orders
@app.get("/customers")
def get_customers():
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM customers ORDER BY id DESC")
    customers = cursor.fetchall()

    cursor.close()
    connection.close()

    return customers
@app.put("/orders/{order_id}")
def update_order_status(order_id: int, status: str):
    connection = get_connection()
    cursor = connection.cursor()

    query = """
        UPDATE orders
        SET status = %s
        WHERE id = %s
    """

    cursor.execute(query, (status, order_id))
    connection.commit()

    cursor.close()
    connection.close()

    return {
        "message": "Order status updated successfully"
    }
@app.put("/products/{product_id}")
def update_product(product_id: int, product: Product):
    connection = get_connection()
    cursor = connection.cursor()

    query = """
        UPDATE products
        SET name = %s,
            description = %s,
            price = %s,
            stock = %s,
            category = %s,
            image_url = %s
        WHERE id = %s
    """

    cursor.execute(query, (
        product.name,
        product.description,
        product.price,
        product.stock,
        product.category,
        product.image_url,
        product_id
    ))

    connection.commit()

    cursor.close()
    connection.close()

    return {
        "message": "Product updated successfully!"
    }
@app.delete("/products/{product_id}")
def delete_product(product_id: int):
    connection = get_connection()
    cursor = connection.cursor()

    query = "DELETE FROM products WHERE id = %s"
    cursor.execute(query, (product_id,))

    connection.commit()

    cursor.close()
    connection.close()

    return {
        "message": "Product deleted successfully!"
    }