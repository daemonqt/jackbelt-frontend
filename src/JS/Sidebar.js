import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { NavLink } from "react-router-dom";
import "../CSS/Sidebar.css";

import pic1 from '../Pics/logo.png';
import icon0 from "../Pics/dashboard.png";
import icon1 from "../Pics/user.png";
import icon2 from "../Pics/inventory-alt.png";
import icon3 from "../Pics/users-alt.png";
import icon4 from "../Pics/handshake.png";
import icon5 from "../Pics/coins.png";
import icon6 from "../Pics/money-check-edit.png";
import icon7 from "../Pics/box-open.png";
import log_out from "../Pics/log-out.png";

const Sidebar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = JSON.parse(localStorage.getItem('token'));
                setUser(response.data);

                const decodedToken = jwtDecode(response.data.token);
                setUser(decodedToken);
            } catch (error) {
                navigate("/login");
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            localStorage.removeItem('token');
            navigate("/login");
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <div className="wrapper">
            <nav className="sidebar">
                <div className="sidebar-header">
                    <img src={pic1} className="rounded-circle usr-image" alt="User Profile" />
                    <p>JackBelt IMS</p>
                </div>
                <div className="sidebar-body">
                    <NavLink to={"/dashboard"} className="nav-link">
                        <img src={icon0} alt="Icon 0" className="icon-color" />DASHBOARD
                    </NavLink>
                    <NavLink to={"/users"} className="nav-link">
                        <img src={icon1} alt="Icon 1" className="icon-color" />USERS
                    </NavLink>
                    <NavLink to={"/products"} className="nav-link">
                        <img src={icon2} alt="Icon 2" className="icon-color" />INVENTORY
                    </NavLink>
                    <NavLink to={"/fresh-products"} className="nav-link">
                        <img src={icon7} alt="Icon 7" className="icon-color" />FRESH PRODUCTS
                    </NavLink>
                    <NavLink to={"/customers"} className="nav-link">
                        <img src={icon3} alt="Icon 3" className="icon-color" />CUSTOMERS
                    </NavLink>
                    <NavLink to={"/suppliers"} className="nav-link">
                        <img src={icon4} alt="Icon 4" className="icon-color" />SUPPLIERS
                    </NavLink>
                    <NavLink to={"/orders"} className="nav-link">
                        <img src={icon5} alt="Icon 5" className="icon-color" />ORDERS
                    </NavLink>
                    <NavLink to={"/purchases"} className="nav-link">
                        <img src={icon6} alt="Icon 6" className="icon-color" />PURCHASES
                    </NavLink>
                </div>
                <div className="sidebar-footer">
                    <p className="user-info">Welcome: <span className="username">{user ? user.name : 'Guest'}</span></p>
                    <button className="btn-custom" onClick={handleLogout}>
                        <img src={log_out} alt="log-out" className="logout_icon"/>
                        LOGOUT
                    </button>
                </div>
            </nav>
        </div>
    );
};
export default Sidebar;
