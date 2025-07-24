import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import AppLogo from '@/components/ui/AppLogo';
import { LanguageSelector } from './LanguageSelector';
import { cn } from '@/lib/utils';

export const ResponsiveNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { t } = useTranslation();

  const navigation = [
    { name: t('navigation.home'), href: '/' },
    { name: t('navigation.how_it_works'), href: '/how-it-works' },
    { name: t('navigation.freight'), href: '/freight' },
    { name: t('navigation.pricing'), href: '/pricing' },
    { name: t('navigation.contact'), href: '/contact' },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0" onClick={closeMobileMenu}>
              <AppLogo className="h-8 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium",
                  "transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <LanguageSelector />
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    {t('navigation.dashboard')}
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={signOut}
                  className="min-h-[44px]" // Standard tactile
                >
                  {t('navigation.logout')}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="min-h-[44px]">
                    {t('navigation.login')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="min-h-[44px]">
                    {t('navigation.register')}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                "min-h-[44px] min-w-[44px] p-2", // Standards tactiles
                "focus:outline-none focus:ring-2 focus:ring-primary"
              )}
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={closeMobileMenu}
                className={cn(
                  "block px-3 py-3 text-base font-medium text-gray-700",
                  "hover:text-primary hover:bg-gray-50 rounded-md",
                  "min-h-[48px] flex items-center", // Standard tactile mobile
                  "transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                )}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Auth Section */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="px-3 mb-3">
                <LanguageSelector />
              </div>
              
              {user ? (
                <div className="space-y-2">
                  <Link to="/dashboard" onClick={closeMobileMenu}>
                    <Button 
                      variant="outline" 
                      className="w-full min-h-[48px] justify-start"
                    >
                      {t('navigation.dashboard')}
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={() => { signOut(); closeMobileMenu(); }}
                    className="w-full min-h-[48px] justify-start"
                  >
                    {t('navigation.logout')}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" onClick={closeMobileMenu}>
                    <Button 
                      variant="outline" 
                      className="w-full min-h-[48px] justify-start"
                    >
                      {t('navigation.login')}
                    </Button>
                  </Link>
                  <Link to="/register" onClick={closeMobileMenu}>
                    <Button 
                      className="w-full min-h-[48px] justify-start"
                    >
                      {t('navigation.register')}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};