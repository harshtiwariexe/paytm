import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SendMoney from "./page/SendMoney";
import Dashboard from "./page/Dashboard";
import SignUp from "./page/SignUp";
import Login from "./page/Login";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/send" element={<SendMoney />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
