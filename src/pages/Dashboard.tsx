
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
import { Truck, Package, QrCode, Bell, History } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [myFreights, setMyFreights] = useState<Freight[]>([]);
  const [myOffers, setMyOffers] = useState<TransportOffer[]>([]);
  const [nearbyFreights, setNearbyFreights] = useState<Freight[]>([]);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);
  const { themeClass, primaryColor, iconColor, userType: themeUserType } = useUserTheme();

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
    <div className={`min-h-screen pt-20 pb-20 px-4 sm:px-6 lg:px-8 ${themeClass}`}>
      <div className="max-w-7xl mx-auto">
        {/* En-tête inspiré par Wave/Orange Money */}
        <div className="text-center mb-6">
          {themeUserType === 'transporter' ? (
            <div className="bg-gradient-to-r from-transporter to-transporter/80 rounded-xl p-6 mb-6 text-white shadow-lg">
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <h1 className="text-2xl font-bold">Bonjour, {user?.user_metadata?.name || 'Transporteur'}</h1>
                  <p className="opacity-90">Transporteur RetourGo</p>
                </div>
                <div className="bg-white/20 p-2 rounded-full">
                  <UserIcon className="h-10 w-10" />
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <div 
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 w-full max-w-xs flex flex-col items-center gap-2"
                  onClick={() => navigate("/profile")}
                >
                  <QrCode className="h-8 w-8" />
                  <span className="text-sm font-medium">Voir mon QR Code</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-shipper to-shipper/80 rounded-xl p-6 mb-6 text-white shadow-lg">
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <h1 className="text-2xl font-bold">Bonjour, {user?.user_metadata?.name || 'Expéditeur'}</h1>
                  <p className="opacity-90">Expéditeur RetourGo</p>
                </div>
                <div className="bg-white/20 p-2 rounded-full">
                  <UserIcon className="h-10 w-10" />
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <div 
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 w-full max-w-xs flex flex-col items-center gap-2"
                  onClick={() => navigate("/profile")}
                >
                  <QrCode className="h-8 w-8" />
                  <span className="text-sm font-medium">Voir mon QR Code</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions rapides inspirées de Wave/Orange Money */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card 
            className="p-4 text-center hover:shadow-md transition-all cursor-pointer bg-white"
            onClick={() => navigate("/marketplace")}
          >
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-3 rounded-full mb-2">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-sm font-medium">Trouver un fret</h3>
            </div>
          </Card>
          
          <Card 
            className="p-4 text-center hover:shadow-md transition-all cursor-pointer bg-white"
            onClick={() => navigate("/new-freight")}
          >
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-3 rounded-full mb-2">
                <Truck className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-sm font-medium">Publier un fret</h3>
            </div>
          </Card>
          
          <Card 
            className="p-4 text-center hover:shadow-md transition-all cursor-pointer bg-white"
            onClick={() => navigate("/history")}
          >
            <div className="flex flex-col items-center">
              <div className="bg-amber-100 p-3 rounded-full mb-2">
                <History className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-sm font-medium">Historique</h3>
            </div>
          </Card>
          
          <Card 
            className="p-4 text-center hover:shadow-md transition-all cursor-pointer bg-white"
            onClick={() => navigate("/notifications")}
          >
            <div className="flex flex-col items-center">
              <div className="bg-purple-100 p-3 rounded-full mb-2">
                <Bell className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-sm font-medium">Notifications</h3>
            </div>
          </Card>
        </div>

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
