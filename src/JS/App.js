import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Login';
import Dashboard from './Dashboard';
import Users from './User';
import Products from  './Product';
import Customers from  './Customer';
import Suppliers from "./Supplier";
import Orders from "./Order";
import Purchases from "./PurchaseOrder";
import Freshproducts from './Fresh-product';
import "bootstrap/dist/css/bootstrap.css";
import "../CSS/App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/users" element={<Users />} />
        <Route path="/products" element={<Products />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/purchases" element={<Purchases />} />
        <Route path="/fresh-products" element={<Freshproducts />} />
      </Routes>
    </Router>
  );
}

export default App;
