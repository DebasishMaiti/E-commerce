import React from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import { useAuth } from '../../Context/Context'

const AdminDashboard = () => {
    const [auth] = useAuth();
    return (
        <Layout>
            <div className='container-fluid m-3 p-3'>
                <div className='row'>
                    <div className='col-md-2'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-10'>
                        <div className='card w-75 p-3'>
                            <h4>Name:- {auth.user.name}</h4>
                            <h4>Email:- {auth.user.email}</h4>
                            <h4>Contact:- {auth.user.phone}</h4>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default AdminDashboard
