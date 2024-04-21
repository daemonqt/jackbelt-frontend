import React, { useEffect, useState } from "react";
import axios from 'axios';
import Image from 'react-bootstrap/Image';
import Navigationbar from "./Navbar";
import Chart from 'chart.js/auto';
import { Bar, Pie } from 'react-chartjs-2';
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
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [totalSuppliers, setTotalSuppliers] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalPurchases, setTotalPurchases] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [salesByProducts, setSalesByProducts] = useState([]);

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
        const fetchTotalProducts = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/products/count`, {
                    headers: {
                        Authorization: token
                    }
                });
                setTotalProducts(response.data.productCount);
            } catch (error) {
                console.error('Error fetching total number of products:', error);
            }
        };
        const fetchTotalCustomers = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/customers/count`, {
                    headers: {
                        Authorization: token
                    }
                });
                setTotalCustomers(response.data.customerCount);
            } catch (error) {
                console.error('Error fetching total number of customers:', error);
            }
        };
        const fetchTotalSuppliers = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/suppliers/count`, {
                    headers: {
                        Authorization: token
                    }
                });
                setTotalSuppliers(response.data.supplierCount);
            } catch (error) {
                console.error('Error fetching total number of suppliers:', error);
            }
        };
        const fetchTotalOrders = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/orders/count`, {
                    headers: {
                        Authorization: token
                    }
                });
                setTotalOrders(response.data.orderCount);
            } catch (error) {
                console.error('Error fetching total number of orders:', error);
            }
        };
        const fetchTotalPurchases = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/purchaseorders/count`, {
                    headers: {
                        Authorization: token
                    }
                });
                setTotalPurchases(response.data.purchaseorderCount);
            } catch (error) {
                console.error('Error fetching total number of purchases:', error);
            }
        };

        fetchTotalUsers();
        fetchTotalProducts();
        fetchTotalCustomers();
        fetchTotalSuppliers();
        fetchTotalOrders();
        fetchTotalPurchases();

    }, [token]);

    useEffect(() => {
        const fetchTotalSales = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/sales`, {
                    headers: {
                        Authorization: token
                    }
                });
                setTotalSales(response.data.totalSales);
            } catch (error) {
                console.error('Error fetching total sales:', error);
            }
        };
        const fetchSalesByProducts = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/sales-by-products`, {
                    headers: {
                        Authorization: token
                    }
                });
                setSalesByProducts(response.data);
            } catch (error) {
                console.error('Error fetching sales by products:', error);
            }
        };

        fetchTotalSales();
        fetchSalesByProducts();
    }, [token]);

    const generateRandomColors = (numColors) => {
        const colors = [];
        for (let i = 0; i < numColors; i++) {
            const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.7)`;
            colors.push(randomColor);
        }
        return colors;
    };

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
                                    <CardText>Products: <span>{totalProducts}</span></CardText>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col>
                            <Card bg="danger">
                                <CardBody>
                                    <CardImg className="photo" src={icon3}/>
                                    <CardText>Customers: <span>{totalCustomers}</span></CardText>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col>
                            <Card bg="warning">
                                <CardBody>
                                    <CardImg className="photo" src={icon4}/>
                                    <CardText>Suppliers: <span>{totalSuppliers}</span></CardText>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col>
                            <Card bg="info">
                                <CardBody>
                                    <CardImg className="photo" src={icon5}/>
                                    <CardText>Orders: <span>{totalOrders}</span></CardText>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col>
                            <Card bg="light">
                                <CardBody>
                                    <CardImg className="photo" src={icon6}/>
                                    <CardText>Purchase: <span>{totalPurchases}</span></CardText>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
                <div className="mt-4">
                    <Row>
                        <Col>
                            <Card bg="dark">
                                <CardBody>
                                    <Bar
                                        data={{
                                            labels: ['Total Sales'],
                                            datasets: [{
                                                label: 'Total Sales',
                                                data: [totalSales],
                                                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                                                borderColor: 'rgba(54, 162, 235, 1)',
                                                borderWidth: 1
                                            }]
                                        }}
                                        options={{
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    grid: {
                                                        color: 'rgba(255,255,255,0.3)' // White grid lines
                                                    },
                                                    ticks: {
                                                        color: 'rgba(255,255,255,1)' // White tick marks
                                                    }
                                                },
                                                x: {
                                                    grid: {
                                                        color: 'rgba(255,255,255,0.3)' // White grid lines
                                                    },
                                                    ticks: {
                                                        color: 'rgba(255,255,255,1)' // White tick marks
                                                    }
                                                }
                                            },
                                            plugins: {
                                                legend: {
                                                    labels: {
                                                        color: 'white' // White legend text color
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col>
                            <Card bg="secondary">
                                <CardBody>
                                    <Pie
                                        data={{
                                            labels: salesByProducts.map(product => product.productName),
                                            datasets: [{
                                                data: salesByProducts.map(product => product.total_sales),
                                                backgroundColor: generateRandomColors(salesByProducts.length) // Use random colors
                                            }]
                                        }}
                                        options={{
                                            plugins: {
                                                legend: {
                                                    display: true,
                                                    position: 'bottom',
                                                    labels: {
                                                        color: 'white'
                                                    }
                                                },
                                                title: {
                                                    display: true,
                                                    text: 'Sales by Product',
                                                    font: {
                                                        size: 18
                                                    },
                                                    color: 'white'
                                                }
                                            }
                                        }}
                                    />
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
