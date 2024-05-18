import React, { useState } from 'react';
import './CSS/LoginSignup.css';

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });

  const signup = async () => {
    console.log("Signup Function", formData);
    try {
      const response = await fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to sign up');
      }

      const responseData = await response.json();

      if (responseData.success) {
        localStorage.setItem('auth-token', responseData.token);
        window.location.replace('/');
      } else {
        alert(responseData.errors);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      if (error instanceof TypeError) {
        alert('Network error. Please check your internet connection and try again.');
      } else {
        alert('Error signing up: ' + error.message);
      }
    }
  };


  const login = async () => {
    console.log("Login Function", formData);

    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const responseData = await response.json();

      if (responseData.success) {
        localStorage.setItem('auth-token', responseData.token);
        window.location.replace('/');
      } else {
        alert(responseData.errors);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Error logging in. Please try again later.');
    }
  };

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>

        <div className="loginsignup-fields">
          {state === "Sign Up" && <input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='Your Name' />}
          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Your Email' />
          <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Password' />
        </div>

        <button onClick={() => { state === "Login" ? login() : signup() }}>Continue</button>

        <p className="loginsignup-login">
          {state === "Sign Up"
            ? "Already have an account? "
            : "Create an account? "}
          <span onClick={() => setState(state === "Login" ? "Sign Up" : "Login")}>
            {state === "Sign Up" ? "Login here" : "Click here"}
          </span>
        </p>

       
      </div>
    </div>
  );
};

export default LoginSignup;
