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

function User() {
    const [users, setUsers] = useState([]);
    const user = JSON.parse(localStorage.getItem('token'));
    const token = user.data.token;

    const headers = {
        accept: 'application/json',
        Authorization: token
    };

    //DISPLAY
    const fetchUsers = async () => {
        await axios.get(`${BACKEND_URL}/api/users`, { headers: headers }).then(({ data }) => {
            setUsers(data);

        });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    //CREATE
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [validationError, setValidationError] = useState({});

    const createUser = async (e) => {
        e.preventDefault();

        console.log(name);
        console.log(username);
        console.log(password);

        const formData = new FormData();

        formData.append('name', name);
        formData.append('username', username);
        formData.append('password', password);

        await axios.post(`${BACKEND_URL}/api/user/register`, { name, username, password }, { headers: headers }).then(({ data }) => {
            Swal.fire({
                icon: "success",
                text: data.message
            });
            handleClose();
            fetchUsers();

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

    //DISPLAY SPECIFIC USER
    const [showUser, setShowUser] = useState(false);
    const [specificUserData, setSpecificUserData] = useState({});
    const handleUserClose = () => setShowUser(false);

    const readSpecificUser = (user_id) => {
        fetchSpecificUser(user_id);
    };

    const fetchSpecificUser = async (user_id) => {
        try {
            const { data } = await axios.get(`${BACKEND_URL}/api/user/${user_id}`, { headers: headers });
            setSpecificUserData(data);
            setShowUser(true);
        } catch (error) {
            console.error("Error fetching specific user data", error);
        }
    };

    //UPDATE
    const [showUpdate, setShowUpdate] = useState(false);
    const [updateUser, setUpdateUser] = useState({});

    const handleCloseUpdate = () => {
        setShowUpdate(false);
        setUpdateUser({});
    };

    const handleShowUpdate = (user) => {
        setUpdateUser(user);
        setShowUpdate(true);
        setName(user.name || "");
        setUsername(user.username || "");
        setPassword(user.password || "");
    };

    const updateContent = async (e) => {
        e.preventDefault();

        const updatedUserData = {
            name,
            username,
            password,
        };

        try {
            await axios.put(`${BACKEND_URL}/api/user/${updateUser.user_id}`, updatedUserData, { headers });

            Swal.fire({
                icon: "success",
                text: "User updated successfully",
            });

            handleCloseUpdate();
            fetchUsers();
        } catch (error) {
            console.error("Error updating user data", error);
        
            if (error.response?.status === 422) {
                setValidationError(error.response.data.errors);
            } else {
                Swal.fire({
                    text: "Error updating user data",
                    icon: "error",
                });
            }
        }
    };

    //DELETE
    const deleteUser = async (user_id) => {
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

        await axios.delete(`${BACKEND_URL}/api/user/${user_id}`, { headers: headers }).then(({ data }) => {

            Swal.fire({
                icon: "success",
                text: "Succesfully Deleted"
            });
            fetchUsers();
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

    const filterUsers = () => {
        return users.filter((user) =>
            user.user_id.toString().includes(searchInput.toLowerCase()) ||
            user.name.toLowerCase().includes(searchInput.toLowerCase()) ||
            user.username.toLowerCase().includes(searchInput.toLowerCase()) ||
            user.ucreation_date.toString().toLowerCase().includes(searchInput.toLowerCase())
        );
    };

    useEffect(() => {
        setSearchResults(filterUsers());
    }, [users, searchInput]);

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
                                <Button variant="btn btn-success btn-sm" onClick={handleShow}>+ Add User</Button>
                            </div>
                        </div>
                        <div className="table-container">
                            <table className="mt-2 text-center">
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
                                                <td>{row.user_id || 'N/A'}</td>
                                                <td>{row.name || 'N/A'}</td>
                                                <td>{row.username || 'N/A'}</td>
                                                <td>{row.ucreation_date || 'N/A'}</td>
                                                <td>
                                                    <Button variant='btn btn-primary btn-sm me-2' onClick={() => readSpecificUser(row.user_id)}>
                                                        View
                                                    </Button>
                                                    <Button variant='btn btn-warning btn-sm me-2' onClick={() => handleShowUpdate(row)}>
                                                        Update
                                                    </Button>
                                                    <Button variant='btn btn-danger btn-sm me-2' onClick={() => deleteUser(row.user_id)}>
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
                    <Modal.Title>Add User</Modal.Title>
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
                        <Row>
                            <Col>
                                <Form.Group controlId="Password">
                                    <Form.Label>Password:</Form.Label>
                                    <Form.Control type="password" placeholder="Enter password" onChange={(event) => setPassword(event.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="justify-content-between">
                    <Button className="mr-auto" variant="success" onClick={createUser}>Submit</Button>
                    <Button variant="danger" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL VIEW */}
            <Modal className="glassmorphism text-white" show={showUser} onHide={handleUserClose} data-bs-theme='dark' centered>
                <Modal.Header className="modal-title">
                    <Modal.Title>View User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container"><br />
                        <table>
                            <tbody>
                                {Array.isArray(specificUserData) && specificUserData.map((defdata, index) => (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <th>User ID</th>
                                            <td>{defdata.user_id || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <th>Name</th>
                                            <td>{defdata.name || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <th>Username</th>
                                            <td>{defdata.username || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <th>Created/Updated When</th>
                                            <td>{defdata.ucreation_date}</td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleUserClose}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* MODAL UPDATE */}
            <Modal className="glassmorphism text-white" show={showUpdate} onHide={handleCloseUpdate} data-bs-theme='dark' centered>
                <Modal.Header className="modal-title">
                    <Modal.Title>Update User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group controlId="Name">
                                    <Form.Label>Name:</Form.Label>
                                    <Form.Control type="text" value={name || updateUser.name} onChange={(event) => setName(event.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="Username">
                                    <Form.Label>Username:</Form.Label>
                                    <Form.Control type="text" value={username || updateUser.username} onChange={(event) => setUsername(event.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="Password">
                                    <Form.Label>Password:</Form.Label>
                                    <Form.Control type="password" value={password || updateUser.password} onChange={(event) => setPassword(event.target.value)} />
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

export default User;
