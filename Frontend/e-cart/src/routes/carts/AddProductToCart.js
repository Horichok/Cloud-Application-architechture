import React, { useState, useEffect } from 'react';
import { useNavigate ,useParams  } from 'react-router-dom';
import './AddProductToCart.css';

function AddProductToCart() {
  const navigate = useNavigate();
  const [productName, setProductName] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');

  const { cartId } = useParams();

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
 
  const handleAddExistingProduct = async () => {
    try {
      // Check if a product is selected
      if (selectedProductId) {
        // Convert selectedProductId to an integer
        const productIdInt = parseInt(selectedProductId);
        // Check if productId is a valid integer
        if (!isNaN(productIdInt)) {
          // Check if the new product name is already in the products list
          const existingProduct = products.find(product => product.name.toLowerCase() === newProductName.toLowerCase());
          if (existingProduct) {
            alert('A product with the same name already exists');
            return;
          }
          // Convert cartId to an integer
          const cartIdInt = parseInt(cartId);
          // Check if cartId is a valid integer
          if (!isNaN(cartIdInt)) {
            // Send cartId and productId to the backend
            const response = await fetch('http://localhost:3001/carts/add', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ cartId: cartIdInt, productId: productIdInt }),
            });
  
            if (response.ok) {
              // Product added to cart successfully
              const data = await response.json();
              console.log('Product added to cart:', data);
              // Redirect or perform any other action here
            } else {
              const errorData = await response.json();
              alert('Error adding product to cart: ' + errorData.message);
            }
          } else {
            alert('Invalid cart ID');
          }
        } else {
          alert('Invalid product ID');
        }
      } else {
        alert('Please select a product');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
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
  

  return (
    <div className="container">
      <h2>Add Product to Cart</h2>
      <div className="form-group">
        <label className="label">Add Existing Product:  </label>
        <select
          className="select-field"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select><p></p>
        <button className="button" onClick={handleAddExistingProduct}>
          Add Existing Product
        </button><p></p><p></p>
      </div>
      <div className="form-group">
        <label className="label">Add New Product:</label><p></p>
        <input
          className="input-field"
          type="text"
          value={newProductName}
          onChange={(e) => setNewProductName(e.target.value)}
          placeholder="Enter Product Name"
        /><p></p>
        <input
          className="input-field"
          type="text"
          value={newProductPrice}
          onChange={(e) => setNewProductPrice(e.target.value)}
          placeholder="Enter Product Price "
        /><p></p>
        <button className="button" onClick={handleAddNewProduct}>
          Add New Product
        </button>
      </div>
    </div>
  );
}

export default AddProductToCart;