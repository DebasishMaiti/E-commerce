import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ForgotPassword = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        newPassword: '',
        question: ''
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
            const response = await axios.post("https://e-commerce-9m1c.vercel.app/api/auth/forgot-password", formData);
            if (response.data) {
                toast.success(response.data.message);
                setTimeout(() => {
                    navigate('/login')
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
                        <h1>Reset Password</h1>
                        <form className='mt-3' onSubmit={dataSendToApi}>
                            <div className="mb-3">
                                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name='email' value={formData.email} placeholder='Enter Your Email' onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <input type="" className="form-control" id="exampleInput" aria-describedby="emailHelp" name='question' value={formData.question} placeholder='Enter Your DOB' onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <input type="password" className="form-control" id="exampleInputPassword1" name='newPassword' value={formData.newPassword} placeholder='Enter Your New Password' onChange={handleChange} />
                            </div>
                            <button type="submit" className="btn btn-primary" >Reset</button>

                        </form>
                    </div>
                </div>
            </Layout>
            <ToastContainer />
        </>

    )
}

export default ForgotPassword
