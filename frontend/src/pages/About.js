import React from 'react'
import Layout from '../components/Layout/Layout'

const About = () => {
    return (
        <>
            <Layout>
                <div className='container about mt-3'>
                    <div className='row'>
                        <div className='col-6 right'>
                        </div>
                        <div className='col-6 left d-flex flex-column align-item-center'>
                            <h1 className='text-center'><u>About Us</u></h1>
                            <p className='mt-5 text-center'>    Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius, tempore
                                quibusdam. Ipsa laborum quibusdam odio quaerat, tenetur unde repellat quos
                                necessitatibus eos assumenda. A necessitatibus explicabo ullam iste ut
                                aliquid! Molestias magni officia dolorem necessitatibus consectetur, numquam
                                voluptate maxime nemo quam, tempora dolor reprehenderit, provident cum id
                                laudantium libero deserunt quibusdam? Quae reprehenderit ea natus autem quos
                                officia atque accusantium? Voluptatum, mollitia earum. Soluta ad minima sint
                                id inventore, at voluptates reiciendis voluptatum et distinctio, blanditiis
                                obcaecati iste quis, eligendi nobis molestias ex. Error molestiae rem
                                explicabo vel nisi fugiat!</p>
                            <button className='btn btn-secondary'>Read More:- </button>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}
export default About