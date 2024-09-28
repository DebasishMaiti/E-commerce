import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
    const params = useParams();
    const [product, setProduct] = useState({});
    const [relatedProduct, setRelatedProduct] = useState([]);

    const getProduct = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/product/get-product/${params.slug}`);
            setProduct(response.data.product);
            getSimilerProduct(response.data.product._id, response.data.product.category._id);
        } catch (error) {
            console.log(error);
        }
    };

    const getSimilerProduct = async (pid, cid) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/product/similer-product/${pid}/${cid}`);
            setRelatedProduct(response.data.product);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getProduct();
    }, [params.slug]); // Updated dependency array

    return (
        <Layout>
            <div className='row mx-2'>
                <div className='col-6 mt-2'>
                    {product._id ? (
                        <img
                            className="card-img-top"
                            height='450'
                            src={`http://localhost:8000/api/product/product-photo/${product._id}`}
                            alt={product.name}
                        />
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
                <div className='col-6'>
                    <h2 className=' text-center'>Product Details</h2>
                    <h4>Name: {product.name}</h4>
                    <h6>Details: {product.description}</h6>
                    <h6>Price: ${product.price}</h6>
                    {product.category && (
                        <h6>Category: {product.category.name}</h6>
                    )}
                    <button className="btn btn-warning">Add to Cart</button>
                </div>
            </div>
            <div className='row container mt-3'>
                <h3>Similar Products</h3>
                <div className="d-flex flex-wrap justify-content-start mt-4">
                    {relatedProduct.length > 0 ? (
                        relatedProduct.map((p, index) => (
                            <div className="card m-2 mx-3" style={{ width: '15rem', borderRadius: '1rem' }} key={index}>
                                <img
                                    className="card-img-top"
                                    src={`http://localhost:8000/api/product/product-photo/${p._id}`}
                                    alt={p.name}
                                    style={{ borderRadius: '1rem' }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{p.name}</h5>
                                    <p className="card-text">{p.description}</p>
                                    <p className="card-text">Price - ${p.price}</p>
                                    <button className="btn btn-secondary btn-sm">Add to Cart</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No similar products found.</p>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ProductDetails;
