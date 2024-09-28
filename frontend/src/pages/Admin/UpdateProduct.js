import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../Context/Context';
import { Select } from 'antd';

const { Option } = Select;

const UpdateProduct = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [auth] = useAuth();
    const [categories, setCategories] = useState([]);
    const [file, setFile] = useState(null);
    const [id, setId] = useState('');

    const types = ["image/png", "image/jpeg", "image/jpg"];
    const [formData, setFormData] = useState({
        name: "",
        description: '',
        price: '',
        category: '',
        quantity: '',
        shipping: '',
        photo: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        let selected = e.target.files[0];

        if (selected && types.includes(selected.type)) {
            setFile(selected);
        } else {
            setFile(null);
            toast.error("Please select an image file (png or jpeg)");
        }
    };

    const getSingleProduct = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/product/get-product/${params.slug}`);
            const data = response.data.product;
            setId(data._id);
            setFormData({
                name: data.name,
                description: data.description,
                price: data.price,
                quantity: data.quantity, // Corrected quantity
                category: data.category._id,
                shipping: data.shipping ? '1' : '0',
            });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getSingleProduct();
    }, []);

    const getAllCategories = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/category/get-category");
            if (response) {
                setCategories(response.data.category);
            }
        } catch (error) {
            console.error(error);
            toast.error("Can't Get Category");
        }
    };

    useEffect(() => {
        getAllCategories();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const newFormData = new FormData();
            newFormData.append("name", formData.name);
            newFormData.append("description", formData.description);
            newFormData.append("price", formData.price);
            newFormData.append("category", formData.category);
            newFormData.append("quantity", formData.quantity);
            newFormData.append("shipping", formData.shipping);
            if (file) newFormData.append("photo", file);

            const response = await axios.put(`http://localhost:8000/api/product/update-product/${id}`, newFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': auth.token
                }
            });
            toast.success(response.data.message);
            setTimeout(() => {
                navigate('/dashboard/admin/products');
            }, 2000);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:8000/api/product/delete-product/${id}`);
            toast.success(response.data.message);
            navigate('/dashboard/admin/products');
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    return (
        <Layout>
            <div className='container-fluid m-3 p-3'>
                <div className='row'>
                    <div className='col-md-2'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-10'>
                        <h1>Update Product</h1>
                        <form className='m-1 w-75' onSubmit={handleUpdate}>
                            <label>Select Category</label>
                            <Select
                                bordered={false}
                                placeholder='Select a category'
                                size='large'
                                showSearch
                                className='form-select mb-3'
                                value={formData.category}
                                onChange={(value) => setFormData({ ...formData, category: value })}>
                                {
                                    categories.map((category, index) => (
                                        <Option key={index} value={category._id}>{category.name}</Option>
                                    ))
                                }
                            </Select>
                            <div className='mb-3 btn btn-secondary w-100 '>
                                <input
                                    type='file'
                                    placeholder='Choose File'
                                    name='photo'
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className='mb-3'>
                                {file ? (
                                    <div className='text-center'>
                                        <img src={URL.createObjectURL(file)} height={'200px'} className='img img-responsive' alt="product preview"></img>
                                    </div>
                                ) : (
                                    <div className='text-center'>
                                        <img src={`http://localhost:8000/api/product/product-photo/${id}`} height={'200px'} className='img img-responsive' alt="product"></img>
                                    </div>
                                )}
                            </div>
                            <div className='mb-3'>
                                <label>Name of the product</label>
                                <input
                                    type='text'
                                    name='name'
                                    value={formData.name}
                                    className='form-control'
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Description of the product</label>
                                <textarea
                                    type="text"
                                    className="form-control"
                                    name='description'
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Price of the Product</label>
                                <input
                                    type="number"
                                    name='price'
                                    value={formData.price}
                                    className="form-control"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Quantity of the Product</label>
                                <input
                                    type="number"
                                    name='quantity'
                                    value={formData.quantity}
                                    className="form-control"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Select Shipping</label>
                                <Select
                                    bordered={false}
                                    placeholder="Select Shipping"
                                    size="large"
                                    showSearch
                                    className="form-select mb-3"
                                    value={formData.shipping}
                                    onChange={(value) => setFormData({ ...formData, shipping: value })}
                                >
                                    <Option value="0">No</Option>
                                    <Option value="1">Yes</Option>
                                </Select>
                            </div>
                            <div className='mb-3'>
                                <button type='submit' className='btn btn-primary'>Update Product</button>
                            </div>
                            <div className='mb-3'>
                                <button type='button' className='btn btn-danger' onClick={handleDelete}>Delete Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </Layout>
    );
};

export default UpdateProduct;
