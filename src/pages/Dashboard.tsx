
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import TransporterDashboard from "@/components/dashboard/TransporterDashboard";
import ShipperDashboard from "@/components/dashboard/ShipperDashboard";
import { Freight, TransportOffer } from "@/types/freight";
import { useUserTheme } from "@/hooks/useUserTheme";
import { Truck, Package } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [myFreights, setMyFreights] = useState<Freight[]>([]);
  const [myOffers, setMyOffers] = useState<TransportOffer[]>([]);
  const [nearbyFreights, setNearbyFreights] = useState<Freight[]>([]);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);
  const { themeClass, iconColor, userType: themeUserType } = useUserTheme();

  // Icon based on user type
  const UserIcon = themeUserType === 'transporter' ? Truck : Package;

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        // Fetch user's profile to get user type
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setUserType(profile?.user_type || null);
        
        // Fetch user's freights (for shippers)
        if (profile?.user_type === 'shipper' || profile?.user_type === 'individual') {
          const { data: freights, error: freightsError } = await supabase
            .from('freights')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (freightsError) throw freightsError;
          setMyFreights(freights as Freight[]);
        }

        // Fetch nearby freights and transport offers (for transporters)
        if (profile?.user_type === 'transporter') {
          // Fetch user's transport offers
          const { data: offers, error: offersError } = await supabase
            .from('transport_offers')
            .select(`
              *,
              freights:freight_id(*)
            `)
            .eq('transporter_id', user.id)
            .order('created_at', { ascending: false });

          if (offersError) throw offersError;
          // Ensure we cast the offers to the correct type
          setMyOffers(offers as unknown as TransportOffer[]);

          // Fetch nearby freights (all available freights for now)
          const { data: nearby, error: nearbyError } = await supabase
            .from('freights')
            .select('*')
            .eq('status', 'available')
            .order('created_at', { ascending: false })
            .limit(6);

          if (nearbyError) throw nearbyError;
          setNearbyFreights(nearby as Freight[] || []);
        }
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: "Impossible de charger vos données",
          variant: "destructive",
        });
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate, toast]);

  if (!user) return null;

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${themeClass}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <UserIcon className="h-10 w-10" style={{ color: iconColor }} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Tableau de Bord <span style={{ color: iconColor }}>RetourGo</span>
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {themeUserType === 'transporter' 
              ? 'Gérez vos trajets et maximisez votre rentabilité' 
              : 'Gérez vos expéditions et trouvez des transporteurs fiables'}
          </p>
        </div>

        <Alert className="mb-6 shadow-md border border-l-4" style={{ borderLeftColor: iconColor }}>
          <AlertTitle style={{ color: iconColor }}>Bienvenue sur RetourGo!</AlertTitle>
          <AlertDescription>
            {themeUserType === 'transporter' 
              ? 'Trouvez des frets pour optimiser vos trajets retour et réduire les retours à vide.'
              : 'Publiez vos frets et trouvez rapidement des transporteurs fiables pour vos marchandises.'}
          </AlertDescription>
        </Alert>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Chargement de votre tableau de bord...</p>
          </div>
        ) : userType ? (
          <>
            {userType === 'transporter' ? (
              <TransporterDashboard 
                offers={myOffers} 
                nearbyFreights={nearbyFreights} 
              />
            ) : (
              <ShipperDashboard 
                myFreights={myFreights} 
              />
            )}
          </>
        ) : (
          <Card className="p-8 text-center">
            <h3 className="text-xl font-bold mb-4">Type d'utilisateur non défini</h3>
            <p className="mb-6">Votre profil utilisateur n'est pas correctement configuré.</p>
            <Button onClick={() => navigate("/profile")}>
              Configurer mon profil
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
