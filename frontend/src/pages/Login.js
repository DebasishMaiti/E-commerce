import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../Context/Context';
import { useLocation } from 'react-router-dom';

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
            console.log(response);
            if (response.data) {
                setAuth({
                    ...auth,
                    user: response.data.user,
                    token: response.data.token,
                });
                localStorage.setItem("auth", JSON.stringify(response.data));
                console.log(response.data);
                toast.success('Login Successful');

                setTimeout(() => {
                    let authentication = JSON.parse(localStorage.getItem('auth'))
                    authentication.user.role == 1 ? navigate('/dashboard/admin') : navigate(location.state || '/')

                    // // navigate(location.state || '/')
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
                <div className="register justify-content-center text-center">
                    <div className="register login-Form d-flex justify-content-center mt-4 rounded-3" style={{ width: "25%" }}>
                        <h1>Login Form</h1>
                        <form className='mt-3' onSubmit={dataSendToApi}>
                            <div className="mb-3">
                                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name='email' value={formData.email} placeholder='Enter Your Email' onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <input type="password" className="form-control" id="exampleInputPassword1" name='password' value={formData.password} placeholder='Enter Your Password' onChange={handleChange} />
                            </div>
                            <button type="submit" className="btn btn-primary" >Submit</button>
                            <div className='mb-3'>
                                <u><span onClick={() => navigate('/forgot-password')} style={{ cursor: "pointer" }}>Forgot Password ?</span></u>
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
