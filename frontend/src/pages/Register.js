import React, { useState } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const navigate = useNavigate()
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
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const dataSendToApi = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post("http://localhost:8000/api/auth/register", formData)
            toast.success(response.data.message)
            setTimeout(() => {
                navigate('/login');
            }, 1800);
        } catch (error) {
            console.log(error);
            toast.error('Something Went Wrong')
        }

    }
    return (
        <>
            <Layout>
                <div className="register justify-content-center text-center">

                    <div className="register  mt-5 rounded-3 registration-Form">
                        <h1>Registration Form</h1>
                        <form className='mt-3' onSubmit={dataSendToApi} style={{ width: "50%" }}>
                            <div className="mb-3">
                                <input type="text" className="form-control" id="exampleInputName" aria-describedby="emailHelp" name='name' value={formData.name} placeholder='Enter Your Name' onChange={(e) => handleChange(e)} />
                            </div>
                            <div className="mb-3">
                                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name='email' value={formData.email} placeholder='Enter Your Email' onChange={(e) => handleChange(e)} />
                            </div>
                            <div className="mb-3">
                                <input type="password" className="form-control" id="exampleInputPassword1" name='password' value={formData.password} placeholder='Enter Your Password' onChange={(e) => handleChange(e)} />
                            </div>
                            <div className="mb-3">
                                <input type="number" className="form-control" id="exampleInputPhone" aria-describedby="emailHelp" name='phone' value={formData.phone} placeholder='Enter Your Phone Number' onChange={(e) => handleChange(e)} />
                            </div>
                            <div className="mb-3">
                                <input type="text" className="form-control" id="exampleInputAddress" aria-describedby="emailHelp" name='address' value={formData.address} placeholder='Enter Your Address' onChange={(e) => handleChange(e)} />
                            </div>
                            <div className="mb-3">
                                <input type="text" className="form-control" id="exampleInputAddress" aria-describedby="emailHelp" name='question' value={formData.question} placeholder='Your Date of Birth' onChange={(e) => handleChange(e)} />
                            </div>
                            <button type="submit" className="btn btn-info">Submit</button>
                        </form>
                    </div>
                </div>
            </Layout>
            <ToastContainer />
        </>
    )
}

export default Register
