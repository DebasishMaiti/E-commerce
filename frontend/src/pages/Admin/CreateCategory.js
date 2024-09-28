import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import CategoryForm from '../../components/Form/CategoryForm';
import { useAuth } from '../../Context/Context';
import { Modal, Select } from 'antd';

const { Option } = Select;

const CreateCategory = () => {
    const [auth] = useAuth();
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(null);
    const [updatedName, setUpdatedName] = useState("");
    const [subcategoryName, setSubcategoryName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [subcategories, setSubcategories] = useState([]);
    const [parentCategory, setParentCategory] = useState('');

    // Subcategory modal state
    const [subcategoryVisible, setSubcategoryVisible] = useState(false);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [updatedSubcategoryName, setUpdatedSubcategoryName] = useState("");

    // Fetch all categories
    const getAllCategory = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/category/get-category");
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

    // Create category
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/category/create-category', { name }, {
                headers: {
                    'Authorization': auth.token
                }
            });
            if (response) {
                getAllCategory();
                toast.success(response.data.message);
                setName('');
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong in input form");
        }
    };

    // Update category
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`http://localhost:8000/api/category/update-category/${selected._id}`, { name: updatedName }, {
                headers: {
                    'Authorization': auth.token
                }
            });
            toast.success(data.message);
            setSelected(null);
            setUpdatedName("");
            setVisible(false);
            getAllCategory();
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        }
    };

    // Delete category
    const DeleteCategory = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8000/api/category/delete-category/${id}`, {
                headers: {
                    'Authorization': auth.token
                }
            });
            if (response) {
                toast.success(response.data.message);
                getAllCategory();
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    // Create subcategory
    const handleSubcategorySubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`http://localhost:8000/api/subcategory/create-subcategory/${categoryId}`, { name: subcategoryName });
            toast.success(data.message);
            setSubcategoryName('');
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        }
    };

    // Fetch subcategories
    const GetSubCategory = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/subcategory/get-subcategory/${parentCategory}`);
            setSubcategories(response.data.subcategories);
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong with getting subcategories');
        }
    };

    useEffect(() => {
        if (parentCategory) {
            GetSubCategory();
        }
    }, [parentCategory]);

    // Open subcategory edit modal
    const handleSubcategoryEdit = (subcategory) => {
        setSelectedSubcategory(subcategory);
        setUpdatedSubcategoryName(subcategory.name);
        setSubcategoryVisible(true);
    };

    // Update subcategory
    const handleSubcategoryUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`http://localhost:8000/api/subcategory/update-subcategory/${selectedSubcategory._id}`, {
                name: updatedSubcategoryName,
            }, {
                headers: {
                    'Authorization': auth.token
                }
            });
            toast.success(data.message);
            setSubcategoryVisible(false);
            setSelectedSubcategory(null);
            GetSubCategory();
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        }
    };

    // Delete subcategory
    const DeleteSubCategory = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8000/api/subcategory/delete-subcategory/${id}`);
            toast.success('Subcategory Deleted');
            GetSubCategory();
            console.log(response);

        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        }
    };

    return (
        <Layout>
            <div className='container-fluid m-3'>
                <div className='row'>
                    <div className='col-md-2'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-10'>
                        <h1 style={{ marginBottom: '20px' }}>Manage Category</h1>
                        <div className='p-3 w-50' style={{ marginBottom: '20px' }}>
                            <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName} />
                        </div>
                        <div className='w-75'>
                            <table className="table table-hover" style={{ marginBottom: '30px' }}>
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((category, index) => (
                                        <tr key={index}>
                                            <td>{category.name}</td>
                                            <td>
                                                <button
                                                    className="btn btn-info"
                                                    style={{ marginRight: '10px' }}
                                                    onClick={() => { setVisible(true); setUpdatedName(category.name); setSelected(category) }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className='btn btn-outline-danger'
                                                    onClick={() => DeleteCategory(category._id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Modal onCancel={() => setVisible(false)} footer={null} visible={visible}>
                            <CategoryForm value={updatedName} setValue={setUpdatedName} handleSubmit={handleUpdate} />
                        </Modal>

                        <h2 style={{ marginBottom: '20px' }}>Manage SubCategory</h2>
                        <label style={{ marginBottom: '10px' }}>Select Category</label>
                        <Select
                            bordered={false}
                            placeholder='Select a category'
                            size='large'
                            showSearch
                            className='form-select mb-3'
                            onChange={(value) => setCategoryId(value)}
                            style={{ marginBottom: '20px', width: '50%' }}
                        >
                            {categories.map((category, index) => (
                                <Option key={index} value={category._id}>{category.name}</Option>
                            ))}
                        </Select>
                        <form onSubmit={handleSubcategorySubmit}>
                            <div className="mb-3" style={{ display: 'flex', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder='Enter new SubCategory'
                                    value={subcategoryName}
                                    onChange={(e) => setSubcategoryName(e.target.value)}
                                    style={{ marginRight: '10px', width: '35rem' }}
                                />
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                            <hr />
                        </form>

                        <h5 style={{ marginBottom: '10px' }}>See all subcategories according to Parent Category</h5>
                        <div className='text-center'>
                            <label style={{ marginBottom: '10px' }}>Select Category</label>
                            <Select
                                bordered={false}
                                placeholder='Select a category'
                                size='large'
                                showSearch
                                className='form-select mb-3'
                                onChange={(value) => setParentCategory(value)}
                                style={{ marginBottom: '20px', width: '50%' }}
                            >
                                {categories.map((category, index) => (
                                    <Option key={index} value={category._id}>{category.name}</Option>
                                ))}
                            </Select>
                            <button className='btn btn-primary' onClick={GetSubCategory}>Get SubCategory</button>
                            <table className="table table-hover" style={{ marginTop: '20px' }}>
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subcategories.map((s, index) => (
                                        <tr key={index}>
                                            <td>{s.name}</td>
                                            <td>
                                                <button
                                                    className='btn btn-outline-info m-2'
                                                    style={{ marginRight: '10px' }}
                                                    onClick={() => handleSubcategoryEdit(s)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className='btn btn-outline-danger'
                                                    onClick={() => DeleteSubCategory(s._id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Modal
                            title="Edit Subcategory"
                            visible={subcategoryVisible}
                            onCancel={() => setSubcategoryVisible(false)}
                            footer={null}
                        >
                            <form onSubmit={handleSubcategoryUpdate}>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter new Subcategory name"
                                        value={updatedSubcategoryName}
                                        onChange={(e) => setUpdatedSubcategoryName(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">Update</button>
                            </form>
                        </Modal>

                    </div>
                </div>
            </div>
            <ToastContainer />
        </Layout>
    );
};

export default CreateCategory;
