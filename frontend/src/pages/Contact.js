import React from 'react';
import Layout from '../components/Layout/Layout';
import '../CSS/Contact.css';  // Import your custom CSS

const Contact = () => {
    return (
        <>
            <Layout>
                <div className="container contact-container mt-3">
                    <div className="row contact-row">
                        <div className="col-6 contact-right">
                            {/* You can add content here if needed */}
                        </div>
                        <div className="col-6 contact-left">
                            <h1 className="contact-title text-center">
                                <u>Contact Us</u>
                            </h1>
                            <h5 className="contact-info">Email : debasish@maiti.com</h5>
                            <h5 className="contact-info">Phone : 123654789</h5>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Contact;
