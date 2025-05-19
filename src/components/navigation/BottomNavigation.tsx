
import { Link, useLocation } from "react-router-dom";
import { Home, Truck, User, History, Package } from "lucide-react";
import { useUserTheme } from "@/hooks/useUserTheme";
import { cn } from "@/lib/utils";

const BottomNavigation = () => {
  const location = useLocation();
  const { iconColor, userType } = useUserTheme();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50 px-2">
      <Link 
        to="/" 
        className={cn("flex flex-col items-center justify-center w-1/5 py-1", 
          isActive("/") ? "text-primary font-medium" : "text-gray-600"
        )}
      >
        <Home className="h-6 w-6" style={{ color: isActive("/") ? iconColor : undefined }} />
        <span className="text-xs mt-1">Accueil</span>
      </Link>
      
      <Link 
        to="/marketplace" 
        className={cn("flex flex-col items-center justify-center w-1/5 py-1", 
          isActive("/marketplace") ? "text-primary font-medium" : "text-gray-600"
        )}
      >
        <Package className="h-6 w-6" style={{ color: isActive("/marketplace") ? iconColor : undefined }} />
        <span className="text-xs mt-1">Marchandises</span>
      </Link>
      
      {userType === 'transporter' ? (
        <Link 
          to="/vehicles" 
          className="flex flex-col items-center justify-center w-1/5 py-1"
        >
          <div className="bg-gradient-to-r from-transporter to-transporter-light rounded-full p-3 -mt-8 shadow-lg">
            <Truck className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs mt-1 text-gray-600">Véhicules</span>
        </Link>
      ) : (
        <Link 
          to="/new-freight" 
          className="flex flex-col items-center justify-center w-1/5 py-1"
        >
          <div className="bg-gradient-to-r from-shipper to-shipper-light rounded-full p-3 -mt-8 shadow-lg">
            <Package className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs mt-1 text-gray-600">Expédier</span>
        </Link>
      )}
      
      <Link 
        to="/history" 
        className={cn("flex flex-col items-center justify-center w-1/5 py-1", 
          isActive("/history") ? "text-primary font-medium" : "text-gray-600"
        )}
      >
        <History className="h-6 w-6" style={{ color: isActive("/history") ? iconColor : undefined }} />
        <span className="text-xs mt-1">Historique</span>
      </Link>
      
      <Link 
        to="/profile" 
        className={cn("flex flex-col items-center justify-center w-1/5 py-1", 
          isActive("/profile") ? "text-primary font-medium" : "text-gray-600"
        )}
      >
        <User className="h-6 w-6" style={{ color: isActive("/profile") ? iconColor : undefined }} />
        <span className="text-xs mt-1">Profil</span>
      </Link>
    </div>
  );
};

export default BottomNavigation;
