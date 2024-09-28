import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../../Context/Context'
import { useCart } from '../../Context/Cart'
import { BiCartAlt } from "react-icons/bi";

const Header = () => {
    const [cart] = useCart();
    const [auth, setAuth] = useAuth();
    const logOut = () => {
        setAuth({
            ...auth,
            user: null,
            token: "",
        });
        localStorage.removeItem("auth");
    }
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{
                position: 'fixed',
                top: 0,
                width: '100%',
                zIndex: 1000,
                height: '60px',
                backgroundColor: '#f8f9fa',
                padding: '1rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                marginBottom: "1rem"
            }}>
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                        <Link to="/" className="navbar-brand d-flex">
                            <h1 className='mt-3'><BiCartAlt /></h1>
                        </Link>

                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink to="/" className="nav-link " aria-current="page"  >Home</NavLink>
                            </li>

                            {
                                (!auth?.user) ? (<>
                                    <li className="nav-item">
                                        <NavLink to="/register" className="nav-link"  >Register</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="/login" className="nav-link"  >Login</NavLink>
                                    </li></>) : (<>
                                        <li className="nav-item dropdown">
                                            <a className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                {auth?.user?.name}
                                            </a>
                                            <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                                <li><NavLink to={`/dashboard/${auth?.user?.role === 1 ? 'admin' : 'user'}`} className="dropdown-item">Dashboard</NavLink></li>
                                                <li className="nav-item">
                                                    <NavLink to="/login" className="dropdown-item" onClick={() => logOut()}>LogOut</NavLink>
                                                </li>
                                            </ul>
                                        </li></>)
                            }
                            <li className="nav-item">
                                <NavLink to="/cart" className="nav-link"  >Cart({cart.length})</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header
