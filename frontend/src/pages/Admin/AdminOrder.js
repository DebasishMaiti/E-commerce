import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminMenu from '../../components/Layout/AdminMenu';
import Layout from '../../components/Layout/Layout';
import { useAuth } from '../../Context/Context';
import { Select } from 'antd';
const { Option } = Select;
import moment from 'moment';

const AdminOrder = () => {
    const [status] = useState(['Not Process', 'Processing', 'Shipped', 'Delivered', 'Cancel']);
    const [auth] = useAuth();
    const [orders, setOrders] = useState([]);
    const [shiping, setShiping] = useState([]);
    const [month, setMonth] = useState('')

    const getOrders = async () => {
        try {
            const { data } = await axios.get('http://localhost:8000/api/auth/all-orders', {
                headers: {
                    Authorization: auth.token,
                },
            });
            setOrders(data || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (auth.token) {
            getOrders();
        }
    }, [auth.token]);

    const handleChange = async (id, value) => {
        try {
            const response = await axios.put(
                `http://localhost:8000/api/auth/order-status/${id}`,
                { status: value },
                {
                    headers: {
                        Authorization: auth.token,
                    },
                }
            );
            console.log(response);
            getOrders();
        } catch (error) {
            console.log(error);
        }
    };

    const getAddress = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/shiping/get-shipings/${id}`, {
                headers: {
                    Authorization: auth.token,
                },
            });
            setShiping(Array.isArray(response.data.shiping) ? response.data.shiping : []);
        } catch (error) {
            console.log(error);
        }
    };

    const handleMonthChange = (value) => {
        setMonth(value);
    }

    const filteredOrders = month ? orders.filter(orders => moment(orders.createdAt).format('MMMM') === month) : orders;

    return (
        <Layout>
            <div className='row'>
                <div className='col-md-2'>
                    <AdminMenu />
                </div>
                <div className='col-md-10'>
                    <h4><u>filter Orders by month</u></h4>
                    <Select style={{ width: '140px' }} placeholder='Select Month' onChange={handleMonthChange}>
                        {moment.months().map((m, index) => (
                            <Option key={index} value={m}>
                                {m}
                            </Option>
                        ))}
                    </Select>
                    <h1 className='text-center'>All Orders</h1>
                    {filteredOrders.length ?
                        filteredOrders.map((order) => (
                            <div
                                className='border-shadow'
                                key={order._id}
                                style={{
                                    marginBottom: '30px',
                                    padding: '20px',
                                    border: '3px solid #ddd',
                                    borderRadius: '10px',
                                }}
                            >
                                <h5>Products:</h5>
                                <table className='table'>
                                    <thead>
                                        <tr>
                                            <th scope='col'>Product</th>
                                            <th scope='col'>Photo</th>
                                            <th scope='col'>Buyer</th>
                                            <th scope='col'>Status</th>
                                            <th scope='col'>Description</th>
                                            <th scope='col'>Price</th>
                                            <th scope='col'>Quantity</th>
                                            <th scope='col'>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.products.map((product) => (
                                            <tr key={product._id}>
                                                <td>{product.name}</td>
                                                <td>
                                                    <img
                                                        className='card-img'
                                                        src={`http://localhost:8000/api/product/product-photo/${product._id}`}
                                                        alt={product.name}
                                                        style={{
                                                            borderRadius: '1rem',
                                                            width: '80px',
                                                            height: '80px',
                                                            objectFit: 'cover',
                                                        }}
                                                    />
                                                </td>
                                                <td>{order.buyer ? order.buyer.name : 'Guest User'}</td>
                                                <td>
                                                    <Select
                                                        bordered={false}
                                                        onChange={(value) => handleChange(order._id, value)}
                                                        defaultValue={order.status}
                                                    >
                                                        {status.map((s, index) => (
                                                            <Option key={index} value={s}>
                                                                {s}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </td>
                                                <td>{product.description}</td>
                                                <td>${product.price}</td>
                                                <td>{product.quantity}</td>
                                                <td>{moment(order.createdAt).format('MMMM Do YYYY')}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan="8">
                                                <div
                                                    className='accordion'
                                                    id={`accordion-${order._id}`}
                                                    style={{
                                                        backgroundColor: '#f8f9fa',
                                                        borderRadius: '8px',
                                                        marginTop: '10px',
                                                    }}
                                                >
                                                    <div className='accordion-item' style={{ border: 'none' }}>
                                                        <h2
                                                            className='accordion-header'
                                                            id={`heading-${order._id}`}
                                                            style={{
                                                                backgroundColor: '#343a40',
                                                                borderRadius: '8px',
                                                            }}
                                                        >
                                                            <button
                                                                className='accordion-button'
                                                                type='button'
                                                                data-bs-toggle='collapse'
                                                                data-bs-target={`#collapse-${order._id}`}
                                                                aria-expanded='false'
                                                                aria-controls={`collapse-${order._id}`}
                                                                onClick={() => getAddress(order._id)}
                                                                style={{
                                                                    color: 'black',
                                                                    padding: '10px 20px',
                                                                }}
                                                            >
                                                                Address
                                                            </button>
                                                        </h2>
                                                        <div
                                                            id={`collapse-${order._id}`}
                                                            className='accordion-collapse collapse'
                                                            aria-labelledby={`heading-${order._id}`}
                                                        >
                                                            <div className='accordion-body'>
                                                                <table className='table '>
                                                                    <thead>
                                                                        <tr>
                                                                            <th scope='col'>Name</th>
                                                                            <th scope='col'>Email</th>
                                                                            <th scope='col'>Phone</th>
                                                                            <th scope='col'>Address</th>
                                                                            <th scope='col'>City</th>
                                                                            <th scope='col'>State</th>
                                                                            <th scope='col'>Zip</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {shiping.map((s, index) => (
                                                                            <tr key={index}>
                                                                                <td>{s.name}</td>
                                                                                <td>{s.email}</td>
                                                                                <td>{s.phone}</td>
                                                                                <td>{s.address}</td>
                                                                                <td>{s.city}</td>
                                                                                <td>{s.state}</td>
                                                                                <td>{s.zip}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ))
                        : ''}
                </div>
            </div>
        </Layout>
    );
};

export default AdminOrder;
