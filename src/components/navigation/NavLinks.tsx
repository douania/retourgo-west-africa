
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";

const NavLinks = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
      <Link
        to="/"
        className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
      >
        {t("nav.home")}
      </Link>

      <Link
        to="/how-it-works"
        className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
      >
        {t("nav.how_it_works")}
      </Link>

      <Link
        to="/pricing"
        className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
      >
        {t("nav.pricing")}
      </Link>

      <Link
        to="/contact"
        className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
      >
        {t("nav.contact")}
      </Link>

      {user && (
        <Link
          to="/ai"
          className="inline-flex items-center px-3 py-1 rounded-full border-2 border-retourgo-orange text-sm font-medium text-retourgo-orange bg-transparent hover:bg-retourgo-orange/10"
        >
          {t("nav.ai_tools")}
        </Link>
      )}
    </div>
  );
};

export default NavLinks;
