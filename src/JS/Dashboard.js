import React, { useEffect, useState } from "react";
import axios from 'axios';
import Image from 'react-bootstrap/Image';
import Navigationbar from "./Navbar";
import Card from 'react-bootstrap/Card';
import "bootstrap/dist/css/bootstrap.css";
import "../CSS/Dash.css";
import icon1 from "../Pics/user.png";
import icon2 from "../Pics/shopping-cart.png";
import icon3 from "../Pics/users-alt.png";
import icon4 from "../Pics/handshake.png";
import icon5 from "../Pics/coins.png";
import icon6 from "../Pics/money-check-edit.png";
import BACKEND_URL from './backendURL';
import { CardBody, CardImg, CardText, Col, Row } from "react-bootstrap";

const Dashboard = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const dash = JSON.parse(localStorage.getItem('token'));
    const token = dash.data.token;

    useEffect(() => {
        const fetchTotalUsers = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/users/count`, {
                    headers: {
                        Authorization: token
                    }
                });
                setTotalUsers(response.data.userCount);
            } catch (error) {
                console.error('Error fetching total number of users:', error);
            }
        };

        fetchTotalUsers();
    }, [token]);

    return (
        <>  
            <Navigationbar/>
            <div className="container"><br />
                <div style={{ textAlign: 'center', alignSelf: 'center', justifyContent: "center", color: "white" }}>
                    <h2 className="title">DASHBOARD</h2>
                </div>
                <div className="mt-4">
                    <Row>
                        <Col>
                            <Card bg="primary">
                                <CardBody>
                                    <CardImg className="photo" src={icon1}/>
                                    <CardText>Users: <span>{totalUsers}</span></CardText>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col>
                            <Card bg="success">
                                <CardBody>
                                    <CardImg className="photo" src={icon2}/>
                                    <CardText>Products: <span>{totalUsers}</span></CardText>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col>
                            <Card bg="danger">
                                <CardBody>
                                    <CardImg className="photo" src={icon3}/>
                                    <CardText>Customers: <span>{totalUsers}</span></CardText>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col>
                            <Card bg="warning">
                                <CardBody>
                                    <CardImg className="photo" src={icon4}/>
                                    <CardText>Suppliers: <span>{totalUsers}</span></CardText>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col>
                            <Card bg="info">
                                <CardBody>
                                    <CardImg className="photo" src={icon5}/>
                                    <CardText>Orders: <span>{totalUsers}</span></CardText>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col>
                            <Card bg="light">
                                <CardBody>
                                    <CardImg className="photo" src={icon6}/>
                                    <CardText>Purchase: <span>{totalUsers}</span></CardText>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
