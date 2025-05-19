
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserTheme } from "@/hooks/useUserTheme";
import { Truck, Package, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LanguageSelector } from "./LanguageSelector";
import { useTranslation } from "@/hooks/useTranslation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const { user, signOut } = useAuth();
  const { userType, badgeClass, iconColor } = useUserTheme();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await signOut();
    onClose();
  };

  return (
    <div
      className={`${
        isOpen ? "block" : "hidden"
      } sm:hidden absolute top-16 inset-x-0 z-50 bg-white shadow-lg`}
    >
      <div className="px-2 pt-2 pb-3 space-y-1 border-b">
        <Link
          to="/"
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
          onClick={onClose}
        >
          {t("nav.home")}
        </Link>
        <Link
          to="/how-it-works"
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
          onClick={onClose}
        >
          {t("nav.how_it_works")}
        </Link>
        <Link
          to="/pricing"
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
          onClick={onClose}
        >
          {t("nav.pricing")}
        </Link>
        <Link
          to="/contact"
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
          onClick={onClose}
        >
          {t("nav.contact")}
        </Link>
      </div>

      {user && (
        <Fragment>
          <div className="px-2 pt-2 pb-3 space-y-1 border-b">
            <Link
              to="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              {t("nav.dashboard")}
            </Link>
            <Link
              to="/marketplace"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              <div className="flex items-center">
                {userType === 'transporter' ? (
                  <>
                    <Package className="h-4 w-4 mr-2" style={{ color: iconColor }} />
                    <Badge variant="outline" className={badgeClass}>
                      {t("marketplace.transporter")}
                    </Badge>
                  </>
                ) : (
                  <>
                    <Truck className="h-4 w-4 mr-2" style={{ color: iconColor }} />
                    <Badge variant="outline" className={badgeClass}>
                      {t("marketplace.shipper")}
                    </Badge>
                  </>
                )}
              </div>
            </Link>
            {userType !== 'transporter' && (
              <Link
                to="/new-freight"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={onClose}
              >
                {t("nav.publish_merchandise")}
              </Link>
            )}
            {userType === 'transporter' && (
              <Link
                to="/vehicle-selection"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={onClose}
              >
                {t("nav.manage_vehicles")}
              </Link>
            )}
          </div>
          <div className="px-2 pt-2 pb-3 space-y-1 border-b">
            <Link
              to="/profile"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              {t("nav.my_profile")}
            </Link>
            <Link
              to="/history"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              {t("nav.history")}
            </Link>
            <button
              className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" /> {t("nav.logout")}
            </button>
          </div>
        </Fragment>
      )}
      
      <div className="px-5 py-4 flex items-center justify-between">
        <span className="text-sm text-gray-500">{t("language.title")}:</span>
        <LanguageSelector />
      </div>
    </div>
  );
};

export default MobileMenu;
