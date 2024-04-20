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

function Purchase() {
    const [purchases, setPurchases] = useState([]);
    const purchase = JSON.parse(localStorage.getItem('token'));
    const token = purchase.data.token;

    const headers = {
        accept: 'application/json',
        Authorization: token
    };

    //DISPLAY
    const fetchPurchases = async () => {
        await axios.get(`${BACKEND_URL}/api/purchaseorders`, { headers: headers }).then(({ data }) => {
            setPurchases(data);

        });
    };

    //for form dropdown
    const [supplierIds, setSupplierIds] = useState([]);
    const [productIds, setProductIds] = useState([]);
    const [userIds, setUserIds] = useState([]);

    const [supplierNames, setSupplierNames] = useState([]);
    const [productNames, setProductNames] = useState([]);
    const [userNames, setUserNames] = useState([]);


    useEffect(() => {
        // Fetch supplier_id data
        axios.get(`${BACKEND_URL}/api/suppliers`, { headers: headers }).then(({ data }) => {
            setSupplierIds(data.map(supplier => supplier.supplier_id));
            setSupplierNames(data.map(supplier => supplier.name));
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

        // Fetch purchases data
        fetchPurchases();
    }, []);
    

    //CREATE
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [supplier_id, setSupplierId] = useState("");
    const [product_id, setProductId] = useState("");
    const [purchaseQuantity, setPurchaseQuantity] = useState("")
    const [receivedMoney, setReceivedMoney] = useState("");
    const [purchaseStatus, setPurchaseStatus] = useState("")
    const [user_id, setUserId] = useState("")
    const [validationError, setValidationError] = useState({});

    const createPurchase = async (e) => {
        e.preventDefault();

        console.log(supplier_id);
        console.log(product_id);
        console.log(purchaseQuantity);
        console.log(receivedMoney);
        console.log(purchaseStatus);
        console.log(user_id);

        const formData = new FormData();

        formData.append('supplier_id', supplier_id);
        formData.append('product_id', product_id);
        formData.append('purchaseQuantity', purchaseQuantity);
        formData.append('receivedMoney', receivedMoney);
        formData.append('purchaseStatus', purchaseStatus);
        formData.append('user_id', user_id);

        await axios.post(`${BACKEND_URL}/api/purchaseorder/register`, { supplier_id, product_id, purchaseQuantity, receivedMoney, purchaseStatus, user_id }, { headers: headers }).then(({ data }) => {
            Swal.fire({
                icon: "success",
                text: data.message
            });
            handleClose();
            fetchPurchases();

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
    const [showPurchase, setShowPurchase] = useState(false);
    const [specificPurchaseData, setSpecificPurchaseData] = useState([]);
    const handlePurchaseClose = () => setShowPurchase(false);

    const readSpecificPurchase = (purchaseorder_id) => {
        fetchSpecificPurchase(purchaseorder_id);
    };

    const fetchSpecificPurchase = async (purchaseorder_id) => {
        await axios.get(`${BACKEND_URL}/api/purchaseorder/${purchaseorder_id}`, { headers: headers }).then(({ data }) => {
            setSpecificPurchaseData(data);
            setShowPurchase(true);
        });
    };

    //UPDATE
    const [showUpdate, setShowUpdate] = useState(false);
    const [updatePurchase, setUpdatePurchase] = useState({});

    const handleCloseUpdate = () => {
        setShowUpdate(false);
        setUpdatePurchase({});
    };

    const handleShowUpdate = (purchase) => {
        setUpdatePurchase(purchase);
        setShowUpdate(true);
        setSupplierId(purchase.supplier_id || "");
        setProductId(purchase.product_id || "");
        setPurchaseQuantity(purchase.purchaseQuantity || "");
        setReceivedMoney(purchase.receivedMoney || "");
        setPurchaseStatus(purchase.purchaseStatus || "");
        setUserId(purchase.user_id || "");
    };

    const updateContent = async (e) => {
        e.preventDefault();

        const updatedPurchaseData = {
            supplier_id,
            product_id,
            purchaseQuantity,
            receivedMoney,
            purchaseStatus,
            user_id,
        };

        try {
            await axios.put(`${BACKEND_URL}/api/purchaseorder/${updatePurchase.purchaseorder_id}`, updatedPurchaseData, { headers });

            Swal.fire({
                icon: "success",
                text: "Purchase updated successfully",
            });

            handleCloseUpdate();
            fetchPurchases();
        } catch (error) {
            console.error("Error updating purchase data", error);

            if (error.response && error.response.status === 422) {
                setValidationError(error.response.data.errors);
            } else {
                Swal.fire({
                    text: "Error updating purchase data",
                    icon: "error",
                });
            }
        }
    };

    //DELETE
    const deletePurchase = async (purchaseorder_id) => {
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

        await axios.delete(`${BACKEND_URL}/api/purchaseorder/${purchaseorder_id}`, { headers: headers }).then(({ data }) => {

            Swal.fire({
                icon: "success",
                text: "Succesfully Deleted"
            });
            fetchPurchases();
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

    const filterPurchases = () => {
        return purchases.filter((purchase) =>
            purchase.purchaseorder_id.toString().includes(searchInput.toLowerCase()) ||
            purchase.supplier_id.toString().includes(searchInput.toLowerCase()) ||
            purchase.product_id.toString().includes(searchInput.toLowerCase()) ||
            purchase.purchaseQuantity.toString().includes(searchInput.toLowerCase()) ||
            purchase.receivedMoney.toString().includes(searchInput.toLowerCase()) ||
            purchase.purchaseStatus.toLowerCase().includes(searchInput.toLowerCase()) ||
            purchase.user_id.toString().includes(searchInput.toLowerCase()) ||
            purchase.soldDatenTime.toString().toLowerCase().includes(searchInput.toLowerCase())
        );
    };

    useEffect(() => {
        setSearchResults(filterPurchases());
    }, [purchases, searchInput]);

    return (
        <>
            <Navigationbar/>
            {/* USER UI */}
            <div className="container"><br />
                <div style={{ textAlign: 'center', alignSelf: 'center', justifyContent: "center", color: "white" }}>
                    <h2 className="title">ORDER TO SUPPLIER</h2>
                </div>
                <div className="top-components">
                    <InputGroup size="sm" className="mb-2 searchbar">
                        <InputGroup.Text>Search</InputGroup.Text>
                        <Form.Control size="sm" type="search" placeholder="search table data" value={searchInput} onChange={handleSearchInputChange} className="me-2" aria-label="Search" />
                    </InputGroup>
                    <Button variant="btn btn-success btn-sm" onClick={handleShow}>+ Register Purchase</Button>
                </div>
                <Table className="mt-2 custom-table" striped bordered hover variant="dark" responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Supplier's Name</th>
                            <th>Product's Name</th>
                            <th>Quantity</th>
                            <th>Received Money</th>
                            <th>Status</th>
                            <th>Processed by</th>
                            <th>Purchased When</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchResults.length > 0 &&
                            searchResults.map((row, key) => (
                                <tr key={key}>
                                    <td>{row.purchaseorder_id || 'N/A'}</td>
                                    <td>{supplierNames[supplierIds.indexOf(row.supplier_id)] || 'N/A'}</td>
                                    <td>{productNames[productIds.indexOf(row.product_id)] || 'N/A'}</td>
                                    <td>{row.purchaseQuantity || 'N/A'}</td>
                                    <td>{row.receivedMoney}</td>
                                    <td>{row.purchaseStatus || 'N/A'}</td>
                                    <td>{userNames[userIds.indexOf(row.user_id)] || 'N/A'}</td>
                                    <td>{row.soldDatenTime || 'N/A'}</td>
                                    <td>
                                        <Button variant='btn btn-primary btn-sm me-2' onClick={() => readSpecificPurchase(row.purchaseorder_id)}>
                                            View
                                        </Button>
                                        <Button variant='btn btn-warning btn-sm me-2' onClick={() => handleShowUpdate(row)}>
                                            Update
                                        </Button>
                                        <Button variant='btn btn-danger btn-sm me-2' onClick={() => deletePurchase(row.purchaseorder_id)}>
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
                    <Modal.Title>Register Purchase</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group controlId="supplierid">
                                    <Form.Label>Supplier Name:</Form.Label>
                                    <Form.Select aria-label="Default select example" onChange={(event) => setSupplierId(event.target.value)}>
                                        <option style={{color: 'red'}} disabled selected>Select supplier name</option>
                                        {supplierNames.map((supplierName, index) => (
                                            <option key={index} value={supplierIds[index]}>{supplierName}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="productid">
                                    <Form.Label>Purchaseed Product:</Form.Label>
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
                                    <Form.Control type="text" placeholder="Enter quantity" onChange={(event) => setPurchaseQuantity(event.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="receive">
                                    <Form.Label>Received Money:</Form.Label>
                                    <Form.Control type="text" placeholder="Enter money" onChange={(event) => setReceivedMoney(event.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="status">
                                    <Form.Label>Purchase Status:</Form.Label>
                                    <Form.Select aria-label="Default select example" onChange={(event) => setPurchaseStatus(event.target.value)}>
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
                    <Button className="mr-auto" variant="success" onClick={createPurchase}>Submit</Button>
                    <Button variant="danger" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL VIEW */}
            <Modal className="glassmorphism text-white" show={showPurchase} onHide={handlePurchaseClose} data-bs-theme='dark' centered>
                <Modal.Header className="modal-title">
                    <Modal.Title>View Purchase</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container"><br />
                        <Table striped bordered hover>
                            <tbody>
                                {Array.isArray(specificPurchaseData) && specificPurchaseData.map((defdata, index) => (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td><strong>Purchase ID</strong></td>
                                            <td>{defdata.purchaseorder_id || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Supplier Info</strong></td>
                                            <td><strong>ID: </strong>{defdata.supplier_id || 'N/A'}, <strong>Name: </strong>{supplierNames[supplierIds.indexOf(defdata.supplier_id)] || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Product Info</strong></td>
                                            <td><strong>ID: </strong>{defdata.product_id || 'N/A'}, <strong>Product: </strong>{productNames[productIds.indexOf(defdata.product_id)] || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Quantity</strong></td>
                                            <td>{defdata.purchaseQuantity || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Received Money</strong></td>
                                            <td>{defdata.receivedMoney || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Status</strong></td>
                                            <td>{defdata.purchaseStatus || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Processed By</strong></td>
                                            <td><strong>ID: </strong>{defdata.user_id || 'N/A'}, <strong>Name: </strong>{userNames[userIds.indexOf(defdata.user_id)] || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Purchaseed When</strong></td>
                                            <td>{defdata.soldDatenTime || 'N/A'}</td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handlePurchaseClose}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL UPDATE */}
            <Modal className="glassmorphism text-white" show={showUpdate} onHide={handleCloseUpdate} data-bs-theme='dark' centered>
                <Modal.Header className="modal-title">
                    <Modal.Title>Update Purchase to Supplier</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group controlId="supplierid">
                                    <Form.Label>Supplier Name:</Form.Label>
                                    <Form.Select aria-label="Default select example" onChange={(event) => setSupplierId(event.target.value)} disabled>
                                        <option>{supplierNames[supplierIds.indexOf(updatePurchase.supplier_id)]}</option>
                                        {supplierNames.map((supplierName, index) => (
                                            <option key={index} value={supplierIds[index]}>{supplierName}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="productid">
                                    <Form.Label>Purchased Product:</Form.Label>
                                    <Form.Select aria-label="Default select example" onChange={(event) => setProductId(event.target.value)} disabled>
                                        <option>{productNames[productIds.indexOf(updatePurchase.product_id)]}</option>
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
                                    <Form.Label>Purchase Quantity:</Form.Label>
                                    <Form.Control type="text" value={purchaseQuantity || updatePurchase.purchaseQuantity} onChange={(event) => setPurchaseQuantity(event.target.value)} disabled/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="receive">
                                    <Form.Label>Received Money:</Form.Label>
                                    <Form.Control type="text" value={receivedMoney || updatePurchase.receivedMoney} onChange={(event) => setReceivedMoney(event.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="status">
                                    <Form.Label>Purchase Status:</Form.Label>
                                    <Form.Select aria-label="Default select example" value={purchaseStatus || updatePurchase.purchaseStatus} onChange={(event) => setPurchaseStatus(event.target.value)}>
                                        <option style={{color: 'red'}} disabled>Select Status</option>
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
                                        <option>{userNames[userIds.indexOf(updatePurchase.user_id)]}</option>
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
        </>
    );
}

export default Purchase;
