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
import Sidebar from "./Sidebar";
import html2pdf from 'html2pdf.js/dist/html2pdf.min.js';

function Product() {
    const [products, setProducts] = useState([]);
    const [enableEditing, setEnableEditing] = useState(true);
    const [generateReportEnabled, setGenerateReportEnabled] = useState(false);
    const [inventoryFinalized, setInventoryFinalized] = useState(false);
    const product = JSON.parse(localStorage.getItem('token'));
    const token = product.data.token;

    const headers = {
        accept: 'application/json',
        Authorization: token
    };

    const handleFinalizeInventory = () => {
        setInventoryFinalized(true);
        setEnableEditing(false);
        setGenerateReportEnabled(true);
    };
    
    const handleEnableEditing = () => {
        setInventoryFinalized(false);
        setEnableEditing(true);
        setGenerateReportEnabled(false);
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

    const [showAlertModal, setShowAlertModal] = useState(false);
    const handleCloseAlertModal = () => setShowAlertModal(false);
    const handleShowAlertModal = () => setShowAlertModal(true);

    const [alertThresholds, setAlertThresholds] = useState({
        inStock: 1000,
        lowStock: 100,
        outOfStock: 0,
        overstock: 1001
    });

    const handleThresholdChange = (event, key) => {
        const { value } = event.target;
        setAlertThresholds(prevState => ({
            ...prevState,
            [key]: parseInt(value, 10)
        }));
    };

    const handleSaveInvAlert = () => {
        // Validation checks
        if (alertThresholds.inStock <= alertThresholds.lowStock) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'In stock must be greater than low stock.',
            });
            return;
        }

        if (alertThresholds.lowStock >= alertThresholds.inStock || alertThresholds.lowStock <= alertThresholds.outOfStock) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Low stock must be less than in stock and greater than out of stock.',
            });
            return;
        }

        if (alertThresholds.overstock <= alertThresholds.inStock) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Overstock must be greater than in stock.',
            });
            return;
        }

        setAlertThresholds(alertThresholds);
        handleCloseAlertModal();
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'All thresholds are valid and saved successfully.',
        });
    };


    const getStockStatus = (quantity) => {
        if (quantity >= alertThresholds.overstock) return 'Overstock';
        if (quantity <= alertThresholds.outOfStock) return 'Out of Stock';
        if (quantity <= alertThresholds.lowStock) return 'Low Stock';
        return 'In Stock';
    };
    const getBackgroundColor = (quantity) => {
        if (quantity >= alertThresholds.overstock) return 'orange';
        if (quantity <= alertThresholds.outOfStock) return 'red';
        if (quantity <= alertThresholds.lowStock) return 'yellow';
        return 'green';
    };

    const saveInventoryReportAsPDF = () => {
        const element = document.querySelector('.inventory-report-table');
        const currentDateTime = new Date().toLocaleString(); // Get the current date and time
    
        const header = `
            <div style="text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 10px; margin-top: 10px;">
                Inventory & Sales Report
            </div>
        `;
    
        const style = `
            <style>
                .inventory-report-table thead, tbody, tfoot, tr, td, th {
                    border-color: #000;
                    border-style: solid;
                    border-width: 1px;
                }
                .inventory-report-table th {
                    font-size: 15px;
                    font-weight: bold;
                    background-color: #969696;
                    color: #000;
                }
                .inventory-report-table td {
                    font-size: 15px;
                    font-weight: normal;
                    color: #000;
                }
            </style>
        `;

        const footer = `
            <div style="text-align: center; font-size: 18px; font-weight: normal; font-style: italic; margin-bottom: 10px; margin-top: 10px;">
                Inventory & Sales Report as of ${currentDateTime}
            </div>
        `;
    
        const htmlContent = header + style + element.outerHTML + footer;
        html2pdf().from(htmlContent).save();
    };

    // Fetch inventory report data
    const [showInventory, setShowInventory] = useState(false);
    const [inventoryReport, setInventoryReport] = useState([]);
    const handleInventoryClose = () => setShowInventory(false);

    const fetchInventoryReport = async () => {
        try {
            const product = JSON.parse(localStorage.getItem('token'));
            const token = product?.data?.token;

            const response = await axios.get(`${BACKEND_URL}/api/inventory-report`, {
                headers: {
                    Authorization: token
                }
            });
            setInventoryReport(response.data);
            setShowInventory(true);
        } catch (error) {
            console.error('Error fetching inventory report:', error);
            if (error.response && error.response.status === 422) {
                setValidationError(error.response.data.errors);
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to fetch inventory report. Please try again later.',
                    icon: 'error'
                });
            }
        }
    };

    //handle "Generate Inventory Report"
    const handleGenerateInventoryReport = () => {
        fetchInventoryReport();
    };

    const getCurrentDateTime = () => {
        const now = new Date();
        return now.toLocaleString();
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
        <Container fluid>
            <Row>
                <Col sm={2}>
                    <Sidebar/>
                </Col>
                <Col>
                    {/* Product UI */}
                    <div className="container"><br />
                        <div className="top-components">
                            <div className="searchbar-container">
                                <InputGroup size="sm" className="searchbar">
                                    <InputGroup.Text>Search</InputGroup.Text>
                                    <Form.Control size="sm" type="search" placeholder="search table data" value={searchInput} onChange={handleSearchInputChange} className="input-data" aria-label="Search" />
                                </InputGroup>
                            </div>
                            <div className="button-container">
                                <Button
                                    variant="info"
                                    onClick={handleShowAlertModal}
                                    size="sm"
                                    className="me-2">
                                    Set Inventory Alert
                                </Button>
                                <Button
                                    variant={!inventoryFinalized ? 'primary' : 'outline-primary'}
                                    onClick={handleFinalizeInventory}
                                    disabled={inventoryFinalized}
                                    size="sm"
                                    className="me-2">
                                    Finalize Inventory
                                </Button>
                                <Button
                                    variant={generateReportEnabled ? 'primary' : 'outline-primary'}
                                    onClick={handleGenerateInventoryReport}
                                    disabled={!generateReportEnabled}
                                    size="sm"
                                    className="me-2">
                                    Inventory & Sales Report
                                </Button>
                                <Button
                                    variant={inventoryFinalized ? 'success' : 'outline-success'}
                                    onClick={handleEnableEditing}
                                    disabled={!inventoryFinalized}
                                    size="sm"
                                    className="me-2">
                                    Enable Editing
                                </Button>
                                <Button
                                    variant={enableEditing ? 'success' : 'outline-success'}
                                    onClick={handleShow}
                                    disabled={!enableEditing}
                                    size="sm">
                                    + Add Product
                                </Button>
                            </div>
                        </div>
                        <div className="table-container">
                            <table className="mt-2 text-center">
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
                                                    <Button
                                                        variant={enableEditing ? 'warning' : 'outline-warning'}
                                                        size="sm"
                                                        onClick={() => handleShowUpdate(row)}
                                                        disabled={!enableEditing}
                                                        className="me-2">
                                                        Update
                                                    </Button>
                                                    <Button
                                                        variant={enableEditing ? 'danger' : 'outline-danger'}
                                                        size="sm"
                                                        onClick={() => deleteProduct(row.product_id)}
                                                        disabled={!enableEditing}
                                                        className="me-2">
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

            {/* MODAL INVREPORT */}
            <Modal className="glassmorphism text-white inventory-modal" show={showInventory} onHide={handleInventoryClose} data-bs-theme='dark' size="xl">
                <Modal.Header className="modal-title">
                    <Modal.Title>Inventory & Sales Report as of {getCurrentDateTime()}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <table className="inventory-report-table text-center">
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Product Code</th>
                                    <th>Price</th>
                                    <th>Current Quantity</th>
                                    <th>Total Sold</th>
                                    <th>Total Quantity</th>
                                    <th>Product Revenue</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventoryReport.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.productName}</td>
                                        <td>{item.productCode}</td>
                                        <td>{item.productPrice}</td>
                                        <td>{item.productQuantity}</td>
                                        <td>{item.orderQuantity}</td>
                                        <td>{item.totalQuantity}</td>
                                        <td>{item.productRevenue}</td>
                                        <td style={{ backgroundColor: getBackgroundColor(item.productQuantity) }}>
                                            {getStockStatus(item.productQuantity)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={saveInventoryReportAsPDF}>Save as PDF</Button>
                    <Button variant="danger" onClick={handleInventoryClose}>Close</Button>
                </Modal.Footer>
            </Modal>

            <Modal className="glassmorphism text-white" show={showAlertModal} onHide={handleCloseAlertModal} data-bs-theme='dark' centered>
                <Modal.Header className="modal-title">
                    <Modal.Title>Set Inventory Alert Thresholds</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="inStockThreshold">
                            <Form.Label>In Stock Threshold:</Form.Label>
                            <Form.Control
                                type="text"
                                value={alertThresholds.inStock}
                                onChange={(event) => handleThresholdChange(event, 'inStock')}
                            />
                        </Form.Group>
                        <Form.Group controlId="lowStockThreshold">
                            <Form.Label>Low Stock Threshold:</Form.Label>
                            <Form.Control
                                type="text"
                                value={alertThresholds.lowStock}
                                onChange={(event) => handleThresholdChange(event, 'lowStock')}
                            />
                        </Form.Group>
                        <Form.Group controlId="outOfStockThreshold">
                            <Form.Label>Out of Stock Threshold:</Form.Label>
                            <Form.Control
                                type="text"
                                value={alertThresholds.outOfStock}
                                onChange={(event) => handleThresholdChange(event, 'outOfStock')}
                            />
                        </Form.Group>
                        <Form.Group controlId="overstockThreshold">
                            <Form.Label>Overstock Threshold:</Form.Label>
                            <Form.Control
                                type="text"
                                value={alertThresholds.overstock}
                                onChange={(event) => handleThresholdChange(event, 'overstock')}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="justify-content-between">
                    <Button variant="success" onClick={handleSaveInvAlert}>Save</Button>
                    <Button variant="danger" onClick={handleCloseAlertModal}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL REGISTER */}
            <Modal className="glassmorphism text-white" show={show} onHide={handleClose} data-bs-theme='dark' centered>
                <Modal.Header className="modal-title">
                    <Modal.Title>Add Product</Modal.Title>
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
                        <table>
                            <tbody>
                                {Array.isArray(specificProductData) && specificProductData.map((defdata, index) => (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <th>Product ID</th>
                                            <td>{defdata.product_id || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <th>Product</th>
                                            <td>{defdata.productName || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <th>Code</th>
                                            <td>{defdata.productCode || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <th>Quantity</th>
                                            <td>{defdata.productQuantity || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <th>Price</th>
                                            <td>{defdata.productPrice || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <th>Created/Updated When</th>
                                            <td>{defdata.pcreation_date}</td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
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
        </Container>
    );
}

export default Product;