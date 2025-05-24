import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../Context/Context';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import '../CSS/CartPage.css'; // Import your custom CSS

const CartPage = () => {
    const [cart, setCart] = useState([]);
    const [auth] = useAuth();
    const navigate = useNavigate();

    const getCart = async () => {
        try {
            const { data } = await axios.get(`http://localhost:8000/api/cart/getcart/${auth.user._id}`);
            const productIds = data.cart[0]?.product || [];

            const productDetails = await Promise.all(
                productIds.map((id) => axios.get(`http://localhost:8000/api/product/get-single-product/${id}`))
            );

            const products = productDetails.map((res) => res.data.product);
            setCart(products);
        } catch (error) {
            console.log('Error fetching cart:', error);
            setCart([]);
        }
    };

    useEffect(() => {
        getCart();
    }, [auth]);

    const removeCartItem = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/cart/removeproduct/${auth.user._id}`, { data: { product: id } });
            getCart();
        } catch (error) {
            console.log(error);
        }
    };

    const totalPrice = () => {
        let total = 0;
        cart.forEach((item) => (total += item.price));
        return total;
    };

    return (
        <Layout>
            <div className="container cartpage-container">
                <div className="row cartpage-header-row">
                    <div className="col-md-12 cartpage-header-col">
                        <div className="text-center cartpage-header-text">
                            <h1 className="cartpage-greeting">{`Hello ${auth.token && auth.user.name}`}</h1>
                            <h4 className="cartpage-subtitle text-center">
                                {cart.length > 0
                                    ? `You have ${cart.length} products in your cart ${auth.token ? '' : 'Please login'}`
                                    : 'Your Cart is empty'}
                            </h4>
                        </div>
                    </div>
                </div>

                <div className="row cartpage-content-row">
                    <div className="col-md-8 cartpage-products-col">
                        {cart.map((p, index) => (
                            <div key={index} className="row m-2 card flex-row cartpage-product-card">
                                <div className="col-md-4 cartpage-product-image-col">
                                    <img
                                        className="card-img cartpage-product-image"
                                        src={`http://localhost:8000/api/product/product-photo/${p._id}`}
                                        alt={p.name}
                                        style={{ borderRadius: '1rem' }}
                                    />
                                </div>
                                <div className="col-md-8 cartpage-product-info-col">
                                    <h4 className="cartpage-product-name">{p.name}</h4>
                                    <p className="cartpage-product-description">{p.description}</p>
                                    <p className="cartpage-product-price">${p.price}</p>
                                    <button
                                        className="btn btn-danger m-1 cartpage-remove-btn"
                                        onClick={() => removeCartItem(p._id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="col-md-4 text-center cartpage-summary-col">
                        <h2 className="cartpage-summary-title">Cart Summary</h2>
                        <p className="cartpage-summary-subtitle">Total | Checkout | Payment</p>
                        <hr />
                        <h4 className="cartpage-total-price">Total: ${totalPrice()}</h4>

                        {auth?.user?.address && (
                            <div className="mb-3 cartpage-address-section">
                                <h4>Current Address:-</h4>
                                <h6 className="cartpage-address">{auth?.user?.address}</h6>
                            </div>
                        )}

                        <div className="mb-3 cartpage-action-buttons">
                            {auth?.token ? (
                                <div className="d-flex flex-column">
                                    <button
                                        className="btn btn-outline-warning"
                                        onClick={() => navigate('/dashboard/user/profile')}
                                    >
                                        Update Address
                                    </button>
                                    <button className="btn btn-info mt-3" onClick={() => navigate('/checkout')}>
                                        checkout
                                    </button>
                                </div>
                            ) : (
                                <button className="btn btn-outline-warning" onClick={() => navigate('/login')}>
                                    Please Login to checkout
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </Layout>
    );
};

export default CartPage;
