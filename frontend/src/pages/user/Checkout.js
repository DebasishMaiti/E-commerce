import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';

import { useAuth } from '../../Context/Context';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DropIn from 'braintree-web-drop-in-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Checkout = () => {
    const [showInput, setShowInput] = useState(false);
    const [showAddInput, setShowAddInput] = useState(false);
    const [cart, setCart] = useState();
    const [auth] = useAuth();
    const navigate = useNavigate();
    const [clientToken, setClientToken] = useState('');
    const [instance, setInstance] = useState('');
    const [loading, setLoading] = useState(false);
    const [guest] = useState('Guest user');
    const [userAdd, setUserAdd] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
    });

    const getCart = async () => {
        try {
            const { data } = await axios.get(`http://localhost:8000/api/cart/getcart/${auth.user._id}`);
            const productIds = data.cart[0]?.product || [];

            const productDetails = await Promise.all(
                productIds.map(id => axios.get(`http://localhost:8000/api/product/get-single-product/${id}`))
            );

            const products = productDetails.map(res => res.data.product);

            setCart(products);
        } catch (error) {
            console.log('Error fetching cart:', error);
            setCart([]);
        }
    };

    useEffect(() => {
        getCart()
    }, [])

    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handlePostShiping = async (orderId) => {
        try {
            const response = await axios.post(
                `http://localhost:8000/api/shiping/add-shiping/${orderId}/${auth.user._id}`,
                formData
            );
            console.log(response);
            DeleteCart(auth.user._id)
        } catch (error) {
            console.log(error);
        }
    };

    const DeleteCart = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/cart/deletecart/${id}`)
        } catch (error) {
            console.log(error);
        }
    }

    // const totalPrice = () => {
    //     let total = 0;
    //     cart.map((item) => (total += item.price));
    //     return total;
    // };

    const getToken = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8000/api/product/braintree/token'
            );
            setClientToken(response.data.clientToken);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getToken();
    }, [auth.token]);

    const handlePayment = async () => {
        try {
            setLoading(true);
            const { nonce } = await instance.requestPaymentMethod();
            console.log(cart,);

            const response = await axios.post(
                `http://localhost:8000/api/product/braintree/payment/${auth.user._id}`,
                {
                    nonce,
                    cart,
                }
            );
            setLoading(false);
            setCart([]);
            navigate('/dashboard/user/orders');
            toast.success('Payment Done');
            var orderId = response.data.order._id;
            handlePostShiping(orderId);
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error('Payment Failed');
        }
    };

    const handleGuestPayment = async () => {
        try {
            setLoading(true);
            const { nonce } = await instance.requestPaymentMethod();
            const response = await axios.post(
                `http://localhost:8000/api/product/braintree/payments/${guest}`,
                {
                    nonce,
                    cart,
                }
            );
            setLoading(false);
            localStorage.removeItem('cart');
            setCart([]);
            navigate('/');
            toast.success('Payment Done');
            var orderId = response.data.order._id;
            handlePostShiping(orderId);
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error('Payment Failed');
        }
    };

    const getShipings = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8000/api/shiping/get-user-shipings/${auth.user._id}`
            );
            setUserAdd(response.data.shiping);
        } catch (error) {
            console.log(error);
        }
    };

    const handleRadioChange = (e) => {
        if (e.target.value === 'show') {
            setShowInput(true);
            setShowAddInput(false);
        } else {
            setShowInput(false);
            setShowAddInput(true);
        }
    };

    const handleAddressSelect = (e) => {
        const selected = userAdd[e.target.value];


        // Populate formData with the selected address details
        setFormData({
            name: selected.name,
            email: selected.email,
            phone: selected.phone,
            address: selected.address,
            city: selected.city,
            state: selected.state,
            zip: selected.zip,
        });
    };

    useEffect(() => {
        getShipings();
    }, [showAddInput]);

    return (
        <Layout>
            {auth.user ? (
                <div className="text-center d-flex flex-column">
                    <h3>Select address or type address</h3>
                    <label style={{ marginLeft: '10px' }}>
                        <input
                            type="radio"
                            value="hide"
                            name="toggleInput"
                            onChange={handleRadioChange}
                        />
                        Select From Your Addresses
                    </label>
                    <label className="m-2">
                        <input
                            type="radio"
                            value="show"
                            name="toggleInput"
                            onChange={handleRadioChange}
                        />
                        Different Address
                    </label>

                    {showAddInput && (
                        <select
                            className="form-control"
                            onChange={handleAddressSelect}
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Select an address
                            </option>
                            {userAdd.map((address, index) => (
                                <option key={index} value={index}>
                                    {address.address}, {address.city}, {address.state} - {address.zip}
                                </option>
                            ))}
                        </select>
                    )}

                    {showInput && (
                        <div
                            style={{
                                marginTop: '50px',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                padding: '30px',
                                paddingRight: '50px',
                                width: '1000px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '10px',
                                boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <form>
                                <div className="form-row d-flex">
                                    <div
                                        className="form-group col-md-4 m-2"
                                        style={{ marginLeft: '3rem' }}
                                    >
                                        <label htmlFor="inputPassword4">Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="inputName4"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group col-md-4 m-2">
                                        <label htmlFor="inputEmail4">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="inputEmail"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group col-md-4 m-2">
                                        <label htmlFor="inputEmail4">Phone</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="inputPhone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-group mb-2">
                                    <label htmlFor="inputAddress">Address</label>
                                    <textarea
                                        type="text"
                                        className="form-control"
                                        id="inputAddress"
                                        placeholder="House/room No, Floor, Apartment/Building, Street"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-row d-flex">
                                    <div className="form-group col-md-4 m-2">
                                        <label htmlFor="inputCity">City</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="inputCity"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group col-md-4 m-2">
                                        <label htmlFor="inputState">State</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="inputState"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group col-md-4 m-2">
                                        <label htmlFor="inputZip">Zip</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="inputZip"
                                            name="zip"
                                            value={formData.zip}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <h2 className='text-center'>Give your address</h2>
                    <div
                        style={{
                            marginTop: '25px',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            padding: '30px',
                            paddingRight: '50px',
                            width: '1000px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '10px',
                            boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <form>
                            <div className="form-row d-flex">
                                <div
                                    className="form-group col-md-4 m-2"
                                    style={{ marginLeft: '3rem' }}
                                >
                                    <label htmlFor="inputPassword4">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="inputName4"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group col-md-4 m-2">
                                    <label htmlFor="inputEmail4">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="inputEmail"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group col-md-4 m-2">
                                    <label htmlFor="inputEmail4">Phone</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="inputPhone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="form-group mb-2">
                                <label htmlFor="inputAddress">Address</label>
                                <textarea
                                    type="text"
                                    className="form-control"
                                    id="inputAddress"
                                    placeholder="House/room No, Floor, Apartment/Building, Street"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-row d-flex">
                                <div className="form-group col-md-4 m-2">
                                    <label htmlFor="inputCity">City</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="inputCity"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group col-md-4 m-2">
                                    <label htmlFor="inputState">State</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="inputState"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group col-md-4 m-2">
                                    <label htmlFor="inputZip">Zip</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="inputZip"
                                        name="zip"
                                        value={formData.zip}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </>
            )}
            <div className="container">
                <div className="row">
                    <div className=" text-center">
                        <h2>Cart Summary</h2>
                        <p>Total | Checkout | Payment</p>
                        <hr />
                        {/* <h4>Total: ${totalPrice()}</h4> */}
                        {auth?.user?.address ? (
                            <>
                                <div className="mb-3">
                                    <h4>Current Address</h4>
                                    <h5>{auth?.user?.address}</h5>
                                </div>
                            </>
                        ) : (
                            ''
                        )}
                        <div className="mt-2">
                            {clientToken && (
                                <DropIn
                                    options={{
                                        authorization: clientToken,
                                        paypal: {
                                            flow: 'vault',
                                        },
                                    }}
                                    onInstance={(instance) => setInstance(instance)}
                                />
                            )}
                            {auth.user ? (
                                <button
                                    className="btn btn-outline-success"
                                    onClick={handlePayment}
                                    disabled={loading || !instance}
                                >
                                    {loading ? 'Processing...' : 'Make Payment'}
                                </button>
                            ) : (
                                <button
                                    className="btn btn-outline-success"
                                    onClick={handleGuestPayment}
                                    disabled={loading || !instance}
                                >
                                    {loading ? 'Processing...' : 'Make Payment'}
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

export default Checkout;
