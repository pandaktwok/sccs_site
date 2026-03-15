import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Donation from './pages/Donation.jsx';
import Dashboard from './pages/Dashboard.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/area-restrita" element={<Dashboard />} />
        <Route path="/doacao" element={<Donation />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
