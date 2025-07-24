import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useDashboardData = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [freights, setFreights] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setProfile(profileData);

        // Fetch freights
        const { data: freightsData } = await supabase
          .from('freights')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);
        
        setFreights(freightsData || []);

        // Fetch offers - disabled until table exists
        // const { data: offersData } = await supabase
        //   .from('transport_offers')
        //   .select('*')
        //   .eq('user_id', user.id)
        //   .order('created_at', { ascending: false })
        //   .limit(20);
        
        // setOffers(offersData || []);
        
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  return {
    profile,
    freights,
    offers,
    isLoading,
    error,
  };
};