
import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type UserTheme = {
  userType: 'transporter' | 'shipper' | 'individual' | null;
  themeClass: string;
  primaryColor: string;
  secondaryColor: string;
  accentClass: string;
  badgeClass: string;
  switchClass: string;
  iconColor: string;
  gradientClass: string;
};

export function useUserTheme() {
  const { user } = useAuth();
  const [userType, setUserType] = useState<'transporter' | 'shipper' | 'individual' | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchUserType = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Erreur lors de la récupération du type d\'utilisateur:', error);
          return;
        }

        if (data) {
          setUserType(data.user_type as 'transporter' | 'shipper' | 'individual');
        }
      } catch (err) {
        console.error("Erreur lors de la récupération du type d'utilisateur:", err);
      }
    };

    fetchUserType();
  }, [user]);

  const theme = useMemo(() => {
    if (userType === 'transporter') {
      return {
        userType,
        themeClass: 'transporter-theme',
        primaryColor: '#9b87f5',
        secondaryColor: '#e5deff',
        accentClass: 'transporter-accent',
        badgeClass: 'transporter-badge',
        switchClass: 'data-[state=checked]:bg-transporter',
        iconColor: '#9b87f5',
        gradientClass: 'bg-gradient-to-r from-transporter to-transporter/80',
      };
    } else if (userType === 'shipper' || userType === 'individual') {
      return {
        userType,
        themeClass: 'shipper-theme',
        primaryColor: '#FF6B00',
        secondaryColor: '#fff1e6',
        accentClass: 'shipper-accent',
        badgeClass: 'shipper-badge',
        switchClass: 'data-[state=checked]:bg-retourgo-orange',
        iconColor: '#FF6B00',
        gradientClass: 'bg-gradient-to-r from-shipper to-shipper/80',
      };
    }

    // Default theme
    return {
      userType: null,
      themeClass: '',
      primaryColor: '#FF6B00',
      secondaryColor: '#fff1e6',
      accentClass: 'bg-retourgo-orange hover:bg-retourgo-orange/90',
      badgeClass: 'bg-retourgo-orange/10 text-retourgo-orange border-retourgo-orange',
      switchClass: 'data-[state=checked]:bg-retourgo-green',
      iconColor: '#FF6B00',
      gradientClass: 'bg-gradient-to-r from-retourgo-orange to-retourgo-orange/80',
    };
  }, [userType]);

  return theme;
}
