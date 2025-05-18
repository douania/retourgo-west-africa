
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import FreightList from "@/components/freight/FreightList";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MapPin, TruckIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FreightMarketplace = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isTransporter, setIsTransporter] = useState(false);
  const [showReturnOnly, setShowReturnOnly] = useState(false);
  const [showNearbyOnly, setShowNearbyOnly] = useState(false);
  const [hasReturnRoute, setHasReturnRoute] = useState(false);
  
  useEffect(() => {
    if (!user) return;

    const fetchUserType = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('user_type, return_destination')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Erreur lors de la récupération du type d\'utilisateur:', error);
          return;
        }

        if (data) {
          setIsTransporter(data.user_type === 'transporter');
          setHasReturnRoute(!!data.return_destination);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
      }
    };

    fetchUserType();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Place de marché <span className="text-retourgo-orange">RetourGo</span>
            </h1>
            <p className="mt-2 text-gray-600">
              Trouvez des frets disponibles et optimisez vos trajets retour
            </p>
          </div>
          
          {user && (
            <Button 
              onClick={() => navigate("/new-freight")}
              className="bg-retourgo-orange hover:bg-retourgo-orange/90"
            >
              Publier un fret
            </Button>
          )}
        </div>

        {isTransporter && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch 
                    id="nearby-filter" 
                    checked={showNearbyOnly}
                    onCheckedChange={setShowNearbyOnly}
                    className="data-[state=checked]:bg-retourgo-green"
                  />
                  <Label htmlFor="nearby-filter" className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>Frets à proximité uniquement</span>
                  </Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch 
                    id="return-filter" 
                    checked={showReturnOnly}
                    onCheckedChange={setShowReturnOnly}
                    disabled={!hasReturnRoute}
                    className="data-[state=checked]:bg-retourgo-green"
                  />
                  <Label htmlFor="return-filter" className="flex items-center gap-1">
                    <TruckIcon className="h-4 w-4" />
                    <span>Compatible avec mon trajet retour</span>
                    {!hasReturnRoute && (
                      <span className="text-xs text-orange-500">(Définissez d'abord votre trajet retour)</span>
                    )}
                  </Label>
                </div>
                
                {!hasReturnRoute && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate("/dashboard")}
                    className="ml-auto"
                  >
                    Définir mon trajet retour
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        
        <FreightList 
          showNearbyOnly={showNearbyOnly}
          showReturnOnly={showReturnOnly}
          showReturnPricing={true}
        />
      </div>
    </div>
  );
};

export default FreightMarketplace;
