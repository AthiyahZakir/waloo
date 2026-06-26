import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import MapPage from './pages/MapPage';
import WashroomDetail from './pages/WashroomDetail';
import AddWashroom from './pages/AddWashroom';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <MapPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<LoginPage />} />
          {/* Placeholders — built on Day 5 */}
          <Route path="/washroom/:id" element={<ProtectedRoute><WashroomDetail /></ProtectedRoute>} />
          <Route path="/add" element={<ProtectedRoute><AddWashroom /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}