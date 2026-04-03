import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import UserLogin from "./pages/UserLogin";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SchedulePickup from "./pages/SchedulePickup";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import { AuthProvider } from "./context/AuthContext";
import "./pages/Responsive.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/schedule-pickup" element={<SchedulePickup />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;