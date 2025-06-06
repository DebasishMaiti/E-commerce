import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminMenu from '../../components/Layout/AdminMenu';
import Layout from '../../components/Layout/Layout';
import { useAuth } from '../../Context/Context';
import { Select } from 'antd';
const { Option } = Select;
import moment from 'moment';
import '../../CSS/AdminOrder.css';  // Import the new CSS file

const AdminOrder = () => {
    const [status] = useState(['Not Process', 'Processing', 'Shipped', 'Delivered', 'Cancel']);
    const [auth] = useAuth();
    const [orders, setOrders] = useState([]);
    const [shiping, setShiping] = useState([]);
    const [month, setMonth] = useState('')

    const getOrders = async () => {
        try {
            const { data } = await axios.get('https://e-commerce-9m1c.vercel.app/api/auth/all-orders', {
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
                `https://e-commerce-9m1c.vercel.app/api/auth/order-status/${id}`,
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
            const response = await axios.get(`https://e-commerce-9m1c.vercel.app/api/shiping/get-shipings/${id}`, {
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

    const filteredOrders = month ? orders.filter(order => moment(order.createdAt).format('MMMM') === month) : orders;

    return (
        <Layout>
            <div className='row admin-order-row'>
                <div className='col-md-2 admin-order-menu-col'>
                    <AdminMenu />
                </div>
                <div className='col-md-10 admin-order-content-col'>
                    <h4 className='admin-order-filter-title'><u>Filter Orders by month</u></h4>
                    <Select
                        className='admin-order-month-select'
                        style={{ width: '140px' }}
                        placeholder='Select Month'
                        onChange={handleMonthChange}
                    >
                        {moment.months().map((m, index) => (
                            <Option key={index} value={m}>
                                {m}
                            </Option>
                        ))}
                    </Select>
                    <h1 className='text-center admin-order-title'>All Orders</h1>

                    {filteredOrders.length ?
                        filteredOrders.map((order) => (
                            <div
                                key={order._id}
                                className='admin-order-card border-shadow'
                                style={{
                                    marginBottom: '30px',
                                    padding: '20px',
                                    border: '3px solid #ddd',
                                    borderRadius: '10px',
                                }}
                            >
                                <h5 className='admin-order-products-title'>Products:</h5>
                                <table className='table admin-order-table'>
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
                                            <tr key={product._id} className='admin-order-product-row'>
                                                <td className='admin-order-product-name'>{product.name}</td>
                                                <td>
                                                    <img
                                                        className='card-img admin-order-product-img'
                                                        src={`https://e-commerce-9m1c.vercel.app/api/product/product-photo/${product._id}`}
                                                        alt={product.name}
                                                        style={{
                                                            borderRadius: '1rem',
                                                            width: '80px',
                                                            height: '80px',
                                                            objectFit: 'cover',
                                                        }}
                                                    />
                                                </td>
                                                <td className='admin-order-buyer-name'>{order.buyer ? order.buyer.name : 'Guest User'}</td>
                                                <td>
                                                    <Select
                                                        bordered={false}
                                                        onChange={(value) => handleChange(order._id, value)}
                                                        defaultValue={order.status}
                                                        className='admin-order-status-select'
                                                    >
                                                        {status.map((s, index) => (
                                                            <Option key={index} value={s}>
                                                                {s}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </td>
                                                <td className='admin-order-product-desc'>{product.description}</td>
                                                <td className='admin-order-product-price'>${product.price}</td>
                                                <td className='admin-order-product-qty'>{product.quantity}</td>
                                                <td className='admin-order-product-date'>{moment(order.createdAt).format('MMMM Do YYYY')}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan="8">
                                                <div
                                                    className='accordion admin-order-accordion'
                                                    id={`accordion-${order._id}`}
                                                    style={{
                                                        backgroundColor: '#f8f9fa',
                                                        borderRadius: '8px',
                                                        marginTop: '10px',
                                                    }}
                                                >
                                                    <div className='accordion-item admin-order-accordion-item' style={{ border: 'none' }}>
                                                        <h2
                                                            className='accordion-header admin-order-accordion-header'
                                                            id={`heading-${order._id}`}
                                                            style={{
                                                                backgroundColor: '#343a40',
                                                                borderRadius: '8px',
                                                            }}
                                                        >
                                                            <button
                                                                className='accordion-button admin-order-accordion-button'
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
                                                            className='accordion-collapse collapse admin-order-accordion-collapse'
                                                            aria-labelledby={`heading-${order._id}`}
                                                        >
                                                            <div className='accordion-body admin-order-accordion-body'>
                                                                <table className='table admin-order-address-table'>
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
                                                                            <tr key={index} className='admin-order-address-row'>
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
                        )) : (
                            <p className="text-center admin-no-orders">No orders found.</p>
                        )}
                </div>
            </div>
        </Layout>
    );
};

export default AdminOrder;
