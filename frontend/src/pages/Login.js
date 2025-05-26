import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../Context/Context';
import '../CSS/Login.css';

const Login = () => {
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const dataSendToApi = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://e-commerce-9m1c.vercel.app/api/auth/login", formData);
            if (response.data) {
                setAuth({
                    ...auth,
                    user: response.data.user,
                    token: response.data.token,
                });
                localStorage.setItem("auth", JSON.stringify(response.data));
                toast.success('Login Successful');
                setTimeout(() => {
                    const authentication = JSON.parse(localStorage.getItem('auth'));
                    authentication.user.role === 1
                        ? navigate('/dashboard/admin')
                        : navigate(location.state || '/');
                }, 1800);
            }
        } catch (error) {
            console.log(error);
            toast.error('Something Went Wrong');
        }
    };

    return (
        <>
            <Layout>
                <div className="login-container d-flex justify-content-center align-items-center">
                    <div className="login-card shadow p-4 rounded">
                        <h2 className="text-center mb-4">Login</h2>
                        <form onSubmit={dataSendToApi}>
                            <div className="mb-3">
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={formData.email}
                                    placeholder="Enter Your Email"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={formData.password}
                                    placeholder="Enter Your Password"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="d-grid gap-2 mb-2">
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                            <div className="text-center">
                                <span className="forgot-link" onClick={() => navigate('/forgot-password')}>
                                    Forgot Password?
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
            </Layout>
            <ToastContainer />
        </>
    );
};

export default Login;
