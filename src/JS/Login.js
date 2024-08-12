import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import "../CSS/Login.css";

import pic1 from '../Pics/logo.png';
import user_icon from '../Pics/user1.png';
import lock_icon from '../Pics/lock.png';

import BACKEND_URL from './backendURL';

const Login = () => {
  const navigate = useNavigate();
  const [ user, setUser ] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = JSON.parse(localStorage.getItem('token'))
        setUser(response.data);
        navigate("/dashboard");

      } catch (error) {
        navigate("/login");
      }
    };
    fetchUser();
  }, []);

  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState(''); 
  const [ token, setToken ] = useState(localStorage.getItem('token') || '');

  const handleLogin = async (e) => {

    try {
      const response = await axios.post(`${BACKEND_URL}/api/user/login`, {
          username,
          password,
      });

      localStorage.setItem("token", JSON.stringify(response));
      navigate("/dashboard");

      const undecoded_token = JSON.parse(localStorage.getItem('token'));
      // console.log(undecoded_token.data.token);
      const decoded_token = jwtDecode(undecoded_token.data.token);
      // console.log(decoded_token);

    } catch (error) {
      // console.error('Login failed', error);
      Swal.fire({
          icon: "error",
          title: "Incorrect username/password.",
          text: "Try again."
      });
    }
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === 'Enter') {
        handleLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="login_box">
        <div className="login-top">
          <Image className="image" src={pic1} alt="Logo" roundedCircle/>
        </div>
        <div className="login-title">
          <span>JackBelt Concrete Product & Aggregate Inventory Management System</span>
        </div>
        <div className="input_box">
          <input type="text" id="user" className="input-field" value={username} onChange={(e) => setUsername(e.target.value)} onKeyPress={handleEnterKeyPress} required />
          <label htmlFor="user" className="label">Username</label>
          <Image className='icon' src={user_icon}/>
        </div>
        <div className="input_box">
          <input type="password" id="pass" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={handleEnterKeyPress} required />
          <label htmlFor="pass" className="label">Password</label>
          <Image className="icon" src={lock_icon}/>
        </div>
        <div className="input_box login-button">
          <input type="submit" className="input-submit" value="Login" onClick={handleLogin}></input>
        </div>
      </div>
    </div>
  );
};

export default Login;
