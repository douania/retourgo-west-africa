
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="sm:hidden">
      <div className="pt-2 pb-3 space-y-1">
        <Link
          to="/"
          className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          onClick={onClose}
        >
          Accueil
        </Link>
        <Link
          to="/marketplace"
          className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          onClick={onClose}
        >
          Frets
        </Link>
        <Link
          to="/how-it-works"
          className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          onClick={onClose}
        >
          Comment ça marche
        </Link>
        <Link
          to="/pricing"
          className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          onClick={onClose}
        >
          Tarifs
        </Link>
        <Link
          to="/contact"
          className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          onClick={onClose}
        >
          Contact
        </Link>
      </div>
      <div className="pt-4 pb-3 border-t border-gray-200">
        {user ? (
          <div className="space-y-1">
            <Link
              to="/dashboard"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              onClick={onClose}
            >
              Tableau de bord
            </Link>
            <button
              className="w-full text-left block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              onClick={handleSignOut}
            >
              Déconnexion
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <Link
              to="/login"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              onClick={onClose}
            >
              Connexion
            </Link>
            <Link
              to="/register"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              onClick={onClose}
            >
              Inscription
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
