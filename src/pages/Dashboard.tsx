
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import FreightCard, { Freight } from "@/components/freight/FreightCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [myFreights, setMyFreights] = useState<Freight[]>([]);
  const [myOffers, setMyOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        // Fetch user's freights
        const { data: freights, error: freightsError } = await supabase
          .from('freights')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (freightsError) throw freightsError;
        
        setMyFreights(freights as Freight[]);

        // Fetch user's transport offers if they are a transporter
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();

        if (profile?.user_type === 'transporter') {
          const { data: offers, error: offersError } = await supabase
            .from('transport_offers')
            .select(`
              *,
              freights:freight_id(*)
            `)
            .eq('transporter_id', user.id)
            .order('created_at', { ascending: false });

          if (offersError) throw offersError;
          setMyOffers(offers || []);
        }
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: "Impossible de charger vos données",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate, toast]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Tableau de Bord <span className="text-retourgo-orange">RetourGo</span>
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Gérez vos trajets et optimisez votre fret retour
          </p>
        </div>

        <Alert className="mb-6">
          <AlertTitle className="text-retourgo-orange">Bienvenue sur RetourGo!</AlertTitle>
          <AlertDescription>
            Votre plateforme pour optimiser les trajets retour et réduire les retours à vide.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
          <Card className="p-6 bg-white shadow-md">
            <h2 className="text-xl font-semibold mb-4">Votre Profil</h2>
            <p className="text-gray-700 mb-2">
              <span className="font-medium">Email:</span> {user?.email}
            </p>
            <p className="text-gray-700 mb-4">
              <span className="font-medium">ID:</span>{" "}
              {user?.id.substring(0, 8)}...
            </p>
            <Button
              className="w-full bg-retourgo-orange hover:bg-retourgo-orange/90"
              onClick={() => navigate("/profile")}
            >
              Modifier le profil
            </Button>
          </Card>

          <Card className="p-6 bg-white shadow-md">
            <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
            <div className="space-y-3">
              <p className="flex justify-between">
                <span className="text-gray-600">Trajets complétés:</span>
                <span className="font-medium">{myFreights.filter(f => f.status === 'completed').length}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Frets transportés:</span>
                <span className="font-medium">{myOffers.filter(o => o.status === 'accepted').length}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Frets disponibles:</span>
                <span className="font-medium">{myFreights.filter(f => f.status === 'available').length}</span>
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-md">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="space-y-3">
              <Button
                className="w-full bg-retourgo-green hover:bg-retourgo-green/90 mb-2"
                onClick={() => navigate("/new-freight")}
              >
                Publier un fret
              </Button>
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 mb-2"
                onClick={() => navigate("/marketplace")}
              >
                Place de marché
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={signOut}
              >
                Se déconnecter
              </Button>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="my-freights" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="my-freights">Mes Frets</TabsTrigger>
            <TabsTrigger value="my-offers">Mes Offres</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-freights">
            {loading ? (
              <p className="text-center py-12 text-gray-500">Chargement...</p>
            ) : (
              <>
                {myFreights.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold text-gray-700">Aucun fret</h3>
                    <p className="text-gray-500 mt-2">Vous n'avez pas encore publié de fret.</p>
                    <Button 
                      onClick={() => navigate("/new-freight")} 
                      className="mt-6 bg-retourgo-orange hover:bg-retourgo-orange/90"
                    >
                      Publier un fret
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myFreights.map((freight) => (
                      <FreightCard key={freight.id} freight={freight} />
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="my-offers">
            {loading ? (
              <p className="text-center py-12 text-gray-500">Chargement...</p>
            ) : (
              <>
                {myOffers.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold text-gray-700">Aucune offre</h3>
                    <p className="text-gray-500 mt-2">Vous n'avez pas encore fait d'offre sur un fret.</p>
                    <Button 
                      onClick={() => navigate("/marketplace")} 
                      className="mt-6 bg-retourgo-green hover:bg-retourgo-green/90"
                    >
                      Voir les frets disponibles
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myOffers.map((offer) => (
                      <Card key={offer.id} className="overflow-hidden hover:shadow-md">
                        <div className="p-4 border-b border-gray-200">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">{offer.freights.title}</h3>
                            <Badge 
                              variant={
                                offer.status === 'pending' ? 'default' : 
                                offer.status === 'accepted' ? 'success' : 
                                'secondary'
                              }
                            >
                              {offer.status === 'pending' ? 'En attente' : 
                               offer.status === 'accepted' ? 'Acceptée' : 
                               'Refusée'}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                            <MapPin className="h-4 w-4 text-retourgo-orange" />
                            <span>{offer.freights.origin} → {offer.freights.destination}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">{offer.price_offered} €</span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/freight/${offer.freight_id}`)}
                            >
                              Voir le fret
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
