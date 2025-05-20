
import { Link, useLocation } from "react-router-dom";
import { Home, Truck, User, History, Package, MapPin } from "lucide-react";
import { useUserTheme } from "@/hooks/useUserTheme";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

const BottomNavigation = () => {
  const location = useLocation();
  const { iconColor, userType } = useUserTheme();
  const { t } = useTranslation();
  
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
        <span className="text-xs mt-1">{t("nav.home")}</span>
      </Link>
      
      {userType === 'transporter' ? (
        // Options pour transporteurs
        <>
          <Link 
            to="/marketplace" 
            className={cn("flex flex-col items-center justify-center w-1/5 py-1", 
              isActive("/marketplace") ? "text-primary font-medium" : "text-gray-600"
            )}
          >
            <Package className="h-6 w-6" style={{ color: isActive("/marketplace") ? iconColor : undefined }} />
            <span className="text-xs mt-1">{t("dashboard.merchandise")}</span>
          </Link>
          
          <Link 
            to="/vehicles" 
            className="flex flex-col items-center justify-center w-1/5 py-1"
          >
            <div className="bg-gradient-to-r from-transporter to-transporter-light rounded-full p-3 -mt-8 shadow-lg">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs mt-1 text-gray-600">{t("dashboard.vehicles")}</span>
          </Link>
          
          <Link 
            to="/map" 
            className={cn("flex flex-col items-center justify-center w-1/5 py-1", 
              isActive("/map") ? "text-primary font-medium" : "text-gray-600"
            )}
          >
            <MapPin className="h-6 w-6" style={{ color: isActive("/map") ? iconColor : undefined }} />
            <span className="text-xs mt-1">{t("dashboard.map")}</span>
          </Link>
        </>
      ) : (
        // Options pour expéditeurs
        <>
          <Link 
            to="/marketplace" 
            className={cn("flex flex-col items-center justify-center w-1/5 py-1", 
              isActive("/marketplace") ? "text-primary font-medium" : "text-gray-600"
            )}
          >
            <Truck className="h-6 w-6" style={{ color: isActive("/marketplace") ? iconColor : undefined }} />
            <span className="text-xs mt-1">{t("dashboard.transporters")}</span>
          </Link>
          
          <Link 
            to="/new-freight" 
            className="flex flex-col items-center justify-center w-1/5 py-1"
          >
            <div className="bg-gradient-to-r from-shipper to-shipper-light rounded-full p-3 -mt-8 shadow-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs mt-1 text-gray-600">{t("dashboard.ship")}</span>
          </Link>
          
          <Link 
            to="/history" 
            className={cn("flex flex-col items-center justify-center w-1/5 py-1", 
              isActive("/history") ? "text-primary font-medium" : "text-gray-600"
            )}
          >
            <History className="h-6 w-6" style={{ color: isActive("/history") ? iconColor : undefined }} />
            <span className="text-xs mt-1">{t("nav.history")}</span>
          </Link>
        </>
      )}
      
      <Link 
        to="/profile" 
        className={cn("flex flex-col items-center justify-center w-1/5 py-1", 
          isActive("/profile") ? "text-primary font-medium" : "text-gray-600"
        )}
      >
        <User className="h-6 w-6" style={{ color: isActive("/profile") ? iconColor : undefined }} />
        <span className="text-xs mt-1">{t("dashboard.profile")}</span>
      </Link>
    </div>
  );
};

export default BottomNavigation;
