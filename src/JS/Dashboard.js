import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import Container from 'react-bootstrap/Container';
import { Card, CardBody, CardImg, CardText, CardTitle, Col, Row } from "react-bootstrap";
import Image from 'react-bootstrap/Image';
import Chart from 'chart.js/auto';
import Sidebar from "./Sidebar";
import "bootstrap/dist/css/bootstrap.css";
import "../CSS/Dash.css";
import icon1 from "../Pics/user.png";
import icon2 from "../Pics/inventory-alt.png";
import icon3 from "../Pics/users-alt.png";
import icon4 from "../Pics/handshake.png";
import icon5 from "../Pics/coins.png";
import icon6 from "../Pics/money-check-edit.png";
import icon7 from "../Pics/box-open.png";
import icon8 from "../Pics/line-chart.png";

import BACKEND_URL from './backendURL';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalCustomers: 0,
        totalSuppliers: 0,
        totalOrders: 0,
        totalPurchases: 0,
        totalFreshproducts: 0,
        totalSales: 0,
        salesByProducts: [],
        salesByMonth: [],
        ordersByMonth: [],
    });

    const { totalUsers, totalProducts, totalCustomers, totalSuppliers, totalOrders, totalPurchases, totalFreshproducts, totalSales, salesByProducts, salesByMonth, ordersByMonth } = dashboardData;

    const token = JSON.parse(localStorage.getItem('token'))?.data?.token;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const promises = [
                    axios.get(`${BACKEND_URL}/api/users/count`, { headers: { Authorization: token } }),
                    axios.get(`${BACKEND_URL}/api/products/count`, { headers: { Authorization: token } }),
                    axios.get(`${BACKEND_URL}/api/customers/count`, { headers: { Authorization: token } }),
                    axios.get(`${BACKEND_URL}/api/suppliers/count`, { headers: { Authorization: token } }),
                    axios.get(`${BACKEND_URL}/api/orders/count`, { headers: { Authorization: token } }),
                    axios.get(`${BACKEND_URL}/api/purchaseorders/count`, { headers: { Authorization: token } }),
                    axios.get(`${BACKEND_URL}/api/fresh-product/count`, { headers: { Authorization: token } }),
                    axios.get(`${BACKEND_URL}/api/sales`, { headers: { Authorization: token } }),
                    axios.get(`${BACKEND_URL}/api/sales-by-products`, { headers: { Authorization: token } }),
                    axios.get(`${BACKEND_URL}/api/sales-by-month`, { headers: { Authorization: token } }),
                    axios.get(`${BACKEND_URL}/api/orders-by-month`, { headers: { Authorization: token } })
                ];

                const responses = await Promise.all(promises);
                const data = responses.map(response => response.data);
                setDashboardData({
                    totalUsers: data[0].userCount,
                    totalProducts: data[1].productCount,
                    totalCustomers: data[2].customerCount,
                    totalSuppliers: data[3].supplierCount,
                    totalOrders: data[4].orderCount,
                    totalPurchases: data[5].purchaseorderCount,
                    totalFreshproducts: data[6].freshproductsCount,
                    totalSales: data[7].totalSales,
                    salesByProducts: data[8],
                    salesByMonth: data[9],
                    ordersByMonth: data[10]
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (token) {
            fetchData();
        }
    }, [token]);

    const processOrdersByMonthData = () => {
        const products = [];
        const orderMonths = [];
        const productData = {};

        ordersByMonth.forEach(item => {
            if (!products.includes(item.productName)) {
                products.push(item.productName);
            }
            if (!orderMonths.includes(item.orderMonth)) {
                orderMonths.push(item.orderMonth);
            }
            if (!productData[item.productName]) {
                productData[item.productName] = [];
            }
            productData[item.productName][orderMonths.indexOf(item.orderMonth)] = item.orderCount;
        });

        const datasets = orderMonths.map((month, index) => {
            return {
                label: month,
                data: products.map(product => productData[product][index] || 0),
                backgroundColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.7)`,
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            };
        });

        return { products, datasets };
    };

    const { products, datasets } = processOrdersByMonthData();

    return (
        <Container fluid>
            <Row>
                <Col sm={2}>
                    <Sidebar />
                </Col>
                <Col>
                    <div className="dash-container">
                        <div className="mt-2">
                        <Row xs={1} md={4} className="g-3">
                                <Col>
                                    <Card>
                                        <Card.Img className="photo" variant="top" src={icon1} />
                                        <Card.Body>
                                            <Card.Title className="text-center">USERS</Card.Title>
                                            <Card.Text className="text-center">
                                                {totalUsers}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card>
                                        <Card.Img className="photo" variant="top" src={icon2} />
                                        <Card.Body>
                                            <Card.Title className="text-center">PRODUCTS</Card.Title>
                                            <Card.Text className="text-center">
                                                {totalProducts}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card>
                                        <Card.Img className="photo" variant="top" src={icon3} />
                                        <Card.Body>
                                            <Card.Title className="text-center">CUSTOMERS</Card.Title>
                                            <Card.Text className="text-center">
                                                {totalCustomers}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card>
                                        <Card.Img className="photo" variant="top" src={icon4} />
                                        <Card.Body>
                                            <Card.Title className="text-center">SUPPLIERS</Card.Title>
                                            <Card.Text className="text-center">
                                                {totalSuppliers}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card>
                                        <Card.Img className="photo" variant="top" src={icon5} />
                                        <Card.Body>
                                            <Card.Title className="text-center">ORDERS</Card.Title>
                                            <Card.Text className="text-center">
                                                {totalOrders}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card>
                                        <Card.Img className="photo" variant="top" src={icon6} />
                                        <Card.Body>
                                            <Card.Title className="text-center">PURCHASES</Card.Title>
                                            <Card.Text className="text-center">
                                                {totalPurchases}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card>
                                        <Card.Img className="photo" variant="top" src={icon7} />
                                        <Card.Body>
                                            <Card.Title className="text-center">FRESH PRODUCTS</Card.Title>
                                            <Card.Text className="text-center">
                                                {totalFreshproducts}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col>
                                    <Card>
                                        <Card.Img className="photo" variant="top" src={icon8} />
                                        <Card.Body>
                                            <Card.Title className="text-center">TOTAL SALES</Card.Title>
                                            <Card.Text className="text-center">
                                                ₱{totalSales}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </div>

                        <div className="mt-3">
                                <Col>
                                    <Card>
                                        <CardBody>
                                            <Bar
                                                data={{
                                                    labels: salesByProducts.map(product => product.productName),
                                                    datasets: [{
                                                        data: salesByProducts.map(product => product.total_sales),
                                                        backgroundColor: 'rgba(54, 162, 235, 0.7)',
                                                        borderColor: 'rgba(54, 162, 235, 1)',
                                                        borderWidth: 1,
                                                        label: 'Sold Amount' // Label for the dataset
                                                    }]
                                                }}
                                                height="550px"
                                                width="800px"
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    indexAxis: 'y', // Set the index axis to 'y' for horizontal bar chart
                                                    plugins: {
                                                        legend: {
                                                            display: false,
                                                            position: 'bottom',
                                                            labels: {
                                                                color: '#BBE1FA'
                                                            }
                                                        },
                                                        title: {
                                                            display: true,
                                                            text: 'Product Sales',
                                                            font: {
                                                                size: 18
                                                            },
                                                            color: '#BBE1FA'
                                                        }
                                                    },
                                                    scales: {
                                                        y: {
                                                            beginAtZero: true,
                                                            grid: {
                                                                color: '#BBE1FA' // White grid lines
                                                            },
                                                            ticks: {
                                                                color: '#BBE1FA' // White tick marks
                                                            }
                                                        },
                                                        x: {
                                                            title: {
                                                                display: true,
                                                                text: 'Sold Amount',
                                                                color: '#BBE1FA'
                                                            },
                                                            grid: {
                                                                color: '#BBE1FA' // White grid lines
                                                            },
                                                            ticks: {
                                                                color: '#BBE1FA' // White tick marks
                                                            }
                                                        }
                                                    },
                                                }}
                                            />
                                        </CardBody>
                                    </Card>
                                </Col>
                        </div>

                        <div className="mt-3">
                                <Col>
                                    <Card>
                                        <CardBody>
                                            <Bar
                                                data={{
                                                    labels: salesByMonth.map(order => order.month),
                                                    datasets: [{
                                                        data: salesByMonth.map(order => order.sales_amount),
                                                        backgroundColor: 'rgba(54, 162, 235, 0.7)', // Bar color
                                                        borderColor: 'rgba(54, 162, 235, 1)', // Bar border color
                                                        borderWidth: 1,
                                                        label: 'Sold Amount' // Label for the dataset
                                                    }]
                                                }}
                                                height="550px"
                                                width="800px"
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    indexAxis: 'x', // Set the index axis to 'y' for horizontal bar chart
                                                    plugins: {
                                                        legend: {
                                                            display: false,
                                                            position: 'bottom',
                                                            labels: {
                                                                color: '#BBE1FA'
                                                            }
                                                        },
                                                        title: {
                                                            display: true,
                                                            text: 'Monthly Sales',
                                                            font: {
                                                                size: 18
                                                            },
                                                            color: '#BBE1FA'
                                                        }
                                                    },
                                                    scales: {
                                                        y: {
                                                            beginAtZero: true,
                                                            title: {
                                                                display: true,
                                                                text: 'Sold Amount',
                                                                color: '#BBE1FA'
                                                            },
                                                            grid: {
                                                                color: '#BBE1FA' // White grid lines
                                                            },
                                                            ticks: {
                                                                color: '#BBE1FA' // White tick marks
                                                            }
                                                        },
                                                        x: {
                                                            grid: {
                                                                color: '#BBE1FA' // White grid lines
                                                            },
                                                            ticks: {
                                                                color: '#BBE1FA' // White tick marks
                                                            }
                                                        }
                                                    },
                                                }}
                                            />
                                        </CardBody>
                                    </Card>
                                </Col>
                        </div>
                       
                        <div className="mt-3">
                            <Col>
                                <Card>
                                    <Card.Body>
                                        <Bar
                                            data={{
                                                labels: products,
                                                datasets: datasets
                                            }}
                                            height="1000px"
                                            width="800px"
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                indexAxis: 'y',
                                                plugins: {
                                                    legend: {
                                                        display: true,
                                                        position: 'bottom',
                                                        labels: {
                                                            color: '#BBE1FA'
                                                        }
                                                    },
                                                    title: {
                                                        display: true,
                                                        text: 'Product Seasonality',
                                                        font: {
                                                            size: 18
                                                        },
                                                        color: '#BBE1FA'
                                                    }
                                                },
                                                scales: {
                                                    y: {
                                                        beginAtZero: true,
                                                        grid: {
                                                            color: '#BBE1FA' // White grid lines
                                                        },
                                                        ticks: {
                                                            color: '#BBE1FA' // White tick marks
                                                        }
                                                    },
                                                    x: {
                                                        title: {
                                                            display: true,
                                                            text: 'Order Count',
                                                            color: '#BBE1FA'
                                                        },
                                                        grid: {
                                                            color: '#BBE1FA' // White grid lines
                                                        },
                                                        ticks: {
                                                            color: '#BBE1FA' // White tick marks
                                                        }
                                                    }
                                                },
                                            }}
                                        />
                                    </Card.Body>
                                </Card>
                            </Col>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
