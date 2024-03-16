import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Swal from 'sweetalert2';

import { jwtDecode } from 'jwt-decode';
import "../CSS/Login.css";

import pic1 from '../Pics/logo.png';

import BACKEND_URL from './backendURL';

const Login = () => {
    const navigate = useNavigate();
    const [ user, setUser ] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {

                const response = JSON.parse(localStorage.getItem('token'))
                setUser(response.data);

                navigate("/dashboard");

            } catch (error) {
                navigate("/login");
            }
        };

        fetchUser();
    }, []);

    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState(''); 
    const [ token, setToken ] = useState(localStorage.getItem('token') || '');

    const handleLogin = async (e) => {

        try {
            const response = await axios.post(`${BACKEND_URL}/api/user/login`, {
                username,
                password,
            });

            localStorage.setItem("token", JSON.stringify(response));
            navigate("/dashboard");

            const undecoded_token = JSON.parse(localStorage.getItem('token'));
            console.log(undecoded_token.data.token);
            const decoded_token = jwtDecode(undecoded_token.data.token);
            console.log(decoded_token);

        } catch (error) {
            // console.error('Login failed', error);
            Swal.fire({
                icon: "error",
                title: "Incorrect username/password.",
                text: "Try again."
            });
        }
    };

    return (
        <div className="container center">
            <Row>
                <Col className="image-container">
                    <Row className="login-logo mt-3">
                        <Image className="image" src={pic1} roundedCircle/>
                    </Row>
                    <Row className="mt-3">
                        <h1 className="text1">JackBelt</h1>
                        <h2 className="text">Concrete Product & Aggregate</h2>
                        <h3 className="text">Inventory Management System</h3>
                    </Row>
                </Col>
                <Col className="form-container">
                    <Row className="glassmorphism">
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicUsername">
                                <Form.Label className="text-label">Username</Form.Label>
                                <Form.Control type="username" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label className="text-label">Password</Form.Label>
                                <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </Form.Group>
                            <Button className="mb-3" variant="success" type="button" onClick={handleLogin}>
                                Login
                            </Button>
                        </Form>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default Login;