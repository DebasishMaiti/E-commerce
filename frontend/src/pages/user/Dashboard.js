import React from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useAuth } from '../../Context/Context'

const Dashboard = () => {
    const [auth] = useAuth()
    return (
        <Layout>
            <div className='container-fluid p-3 m-3'>
                <div className='row'>
                    <div className='col-md-3'>
                        <UserMenu />
                    </div>
                    <div className='col-md-9'>
                        <div className='card w-75 p-3'>
                            <h4>Name:- {auth.user.name}</h4>
                            <h4>Email:- {auth.user.email}</h4>
                            <h4>Address:- {auth.user.address}</h4>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard
