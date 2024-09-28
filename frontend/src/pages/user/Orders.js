import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import UserMenu from '../../components/Layout/UserMenu';
import axios from 'axios';
import { useAuth } from '../../Context/Context';
import moment from 'moment';

const Orders = () => {
    const [auth] = useAuth();
    const [orders, setOrders] = useState([]);

    const getOrders = async () => {
        try {
            const { data } = await axios.get(`http://localhost:8000/api/auth/userOrders/${auth.user._id}`, {
                headers: {
                    'Authorization': auth.token
                }
            });
            setOrders(data || []);
            console.log(data);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (auth.token) {
            getOrders();
        }
    }, [auth.token]);

    return (
        <Layout>
            <div className='container-fluid p-3 m-3'>
                <div className='row'>
                    <div className='col-md-3'>
                        <UserMenu />
                    </div>
                    <div className='col-md-9'>
                        <h3 className='text-center'>All Orders</h3>
                        {orders.length ? (
                            orders.map((order) => (
                                <div className='border-shadow' key={order._id}>
                                    <h5>Products:</h5>
                                    <table className='table'>
                                        <thead>
                                            <tr>
                                                <th scope='col'>Name</th>

                                                <th scope='col'>Photo</th>
                                                <th scope='col'>Description</th>
                                                <th scope='col'>Price</th>
                                                <th scope='col'>Quantity</th>
                                                <th scope='col'>Status</th>
                                                <th scope='col'>date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.products.map((product) => (
                                                <tr key={product._id}>
                                                    <td>{product.name}</td>
                                                    <td>
                                                        <img src={`http://localhost:8000/api/product/product-photo/${product._id}`} alt={product.name} style={{ width: '100px' }} />
                                                    </td>
                                                    <td>{product.description}</td>
                                                    <td>${product.price}</td>
                                                    <td>{product.quantity}</td>
                                                    <td>{order.status}</td>
                                                    <td>{moment(order.createdAt).format('MMMM Do YYYY')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))
                        ) : (
                            <p>No orders found.</p>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Orders;
