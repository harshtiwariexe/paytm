import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            id="firstName"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            name="lastName"
            id="lastName"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            onClick={async () => {
              const response = await axios.post(
                "http://localhost:3000/api/v1/user/signup",
                {
                  email,
                  firstName,
                  lastName,
                  password,
                }
              );
              localStorage.setItem("token", response.data.token);
              navigate("/");
              localStorage.delete("token");
            }}
          >
            Sign Up
          </button>
        </form>

        <p>Already have an account?</p>
        <Link to="/login">Login</Link>
      </div>
    </>
  );
}
