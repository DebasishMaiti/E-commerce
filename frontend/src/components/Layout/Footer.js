import React from 'react'
import { Link } from 'react-router-dom'
const Footer = () => {
    return (
        <div className='footer'>
            <h4 className='text-center'>All Right Reserved &copy; Debasish</h4>
            <p className='text-center mt-1'></p>
            <Link to="/about">About &nbsp;| </Link>
            <Link to="/contact">Contact &nbsp;| </Link>
            <Link to="/policy">Privacy Policy</Link>
        </div>
    )
}

export default Footer
