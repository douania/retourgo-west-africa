import { Link, useLocation } from 'react-router-dom';
import { Home, Package, Map, User, MessageSquare, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  requiresAuth?: boolean;
}

export const MobileNavigation = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      icon: Home,
      label: t('navigation.home'),
      href: '/',
    },
    {
      icon: Package,
      label: t('navigation.freight'),
      href: '/freight',
    },
    {
      icon: Map,
      label: t('navigation.map'),
      href: '/map',
    },
    {
      icon: MessageSquare,
      label: t('navigation.ai_assistant'),
      href: '/ai-assistant',
    },
    {
      icon: User,
      label: user ? t('navigation.dashboard') : t('navigation.login'),
      href: user ? '/dashboard' : '/login',
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Bottom Navigation - Fixed */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
        <div className="grid h-16 max-w-lg grid-cols-5 mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "inline-flex flex-col items-center justify-center px-2 py-2 text-xs font-medium",
                  "min-h-[64px] min-w-[44px]", // Standards tactiles
                  "transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  "active:scale-95 transform transition-transform", // Feedback tactile
                  active 
                    ? "text-primary bg-primary/10" 
                    : "text-gray-500 hover:text-primary hover:bg-gray-50"
                )}
                aria-label={item.label}
              >
                <Icon className={cn(
                  "w-5 h-5 mb-1 transition-transform duration-200",
                  active && "scale-110"
                )} />
                <span className={cn(
                  "text-xs font-medium truncate max-w-full",
                  active && "font-semibold"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer pour éviter que le contenu soit caché par la nav fixe */}
      <div className="h-16 md:hidden" />
    </>
  );
};