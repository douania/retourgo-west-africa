
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { PageSkeleton } from './components/ui/page-skeleton';
import { MobileNavigation } from './components/navigation/MobileNavigation';
import './App.css';

// Pages critiques chargées immédiatement
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Pages chargées en lazy loading pour optimiser les performances
const Dashboard = lazy(() => import('./pages/Dashboard'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const Contact = lazy(() => import('./pages/Contact'));
const UserTypeSelection = lazy(() => import('./pages/UserTypeSelection'));
const IndividualRegistration = lazy(() => import('./pages/IndividualRegistration'));
const CompanyRegistration = lazy(() => import('./pages/CompanyRegistration'));
const FreightMarketplace = lazy(() => import('./pages/FreightMarketplace'));
const VehicleTypeSelection = lazy(() => import('./pages/VehicleTypeSelection'));
const VehicleRegistration = lazy(() => import('./pages/VehicleRegistration'));
const VehicleNew = lazy(() => import('./pages/VehicleNew'));
const DriverRegistration = lazy(() => import('./pages/DriverRegistration'));
const Profiles = lazy(() => import('./pages/Profiles'));
const Profile = lazy(() => import('./pages/Profile'));
const Pricing = lazy(() => import('./pages/Pricing'));
const AIAssistant = lazy(() => import('./pages/AIAssistant'));
const NewFreight = lazy(() => import('./pages/NewFreight'));
const FreightDetails = lazy(() => import('./pages/FreightDetails'));
const FreightOffers = lazy(() => import('./pages/FreightOffers'));
const History = lazy(() => import('./pages/History'));
const Map = lazy(() => import('./pages/Map'));

// Le PageSkeleton est maintenant importé depuis le composant dédié

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="relative min-h-screen">
          <Toaster richColors position="top-center" />
          <Suspense fallback={<PageSkeleton />}>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/user-type-selection" element={<UserTypeSelection />} />
            {/* Redirect from old route to new route */}
            <Route path="/user-type" element={<Navigate to="/user-type-selection" replace />} />
            <Route path="/register/individual" element={<IndividualRegistration />} />
            <Route path="/register/company" element={<CompanyRegistration />} />
            <Route path="/individual-registration" element={<IndividualRegistration />} />
            <Route path="/company-registration" element={<CompanyRegistration />} />
            <Route path="/freight" element={<FreightMarketplace />} />
            {/* Redirect from /marketplace to /freight */}
            <Route path="/marketplace" element={<Navigate to="/freight" replace />} />
            <Route path="/vehicle-type" element={<VehicleTypeSelection />} />
            {/* Add new redirect for /vehicle-selection to /vehicle-type */}
            <Route path="/vehicle-selection" element={<Navigate to="/vehicle-type" replace />} />
            <Route path="/vehicle-registration" element={<VehicleRegistration />} />
            {/* Add new route for specific vehicle type registration */}
            <Route path="/vehicles/new" element={<VehicleNew />} />
            <Route path="/driver-registration" element={<DriverRegistration />} />
            <Route path="/profiles" element={<Profiles />} />
            <Route path="/profile/:id" element={<Profile />} />
            {/* Add new route for profile without ID that redirects to the user's profile */}
            <Route path="/profile" element={<Navigate to="/profile/me" replace />} />
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
          </Suspense>
          
          {/* Navigation mobile bottom fixe */}
          <MobileNavigation />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
