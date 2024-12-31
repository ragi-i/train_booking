import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/UserLogin";
import Signup from "./pages/UserRegister";
import SeatBooking from "./pages/SeatBooking";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Login />} />
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/seats" element ={<SeatBooking/>}/>
            </Routes>
        </Router>
    );
}

export default App;
