import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../Context/Context';
import { ToastContainer, toast } from 'react-toastify';
import '../CSS/ProductDetails.css';

const ProductDetails = () => {
    const [auth] = useAuth();
    const params = useParams();
    const [product, setProduct] = useState({});
    const [relatedProduct, setRelatedProduct] = useState([]);

    const getProduct = async () => {
        try {
            const response = await axios.get(`https://e-commerce-two-lemon.vercel.app/api/product/get-product/${params.slug}`);
            setProduct(response.data.product);
            getSimilerProduct(response.data.product._id, response.data.product.category._id);
        } catch (error) {
            console.log(error);
        }
    };

    const getSimilerProduct = async (pid, cid) => {
        try {
            const response = await axios.get(`https://e-commerce-two-lemon.vercel.app/api/product/similer-product/${pid}/${cid}`);
            setRelatedProduct(response.data.product);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getProduct();
    }, [params.slug]);

    const handleAddToCart = async (id) => {
        try {
            const response = await axios.post(`https://e-commerce-two-lemon.vercel.app/api/cart/addtocart/${auth.user._id}`, { product: id });
            response ? toast.success('Item Added to cart') : toast.error('Something went wrong');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout>
            <div className='container product-details-container mt-4'>
                <div className='row'>
                    <div className='col-md-6 text-center mb-4'>
                        {product._id ? (
                            <img
                                className="img-fluid rounded shadow product-main-img"
                                src={`https://e-commerce-two-lemon.vercel.app/api/product/product-photo/${product._id}`}
                                alt={product.name}
                            />
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                    <div className='col-md-6'>
                        <div className='product-info'>
                            <h2 className='text-center mb-4'>Product Details</h2>
                            <h4>Name: {product.name}</h4>
                            <h6>Details: {product.description}</h6>
                            <h6>Price: ${product.price}</h6>
                            {product.category && (
                                <h6>Category: {product.category.name}</h6>
                            )}
                            <button className="btn btn-warning mt-3" onClick={() => handleAddToCart(product._id)}>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>

                <div className='similar-products mt-5'>
                    <h3 className="mb-4">Similar Products</h3>
                    <div className="row">
                        {relatedProduct.length > 0 ? (
                            relatedProduct.map((p, index) => (
                                <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={index}>
                                    <div className="card h-100 shadow-sm product-card">
                                        <img
                                            className="card-img-top"
                                            src={`https://e-commerce-two-lemon.vercel.app/api/product/product-photo/${p._id}`}
                                            alt={p.name}
                                        />
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title">{p.name}</h5>
                                            <p className="card-text small">{p.description}</p>
                                            <p className="card-text fw-bold">Price - ${p.price}</p>
                                            <button className="btn btn-secondary btn-sm mt-auto">Add to Cart</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No similar products found.</p>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </Layout>
    );
};

export default ProductDetails;
