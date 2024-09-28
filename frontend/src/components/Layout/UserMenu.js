import React from 'react'
import { Link } from 'react-router-dom'

const UserMenu = () => {
    return (
        <div>
            <div className='text-center'>
                <div class="list-group">
                    <h3>Dashboard</h3>
                    <Link to="/dashboard/user/profile" class="list-group-item list-group-item-action">Profile</Link>
                    <Link to="/dashboard/user/Orders" class="list-group-item list-group-item-action">My Orders</Link>
                </div>
            </div>
        </div>
    )
}

export default UserMenu
