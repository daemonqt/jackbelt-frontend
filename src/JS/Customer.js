import React, { useEffect, useState } from "react";
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Navigationbar from "./Navbar";
import Swal from 'sweetalert2';
import "../CSS/Style.css";
import BACKEND_URL from './backendURL';

function Customer() {
    const [customers, setCustomers] = useState([]);
    const customer = JSON.parse(localStorage.getItem('token'));
    const token = customer.data.token;

    const headers = {
        accept: 'application/json',
        Authorization: token
    };

    //DISPLAY
    const fetchCustomers = async () => {
        await axios.get(`${BACKEND_URL}/api/customers`, { headers: headers }).then(({ data }) => {
            setCustomers(data);

        });
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    //CREATE
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [validationError, setValidationError] = useState({});

    const createCustomer = async (e) => {
        e.preventDefault();

        console.log(name);
        console.log(username);

        const formData = new FormData();

        formData.append('name', name);
        formData.append('username', username);

        await axios.post(`${BACKEND_URL}/api/customer/register`, { name, username }, { headers: headers }).then(({ data }) => {
            Swal.fire({
                icon: "success",
                text: data.message
            });
            handleClose();
            fetchCustomers();

        }).catch(({ response }) => {
            if (response.status === 422) {
                setValidationError(response.data.errors);
            } else {
                Swal.fire({
                    // text: response.data.message,
                    title: 'Username already exist',
                    icon: 'error',
                    text: 'Try again'
                });
            }
        });
    };

    //DISPLAY SPECIFIC Customer
    const [showCustomer, setShowCustomer] = useState(false);
    const [specificCustomerData, setSpecificCustomerData] = useState({});
    const handleCustomerClose = () => setShowCustomer(false);

    const readSpecificCustomer = (customer_id) => {
        fetchSpecificCustomer(customer_id);
    };

    const fetchSpecificCustomer = async (customer_id) => {
        try {
            const { data } = await axios.get(`${BACKEND_URL}/api/customer/${customer_id}`, { headers: headers });
            setSpecificCustomerData(data);
            setShowCustomer(true);
        } catch (error) {
            console.error("Error fetching specific customer data", error);
        }
    };

    //UPDATE
    const [showUpdate, setShowUpdate] = useState(false);
    const [updateCustomer, setUpdateCustomer] = useState({});

    const handleCloseUpdate = () => {
        setShowUpdate(false);
        setUpdateCustomer({});
    };

    const handleShowUpdate = (customer) => {
        setUpdateCustomer(customer);
        setShowUpdate(true);
        setName(customer.name || "");
        setUsername(customer.username || "");
    };

    const updateContent = async (e) => {
        e.preventDefault();

        const updatedCustomerData = {
            name,
            username
        };

        try {
            await axios.put(`${BACKEND_URL}/api/customer/${updateCustomer.customer_id}`, updatedCustomerData, { headers });

            Swal.fire({
                icon: "success",
                text: "Customer updated successfully",
            });

            handleCloseUpdate();
            fetchCustomers();
        } catch (error) {
            console.error("Error updating customer data", error);

            if (error.response && error.response.status === 422) {
                setValidationError(error.response.data.errors);
            } else {
                Swal.fire({
                    text: "Error updating Customer data",
                    icon: "error",
                });
            }
        }
    };

    //DELETE
    const deleteCustomer = async (customer_id) => {
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

        await axios.delete(`${BACKEND_URL}/api/customer/${customer_id}`, { headers: headers }).then(({ data }) => {

            Swal.fire({
                icon: "success",
                text: "Succesfully Deleted"
            });
            fetchCustomers();
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

    const filterCustomers = () => {
        return customers.filter((customer) =>
            customer.customer_id.toString().includes(searchInput.toLowerCase()) ||
            customer.name.toLowerCase().includes(searchInput.toLowerCase()) ||
            customer.username.toLowerCase().includes(searchInput.toLowerCase()) ||
            customer.ccreation_date.toString().toLowerCase().includes(searchInput.toLowerCase())
        );
    };

    useEffect(() => {
        setSearchResults(filterCustomers());
    }, [customers, searchInput]);

    return (
        <>
            <Navigationbar/>
            {/* Customer UI */}
            <div className="container"><br />
                <div style={{ textAlign: 'center', alignSelf: 'center', justifyContent: "center", color: "white" }}>
                    <h2 className="title">CUSTOMERS</h2>
                </div>
                <div className="top-components">
                    <InputGroup size="sm" className="mb-2 searchbar">
                        <InputGroup.Text>Search</InputGroup.Text>
                        <Form.Control size="sm" type="search" placeholder="search table data" value={searchInput} onChange={handleSearchInputChange} className="me-2" aria-label="Search" />
                    </InputGroup>
                    <Button variant="btn btn-success btn-sm" onClick={handleShow}>+ Register Customer</Button>
                </div>
                <Table className="mt-2 custom-table" striped bordered hover variant="dark" responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Created/Updated When</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchResults.length > 0 &&
                            searchResults.map((row, key) => (
                                <tr key={key}>
                                    <td>{row.customer_id || 'N/A'}</td>
                                    <td>{row.name || 'N/A'}</td>
                                    <td>{row.username || 'N/A'}</td>
                                    <td>{row.ccreation_date || 'N/A'}</td>
                                    <td>
                                        <Button variant='btn btn-primary btn-sm me-2' onClick={() => readSpecificCustomer(row.customer_id)}>
                                            View
                                        </Button>
                                        <Button variant='btn btn-warning btn-sm me-2' onClick={() => handleShowUpdate(row)}>
                                            Update
                                        </Button>
                                        <Button variant='btn btn-danger btn-sm me-2' onClick={() => deleteCustomer(row.customer_id)}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </div>

            {/* MODAL REGISTER */}
            <Modal className="glassmorphism text-white" show={show} onHide={handleClose} data-bs-theme='dark' centered>
                <Modal.Header className="modal-title">
                    <Modal.Title>Register Customer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group controlId="Name">
                                    <Form.Label>Name:</Form.Label>
                                    <Form.Control type="text" placeholder="Enter fullname" onChange={(event) => setName(event.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="Username">
                                    <Form.Label>Username:</Form.Label>
                                    <Form.Control type="text" placeholder="Enter username" onChange={(event) => setUsername(event.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="justify-content-between">
                    <Button className="mr-auto" variant="success" onClick={createCustomer}>Submit</Button>
                    <Button variant="danger" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL VIEW */}
            <Modal className="glassmorphism text-white" show={showCustomer} onHide={handleCustomerClose} data-bs-theme='dark' centered>
                <Modal.Header className="modal-title">
                    <Modal.Title>View Customer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container"><br />
                        <Table striped bordered hover>
                            <tbody>
                                {Array.isArray(specificCustomerData) && specificCustomerData.map((defdata, index) => (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td><strong>Customer ID</strong></td>
                                            <td>{defdata.customer_id || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Name</strong></td>
                                            <td>{defdata.name || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>username</strong></td>
                                            <td>{defdata.username || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Created/Updated When</strong></td>
                                            <td>{defdata.ccreation_date}</td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleCustomerClose}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL UPDATE */}
            <Modal className="glassmorphism text-white" show={showUpdate} onHide={handleCloseUpdate} data-bs-theme='dark' centered>
                <Modal.Header className="modal-title">
                    <Modal.Title>Update Customer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group controlId="Name">
                                    <Form.Label>Name:</Form.Label>
                                    <Form.Control type="text" value={name || updateCustomer.name} onChange={(event) => setName(event.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="Customername">
                                    <Form.Label>Customername:</Form.Label>
                                    <Form.Control type="text" value={username || updateCustomer.username} onChange={(event) => setUsername(event.target.value)} />
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
        </>
    );
}

export default Customer;