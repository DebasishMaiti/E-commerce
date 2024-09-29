import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/Context';
import { Select } from 'antd';
const { Option } = Select;

const CreateProduct = () => {
    const navigate = useNavigate();
    const [auth] = useAuth();
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [parentCategory, setParentCategory] = useState('');
    const [file, setFile] = useState(null);
    const types = ["image/jpg", "image/png", "image/jpeg"];
    const [formData, setFormData] = useState({
        name: "",
        description: '',
        price: '',
        category: undefined,
        subcategory: undefined,
        quantity: '',
        shipping: undefined,
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
        console.log(selected);

        if (selected && types.includes(selected.type)) {
            setFile(selected);
        } else {
            setFile(null);
            toast.error("Please select an image file (png or jpeg)");
        }
    };

    const getAllCategory = async () => {
        try {
            const response = await axios.get("https://e-commerce-9m1c.vercel.app/api/category/get-category");
            if (response) {
                setCategories(response.data.category);
            }
        } catch (error) {
            console.log(error);
            toast.error("Can't Get Category");
        }
    };

    useEffect(() => {
        getAllCategory();
    }, []);

    const GetSubCategory = async () => {
        if (!parentCategory) return;
        try {
            const { data } = await axios.get(`https://e-commerce-9m1c.vercel.app/api/subcategory/get-subcategory/${parentCategory}`);
            if (data) {
                setSubcategories(data.subcategories);
            }
        } catch (error) {
            console.log(error);
            toast.error('Something Went Wrong');
        }
    };

    useEffect(() => {
        GetSubCategory();
    }, [parentCategory]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const newFormData = new FormData();
            newFormData.append("name", formData.name);
            newFormData.append("description", formData.description);
            newFormData.append("price", formData.price);
            newFormData.append("category", formData.category);
            newFormData.append("subcategory", formData.subcategory);
            newFormData.append("quantity", formData.quantity);
            newFormData.append("shipping", formData.shipping);
            newFormData.append('photo', file);

            const response = await axios.post('https://e-commerce-9m1c.vercel.app/api/product/create-product', newFormData, {
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
            console.log(error);
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
                        <h1 className='text-center'>Create Product</h1>
                        <form className='m-1 w-75' onSubmit={handleCreate}>
                            <label>Select a category</label>
                            <Select
                                bordered={false}
                                placeholder='Select a category'
                                size='large'
                                showSearch
                                className='form-select mb-3'
                                value={formData.category}
                                onChange={(value) => {
                                    setParentCategory(value);
                                    setFormData({ ...formData, category: value });
                                }}
                            >
                                {categories.map((category, index) => (
                                    <Option key={index} value={category._id}>{category.name}</Option>
                                ))}
                            </Select>

                            <Select
                                bordered={false}
                                placeholder='Select a subcategory'
                                size='large'
                                showSearch
                                className='form-select mb-3'
                                value={formData.subcategory}
                                onChange={(value) => setFormData({ ...formData, subcategory: value })}
                                disabled={!subcategories.length}
                            >
                                {subcategories.map((subcategory, index) => (
                                    <Option key={index} value={subcategory._id}>{subcategory.name}</Option>
                                ))}
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
                                {file && (
                                    <div className='text-center'>
                                        <img src={URL.createObjectURL(file)} height={'200px'} className='img img-responsive' alt='Selected file preview' />
                                    </div>
                                )}
                            </div>

                            <div className='mb-3'>
                                <input
                                    placeholder='Name of the product'
                                    type='text'
                                    name='name'
                                    value={formData.name}
                                    className='form-control'
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
                                <textarea
                                    placeholder='Description of the product'
                                    type="text"
                                    className="form-control"
                                    name='description'
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
                                <input
                                    placeholder='Price of the Product'
                                    type="number"
                                    name='price'
                                    value={formData.price}
                                    className="form-control"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
                                <input
                                    placeholder='Quantity of the Product'
                                    type="number"
                                    name='quantity'
                                    value={formData.quantity}
                                    className="form-control"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
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
                                <button type='submit' className='btn btn-primary'>Create Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </Layout>
    );
};

export default CreateProduct;
