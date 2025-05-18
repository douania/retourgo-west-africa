
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, Package, ArrowDown, ArrowUp } from "lucide-react";
import { useUserTheme } from "@/hooks/useUserTheme";
import { Freight, TransportOffer } from "@/types/freight";

const History = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userType, primaryColor, iconColor, gradientClass } = useUserTheme();
  const [loading, setLoading] = useState(true);
  const [completedFreights, setCompletedFreights] = useState<Freight[]>([]);
  const [completedOffers, setCompletedOffers] = useState<TransportOffer[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchUserHistory = async () => {
      try {
        if (userType === 'shipper' || userType === 'individual') {
          // Fetch completed freights for shippers
          const { data, error } = await supabase
            .from('freights')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'completed')
            .order('updated_at', { ascending: false });

          if (error) throw error;
          setCompletedFreights(data as Freight[] || []);
        } else if (userType === 'transporter') {
          // Fetch completed transport offers for transporters
          const { data, error } = await supabase
            .from('transport_offers')
            .select(`
              *,
              freights:freight_id(*)
            `)
            .eq('transporter_id', user.id)
            .eq('status', 'completed')
            .order('updated_at', { ascending: false });

          if (error) throw error;
          setCompletedOffers(data as unknown as TransportOffer[] || []);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger votre historique",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (userType) {
      fetchUserHistory();
    }
  }, [user, navigate, toast, userType]);

  if (!user) return null;

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 sm:px-6 lg:px-8">
      <div className={`${gradientClass} text-white p-6 rounded-xl mb-6`}>
        <h1 className="text-2xl font-bold">Historique de mes activités</h1>
        <p className="text-white/80">Consultez l'historique de vos frets et transports</p>
      </div>

      <Tabs defaultValue="completed" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="completed">
            {userType === 'transporter' ? 'Transports effectués' : 'Frets expédiés'}
          </TabsTrigger>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="completed">
          {loading ? (
            <p className="text-center py-12">Chargement...</p>
          ) : userType === 'transporter' ? (
            completedOffers.length > 0 ? (
              <div className="space-y-4">
                {completedOffers.map(offer => (
                  <Card key={offer.id} className="p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition" onClick={() => navigate(`/freight/${offer.freight_id}`)}>
                    <div className="flex items-center">
                      <div className="bg-purple-100 p-2 rounded-full mr-4">
                        <Truck className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{offer.freights?.title || 'Transport'}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(offer.updated_at || '').toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <ArrowUp className="h-5 w-5 text-green-500" />
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <h3 className="text-lg font-medium text-gray-700">Aucun transport effectué</h3>
                <p className="text-gray-500">Votre historique apparaîtra ici</p>
              </div>
            )
          ) : completedFreights.length > 0 ? (
            <div className="space-y-4">
              {completedFreights.map(freight => (
                <Card key={freight.id} className="p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition" onClick={() => navigate(`/freight/${freight.id}`)}>
                  <div className="flex items-center">
                    <div className="bg-orange-100 p-2 rounded-full mr-4">
                      <Package className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{freight.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(freight.updated_at || '').toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <ArrowDown className="h-5 w-5 text-blue-500" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <h3 className="text-lg font-medium text-gray-700">Aucun fret expédié</h3>
              <p className="text-gray-500">Votre historique apparaîtra ici</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="payments">
          <div className="text-center py-12">
            <ArrowDown className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <h3 className="text-lg font-medium text-gray-700">Aucun paiement récent</h3>
            <p className="text-gray-500">Votre historique de paiements apparaîtra ici</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default History;
