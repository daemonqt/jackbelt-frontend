import React, { useEffect, useState } from "react";
// import { useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';
// import { Link } from 'react-router-dom';

// import Navbar from 'react-bootstrap/Navbar';
// import Nav from 'react-bootstrap/Nav';
// import Button from 'react-bootstrap/Button';
// import Container from 'react-bootstrap/Container';
import axios from 'axios';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
// import pic1 from '../Pics/logo.png';
import Navigationbar from "./Navbar";
import "bootstrap/dist/css/bootstrap.css";
import "../CSS/Dash.css"
import pic from "../Pics/staph.jpg"
import BACKEND_URL from './backendURL';

const Dashboard = () => {
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        const fetchTotalUsers = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/users`);
                setTotalUsers(response.data.count);
            } catch (error) {
                console.error('Error fetching total number of users:', error);
            }
        };

        fetchTotalUsers();
    }, []);

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
            <div className="mt-4">
                <Card>
                    <Card.Body>
                        <Card.Title>Users</Card.Title>
                        <Card.Text>Total Users: {totalUsers}</Card.Text>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
};

export default Dashboard;