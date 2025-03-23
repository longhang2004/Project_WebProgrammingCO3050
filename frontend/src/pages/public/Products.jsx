import React from "react";
import {Outlet} from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {useSelector} from "react-redux";
import Navbar from "../../components/Navbar";

function Products() {
    // const products = useSelector((state) => state.products);
    return (
        <>
            <Header />
            <Navbar />
            <Outlet />
            <Footer />
        </>
    );
}

export default Products;
