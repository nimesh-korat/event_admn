import React, { useState } from "react";
import axios from "axios";

function Login() {
  axios.defaults.withCredentials = true;
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: "0",
  });
  const [isLoaded, setLoaded] = useState(true);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    setLoaded(false);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_MONGO_BASE_URL}/login`,
        loginData
      );

      const { success } = response.data;
      console.log(success);

      if (success) {
        localStorage.setItem("token", response.data.token);
        window.location.reload(false);
        setLoaded(true);
      }
    } catch (error) {
      console.log("Login Err: ", error);
      setLoaded(true);
      if (error.response && error.response.status === 401) {
        alert("Invalid username or password");
      } else {
        alert("Error: Failed to connect to server");
      }
    }
  };

  return (
    <>
      {isLoaded ? (
        <div id="signup" className="container">
          <div className="forms-container">
            <div className="signin-signup">
              <form onSubmit={handleLoginSubmit} className="sign-in-form">
                <h2 className="title">Sign in</h2>
                <div className="input-field">
                  <i className="fas fa-user" />
                  <input
                    type="email"
                    placeholder="Username"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required
                  />
                </div>
                <div className="input-field">
                  <i className="fas fa-lock" />
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Sign In
                </button>
              </form>
            </div>
          </div>
          <div className="panels-container">
            <div className="panel left-panel">
              <img
                src="/images/auth/login-bg.jpg"
                alt="logo"
                className="image"
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>
      ) : (
        <h3 className="text-center">Please Wait...</h3>
      )}
    </>
  );
}

export default Login;
