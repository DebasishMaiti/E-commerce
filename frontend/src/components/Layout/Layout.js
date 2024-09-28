import React from 'react'
import Header from './Header'
import Footer from './Footer'

const Layout = ({ children }) => {
    return (
        <div>
            <Header style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }} />
            <main style={{ minHeight: "85vh", marginTop: '60px' }}>{children}</main>
            <Footer />
        </div>
    )
}

export default Layout
