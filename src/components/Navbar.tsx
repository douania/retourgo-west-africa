
import { useState } from "react";
import { Link } from "react-router-dom";
import AppLogo from "@/components/ui/AppLogo";
import NavLinks from "@/components/navigation/NavLinks";
import AuthButtons from "@/components/navigation/AuthButtons";
import MobileMenu from "@/components/navigation/MobileMenu";
import NavbarToggleButton from "@/components/navigation/NavbarToggleButton";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Truck, Package } from "lucide-react";
import { useUserTheme } from "@/hooks/useUserTheme";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import { LanguageSelector } from "@/components/navigation/LanguageSelector";
import { useTranslation } from "@/hooks/useTranslation";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const { badgeClass, iconColor, userType } = useUserTheme();
  const { t } = useTranslation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <AppLogo />
              </div>
              <NavLinks />
            </div>
            <div className="hidden sm:flex sm:items-center">
              {user && (
                <Link to="/marketplace" className="flex items-center gap-2 mr-4">
                  {userType === 'transporter' ? (
                    <>
                      <Package className="h-4 w-4" style={{ color: iconColor }} />
                      <Badge variant="outline" className={`${badgeClass} animate-pulse-light`}>
                        {t("marketplace.transporter")}
                      </Badge>
                    </>
                  ) : (
                    <>
                      <Truck className="h-4 w-4" style={{ color: iconColor }} />
                      <Badge variant="outline" className={`${badgeClass} animate-pulse-light`}>
                        {t("marketplace.shipper")}
                      </Badge>
                    </>
                  )}
                </Link>
              )}
            </div>
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <AuthButtons />
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <NavbarToggleButton isOpen={isMenuOpen} onClick={toggleMenu} />
            </div>
          </div>
        </div>

        <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </nav>
      
      {user && <BottomNavigation />}
    </>
  );
};

export default Navbar;
