import React, { useEffect, useState } from 'react'
import AdminMenu from '../../components/Layout/AdminMenu'
import Layout from '../../components/Layout/Layout'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Pagination } from 'react-bootstrap';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [active, setActive] = useState(1)
    const [totalRecords, setTotalRecords] = useState(0)
    const [value, setValue] = useState('')

    const getAllProducts = async () => {
        try {
            const response = await axios.get(`https://e-commerce-9m1c.vercel.app/api/product/get-product/?page=${page}&q=${value}`);
            setProducts(response.data.product);
            setTotalRecords(response.data.totalRecord);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong")
        }
    }
    useEffect(() => {
        getAllProducts();
    }, [page, value]);

    let items = [];
    let perPage = 8;
    for (let number = 1; number <= Math.ceil(totalRecords / perPage); number++) {
        items.push(
            <Pagination.Item key={number} active={number === active} onClick={() => paginate(number)}>
                {number}
            </Pagination.Item>,
        );
    }
    const paginate = (pageNumber) => {

        setActive(pageNumber);
        setPage(pageNumber);
        getAllProducts()
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        setPage(1);
        getAllProducts();
    };

    const handleReset = () => {
        setValue('');
        setPage(1);
        getAllProducts();
    };

    return (
        <Layout>
            <div className='row'>
                <div className='col-md-2'>
                    <AdminMenu />
                </div>
                <div className='col-md-10'>
                    <form onSubmit={handleSearch}>
                        <input
                            style={{ width: '25rem' }}
                            className='form-control m-2'
                            type="text"
                            placeholder="Search product by name"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        />
                        <button className='btn btn-primary m-2' type='submit'>Search</button>
                        <button className='btn btn-info' onClick={() => handleReset()}>Reset</button>
                    </form>
                    <div className='d-flex flex-wrap'>
                        {products.map((p, index) => (
                            <Link to={`https://e-commerce-9m1c.vercel.app/dashboard/admin/products/${p.slug}`} className='product-link'>
                                <div className="card m-2" style={{ width: '15rem' }} key={index}>
                                    <img className="card-img-top" src={`https://e-commerce-9m1c.vercel.app/api/product/product-photo/${p._id}`} alt={p.name} />
                                    <div className="card-body">
                                        <h5 className="card-title">{p.name}</h5>
                                        <p className="card-text">{p.description}</p>

                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <Pagination>{items}</Pagination>
                </div>
            </div>
            <ToastContainer />
        </Layout >
    )
}

export default Products
