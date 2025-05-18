
import { Link } from "react-router-dom";

const NavLinks = () => {
  return (
    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
      <Link
        to="/"
        className="border-transparent text-gray-500 hover:border-retourgo-green hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
      >
        Accueil
      </Link>
      <Link
        to="/marketplace"
        className="border-transparent text-gray-500 hover:border-retourgo-green hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
      >
        Frets
      </Link>
      <Link
        to="/how-it-works"
        className="border-transparent text-gray-500 hover:border-retourgo-green hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
      >
        Comment ça marche
      </Link>
      <Link
        to="/pricing"
        className="border-transparent text-gray-500 hover:border-retourgo-green hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
      >
        Tarifs
      </Link>
      <Link
        to="/contact"
        className="border-transparent text-gray-500 hover:border-retourgo-green hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
      >
        Contact
      </Link>
    </div>
  );
};

export default NavLinks;
