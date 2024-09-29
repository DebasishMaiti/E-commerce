import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { Radio } from 'antd';
import { Pagination, Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/Cart';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [parentCategory, setParentCategory] = useState('');
    const [checked, setChecked] = useState([]);
    const [checkedSubcategories, setCheckedSubcategories] = useState([]);
    const [radio, setRadio] = useState([]);
    const [page, setPage] = useState(1);
    const [active, setActive] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [value, setValue] = useState('');
    const [priceRanges, setPriceRanges] = useState([]);
    const [bestSellingProducts, setBestSellingProducts] = useState([]);

    const getBestSellingProduct = async () => {
        try {
            const response = await axios.get(`https://e-commerce-9m1c.vercel.app/api/product/best-selling-product`);
            setBestSellingProducts(response.data);
            console.log(response.data)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getBestSellingProduct()
    }, [])
    const getAllCategory = async () => {
        try {
            const response = await axios.get("https://e-commerce-9m1c.vercel.app/api/category/get-category/");
            if (response) {
                setCategories(response.data.category);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getAllProduct = async () => {
        try {
            const response = await axios.get(`https://e-commerce-9m1c.vercel.app/api/product/get-product/?page=${page}&q=${value}`);
            setProducts(response.data.product);
            setTotalRecords(response.data.totalRecord);
        } catch (error) {
            console.log(error);
        }
    };

    const getFilteredProduct = async () => {
        try {
            const response = await axios.post(`https://e-commerce-9m1c.vercel.app/api/product/filter-product/?page=${page}`, { checked, radio, subcategory: checkedSubcategories });
            setProducts(response.data.product);
            setTotalRecords(response.data.totalRecord);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchPriceRanges = async () => {
        try {
            const response = await axios.get('https://e-commerce-9m1c.vercel.app/api/product/get-price-ranges');
            setPriceRanges(response.data.priceRanges);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllCategory();
        fetchPriceRanges();
    }, []);



    useEffect(() => {
        if (checked.length || radio.length) {
            getFilteredProduct();
        } else {
            getAllProduct();
        }
    }, [page, value, checked, radio, checkedSubcategories]);

    const handleFilter = (value, id) => {
        let all = [...checked];
        if (value) {
            all.push(id);
        } else {
            all = all.filter((c) => c !== id);
        }
        setChecked(all);
    };

    const paginate = (pageNumber) => {
        setActive(pageNumber);
        setPage(pageNumber);
        if (checked.length || radio.length || checkedSubcategories.length) {
            getFilteredProduct();
        } else {
            getAllProduct();
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setPage(1);
        getAllProduct();
    };

    const handleReset = () => {
        setValue('');
        setPage(1);
        getAllProduct();
    };

    const GetSubCategory = async () => {
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
        if (parentCategory) {
            GetSubCategory();
        }
    }, [parentCategory]);

    const handleSubcategoryFilter = (value, id) => {
        let allSubcategories = [...checkedSubcategories];
        if (value) {
            allSubcategories.push(id);
        } else {
            allSubcategories = allSubcategories.filter((sub) => sub !== id);
        }
        setCheckedSubcategories(allSubcategories);
    };

    const handlePriceFilter = (value) => {
        setRadio(value);
    };

    let items = [];
    let perPage = 8;
    for (let number = 1; number <= Math.ceil(totalRecords / perPage); number++) {
        items.push(
            <Pagination.Item key={number} active={number === active} onClick={() => paginate(number)}>
                {number}
            </Pagination.Item>,
        );
    }

    return (
        <>
            <Layout>
                <div className="row">
                    <div className="col-md-2 position-fixed" style={{ backgroundColor: '#f8f9fa', padding: '10px', height: '100vh' }}>
                        <form onSubmit={handleSearch} style={{ marginBottom: '10px' }}>
                            <input
                                style={{ width: '100%', marginBottom: '5px' }}
                                className='form-control'
                                type="text"
                                placeholder="Search product by name"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                            />

                            <button className='btn btn-info' onClick={() => handleReset()} style={{ width: '100%' }}>Reset</button>
                        </form>
                        <h5 className='text-center'>Filter By Category</h5>
                        <div className="accordion" id="accordionExample">
                            {categories.map((category, index) => (
                                <div className="accordion-item" key={index}>
                                    <h2 className="accordion-header" id={`heading${index}`}>
                                        <button
                                            className="accordion-button"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#collapse${index}`}
                                            aria-expanded="true"
                                            aria-controls={`collapse${index}`}
                                            onClick={() => setParentCategory(category._id)}
                                        >
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    value={category.id}
                                                    id={`flexCheck${index}`}
                                                    onChange={(e) => handleFilter(e.target.checked, category._id)}
                                                />
                                                <label className="form-check-label" htmlFor={`flexCheck${index}`}>
                                                    {category.name}
                                                </label>
                                            </div>
                                        </button>
                                    </h2>
                                    <div
                                        id={`collapse${index}`}
                                        className="accordion-collapse collapse"
                                        aria-labelledby={`heading${index}`}
                                        data-bs-parent="#accordionExample"
                                    >
                                        <div className="accordion-body" style={{ marginLeft: '1rem' }}>
                                            {subcategories.length > 0 ? (
                                                subcategories.map((subcategory) => (
                                                    <div className="form-check" key={subcategory._id}>
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={`flexCheckDefault${subcategory._id}`}
                                                            onChange={(e) => handleSubcategoryFilter(e.target.checked, subcategory._id)}
                                                        />
                                                        <label className="form-check-label" htmlFor={`flexCheckDefault${subcategory._id}`}>
                                                            {subcategory.name}
                                                        </label>
                                                    </div>
                                                ))
                                            ) : (
                                                <p>No subcategories available</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <h5 className="text-center">Filter By Price</h5>
                        <div className="d-flex flex-column" style={{}}>
                            <Radio.Group onChange={(e) => handlePriceFilter(e.target.value)} style={{}}>
                                {priceRanges.map((range, index) => (
                                    <div key={index}>
                                        <Radio value={range}>{`$${range[0]} - $${range[1]}`}</Radio>
                                    </div>
                                ))}
                            </Radio.Group>
                        </div>
                        <div className='d-flex flex-column'>
                            <button className='btn btn-info' onClick={() => window.location.reload()} style={{ width: '100%' }}>Reset Filters</button>
                        </div>
                    </div>
                    <div className="col-md-10 min-vh-80" style={{ marginLeft: '15rem', padding: '20px' }}>
                        <Carousel className="custom-carousel">
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src="https://media.istockphoto.com/id/822518448/photo/shopping-cart-icon-with-lines-pointing-on-different-places-around-the-globe-online-shopping.jpg?s=2048x2048&w=is&k=20&c=TS62RsECQgz400u-A2ozR3NUWQgPaVf1WdCwEFzNPx4="
                                    alt="First slide"
                                    style={{ height: '400px', objectFit: 'cover' }}
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src="https://media.istockphoto.com/id/1474764768/photo/smart-warehouse-inventory-management-system-concept.jpg?s=1024x1024&w=is&k=20&c=TGBkKOsD_e5An_vAPxwATofe1fJ0QtXDbpei3IzCWN8="
                                    alt="Second slide"
                                    style={{ height: '400px', objectFit: 'cover' }}
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src="https://media.istockphoto.com/id/1425853190/photo/smart-phone-with-chopping-cart-parcel-box-sign-3d-render-concept-for.webp?b=1&s=170667a&w=0&k=20&c=SXQd7OKSEzGrmn0i47uR3p5-yinMJmlIMIgql4LxlQQ="
                                    alt="Third slide"
                                    style={{ height: '400px', objectFit: 'cover' }}
                                />
                            </Carousel.Item>
                        </Carousel>
                        <div className="d-flex flex-wrap justify-content-start mt-4">
                            {products.map((p, index) => (
                                <div className="card m-2" style={{ width: '18rem', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }} key={index}>
                                    <img src={`https://e-commerce-9m1c.vercel.app/api/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} style={{ height: '200px', objectFit: 'cover' }} />
                                    <div className="card-body">
                                        <h5 className="card-title">{p.name}</h5>
                                        <p className="card-text">{`${p.description.substring(0, 20)}...`}</p>
                                        <p className="card-text"> ${p.price} </p>
                                        <button className='btn btn-info' onClick={() => navigate(`/product/${p.slug}`)} style={{ width: '100%', marginBottom: '10px' }}>More Details</button>
                                        <button className='btn btn-dark' onClick={() => {
                                            setCart([...cart, p]);
                                            localStorage.setItem("cart", JSON.stringify([...cart, p]));
                                            toast.success("Item added to cart");
                                        }} style={{ width: '100%' }}>ADD TO CART</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Pagination className='justify-content-center'>{items}</Pagination>
                        <hr />
                        <div className='mt-5'>
                            <h4 className='text-center'>Our Best Selling Products</h4>
                            <div className="d-flex flex-wrap justify-content-start mt-4">
                                {bestSellingProducts.map((p, index) => (
                                    <div className="card m-2" style={{ width: '18rem', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }} key={index}>
                                        <img src={`https://e-commerce-9m1c.vercel.app/api/product/product-photo/${p._id._id}`} className="card-img-top" alt={p.name} style={{ height: '200px', objectFit: 'cover' }} />
                                        <div className="card-body">
                                            <h5 className="card-title">{p._id.name}</h5>
                                            <p className="card-text">{`${p._id.description.substring(0, 20)}...`}</p>
                                            <p className="card-text"> ${p._id.price} </p>
                                            <button className='btn btn-info' onClick={() => navigate(`/product/${p._id.slug}`)} style={{ width: '100%', marginBottom: '10px' }}>More Details</button>
                                            <button className='btn btn-dark' onClick={() => {
                                                setCart([...cart, p._id]);
                                                localStorage.setItem("cart", JSON.stringify([...cart, p._id]));
                                                toast.success("Item added to cart");
                                            }} style={{ width: '100%' }}>ADD TO CART</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <ToastContainer />
            </Layout>
        </>
    );
};

export default Home;
