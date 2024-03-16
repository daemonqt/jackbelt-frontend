import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Login from './Login';
import Users from './User';
import Products from  './Product';
import Customers from  './Customer';
import Suppliers from "./Supplier";
import Orders from "./Order";
import Purchases from "./PurchaseOrder";
import Dashboard from './Dashboard';

import "bootstrap/dist/css/bootstrap.css";
import "../CSS/App.css"

const App = () => {
  return (
    <div className="app-container">
      <div className="background-layer" fluid="true"></div>
      <Router>
        <Container className="main-container">
          <Row>
            <Col md={12}>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />}/>
                <Route path="/users" element={<Users />} />
                <Route path="/products" element={<Products />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/purchases" element={<Purchases />} />
                <Route path="/dashboard/" element={<Dashboard />}/>
              </Routes>
            </Col>
          </Row>
        </Container>
      </Router>
    </div>
  );
}

export default App;