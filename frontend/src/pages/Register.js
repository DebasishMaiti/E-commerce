import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../CSS/Register.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        question: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const dataSendToApi = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://e-commerce-two-lemon.vercel.app/api/auth/register", formData);
            toast.success(response.data.message);
            setTimeout(() => {
                navigate('/login');
            }, 1800);
        } catch (error) {
            console.log(error);
            toast.error('Something Went Wrong');
        }
    };

    return (
        <>
            <Layout>
                <div className="container register-page py-5">
                    <div className="row justify-content-center">
                        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
                            <div className="registration-form p-4 rounded-3 shadow-sm bg-white">
                                <h1 className="text-center mb-4">Registration Form</h1>
                                <form onSubmit={dataSendToApi}>
                                    <div className="mb-3">
                                        <input type="text" className="form-control" name="name" value={formData.name} placeholder="Enter Your Name" onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <input type="email" className="form-control" name="email" value={formData.email} placeholder="Enter Your Email" onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <input type="password" className="form-control" name="password" value={formData.password} placeholder="Enter Your Password" onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <input type="number" className="form-control" name="phone" value={formData.phone} placeholder="Enter Your Phone Number" onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <input type="text" className="form-control" name="address" value={formData.address} placeholder="Enter Your Address" onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <input type="text" className="form-control" name="question" value={formData.question} placeholder="Your Date of Birth" onChange={handleChange} />
                                    </div>
                                    <div className="d-grid">
                                        <button type="submit" className="btn btn-info">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
            <ToastContainer />
        </>
    );
};

export default Register;
