import React, { useEffect, useState } from "react";
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Swal from 'sweetalert2';
import "../CSS/Style.css";
import BACKEND_URL from './backendURL';
import Sidebar from "./Sidebar.js";

function Freshproduct() {
    const [freshproducts, setFreshproducts] = useState([]);
    const freshproduct = JSON.parse(localStorage.getItem('token'));
    const token = freshproduct.data.token;

    const headers = {
        accept: 'application/json',
        Authorization: token
    };

    //DISPLAY
    const fetchFreshproducts = async () => {
        await axios.get(`${BACKEND_URL}/api/fresh-products`, { headers: headers }).then(({ data }) => {
            setFreshproducts(data);

        });
    };

    //for form dropdown
    const [productIds, setProductIds] = useState([]);
    const [userIds, setUserIds] = useState([]);

    const [productNames, setProductNames] = useState([]);
    const [userNames, setUserNames] = useState([]);


    useEffect(() => {
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

        // Fetch fresh products data
        fetchFreshproducts();
    }, []);
    

    //CREATE
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [product_id, setProductId] = useState("");
    const [freshproductQuantity, setFreshproductQuantity] = useState("")
    const [user_id, setUserId] = useState("")
    const [validationError, setValidationError] = useState({});

    const createFreshproduct = async (e) => {
        e.preventDefault();

        console.log(product_id);
        console.log(freshproductQuantity);
        console.log(user_id);

        const formData = new FormData();

        formData.append('product_id', product_id);
        formData.append('freshproductQuantity', freshproductQuantity);
        formData.append('user_id', user_id);

        await axios.post(`${BACKEND_URL}/api/fresh-products/register`, { product_id, freshproductQuantity, user_id }, { headers: headers }).then(({ data }) => {
            Swal.fire({
                icon: "success",
                text: data.message
            });
            handleClose();
            fetchFreshproducts();

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

    //DISPLAY SPECIFIC USER
    const [showFreshproduct, setShowFreshproduct] = useState(false);
    const [specificFreshproductData, setSpecificFreshproductData] = useState([]);
    const handleFreshproductClose = () => setShowFreshproduct(false);

    const readSpecificFreshproduct = (freshproduct_id) => {
        fetchSpecificFreshproduct(freshproduct_id);
    };

    const fetchSpecificFreshproduct = async (freshproduct_id) => {
        await axios.get(`${BACKEND_URL}/api/fresh-products/${freshproduct_id}`, { headers: headers }).then(({ data }) => {
            setSpecificFreshproductData(data);
            setShowFreshproduct(true);
        });
    };

    // //UPDATE
    // const [showUpdate, setShowUpdate] = useState(false);
    // const [updateFreshproduct, setUpdateFreshproduct] = useState({});

    // const handleCloseUpdate = () => {
    //     setShowUpdate(false);
    //     setUpdateFreshproduct({});
    // };

    // const handleShowUpdate = (freshproducts) => {
    //     setUpdateFreshproduct(freshproducts);
    //     setShowUpdate(true);
    //     setProductId(freshproducts.product_id || "");
    //     setFreshproductQuantity(freshproducts.freshproductQuantity || "");
    //     setUserId(freshproducts.user_id || "");
    // };

    // const updateContent = async (e) => {
    //     e.preventDefault();

    //     const updatedFreshproductData = {
    //         product_id,
    //         freshproductQuantity,
    //         user_id,
    //     };

    //     try {
    //         await axios.put(`${BACKEND_URL}/api/fresh-products/${updateFreshproduct.freshproduct_id}`, updatedFreshproductData, { headers });

    //         Swal.fire({
    //             icon: "success",
    //             text: "Fresh product updated successfully",
    //         });

    //         handleCloseUpdate();
    //         fetchFreshproducts();
    //     } catch (error) {
    //         console.error("Error updating fresh product data", error);

    //         if (error.response && error.response.status === 422) {
    //             setValidationError(error.response.data.errors);
    //         } else {
    //             Swal.fire({
    //                 text: "Error updating fresh product data",
    //                 icon: "error",
    //             });
    //         }
    //     }
    // };

    //DELETE
    const deleteFreshproduct = async (freshproduct_id) => {
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

        await axios.delete(`${BACKEND_URL}/api/fresh-products/${freshproduct_id}`, { headers: headers }).then(({ data }) => {

            Swal.fire({
                icon: "success",
                text: "Succesfully Deleted"
            });
            fetchFreshproducts();
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

    const productIdToNameMap = productIds.reduce((map, id, index) => {
        map[id] = productNames[index];
        return map;
    }, {});

    const userIdToNameMap = userIds.reduce((map, id, index) => {
        map[id] = userNames[index];
        return map;
    }, {});

    const filterFreshproducts = () => {
        return freshproducts.filter((freshproduct) => {
            const productName = productIdToNameMap[freshproduct.product_id] || '';
            const userName = userIdToNameMap[freshproduct.user_id] || '';
            return (
                freshproduct.freshproduct_id.toString().includes(searchInput.toLowerCase()) ||
                freshproduct.product_id.toString().includes(searchInput.toLowerCase()) ||
                productName.toLowerCase().includes(searchInput.toLowerCase()) ||
                freshproduct.freshproductQuantity.toString().includes(searchInput.toLowerCase()) ||
                freshproduct.user_id.toString().includes(searchInput.toLowerCase()) ||
                userName.toLowerCase().includes(searchInput.toLowerCase()) ||
                freshproduct.dateManufactured.toString().toLowerCase().includes(searchInput.toLowerCase())
            );
        });
    };

    useEffect(() => {
        setSearchResults(filterFreshproducts());
    }, [freshproducts, searchInput]);

    return (
        <Container fluid>
            <Row>
                <Col sm={2}>
                    <Sidebar/>
                </Col>
                <Col>
                    {/* Freshproduct UI */}
                    <div className="container"><br />
                        <div className="top-components">
                            <div className="searchbar-container">
                                <InputGroup size="sm" className="searchbar">
                                    <InputGroup.Text>Search</InputGroup.Text>
                                    <Form.Control size="sm" type="search" placeholder="search table data" value={searchInput} onChange={handleSearchInputChange} className="input-data" aria-label="Search" />
                                </InputGroup>
                            </div>
                            <div className="button-container">
                                <Button variant="btn btn-success btn-sm" onClick={handleShow}>+ Add Fresh product</Button>
                            </div>
                        </div>
                        <div className="table-container">
                            <table className="mt-2 text-center">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Listed by</th>
                                        <th>Manufactured When</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchResults.length > 0 &&
                                        searchResults.map((row, key) => (
                                            <tr key={key}>
                                                <td>{row.freshproduct_id || 'N/A'}</td>
                                                <td>{productNames[productIds.indexOf(row.product_id)] || 'N/A'}</td>
                                                <td>{row.freshproductQuantity || 'N/A'}</td>
                                                <td>{userNames[userIds.indexOf(row.user_id)] || 'N/A'}</td>
                                                <td>{row.dateManufactured || 'N/A'}</td>
                                                <td>
                                                    <Button variant='btn btn-primary btn-sm me-2' onClick={() => readSpecificFreshproduct(row.freshproduct_id)}>
                                                        View
                                                    </Button>
                                                    {/* <Button variant='btn btn-warning btn-sm me-2' onClick={() => handleShowUpdate(row)}>
                                                        Update
                                                    </Button> */}
                                                    <Button variant='btn btn-danger btn-sm me-2' onClick={() => deleteFreshproduct(row.freshproduct_id)}>
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

            {/* MODAL REGISTER */}
            <Modal className="glassmorphism text-white" show={show} onHide={handleClose} data-bs-theme='dark' centered>
                <Modal.Header className="modal-title">
                    <Modal.Title>Add Fresh Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group controlId="productid">
                                    <Form.Label>Product:</Form.Label>
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
                                    <Form.Control type="text" placeholder="Enter quantity" onChange={(event) => setFreshproductQuantity(event.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="userid">
                                    <Form.Label>Listed by:</Form.Label>
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
                    <Button className="mr-auto" variant="success" onClick={createFreshproduct}>Submit</Button>
                    <Button variant="danger" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL VIEW */}
            <Modal className="glassmorphism text-white" show={showFreshproduct} onHide={handleFreshproductClose} data-bs-theme='dark' centered>
                <Modal.Header className="modal-title">
                    <Modal.Title>View Fresh Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container"><br />
                        <table>
                            <tbody>
                                {Array.isArray(specificFreshproductData) && specificFreshproductData.map((defdata, index) => (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <th>Freshproduct ID</th>
                                            <td>{defdata.freshproduct_id || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <th>Product Info</th>
                                            <td><strong>ID: </strong>{defdata.product_id || 'N/A'}, <strong>Product: </strong>{productNames[productIds.indexOf(defdata.product_id)] || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <th>Quantity</th>
                                            <td>{defdata.freshproductQuantity || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <th>Listed By</th>
                                            <td><strong>ID: </strong>{defdata.user_id || 'N/A'}, <strong>Name: </strong>{userNames[userIds.indexOf(defdata.user_id)] || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <th>Manufactured When</th>
                                            <td>{defdata.dateManufactured || 'N/A'}</td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleFreshproductClose}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL UPDATE */}
            {/* <Modal className="glassmorphism text-white" show={showUpdate} onHide={handleCloseUpdate} data-bs-theme='dark' centered>
                <Modal.Header className="modal-title">
                    <Modal.Title>Update Fresh Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group controlId="productid">
                                    <Form.Label>Product:</Form.Label>
                                    <Form.Select aria-label="Default select example" onChange={(event) => setProductId(event.target.value)} disabled>
                                        <option>{productNames[productIds.indexOf(updateFreshproduct.product_id)]}</option>
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
                                    <Form.Control type="text" value={freshproductQuantity || updateFreshproduct.freshproductQuantity} onChange={(event) => setFreshproductQuantity(event.target.value)} disabled/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="userid">
                                    <Form.Label>Listed by:</Form.Label>
                                    <Form.Select aria-label="Default select example" onChange={(event) => setUserId(event.target.value)} disabled>
                                        <option>{userNames[userIds.indexOf(updateFreshproduct.user_id)]}</option>
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
            </Modal> */}
        </Container>
    );
}

export default Freshproduct;
