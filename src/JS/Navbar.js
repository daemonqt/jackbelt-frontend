import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import pic1 from '../Pics/logo.png';

import "bootstrap/dist/css/bootstrap.css";
import "../CSS/Navbar.css"

const Navigationbar = () => {

    const [ user, setUser ] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchUser = async () => {
            try {

                const response = JSON.parse(localStorage.getItem('token'))
                setUser(response.data);

                const decoded_token = jwtDecode(response.data.token);
                console.log(decoded_token);
                setUser(decoded_token);

            } catch (error) {

                navigate("/login");
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {

        try {

            localStorage.removeItem('token');
            navigate("/login");

        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <>
            <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand as={Link} to={"/dashboard"} eventKey="link-7">
                        <Image className="logo" src={pic1}/>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto" variant="underline">
                        <Nav.Link as={Link} to={"/users"} eventKey="link-1" className="text-decoration-none text-white">Users</Nav.Link>
                        <Nav.Link as={Link} to={"/products"} eventKey="link-2" className="text-decoration-none text-white">Products</Nav.Link>
                        <Nav.Link as={Link} to={"/customers"} eventKey="link-3" className="text-decoration-none text-white">Customers</Nav.Link>
                        <Nav.Link as={Link} to={"/suppliers"} eventKey="link-4" className="text-decoration-none text-white">Suppliers</Nav.Link>
                        <Nav.Link as={Link} to={"/orders"} eventKey="link-5" className="text-decoration-none text-white">Customer-Order</Nav.Link>
                        <Nav.Link as={Link} to={"/purchases"} eventKey="link-6" className="text-decoration-none text-white">Order-to-Supplier</Nav.Link>
                    </Nav>
                    <Nav className="justify-content-end">
                        <Navbar.Text className="text-white">
                            Welcome: <span className="text-color me-4">{user? user.username: ''}</span>
                        </Navbar.Text>
                        <Button variant="primary" onClick={handleLogout}>Logout</Button>
                    </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default Navigationbar;