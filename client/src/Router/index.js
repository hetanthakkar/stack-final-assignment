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
import UserProfile from "../components/main/profilePage";
import PrivateRoute from "./PrivateRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={<PrivateRoute Component={FakeStackOverflow} />}
        />
        <Route path="/login" element={<Username />} />
        <Route path="/username" element={<Username />} />
        <Route path="/password" element={<Password />} />
        <Route path="/recovery" element={<Recovery />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/profile" element={<PrivateRoute Component={Profile} />} />
        <Route
          path="/show-user"
          element={<PrivateRoute Component={UserProfile} />}
        />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
