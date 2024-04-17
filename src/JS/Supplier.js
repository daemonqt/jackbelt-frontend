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

function Supplier() {
    const [suppliers, setSuppliers] = useState([]);
    const supplier = JSON.parse(localStorage.getItem('token'));
    const token = supplier.data.token;

    const headers = {
        accept: 'application/json',
        Authorization: token
    };

    //DISPLAY
    const fetchSuppliers = async () => {
        await axios.get(`${BACKEND_URL}/api/suppliers`, { headers: headers }).then(({ data }) => {
            setSuppliers(data);

        });
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    //CREATE
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [validationError, setValidationError] = useState({});

    const createSupplier = async (e) => {
        e.preventDefault();

        console.log(name);
        console.log(username);

        const formData = new FormData();

        formData.append('name', name);
        formData.append('username', username);

        await axios.post(`${BACKEND_URL}/api/supplier/register`, { name, username }, { headers: headers }).then(({ data }) => {
            Swal.fire({
                icon: "success",
                text: data.message
            });
            handleClose();
            fetchSuppliers();

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

    //DISPLAY SPECIFIC Supplier
    const [showSupplier, setShowSupplier] = useState(false);
    const [specificSupplierData, setSpecificSupplierData] = useState({});
    const handleSupplierClose = () => setShowSupplier(false);

    const readSpecificSupplier = (supplier_id) => {
        fetchSpecificSupplier(supplier_id);
    };

    const fetchSpecificSupplier = async (supplier_id) => {
        try {
            const { data } = await axios.get(`${BACKEND_URL}/api/supplier/${supplier_id}`, { headers: headers });
            setSpecificSupplierData(data);
            setShowSupplier(true);
        } catch (error) {
            console.error("Error fetching specific supplier data", error);
        }
    };

    //UPDATE
    const [showUpdate, setShowUpdate] = useState(false);
    const [updateSupplier, setUpdateSupplier] = useState({});

    const handleCloseUpdate = () => {
        setShowUpdate(false);
        setUpdateSupplier({});
    };

    const handleShowUpdate = (supplier) => {
        setUpdateSupplier(supplier);
        setShowUpdate(true);
        setName(supplier.name || "");
        setUsername(supplier.username || "");
    };

    const updateContent = async (e) => {
        e.preventDefault();

        const updatedSupplierData = {
            name,
            username
        };

        try {
            await axios.put(`${BACKEND_URL}/api/supplier/${updateSupplier.supplier_id}`, updatedSupplierData, { headers });

            Swal.fire({
                icon: "success",
                text: "Supplier updated successfully",
            });

            handleCloseUpdate();
            fetchSuppliers();
        } catch (error) {
            console.error("Error updating supplier data", error);

            if (error.response && error.response.status === 422) {
                setValidationError(error.response.data.errors);
            } else {
                Swal.fire({
                    text: "Error updating Supplier data",
                    icon: "error",
                });
            }
        }
    };

    //DELETE
    const deleteSupplier = async (supplier_id) => {
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

        await axios.delete(`${BACKEND_URL}/api/supplier/${supplier_id}`, { headers: headers }).then(({ data }) => {

            Swal.fire({
                icon: "success",
                text: "Succesfully Deleted"
            });
            fetchSuppliers();
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

    const filterSuppliers = () => {
        return suppliers.filter((supplier) =>
            supplier.supplier_id.toString().includes(searchInput.toLowerCase()) ||
            supplier.name.toLowerCase().includes(searchInput.toLowerCase()) ||
            supplier.username.toLowerCase().includes(searchInput.toLowerCase()) ||
            supplier.screation_date.toString().toLowerCase().includes(searchInput.toLowerCase())
        );
    };

    useEffect(() => {
        setSearchResults(filterSuppliers());
    }, [suppliers, searchInput]);

    return (
        <>
            <Navigationbar/>
            {/* Supplier UI */}
            <div className="container"><br />
                <div style={{ textAlign: 'center', alignSelf: 'center', justifyContent: "center", color: "white" }}>
                    <h2 className="title">SUPPLIERS</h2>
                </div>
                <div className="top-components">
                    <InputGroup size="sm" className="mb-2 searchbar">
                        <InputGroup.Text>Search</InputGroup.Text>
                        <Form.Control size="sm" type="search" placeholder="search table data" value={searchInput} onChange={handleSearchInputChange} className="me-2" aria-label="Search" />
                    </InputGroup>
                    <Button variant="btn btn-success btn-sm" onClick={handleShow}>+ Register Supplier</Button>
                </div>
                <Table className="mt-2 custom-table" striped bordered hover variant="dark" responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchResults.length > 0 &&
                            searchResults.map((row, key) => (
                                <tr key={key}>
                                    <td>{row.supplier_id || 'N/A'}</td>
                                    <td>{row.name || 'N/A'}</td>
                                    <td>{row.username || 'N/A'}</td>
                                    <td>{row.screation_date || 'N/A'}</td>
                                    <td>
                                        <Button variant='btn btn-primary btn-sm me-2' onClick={() => readSpecificSupplier(row.supplier_id)}>
                                            View
                                        </Button>
                                        <Button variant='btn btn-warning btn-sm me-2' onClick={() => handleShowUpdate(row)}>
                                            Update
                                        </Button>
                                        <Button variant='btn btn-danger btn-sm me-2' onClick={() => deleteSupplier(row.supplier_id)}>
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
                    <Modal.Title>Register Supplier</Modal.Title>
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
                    <Button className="mr-auto" variant="success" onClick={createSupplier}>Submit</Button>
                    <Button variant="danger" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL VIEW */}
            <Modal className="glassmorphism text-white" show={showSupplier} onHide={handleSupplierClose} data-bs-theme='dark' centered>
                <Modal.Header className="modal-title">
                    <Modal.Title>View Supplier</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container"><br />
                        <Table striped bordered hover>
                            <tbody>
                                {Array.isArray(specificSupplierData) && specificSupplierData.map((defdata, index) => (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td><strong>Supplier ID</strong></td>
                                            <td>{defdata.supplier_id || 'N/A'}</td>
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
                                            <td>{defdata.screation_date}</td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleSupplierClose}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL UPDATE */}
            <Modal className="glassmorphism text-white" show={showUpdate} onHide={handleCloseUpdate} data-bs-theme='dark' centered>
                <Modal.Header className="modal-title">
                    <Modal.Title>Update Supplier</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group controlId="Name">
                                    <Form.Label>Name:</Form.Label>
                                    <Form.Control type="text" value={name || updateSupplier.name} onChange={(event) => setName(event.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="Suppliername">
                                    <Form.Label>Suppliername:</Form.Label>
                                    <Form.Control type="text" value={username || updateSupplier.username} onChange={(event) => setUsername(event.target.value)} />
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

export default Supplier;