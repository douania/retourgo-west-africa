
import { useState } from "react";
import { Link } from "react-router-dom";
import AppLogo from "@/components/ui/AppLogo";
import NavLinks from "@/components/navigation/NavLinks";
import AuthButtons from "@/components/navigation/AuthButtons";
import MobileMenu from "@/components/navigation/MobileMenu";
import NavbarToggleButton from "@/components/navigation/NavbarToggleButton";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <AppLogo />
            </div>
            <NavLinks />
          </div>
          <AuthButtons />
          <div className="-mr-2 flex items-center sm:hidden">
            <NavbarToggleButton isOpen={isMenuOpen} onClick={toggleMenu} />
          </div>
        </div>
      </div>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </nav>
  );
};

export default Navbar;
