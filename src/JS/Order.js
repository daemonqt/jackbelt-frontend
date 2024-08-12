import React, { useEffect, useState } from "react";
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Swal from 'sweetalert2';
import "../CSS/Style.css";
import BACKEND_URL from './backendURL';
import Sidebar from "./Sidebar.js";

import picsizechart from "../Pics/rcppics/rcpchart.png";
import rcp1 from "../Pics/rcppics/rcp1.png";
import rcp2 from "../Pics/rcppics/rcp2.png";
import rcp3 from "../Pics/rcppics/rcp3.png";
import rcp4 from "../Pics/rcppics/rcp4.png";
import rcp5 from "../Pics/rcppics/rcp5.png";
import rcp6 from "../Pics/rcppics/rcp6.png";
import rcp7 from "../Pics/rcppics/rcp7.png";
import rcp8 from "../Pics/rcppics/rcp8.png";
import rcp9 from "../Pics/rcppics/rcp9.png";
import rcp10 from "../Pics/rcppics/rcp10.png";
import rcp11 from "../Pics/rcppics/rcp11.png";

function Order() {
    const [orders, setOrders] = useState([]);
    const order = JSON.parse(localStorage.getItem('token'));
    const token = order.data.token;

    const headers = {
        accept: 'application/json',
        Authorization: token
    };

    //DISPLAY
    const fetchOrders = async () => {
        await axios.get(`${BACKEND_URL}/api/orders`, { headers: headers }).then(({ data }) => {
            setOrders(data);

        });
    };

    //for form dropdown
    const [customerIds, setCustomerIds] = useState([]);
    const [productIds, setProductIds] = useState([]);
    const [userIds, setUserIds] = useState([]);

    const [customerNames, setCustomerNames] = useState([]);
    const [productNames, setProductNames] = useState([]);
    const [userNames, setUserNames] = useState([]);


    useEffect(() => {
        // Fetch customer_id data
        axios.get(`${BACKEND_URL}/api/customers`, { headers: headers }).then(({ data }) => {
            setCustomerIds(data.map(customer => customer.customer_id));
            setCustomerNames(data.map(customer => customer.name));
        });
    
        // Fetch product data
        axios.get(`${BACKEND_URL}/api/products`, { headers: headers }).then(({ data }) => {
            setProductIds(data.map(product => product.product_id));
            setProductNames(data.map(product => product.productName));
        });

        // Fetch user data
        axios.get(`${BACKEND_URL}/api/users`, { headers: headers }).then(({ data }) => {
            setUserIds(data.map(user => user.user_id));
            setUserNames(data.map(user => user.name));
        });

        // Fetch orders data
        fetchOrders();
    }, []);

    

    //CREATE
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [customer_id, setCustomerId] = useState("");
    const [product_id, setProductId] = useState("");
    const [orderQuantity, setOrderQuantity] = useState("")
    const [orderStatus, setOrderStatus] = useState("")
    const [user_id, setUserId] = useState("")
    const [validationError, setValidationError] = useState({});

    const createOrder = async (e) => {
        e.preventDefault();

        console.log(customer_id);
        console.log(product_id);
        console.log(orderQuantity);
        console.log(orderStatus);
        console.log(user_id);

        const formData = new FormData();

        formData.append('customer_id', customer_id);
        formData.append('product_id', product_id);
        formData.append('orderQuantity', orderQuantity);
        formData.append('orderStatus', orderStatus);
        formData.append('user_id', user_id);

        await axios.post(`${BACKEND_URL}/api/order/register`, { customer_id, product_id, orderQuantity, orderStatus, user_id }, { headers: headers }).then(({ data }) => {
            Swal.fire({
                icon: "success",
                text: data.message
            });
            handleClose();
            fetchOrders();

        }).catch(({ response }) => {
            if (response.status === 422) {
                setValidationError(response.data.errors);
            } else {
                Swal.fire({
                    // text: response.data.message,
                    title: 'Data input error',
                    icon: 'error',
                    text: 'Try again'
                });
            }
        });
    };
    //Size chart
    const [showSizeModal, setShowSizeModal] = useState(false);
    const handleSizeModalClose = () => setShowSizeModal(false);
    const handleShowSizeModal = () => setShowSizeModal(true);

    //DISPLAY SPECIFIC USER
    const [showOrder, setShowOrder] = useState(false);
    const [specificOrderData, setSpecificOrderData] = useState({});
    const handleOrderClose = () => setShowOrder(false);

    const readSpecificOrder = (order_id) => {
        fetchSpecificOrder(order_id);
    };

    const fetchSpecificOrder = async (order_id) => {
        try {
            const { data } = await axios.get(`${BACKEND_URL}/api/order/${order_id}`, { headers: headers });
            setSpecificOrderData(data);
            setShowOrder(true);
        } catch (error) {
            console.error("Error fetching specific order data", error);
        }
    };

    //UPDATE
    const [showUpdate, setShowUpdate] = useState(false);
    const [updateOrder, setUpdateOrder] = useState({});

    const handleCloseUpdate = () => {
        setShowUpdate(false);
        setUpdateOrder({});
    };

    const handleShowUpdate = (order) => {
        setUpdateOrder(order);
        setShowUpdate(true);
        setCustomerId(order.customer_id || "");
        setProductId(order.product_id || "");
        setOrderQuantity(order.orderQuantity || "");
        setOrderStatus(order.orderStatus || "");
        setUserId(order.user_id || "");
    };

    const updateContent = async (e) => {
        e.preventDefault();

        const updatedOrderData = {
            customer_id,
            product_id,
            orderQuantity,
            orderStatus,
            user_id,
        };

        try {
            await axios.put(`${BACKEND_URL}/api/order/${updateOrder.order_id}`, updatedOrderData, { headers });

            Swal.fire({
                icon: "success",
                text: "Order updated successfully",
            });

            handleCloseUpdate();
            fetchOrders();
        } catch (error) {
            console.error("Error updating order data", error);

            if (error.response && error.response.status === 422) {
                setValidationError(error.response.data.errors);
            } else {
                Swal.fire({
                    text: "Error updating order data",
                    icon: "error",
                });
            }
        }
    };

    //DELETE
    const deleteOrder = async (order_id) => {
        const isConfirm = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            return result.isConfirmed;
        });

        if (!isConfirm) {
            return;
        }

        await axios.delete(`${BACKEND_URL}/api/order/${order_id}`, { headers: headers }).then(({ data }) => {

            Swal.fire({
                icon: "success",
                text: "Succesfully Deleted"
            });
            fetchOrders();
        }).catch(({ response: { data } }) => {
            Swal.fire({
                text: data.message,
                icon: "error"
            });
        });
    };

    //Search bar component
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    
    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
    };
    
    const customerIdToNameMap = customerIds.reduce((map, id, index) => {
        map[id] = customerNames[index];
        return map;
    }, {});

    const productIdToNameMap = productIds.reduce((map, id, index) => {
        map[id] = productNames[index];
        return map;
    }, {});

    const userIdToNameMap = userIds.reduce((map, id, index) => {
        map[id] = userNames[index];
        return map;
    }, {});

    const filterOrders = () => {
        return orders.filter((order) => {
            const customerName = customerIdToNameMap[order.customer_id] || '';
            const productName = productIdToNameMap[order.product_id] || '';
            const userName = userIdToNameMap[order.user_id] || '';
            return (
                order.order_id.toString().includes(searchInput.toLowerCase()) ||
                order.customer_id.toString().includes(searchInput.toLowerCase()) ||
                customerName.toLowerCase().includes(searchInput.toLowerCase()) ||
                order.product_id.toString().includes(searchInput.toLowerCase()) ||
                productName.toLowerCase().includes(searchInput.toLowerCase()) ||
                order.orderQuantity.toString().includes(searchInput.toLowerCase()) ||
                order.priceInTotal.toString().includes(searchInput.toLowerCase()) ||
                order.orderStatus.toLowerCase().includes(searchInput.toLowerCase()) ||
                order.user_id.toString().includes(searchInput.toLowerCase()) ||
                userName.toLowerCase().includes(searchInput.toLowerCase()) ||
                order.orderDatenTime.toString().toLowerCase().includes(searchInput.toLowerCase())
            );
        });
    };

    useEffect(() => {
        setSearchResults(filterOrders());
    }, [orders, searchInput]);

    return (
        <Container fluid>
            <Row>
                <Col sm={2}>
                    <Sidebar/>
                </Col>
                <Col>
                    {/* USER UI */}
                    <div className="container"><br />
                        <div className="top-components">
                            <div className="searchbar-container">
                                <InputGroup size="sm" className="searchbar">
                                    <InputGroup.Text>Search</InputGroup.Text>
                                    <Form.Control size="sm" type="search" placeholder="search table data" value={searchInput} onChange={handleSearchInputChange} className="input-data" aria-label="Search" />
                                </InputGroup>
                            </div>
                            <div className="button-container">
                                <Button variant="btn btn-primary btn-sm" className="me-2" onClick={handleShowSizeModal}>Size Comparison</Button>
                                <Button variant="btn btn-success btn-sm" onClick={handleShow}>+ Add Order</Button>
                            </div>
                        </div>
                        <div className="table-container">
                            <table className="mt-2 text-center">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Customer's Name</th>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Processed by</th>
                                        <th>Ordered When</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchResults.length > 0 &&
                                        searchResults.map((row, key) => (
                                            <tr key={key}>
                                                <td>{row.order_id || 'N/A'}</td>
                                                <td>{customerNames[customerIds.indexOf(row.customer_id)] || 'N/A'}</td>
                                                <td>{productNames[productIds.indexOf(row.product_id)] || 'N/A'}</td>
                                                <td>{row.orderQuantity || 'N/A'}</td>
                                                <td>{row.priceInTotal || 'N/A'}</td>
                                                <td>{row.orderStatus || 'N/A'}</td>
                                                <td>{userNames[userIds.indexOf(row.user_id)] || 'N/A'}</td>
                                                <td>{row.orderDatenTime || 'N/A'}</td>
                                                <td>
                                                    <Button variant='btn btn-primary btn-sm me-2' onClick={() => readSpecificOrder(row.order_id)}>
                                                        View
                                                    </Button>
                                                    <Button variant='btn btn-warning btn-sm me-2' onClick={() => handleShowUpdate(row)}>
                                                        Update
                                                    </Button>
                                                    <Button variant='btn btn-danger btn-sm me-2' onClick={() => deleteOrder(row.order_id)}>
                                                        Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Col>
            </Row>
            
            {/* VIEW SIZES */}
            <Modal className="glassmorphism text-white" show={showSizeModal} onHide={handleSizeModalClose} data-bs-theme='dark' size="xl">
                <Modal.Header className="modal-title">
                    <Modal.Title>Size Comparison Chart</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container" style={{justifyContent: 'center', alignContent: 'center'}}>
                        <Row>
                            <Col>
                                <Image src={picsizechart} alt="sizechart" style={{width: 700}} rounded fluid/>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col>
                                <Carousel>
                                    <Carousel.Item>
                                        <Image src={rcp1} style={{width: 700}} rounded fluid/>
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <Image src={rcp2} style={{width: 700}} rounded fluid/>
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <Image src={rcp3} style={{width: 700}} rounded fluid/>
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <Image src={rcp4} style={{width: 700}} rounded fluid/>
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <Image src={rcp5} style={{width: 700}} rounded fluid/>
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <Image src={rcp6} style={{width: 700}} rounded fluid/>
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <Image src={rcp7} style={{width: 700}} rounded fluid/>
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <Image src={rcp8} style={{width: 700}} rounded fluid/>
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <Image src={rcp9} style={{width: 700}} rounded fluid/>
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <Image src={rcp10} style={{width: 700}} rounded fluid/>
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <Image src={rcp11} style={{width: 700}} rounded fluid/>
                                    </Carousel.Item>
                                </Carousel>
                            </Col>
                        </Row>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleSizeModalClose}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL REGISTER */}
            <Modal className="glassmorphism text-white" show={show} onHide={handleClose} data-bs-theme='dark' centered>
                <Modal.Header className="modal-title">
                    <Modal.Title>Add Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group controlId="customerid">
                                    <Form.Label>Customer Name:</Form.Label>
                                    <Form.Select aria-label="Default select example" onChange={(event) => setCustomerId(event.target.value)}>
                                        <option style={{color: 'red'}} disabled selected>Select customer name</option>
                                        {customerNames.map((customerName, index) => (
                                            <option key={index} value={customerIds[index]}>{customerName}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="productid">
                                    <Form.Label>Ordered Product:</Form.Label>
                                    <Form.Select aria-label="Default select example" onChange={(event) => setProductId(event.target.value)}>
                                        <option style={{color: 'red'}} disabled selected>Select Product</option>
                                        {productNames.map((productName, index) => (
                                            <option key={index} value={productIds[index]}>{productName}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="quantity">
                                    <Form.Label>Quantity:</Form.Label>
                                    <Form.Control type="text" placeholder="Enter quantity" onChange={(event) => setOrderQuantity(event.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="status">
                                    <Form.Label>Order Status:</Form.Label>
                                    <Form.Select aria-label="Default select example" onChange={(event) => setOrderStatus(event.target.value)}>
                                        <option style={{color: 'red'}} disabled selected>Select Status</option>
                                        <option value="PAID">PAID</option>
                                        <option value="PENDING">PENDING</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="userid">
                                    <Form.Label>Processed by:</Form.Label>
                                    <Form.Select aria-label="Default select example" onChange={(event) => setUserId(event.target.value)}>
                                        <option style={{color: 'red'}} disabled selected>Select User</option>
                                        {userNames.map((userName, index) => (
                                            <option key={index} value={userIds[index]}>{userName}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="justify-content-between">
                    <Button className="mr-auto" variant="success" onClick={createOrder}>Submit</Button>
                    <Button variant="danger" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL VIEW */}
            <Modal className="glassmorphism text-white" show={showOrder} onHide={handleOrderClose} data-bs-theme='dark' centered>
                <Modal.Header className="modal-title">
                    <Modal.Title>View Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container"><br />
                        <table>
                            <tbody>
                                {Array.isArray(specificOrderData) && specificOrderData.map((defdata, index) => (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <th>Order ID</th>
                                            <td>{defdata.order_id || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <th>Customer Info</th>
                                            <td><strong>ID: </strong>{defdata.customer_id || 'N/A'}, <strong>Name: </strong>{customerNames[customerIds.indexOf(defdata.customer_id)] || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <th>Product Info</th>
                                            <td><strong>ID: </strong>{defdata.product_id || 'N/A'}, <strong>Product: </strong>{productNames[productIds.indexOf(defdata.product_id)] || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <th>Quantity</th>
                                            <td>{defdata.orderQuantity || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <th>Total Price</th>
                                            <td>{defdata.priceInTotal || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <th>Status</th>
                                            <td>{defdata.orderStatus || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <th>Processed By</th>
                                            <td><strong>ID: </strong>{defdata.user_id || 'N/A'}, <strong>Name: </strong>{userNames[userIds.indexOf(defdata.user_id)] || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <th>Ordered When</th>
                                            <td>{defdata.orderDatenTime}</td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleOrderClose}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL UPDATE */}
            <Modal className="glassmorphism text-white" show={showUpdate} onHide={handleCloseUpdate} data-bs-theme='dark' centered>
                <Modal.Header className="modal-title">
                    <Modal.Title>Update Customer Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group controlId="customerid">
                                    <Form.Label>Customer Name:</Form.Label>
                                    <Form.Select aria-label="Default select example" onChange={(event) => setCustomerId(event.target.value)} disabled>
                                        <option>{customerNames[customerIds.indexOf(updateOrder.customer_id)]}</option>
                                        {customerNames.map((customerName, index) => (
                                            <option key={index} value={customerIds[index]}>{customerName}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="productid">
                                    <Form.Label>Ordered Product:</Form.Label>
                                    <Form.Select aria-label="Default select example" onChange={(event) => setProductId(event.target.value)} disabled>
                                        <option>{productNames[productIds.indexOf(updateOrder.product_id)]}</option>
                                        {productNames.map((productName, index) => (
                                            <option key={index} value={productIds[index]}>{productName}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="quantity">
                                    <Form.Label>Order Quantity:</Form.Label>
                                    <Form.Control type="text" value={orderQuantity || updateOrder.orderQuantity} onChange={(event) => setOrderQuantity(event.target.value)} disabled/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="status">
                                    <Form.Label>Order Status:</Form.Label>
                                    <Form.Select aria-label="Default select example" value={orderStatus || updateOrder.orderStatus} onChange={(event) => setOrderStatus(event.target.value)}>
                                        <option style={{color: 'red'}} disabled selected>Select Status</option>
                                        <option value="PAID">PAID</option>
                                        <option value="PENDING">PENDING</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="userid">
                                    <Form.Label>Processed by:</Form.Label>
                                    <Form.Select aria-label="Default select example" onChange={(event) => setUserId(event.target.value)} disabled>
                                        <option>{userNames[userIds.indexOf(updateOrder.user_id)]}</option>
                                        {userNames.map((userName, index) => (
                                            <option key={index} value={userIds[index]}>{userName}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="justify-content-between">
                    <Button className="mr-auto" variant="warning" onClick={updateContent}>Update</Button>
                    <Button variant="danger" onClick={handleCloseUpdate}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Order;
