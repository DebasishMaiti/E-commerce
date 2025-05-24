import React from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import { useAuth } from '../../Context/Context'
import '../../CSS/AdminDashboard.css'

const AdminDashboard = () => {
    const [auth] = useAuth();
    return (
        <Layout>
            <div className='container-fluid admin-container m-3 p-3'>
                <div className='row admin-row'>
                    <div className='col-md-2 admin-menu-col' style={{ backgroundColor: '#343a40' }}>
                        <AdminMenu />
                    </div>
                    <div className='col-md-10 admin-info-col'>
                        <div className='card admin-info-card w-75 p-3'>
                            <h4 className='admin-info-item'>Name: {auth.user.name}</h4>
                            <h4 className='admin-info-item'>Email: {auth.user.email}</h4>
                            <h4 className='admin-info-item'>Contact: {auth.user.phone}</h4>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default AdminDashboard
