import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useAuth } from '../../Context/Context'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Profile = () => {
    const [auth, setAuth] = useAuth()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
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
            const response = await axios.put("https://e-commerce-9m1c.vercel.app/api/auth/profile", formData, {
                headers: {
                    'Authorization': auth.token
                }
            })
            toast.success(response.data.message)
            setAuth(response.data.updatedUser);
            let ls = localStorage.getItem('auth');
            ls = JSON.parse(ls);
            ls.user = response.data.updatedUser
            localStorage.setItem('auth', JSON.stringify(ls));

        } catch (error) {
            console.log(error);
            toast.error('Something Went Wrong')
        }
    }

    useEffect(() => {
        const formData = auth.user;
        setFormData({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            address: formData.address
        })
    }, [])

    return (
        <Layout>
            <div className='container-fluid p-3 m-3'>
                <div className='row'>
                    <div className='col-md-3'>
                        <UserMenu />
                    </div>
                    <div className='col-md-9'>
                        <div className="register justify-content-center text-center">

                            <div className="register  mt-5 rounded-3 registration-Form">
                                <h1>Update Profile</h1>
                                <form className='mt-3' onSubmit={dataSendToApi} style={{ width: "50%" }}>
                                    <div className="mb-3">
                                        <input type="text" className="form-control" id="exampleInputName" aria-describedby="emailHelp" name='name' value={formData.name} placeholder='Enter Your Name' onChange={(e) => handleChange(e)} />
                                    </div>
                                    <div className="mb-3">
                                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name='email' value={formData.email} placeholder='Enter Your Email' onChange={(e) => handleChange(e)} />
                                    </div>
                                    <div className="mb-3">
                                        <input type="password" className="form-control" id="exampleInputPassword1" name='password' value={formData.password} placeholder='Enter Your Password' onChange={(e) => handleChange(e)} disabled />
                                    </div>
                                    <div className="mb-3">
                                        <input type="number" className="form-control" id="exampleInputPhone" aria-describedby="emailHelp" name='phone' value={formData.phone} placeholder='Enter Your Phone Number' onChange={(e) => handleChange(e)} />
                                    </div>
                                    <div className="mb-3">
                                        <input type="text" className="form-control" id="exampleInputAddress" aria-describedby="emailHelp" name='address' value={formData.address} placeholder='Enter Your Address' onChange={(e) => handleChange(e)} />
                                    </div>
                                    <button type="submit" className="btn btn-info">Update</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </Layout>
    )
}

export default Profile
