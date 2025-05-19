
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NewFreight from "./pages/NewFreight";
import FreightMarketplace from "./pages/FreightMarketplace";
import FreightDetails from "./pages/FreightDetails";
import FreightOffers from "./pages/FreightOffers";
import HowItWorks from "./pages/HowItWorks";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import VehicleTypeSelection from "./pages/VehicleTypeSelection";
import VehicleRegistration from "./pages/VehicleRegistration";
import DriverRegistration from "./pages/DriverRegistration";
import History from "./pages/History";
import UserTypeSelection from "./pages/UserTypeSelection";
import CompanyRegistration from "./pages/CompanyRegistration";
import IndividualRegistration from "./pages/IndividualRegistration";

// App component
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user-type-selection" element={<UserTypeSelection />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profiles" element={<Profile />} />
          <Route path="/new-freight" element={<NewFreight />} />
          <Route path="/marketplace" element={<FreightMarketplace />} />
          <Route path="/freight/:id" element={<FreightDetails />} />
          <Route path="/freight/:id/offers" element={<FreightOffers />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/vehicle-selection" element={<VehicleTypeSelection />} />
          <Route path="/vehicle-registration" element={<VehicleRegistration />} />
          <Route path="/driver-registration" element={<DriverRegistration />} />
          <Route path="/vehicles" element={<Navigate to="/vehicle-selection" replace />} />
          <Route path="/vehicles/new" element={<VehicleRegistration />} />
          <Route path="/drivers/new" element={<DriverRegistration />} />
          <Route path="/history" element={<History />} />
          <Route path="/company-registration" element={<CompanyRegistration />} />
          <Route path="/individual-registration" element={<IndividualRegistration />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
