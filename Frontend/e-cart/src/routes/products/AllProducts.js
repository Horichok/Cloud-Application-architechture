import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function AddProduct() {
  const navigate = useNavigate();
  const { cartId } = useParams();
  const [products, setProducts] = useState([]);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [alreadyExist, setAlreadyExist] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
        const response = await fetch('http://localhost:3001/products/all');
        const data = await response.json();
        setProducts(data);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

  const handleAddNewProduct = async () => {
    // Check if new product name is provided
    if (newProductName.trim() === '') {
      alert('Please provide a product name');
      return;
    }
  
    // Check if the price is a valid number
    const parsedPrice = parseFloat(newProductPrice);
    if (isNaN(parsedPrice)) {
      alert('Please provide a valid price');
      return;
    }
  
    // Check if the new product name already exists
    const productExists = products.some(product => product.name === newProductName);
    if (productExists) {
      alert('This product already exists');
      return;
    }
  
    try {
      // Send new product name and price to create product endpoint
      const response = await fetch('http://localhost:3001/products/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newProductName, price: parsedPrice }),
      });
  
      if (response.ok) {
        // Clear input fields and fetch updated products list
        setNewProductName('');
        setNewProductPrice('');
        await fetchProducts();
      } else {
        const errorData = await response.json();
        alert('Error creating product: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleChangePrice = async (productId) => {
    const newPrice = prompt('Enter the new price:');
    if (newPrice === null) return; // User cancelled
    const parsedNewPrice = parseFloat(newPrice);
    if (isNaN(parsedNewPrice)) {
      alert('Please provide a valid price');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3001/products/${productId}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: products.find(p => p.id === productId).name, price: parsedNewPrice }),
      });

      if (response.ok) {
        await fetchProducts();
      } else {
        const errorData = await response.json();
        alert('Error updating price: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error updating price:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:3001/products/${productId}/del`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchProducts();
      } else {
        const errorData = await response.json();
        alert('Error deleting product: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="container">
      <h2>Add Product</h2>

      <div className="form-group">
        <label className="label">Add New Product:</label>
        <p></p>
        <input
          className="input-field"
          type="text"
          value={newProductName}
          onChange={(e) => setNewProductName(e.target.value)}
          placeholder="Enter Product Name"
        />
        <p></p>
        <input
          className="input-field"
          type="text"
          value={newProductPrice}
          onChange={(e) => setNewProductPrice(e.target.value)}
          placeholder="Enter Product Price"
        />
        <p></p>
        <button className="button" onClick={handleAddNewProduct}>
          Add New Product
        </button>
      </div>

      <h2>Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <p>
              <strong>Name:</strong> {product.name}
            </p>
            <p>
              <strong>Price:</strong> {product.price}
            </p>
            <button className="button" onClick={() => handleChangePrice(product.id)}>
              Change Price
            </button>
            <button className="button" onClick={() => handleDeleteProduct(product.id)}>
              Delete Product
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddProduct;
