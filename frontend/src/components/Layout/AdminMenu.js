import React from 'react'
import { Link } from 'react-router-dom'
import '../../CSS/AdminMenu.css'
const AdminMenu = () => {
    return (
        <>
            <div className='text-center admin-menu-container'>
                <div className="list-group admin-menu-list">
                    <h3 className="admin-menu-title">Admin Panel</h3>
                    <Link to="/dashboard/admin/create-category" className="list-group-item list-group-item-action admin-menu-link">Create Category</Link>
                    <Link to="/dashboard/admin/create-product" className="list-group-item list-group-item-action admin-menu-link">Create Product</Link>
                    <Link to="/dashboard/admin/products" className="list-group-item list-group-item-action admin-menu-link">Products</Link>
                    <Link to="/dashboard/admin/orders" className="list-group-item list-group-item-action admin-menu-link">Orders</Link>
                    <Link to="/dashboard/admin/users" className="list-group-item list-group-item-action admin-menu-link">User</Link>
                </div>
            </div>
        </>
    )
}

export default AdminMenu
