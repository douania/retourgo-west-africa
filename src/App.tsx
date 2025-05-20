
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import HowItWorks from './pages/HowItWorks';
import Contact from './pages/Contact';
import UserTypeSelection from './pages/UserTypeSelection';
import IndividualRegistration from './pages/IndividualRegistration';
import CompanyRegistration from './pages/CompanyRegistration';
import FreightMarketplace from './pages/FreightMarketplace';
import VehicleTypeSelection from './pages/VehicleTypeSelection';
import VehicleRegistration from './pages/VehicleRegistration';
import DriverRegistration from './pages/DriverRegistration';
import Profiles from './pages/Profiles';
import Profile from './pages/Profile';
import Pricing from './pages/Pricing';
import AIAssistant from './pages/AIAssistant';
import NewFreight from './pages/NewFreight';
import FreightDetails from './pages/FreightDetails';
import FreightOffers from './pages/FreightOffers';
import History from './pages/History';
import Map from './pages/Map';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster richColors position="top-center" />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/user-type" element={<UserTypeSelection />} />
          <Route path="/register/individual" element={<IndividualRegistration />} />
          <Route path="/register/company" element={<CompanyRegistration />} />
          <Route path="/individual-registration" element={<IndividualRegistration />} />
          <Route path="/company-registration" element={<CompanyRegistration />} />
          <Route path="/freight" element={<FreightMarketplace />} />
          {/* Redirect from /marketplace to /freight */}
          <Route path="/marketplace" element={<Navigate to="/freight" replace />} />
          <Route path="/vehicle-type" element={<VehicleTypeSelection />} />
          <Route path="/vehicle-registration" element={<VehicleRegistration />} />
          <Route path="/driver-registration" element={<DriverRegistration />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          {/* Redirect from /ai to /ai-assistant */}
          <Route path="/ai" element={<Navigate to="/ai-assistant" replace />} />
          <Route path="/new-freight" element={<NewFreight />} />
          <Route path="/freight/:id" element={<FreightDetails />} />
          <Route path="/freight/:id/offers" element={<FreightOffers />} />
          <Route path="/history" element={<History />} />
          <Route path="/map" element={<Map />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
