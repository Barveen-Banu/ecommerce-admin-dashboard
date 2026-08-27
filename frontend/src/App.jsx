import { useEffect, useState } from "react";
import Login from "./Login";
import "./App.css";

function App() {
 
  const [isLoggedIn, setIsLoggedIn] = useState(
  localStorage.getItem("isLoggedIn") === "true"
);
  const [activePage, setActivePage] = useState("dashboard");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const totalProducts = products.length;

const totalStock = products.reduce(
  (total, product) => total + Number(product.stock),
  0
);

const productValue = products.reduce(
  (total, product) =>
    total + Number(product.price) * Number(product.stock),
  0
);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

const [formData, setFormData] = useState({
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  image_url: "",
});

useEffect(() => {
  fetch("https://ecommerce-admin-dashboard-ydpi.onrender.com")
    .then((response) => response.json())
    .then((data) => setProducts(data))
    .catch((error) => console.error("Error:", error));
}, []);
useEffect(() => {
  fetch("https://ecommerce-admin-dashboard-ydpi.onrender.com")
    .then((response) => response.json())
    .then((data) => setOrders(data))
    .catch((error) => console.error("Error:", error));
}, []);
useEffect(() => {
  fetch("https://ecommerce-admin-dashboard-ydpi.onrender.com")
    .then((response) => response.json())
    .then((data) => setCustomers(data))
    .catch((error) => console.error("Error:", error));
}, []);
const handleAddProduct = (e) => {
  e.preventDefault();

  const url = editingId
    ? `https://ecommerce-admin-dashboard-ydpi.onrender.com/products/${editingId}`
    : "https://ecommerce-admin-dashboard-ydpi.onrender.com/productts";

  const method = editingId ? "PUT" : "POST";

  fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    }),
  })
    .then((response) => response.json())
    .then(() => {
      alert(
        editingId
          ? "Product updated successfully!"
          : "Product added successfully!"
      );

      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        image_url: "",
      });

      setEditingId(null);
      setShowForm(false);

      fetch("https://ecommerce-admin-dashboard-ydpi.onrender.com/products")
        .then((response) => response.json())
        .then((data) => setProducts(data));
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
const handleEdit = (product) => {
  setFormData({
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    category: product.category,
    image_url: product.image_url || "",
  });

  setEditingId(product.id);
  setShowForm(true);
};
const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await fetch(
      `https://ecommerce-admin-dashboard-ydpi.onrender.com/orders/${orderId}?status=${newStatus}`,
      {
        method: "PUT",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update order status");
    }

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );

  } catch (error) {
    console.error("Error updating order:", error);
  }
};
if (!isLoggedIn) {
  return (
    <Login
      onLogin={() => {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
      }}
    />
  );
}

return (
  <div className="dashboard">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2>ShopAdmin</h2>

       <nav>
  <a
  href="#"
  className={activePage === "dashboard" ? "active" : ""}
  onClick={(e) => {
    e.preventDefault();
    setActivePage("dashboard");
  }}
>
  Dashboard
</a>

  <a
    href="#"
    className={activePage === "products" ? "active" : ""}
    onClick={(e) => {
      e.preventDefault();
      setActivePage("products");
    }}
  >
    Products
  </a>

  <a
    href="#"
    className={activePage === "orders" ? "active" : ""}
    onClick={(e) => {
      e.preventDefault();
      setActivePage("orders");
    }}
  >
    Orders
  </a>

  <a
    href="#"
    className={activePage === "customers" ? "active" : ""}
    onClick={(e) => {
      e.preventDefault();
      setActivePage("customers");
    }}
  >
    Customers
  </a>
</nav>

        <button
          className="logout-button"
          onClick={() => setIsLoggedIn(false)}
        >
          Logout
        </button>
      </aside>
      

      {/* Main Content */}
      <main className="main-content">

        <header className="topbar">
          <h1>
  {activePage === "dashboard" && "Dashboard"}
  {activePage === "products" && "Products"}
  {activePage === "orders" && "Orders"}
  {activePage === "customers" && "Customers"}
</h1>
          <span>Admin</span>
        </header>

   {/* Dashboard Cards */}
{activePage === "dashboard" && (
  <>
    <section className="cards">

      <div className="card">
        <h3>Total Products</h3>
        <p>{totalProducts}</p>
      </div>

      <div className="card">
        <h3>Total Stock</h3>
        <p>{totalStock}</p>
      </div>

      <div className="card">
        <h3>Product Value</h3>
        <p>₹{productValue.toLocaleString("en-IN")}</p>
      </div>

      <div className="card">
        <h3>Orders</h3>
        <p>{orders.length}</p>
      </div>

      <div className="card">
        <h3>Total Customers</h3>
        <p>{customers.length}</p>
      </div>

    </section>

    <div className="recent-orders">

      <div className="section-header">
        <h2>Recent Orders</h2>
      </div>

      <div className="product-table">

        <div className="table-header">
          <span>Order ID</span>
          <span>Customer</span>
          <span>Product</span>
          <span>Amount</span>
          <span>Status</span>
        </div>

        {orders.slice(0, 5).map((order) => (
          <div className="table-row" key={order.id}>
            <span>{order.order_number}</span>
            <span>{order.customer_name}</span>
            <span>{order.product_name}</span>
            <span>
              ₹{Number(order.amount).toLocaleString("en-IN")}
            </span>
<span
  className={
    order.status.toLowerCase() === "completed"
      ? "status completed"
      : "status pending"
  }
>
  {order.status}
</span>
          </div>
        ))}

      </div>

    </div>
  </>
)}

        {activePage === "products" && (
  <section className="products-section">
<div className="section-header">
  <h2>Products ({products.length})</h2>
<button onClick={() => setShowForm(!showForm)}>
  {showForm ? "Close" : "Add Product"}
</button>
</div>
<div className="search-box">
  <input
    type="text"
    placeholder="Search products..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>
<div className="category-filter">

  <button
    type="button"
    className="category-button"
    onClick={() => setCategoryOpen(!categoryOpen)}
  >
    {selectedCategory === "All"
      ? "All Categories"
      : selectedCategory}

    <span>▼</span>
  </button>

  {categoryOpen && (
    <div className="category-menu">

      <button
        type="button"
        onClick={() => {
          setSelectedCategory("All");
          setCategoryOpen(false);
        }}
      >
        All Categories
      </button>

      <button
        type="button"
        onClick={() => {
          setSelectedCategory("Electronics");
          setCategoryOpen(false);
        }}
      >
        Electronics
      </button>

      <button
        type="button"
        onClick={() => {
          setSelectedCategory("Clothing");
          setCategoryOpen(false);
        }}
      >
        Clothing
      </button>

      <button
        type="button"
        onClick={() => {
          setSelectedCategory("Accessories");
          setCategoryOpen(false);
        }}
      >
        Accessories
      </button>

    </div>
  )}

</div>
{showForm && (
  <form className="product-form" onSubmit={handleAddProduct}>
    <input
      type="text"
      placeholder="Product Name"
      value={formData.name}
      onChange={(e) =>
        setFormData({
          ...formData,
          name: e.target.value,
        })
      }
    />

    <input
      type="text"
      placeholder="Description"
      value={formData.description}
      onChange={(e) =>
        setFormData({
          ...formData,
          description: e.target.value,
        })
      }
    />

    <input
      type="number"
      placeholder="Price"
      value={formData.price}
      onChange={(e) =>
        setFormData({
          ...formData,
          price: e.target.value,
        })
      }
    />

    <input
      type="number"
      placeholder="Stock"
      value={formData.stock}
      onChange={(e) =>
        setFormData({
          ...formData,
          stock: e.target.value,
        })
      }
    />

    <input
      type="text"
      placeholder="Category"
      value={formData.category}
      onChange={(e) =>
        setFormData({
          ...formData,
          category: e.target.value,
        })
      }
    />

    <input
      type="text"
      placeholder="Image URL"
      value={formData.image_url}
      onChange={(e) =>
        setFormData({
          ...formData,
          image_url: e.target.value,
        })
      }
    />
<button type="submit">
  {editingId ? "Update Product" : "Save Product"}
</button>
<button
  type="button"
  onClick={() => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      image_url: "",
    });
  }}
>
  Cancel
</button>
  </form>
)}
  <div className="product-table">

  <div className="table-header">
    <span>Product</span>
    <span>Category</span>
    <span>Price</span>
    <span>Stock</span>
    <span>Action</span>
  </div>
{products
  .filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  })
  .map((product) => (
    <div className="table-row product-row" key={product.id}>

      <span className="product-info">
        <img
          src={`/${product.image_url}`}
          alt={product.name}
          className="product-image"
        />
        {product.name}
      </span>

      <span>{product.category}</span>

      <span>₹{product.price}</span>

      <span>{product.stock}</span>

      <span className="action-buttons">
        <button onClick={() => handleEdit(product)}>
          Edit
        </button>

        <button
          onClick={() => {
            if (window.confirm(`Delete ${product.name}?`)) {
              fetch(
                `https://ecommerce-admin-dashboard-ydpi.onrender.com/products/${product.id}`,
                {
                  method: "DELETE",
                }
              )
                .then((response) => response.json())
                .then(() => {
                  alert("Product deleted successfully!");

                  fetch("https://ecommerce-admin-dashboard-ydpi.onrender.com/products")
                    .then((response) => response.json())
                    .then((data) => setProducts(data));
                })
                .catch((error) => {
                  console.error("Error:", error);
                });
            }
          }}
        >
          Delete
        </button>
      </span>

    </div>
   ))}
        </div>

      </section>
)}
{activePage === "orders" && (
  <section className="products-section orders-section">

    <div className="section-header">
      <h2>Recent Orders</h2>
    </div>

    <div className="product-table">

      <div className="table-header">
        <span>Order ID</span>
        <span>Customer</span>
        <span>Product</span>
        <span>Amount</span>
        <span>Status</span>
      </div>

      {orders.map((order) => (
  <div className="table-row" key={order.id}>

    <span>{order.order_number}</span>

    <span>{order.customer_name}</span>

    <span>{order.product_name}</span>

    <span>₹{Number(order.amount).toLocaleString("en-IN")}</span>

    <select
  value={order.status}
  onChange={(e) =>
    updateOrderStatus(order.id, e.target.value)
  }
  className={`status-select ${
    order.status.toLowerCase() === "completed"
      ? "completed"
      : "pending"
  }`}
>
  <option value="Pending">Pending</option>
  <option value="Completed">Completed</option>
</select>
  </div>
))}
    </div>

  </section>
)}
{activePage === "customers" && (
  <section className="products-section customers-section">

    <div className="section-header">
      <h2>Customers</h2>
    </div>

    <div className="product-table">

      <div className="table-header">
        <span>Customer ID</span>
        <span>Name</span>
        <span>Email</span>
        <span>Orders</span>
        <span>Status</span>
      </div>
{customers.map((customer) => (
  <div className="table-row" key={customer.id}>

    <span>{customer.customer_number}</span>

    <span>{customer.name}</span>

    <span>{customer.email}</span>

    <span>{customer.total_orders}</span>

  <span
  className={`status ${
    customer.status.toLowerCase() === "active"
      ? "active"
      : "pending"
  }`}
>
  {customer.status}
</span>
  </div>
))}
    </div>

  </section>
)}
       </main>
  </div>
);
}
export default App;