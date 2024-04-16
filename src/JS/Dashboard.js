import React, { useEffect, useState } from "react";
// import { useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';
// import { Link } from 'react-router-dom';

// import Navbar from 'react-bootstrap/Navbar';
// import Nav from 'react-bootstrap/Nav';
// import Button from 'react-bootstrap/Button';
// import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
// import pic1 from '../Pics/logo.png';
import Navigationbar from "./Navbar";
import "bootstrap/dist/css/bootstrap.css";
import "../CSS/Dash.css"
import pic from "../Pics/staph.jpg"

const Dashboard = () => {
    return (
        <>  
            <Navigationbar/>
            <div className="container text-white"><br />
                <div style={{ textAlign: 'center', alignSelf: 'center', justifyContent: "center", color: "red" }}>
                    <h1 className="title">PAGE UNDER CONSTRUCTION!</h1>
                </div>
                <div className="dash-container mt-4">
                    <Image className="photo" src={pic}/>
                </div>
                <div className="mt-4" style={{ textAlign: 'center', alignSelf: 'center', justifyContent: "center" }}>
                    <h2 style={{color: "green"}}>Future Updates:</h2>
                    <h5 style={{color: "blue"}}> &gt; Add Pagination feature</h5>
                    <h5 style={{color: "blue"}}> &gt; Improving page design</h5>
                    <h5 style={{color: "blue"}}> &gt; Dashboard charts/graphs for sales, etc.</h5>
                </div>
            </div>
        </>
    );
};

export default Dashboard;