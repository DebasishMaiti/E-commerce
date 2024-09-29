import React from 'react';
import Layout from '../components/Layout/Layout';
import { useCart } from '../Context/Cart';
import { useAuth } from '../Context/Context';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const [cart, setCart] = useCart();
    const [auth] = useAuth();
    const navigate = useNavigate();


    const removeCartItem = (id) => {
        try {
            let myCart = [...cart];
            let index = myCart.findIndex((item) => item._id === id);
            myCart.splice(index, 1);
            setCart(myCart);
            localStorage.setItem('cart', JSON.stringify(myCart));
        } catch (error) {
            console.log(error);
        }
    };

    const totalPrice = () => {
        let total = 0;
        cart.map((item) => (total += item.price));
        return total;
    };

    return (
        <Layout>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-12'>

                        <div className='text-center mb-1'>
                            <h1>{`Hello ${auth.token && auth.user.name}`}</h1>
                            <h4 className='text-center'>
                                {cart.length > 0 ? `You have ${cart.length} products in your cart ${auth.token ? '' : 'Please login'}` : 'Your Cart is empty'}
                            </h4>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-8'>
                        {cart.map((p, index) => (
                            <div key={index} className='row m-2 card flex-row'>
                                <div className='col-md-4'>
                                    <img className='card-img' src={`https://e-commerce-9m1c.vercel.app/api/product/product-photo/${p._id}`} alt={p.name} style={{ borderRadius: '1rem' }} />
                                </div >
                                <div className='col-md-8'>
                                    <h4>{p.name}</h4>
                                    <p>{p.description}</p>
                                    <p>${p.price}</p>
                                    <button className='btn btn-danger m-1' onClick={() => removeCartItem(p._id)}>Remove</button>
                                </div>
                            </div >
                        ))}
                    </div >
                    <div className='col-md-4 text-center'>
                        <h2>Cart Summary</h2>
                        <p>Total | Checkout | Payment</p>
                        <hr />
                        <h4>Total: ${totalPrice()}</h4>
                        {auth?.user?.address ? (
                            <>
                                <div className='mb-3'>
                                    <h4>Current Address:-</h4>
                                    <h6>{auth?.user?.address}</h6>

                                </div>
                            </>
                        ) : ""}
                        <div className='mb-3'>
                            {auth?.token ? (
                                <div className='d-flex flex-column'>
                                    <button className='btn btn-outline-warning' onClick={() => navigate('/dashboard/user/profile')}>
                                        Update Address
                                    </button>
                                    <button className='btn btn-info mt-3' onClick={() => navigate('/checkout')}>checkout</button>
                                </div>
                            ) : (
                                <button className='btn btn-outline-warning' onClick={() => navigate('/login')}>
                                    Please Login to checkout
                                </button>
                            )}
                        </div>

                        {!auth.token ? <><h4>OR</h4> <button className='btn btn-success mt-2' onClick={() => navigate('/checkout')}>Checkout as Guest</button></> : ''}
                    </div>
                </div >
            </div >
        </Layout >
    );
};

export default CartPage;


