import React, { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import { useParams, useNavigate } from 'react-router-dom';
import './CartDetail.css';

function CartDetail() {
  const { cartId } = useParams();
  const [cart, setCart] = useState({});
  const [users, setUsers] = useState([]);
  const [password, setPassword] = useState('');
  const [owner, setOwner] = useState({});
  const [deleteError, setDeleteError] = useState('');
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0); 
  const [collaboratorUsername, setCollaboratorUsername] = useState('');
  const [shareError, setShareError] = useState('');
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  

  useEffect(() => {
    fetchCart();
    fetchUsers();
    fetchProducts();
  }, []);

  useEffect(() => {
    const ownerData = users.find((user) => user.id === cart.userId);
    if (ownerData) {
      setOwner(ownerData);
    }
  }, [users, cart.userId]);

  useEffect(() => {
    // Calculate total price when products change
    if (cart.products) {
      const totalPrice = cart.products.reduce((acc, productId) => {
        const product = products.find((product) => product.id === productId);
        return acc + (product ? product.price : 0);
      }, 0);
      setTotalPrice(totalPrice);
    }
  }, [cart.products, products]);

  const fetchCart = async () => {
    try {
      const response = await fetch(`http://localhost:3001/carts/${cartId}`);
      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/users/all');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/products/all');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const getUsernameFromId = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.username : 'Unknown User';
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:3001/carts/${cartId}/products/${productId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Product removed from cart successfully');
        // Refresh cart data after deletion
        fetchCart();
      } else {
        const data = await response.json();
        setDeleteError(data.message);
      }
    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  };

  const handleDeleteCart = async () => {
    // Implement delete cart functionality here
    console.log('Deleting cart with ID:', cartId);
  };

  const handleDelete = async () => {
    try {
      // Open the modal to prompt for the password
      setShowDeleteModal(true);
    } catch (error) {
      console.error('Error opening modal:', error);
      setDeleteError('An error occurred while deleting the cart');
    }
  };
  
  

  const confirmDelete = async () => {
    try {
      // Hash the entered password
      const hashedPassword = bcrypt.hashSync(password, 10);
  
      // Fetch the owner's data from the users array
      const ownerData = users.find((user) => user.id === cart.userId);
  
      if (!ownerData) {
        console.error('Owner data not found');
        return;
      }
  
      // Compare the entered password hash with the owner's password hash
      const isPasswordMatch = bcrypt.compareSync(password, ownerData.password);
  
      if (isPasswordMatch) {
        // Send a DELETE request to delete the cart
        const response = await fetch(`http://localhost:3001/carts/${cartId}/del`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          // Cart deleted successfully
          console.log('Cart deleted successfully');
          navigate('/carts'); // Navigate to the carts page
        } else {
          const data = await response.json();
          console.error('Error deleting cart:', data.message);
          setDeleteError(data.message);
        }
      } else {
        setDeleteError('Incorrect password');
      }
    } catch (error) {
      console.error('Error deleting cart:', error);
      setDeleteError('An error occurred while deleting the cart');
    } finally {
      // Close the modal after the operation
      setShowDeleteModal(false);
    }
  };
  

  const handleShareCart = async () => {
    try {
      // Open the modal to prompt for the owner's password
      setShowShareModal(true);
    } catch (error) {
      console.error('Error opening modal:', error);
    }
  };
  
  const confirmShareCart = async () => {
    try {
      // Hash the entered password
      const hashedPassword = bcrypt.hashSync(password, 10);
  
      // Compare the entered password hash with the owner's password hash
      const isPasswordMatch = bcrypt.compareSync(password, owner.password);
  
      if (isPasswordMatch) {
        // Find the user ID of the collaborator using their username
        const collaborator = users.find(user => user.username === collaboratorUsername);
        if (!collaborator) {
          setShareError('User not found');
          return;
        }
  
        // Check if the collaborator already exists in the cart
        if (cart.collaborators && cart.collaborators.includes(collaborator.id)) {
          setShareError('Collaborator already added');
          return;
        }
  
        // Send request to backend to share cart with collaborator
        const response = await fetch('http://localhost:3001/carts/share', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cartId: parseInt(cartId), userId: collaborator.id }),
        });
  
        if (response.ok) {
          // Cart shared successfully
          const data = await response.json();
          console.log('Cart shared with collaborator:', data);
          // Reset collaborator input field and clear any previous error message
          setCollaboratorUsername('');
          setShareError('');
          window.location.reload();
        } else {
          const errorData = await response.json();
          setShareError(errorData.message);
        }
      } else {
        setShareError('Incorrect password');
      }
    } catch (error) {
      console.error('Error sharing cart with collaborator:', error);
      setShareError('An error occurred while sharing the cart');
    } finally {
      // Close the modal after the operation
      setShowShareModal (false);
    }
  };
  

  return (
    <div className="container">
    <h2>Cart Details</h2>
      <div className="cart-details">
        <p><strong>Cart name:</strong> {cart.name}</p>
        <p><strong>Cart ID:</strong> {cart.id}</p>
        <p><strong>Owner:</strong> {getUsernameFromId(cart.userId)}</p>
        <p><strong>Collaborators:</strong> {cart.collaborators && cart.collaborators.map((collaborator) => getUsernameFromId(collaborator)).join(', ')}</p>
        <div className="product-list">
          <p><strong>Products:</strong></p>
          {cart.products && cart.products.map((productId, index) => {
            const product = products.find((product) => product.id === productId);
            return (
              <div key={index} className="product-block">
                <span>{product ? product.name + "  " : 'Unknown Product  '}</span>
                <button className="delete-button" onClick={() => handleDeleteProduct(productId)}>X</button>
              </div>
            );
          })}
          <p><strong>Total Price:</strong> {totalPrice.toFixed(2)}€</p> {/* Display total price */}
        </div>
        <button className="button" onClick={() => navigate(`/carts/${cartId}/add-product`)}>
          Add Product to Cart
        </button>
        <p></p>
        <div>
        <button className="delete-button" onClick={handleDelete}>Delete Cart</button>
          {deleteError && <p className="error-message">{deleteError}</p>}
        </div>
        {showDeleteModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Enter Password</h2>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button className="delete-button" onClick={confirmDelete}>Confirm</button>
              <button className="button" onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    <div className="share-cart">
      <h2>Share Cart</h2>
      <input type="text" value={collaboratorUsername} onChange={(e) => setCollaboratorUsername(e.target.value)} placeholder="Enter collaborator username" />
      <button className="button" onClick={handleShareCart}>Share with Collaborator</button>
      {shareError && <p className="error-message">{shareError}</p>}
    </div>
    {showShareModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Enter Password</h2>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button className="delete-button" onClick={confirmShareCart}>Confirm</button>
              <button className="button" onClick={() => setShowShareModal(false)}>Cancel</button>
            </div>
          </div>
        )}
</div>

  );
}

export default CartDetail;
