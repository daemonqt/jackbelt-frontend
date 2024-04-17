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

function Product() {
    const [products, setProducts] = useState([]);
    const product = JSON.parse(localStorage.getItem('token'));
    const token = product.data.token;

    const headers = {
        accept: 'application/json',
        Authorization: token
    };

    //DISPLAY
    const fetchProducts = async () => {
        await axios.get(`${BACKEND_URL}/api/products`, { headers: headers }).then(({ data }) => {
            setProducts(data);

        });
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    //CREATE
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [productName, setProductName] = useState("");
    const [productCode, setProductCode] = useState("");
    const [productQuantity, setProductQuantity] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [validationError, setValidationError] = useState({});

    const createProduct = async (e) => {
        e.preventDefault();
    
        console.log(productName);
        console.log(productCode);
        console.log(productQuantity);
        console.log(productPrice);

        const formData = new FormData();

        formData.append('productName', productName);
        formData.append('productCode', productCode);
        formData.append('productQuantity', productQuantity);
        formData.append('productPrice', productPrice);
    
        await axios.post(`${BACKEND_URL}/api/product/register`, { productName, productCode, productQuantity, productPrice }, { headers: headers }).then(({ data }) => {
            Swal.fire({
                icon: "success",
                text: data.message
            });
            handleClose();
            fetchProducts();

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

    //DISPLAY SPECIFIC Product
    const [showProduct, setShowProduct] = useState(false);
    const [specificProductData, setSpecificProductData] = useState({});
    const handleProductClose = () => setShowProduct(false);

    const readSpecificProduct = (product_id) => {
        fetchSpecificProduct(product_id);
    };

    const fetchSpecificProduct = async (product_id) => {
        await axios.get(`${BACKEND_URL}/api/product/${product_id}`, { headers: headers }).then(({ data }) => {
            setSpecificProductData(data);
            setShowProduct(true);
        });
    };

    //UPDATE
    const [showUpdate, setShowUpdate] = useState(false);
    const [updateProduct, setUpdateProduct] = useState({});

    const handleCloseUpdate = () => {
        setShowUpdate(false);
        setUpdateProduct({});
    };

    const handleShowUpdate = (product) => {
        setUpdateProduct(product);
        setShowUpdate(true);
        setProductName(product.productName || "");
        setProductCode(product.productCode || "");
        setProductQuantity(product.productQuantity || "");
        setProductPrice(product.productPrice || "");
    };

    const updateContent = async (e) => {
        e.preventDefault();

        const updatedProductData = {
            productName,
            productCode,
            productQuantity,
            productPrice,
        };

        try {
            await axios.put(`${BACKEND_URL}/api/product/${updateProduct.product_id}`, updatedProductData, { headers });

            Swal.fire({
                icon: "success",
                text: "Product updated successfully",
            });

            handleCloseUpdate();
            fetchProducts();
        } catch (error) {
            console.error("Error updating product data", error);

            if (error.response && error.response.status === 422) {
                setValidationError(error.response.data.errors);
            } else {
                Swal.fire({
                    text: "Error updating product data",
                    icon: "error",
                });
            }
        }
    };

    //DELETE
    const deleteProduct = async (product_id) => {
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

        await axios.delete(`${BACKEND_URL}/api/product/${product_id}`, { headers: headers }).then(({ data }) => {

            Swal.fire({
                icon: "success",
                text: "Succesfully Deleted"
            });
            fetchProducts();
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

    const filterProducts = () => {
        return products.filter((product) =>
            product.product_id.toString().includes(searchInput.toLowerCase()) ||
            product.productName.toLowerCase().includes(searchInput.toLowerCase()) ||
            product.productCode.toLowerCase().includes(searchInput.toLowerCase()) ||
            product.productQuantity.toString().includes(searchInput.toLowerCase()) ||
            product.productPrice.toString().includes(searchInput.toLowerCase()) ||
            product.pcreation_date.toString().toLowerCase().includes(searchInput.toLowerCase())
        );
    };

    useEffect(() => {
        setSearchResults(filterProducts());
    }, [products, searchInput]);

    return (
        <>
            <Navigationbar/>
            {/* Product UI */}
            <div className="container"><br />
                <div style={{ textAlign: 'center', alignSelf: 'center', justifyContent: "center", color: "white" }}>
                    <h2 className="title">PRODUCTS</h2>
                </div>
                <div className="top-components">
                    <InputGroup size="sm" className="mb-2 searchbar">
                        <InputGroup.Text>Search</InputGroup.Text>
                        <Form.Control size="sm" type="search" placeholder="search table data" value={searchInput} onChange={handleSearchInputChange} className="me-2" aria-label="Search" />
                    </InputGroup>
                    <Button variant="btn btn-success btn-sm" onClick={handleShow}>+ Register Product</Button>
                </div>
                <Table className="mt-2 custom-table" striped bordered hover variant="dark" responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Product</th>
                            <th>Code</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Created/Updated When</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchResults.length > 0 &&
                            searchResults.map((row, key) => (
                                <tr key={key}>
                                    <td>{row.product_id || 'N/A'}</td>
                                    <td>{row.productName || 'N/A'}</td>
                                    <td>{row.productCode || 'N/A'}</td>
                                    <td>{row.productQuantity || 'N/A'}</td>
                                    <td>{row.productPrice || 'N/A'}</td>
                                    <td>{row.pcreation_date || 'N/A'}</td>
                                    <td>
                                        <Button variant='btn btn-primary btn-sm me-2' onClick={() => readSpecificProduct(row.product_id)}>
                                            View
                                        </Button>
                                        <Button variant='btn btn-warning btn-sm me-2' onClick={() => handleShowUpdate(row)}>
                                            Update
                                        </Button>
                                        <Button variant='btn btn-danger btn-sm me-2' onClick={() => deleteProduct(row.product_id)}>
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
                    <Modal.Title>Register Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group controlId="Product">
                                    <Form.Label>Product:</Form.Label>
                                    <Form.Control type="text" placeholder="Enter product name" onChange={(event) => setProductName(event.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="Code">
                                    <Form.Label>Code:</Form.Label>
                                    <Form.Control type="text" placeholder="Enter product code" onChange={(event) => setProductCode(event.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="Quantity">
                                    <Form.Label>Quantity:</Form.Label>
                                    <Form.Control type="text" placeholder="Enter quantity" onChange={(event) => setProductQuantity(event.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="Price">
                                    <Form.Label>Price:</Form.Label>
                                    <Form.Control type="text" placeholder="Enter price" onChange={(event) => setProductPrice(event.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="justify-content-between">
                    <Button className="mr-auto" variant="success" onClick={createProduct}>Submit</Button>
                    <Button variant="danger" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL VIEW */}
            <Modal className="glassmorphism text-white" show={showProduct} onHide={handleProductClose} data-bs-theme='dark' centered>
                <Modal.Header className="modal-title">
                    <Modal.Title>View Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container"><br />
                        <Table striped bordered hover>
                            <tbody>
                                {Array.isArray(specificProductData) && specificProductData.map((defdata, index) => (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td><strong>Product ID</strong></td>
                                            <td>{defdata.product_id || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Product</strong></td>
                                            <td>{defdata.productName || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Code</strong></td>
                                            <td>{defdata.productCode || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Quantity</strong></td>
                                            <td>{defdata.productQuantity || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Price</strong></td>
                                            <td>{defdata.productPrice || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Created/Updated When</strong></td>
                                            <td>{defdata.pcreation_date}</td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleProductClose}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL UPDATE */}
            <Modal className="glassmorphism text-white" show={showUpdate} onHide={handleCloseUpdate} data-bs-theme='dark' centered>
                <Modal.Header className="modal-title">
                    <Modal.Title>Update Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group controlId="Product">
                                    <Form.Label>Product:</Form.Label>
                                    <Form.Control type="text" value={productName || updateProduct.productName} onChange={(event) => setProductName(event.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="Code">
                                    <Form.Label>Code:</Form.Label>
                                    <Form.Control type="text" value={productCode || updateProduct.productCode} onChange={(event) => setProductCode(event.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="Quantity">
                                    <Form.Label>Quantity:</Form.Label>
                                    <Form.Control type="text" value={productQuantity || updateProduct.productQuantity} onChange={(event) => setProductQuantity(event.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="Price">
                                    <Form.Label>Price:</Form.Label>
                                    <Form.Control type="text" value={productPrice || updateProduct.productPrice} onChange={(event) => setProductPrice(event.target.value)} />
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

export default Product;