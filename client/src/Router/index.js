import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Username from "../components/LoginComponents/Username";
import Password from "../components/LoginComponents/Password";
import Register from "../components/LoginComponents/Register";
import Profile from "../components/LoginComponents/Profile";
import Recovery from "../components/LoginComponents/Recovery";
import Reset from "../components/LoginComponents/Reset";
import PageNotFound from "../components/LoginComponents/PageNotFound";
import LoginPage from "../components/main/loginPage";
import FakeStackOverflow from "../components/fakestackoverflow";
import "../index.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Username />} />
        <Route exact path="/home" element={<FakeStackOverflow />} />
        <Route exact path="/username" element={<Username />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/password" element={<Password />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/recovery" element={<Recovery />} />
        <Route exact path="/reset" element={<Reset />} />
        <Route exact path="/*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
