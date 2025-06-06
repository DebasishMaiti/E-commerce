import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import CategoryForm from '../../components/Form/CategoryForm';
import { useAuth } from '../../Context/Context';
import { Modal, Select } from 'antd';
import '../../CSS/CreateCategory.css'
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

    const [subcategoryVisible, setSubcategoryVisible] = useState(false);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [updatedSubcategoryName, setUpdatedSubcategoryName] = useState("");

    const getAllCategory = async () => {
        try {
            const response = await axios.get("https://e-commerce-9m1c.vercel.app/api/category/get-category");
            if (response) setCategories(response.data.category);
        } catch (error) {
            console.log(error);
            toast.error("Can't Get Category");
        }
    };

    useEffect(() => {
        getAllCategory();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://e-commerce-9m1c.vercel.app/api/category/create-category', { name }, {
                headers: { 'Authorization': auth.token }
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

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`https://e-commerce-9m1c.vercel.app/api/category/update-category/${selected._id}`, { name: updatedName }, {
                headers: { 'Authorization': auth.token }
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

    const DeleteCategory = async (id) => {
        try {
            const response = await axios.delete(`https://e-commerce-9m1c.vercel.app/api/category/delete-category/${id}`, {
                headers: { 'Authorization': auth.token }
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

    const handleSubcategorySubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`https://e-commerce-9m1c.vercel.app/api/subcategory/create-subcategory/${categoryId}`, { name: subcategoryName });
            toast.success(data.message);
            setSubcategoryName('');
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        }
    };

    const GetSubCategory = async () => {
        try {
            const response = await axios.get(`https://e-commerce-9m1c.vercel.app/api/subcategory/get-subcategory/${parentCategory}`);
            setSubcategories(response.data.subcategories);
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong with getting subcategories');
        }
    };

    useEffect(() => {
        if (parentCategory) GetSubCategory();
    }, [parentCategory]);

    const handleSubcategoryEdit = (subcategory) => {
        setSelectedSubcategory(subcategory);
        setUpdatedSubcategoryName(subcategory.name);
        setSubcategoryVisible(true);
    };

    const handleSubcategoryUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`https://e-commerce-9m1c.vercel.app/api/subcategory/update-subcategory/${selectedSubcategory._id}`, {
                name: updatedSubcategoryName,
            }, {
                headers: { 'Authorization': auth.token }
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

    const DeleteSubCategory = async (id) => {
        try {
            const response = await axios.delete(`https://e-commerce-9m1c.vercel.app/api/subcategory/delete-subcategory/${id}`);
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
            <div className='container-fluid m-3 create-category-container'>
                <div className='row create-category-row'>
                    <div className='col-md-2 create-category-menu' style={{ backgroundColor: '#343a40' }}>
                        <AdminMenu />
                    </div>
                    <div className='col-md-10 create-category-content'>
                        <h1 className="create-category-title" style={{ marginBottom: '20px' }}>Manage Category</h1>
                        <div className='p-3 w-50 create-category-form-wrapper' style={{ marginBottom: '20px' }}>
                            <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName} />
                        </div>

                        <div className='w-75 create-category-table-wrapper'>
                            <table className="table table-hover create-category-table" style={{ marginBottom: '30px' }}>
                                <thead className="thead-light create-category-thead">
                                    <tr>
                                        <th scope="col" className="create-category-th">Name</th>
                                        <th scope="col" className="create-category-th">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="create-category-tbody">
                                    {categories.map((category, index) => (
                                        <tr key={index} className="create-category-tr">
                                            <td className="create-category-td">{category.name}</td>
                                            <td className="create-category-td">
                                                <button
                                                    className="btn btn-info create-category-edit-btn"
                                                    style={{ marginRight: '10px' }}
                                                    onClick={() => { setVisible(true); setUpdatedName(category.name); setSelected(category) }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className='btn btn-outline-danger create-category-delete-btn'
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

                        <Modal onCancel={() => setVisible(false)} footer={null} visible={visible} className="create-category-modal">
                            <CategoryForm value={updatedName} setValue={setUpdatedName} handleSubmit={handleUpdate} />
                        </Modal>

                        <h2 className="create-subcategory-title" style={{ marginBottom: '20px' }}>Manage SubCategory</h2>
                        <label className="create-subcategory-label" style={{ marginBottom: '10px' }}>Select Category</label>
                        <Select
                            bordered={false}
                            placeholder='Select a category'
                            size='large'
                            showSearch
                            className='form-select mb-3 create-subcategory-select'
                            onChange={(value) => setCategoryId(value)}
                            style={{ marginBottom: '20px', width: '50%' }}
                        >
                            {categories.map((category, index) => (
                                <Option key={index} value={category._id}>{category.name}</Option>
                            ))}
                        </Select>
                        <form onSubmit={handleSubcategorySubmit} className="create-subcategory-form">
                            <div className="mb-3 create-subcategory-input-group" style={{ display: 'flex', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    className="form-control mb-3 create-subcategory-input"
                                    placeholder='Enter new SubCategory'
                                    value={subcategoryName}
                                    onChange={(e) => setSubcategoryName(e.target.value)}
                                    style={{ marginRight: '10px', width: '35rem' }}
                                />
                                <button type="submit" className="btn btn-primary create-subcategory-submit-btn">Submit</button>
                            </div>
                            <hr />
                        </form>

                        <h5 className="create-subcategory-seeall-title" style={{ marginBottom: '10px' }}>
                            See all subcategories according to Parent Category
                        </h5>
                        <div className='text-center create-subcategory-seeall-wrapper'>
                            <label className="create-subcategory-select-label" style={{ marginBottom: '10px' }}>Select Category</label>
                            <Select
                                bordered={false}
                                placeholder='Select a category'
                                size='large'
                                showSearch
                                className='form-select mb-3 create-subcategory-parent-select'
                                onChange={(value) => setParentCategory(value)}
                                style={{ marginBottom: '20px', width: '50%' }}
                            >
                                {categories.map((category, index) => (
                                    <Option key={index} value={category._id}>{category.name}</Option>
                                ))}
                            </Select>
                            <button className='btn btn-primary create-subcategory-get-btn' onClick={GetSubCategory}>Get SubCategory</button>
                            <table className="table table-hover create-subcategory-table" style={{ marginTop: '20px' }}>
                                <thead className="thead-light create-subcategory-thead">
                                    <tr>
                                        <th scope="col" className="create-subcategory-th">Name</th>
                                        <th scope="col" className="create-subcategory-th">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="create-subcategory-tbody">
                                    {subcategories.map((s, index) => (
                                        <tr key={index} className="create-subcategory-tr">
                                            <td className="create-subcategory-td">{s.name}</td>
                                            <td className="create-subcategory-td">
                                                <button
                                                    className='btn btn-outline-info m-2 create-subcategory-edit-btn'
                                                    style={{ marginRight: '10px' }}
                                                    onClick={() => handleSubcategoryEdit(s)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className='btn btn-outline-danger create-subcategory-delete-btn'
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
                            className="create-subcategory-modal"
                        >
                            <form onSubmit={handleSubcategoryUpdate} className="create-subcategory-edit-form">
                                <input
                                    type="text"
                                    className="form-control create-subcategory-edit-input"
                                    value={updatedSubcategoryName}
                                    onChange={(e) => setUpdatedSubcategoryName(e.target.value)}
                                />
                                <button className='btn btn-primary mt-3 create-subcategory-edit-submit-btn' type="submit">Update</button>
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
