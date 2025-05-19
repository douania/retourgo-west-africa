
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import FreightList from "@/components/freight/FreightList";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MapPin, TruckIcon, Search, Filter, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useUserTheme } from "@/hooks/useUserTheme";
import Navbar from "@/components/Navbar";

const FreightMarketplace = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showReturnOnly, setShowReturnOnly] = useState(false);
  const [showNearbyOnly, setShowNearbyOnly] = useState(false);
  const [hasReturnRoute, setHasReturnRoute] = useState(false);
  const { themeClass, primaryColor, switchClass, userType } = useUserTheme();
  
  useEffect(() => {
    if (!user) return;

    const fetchUserProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('return_destination')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Erreur lors de la récupération des données de profil:', error);
          return;
        }

        if (data) {
          setHasReturnRoute(!!data.return_destination);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
      }
    };

    fetchUserProfile();
  }, [user]);

  return (
    <>
      <Navbar />
      <div className={`min-h-screen py-20 ${themeClass}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                {userType === 'transporter' ? (
                  <>
                    <Search className="h-8 w-8" style={{ color: primaryColor }} />
                    Marchandises disponibles
                  </>
                ) : (
                  <>
                    <TruckIcon className="h-8 w-8" style={{ color: primaryColor }} />
                    Transporteurs disponibles
                  </>
                )}
                <span style={{ color: primaryColor }}> RetourGo</span>
              </h1>
              <p className="mt-2 text-gray-600">
                {userType === 'transporter' 
                  ? "Trouvez des marchandises disponibles et optimisez vos trajets retour" 
                  : "Trouvez des transporteurs fiables pour vos marchandises"}
              </p>
            </div>
            
            {user && userType !== 'transporter' && (
              <Button 
                onClick={() => navigate("/new-freight")}
                className="shipper-accent"
              >
                Publier une marchandise
              </Button>
            )}
          </div>

          {userType === 'transporter' && (
            <Card className="mb-6 shadow-md border">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-2 bg-white/50 p-2 rounded-xl">
                    <Switch 
                      id="nearby-filter" 
                      checked={showNearbyOnly}
                      onCheckedChange={setShowNearbyOnly}
                      className={switchClass}
                    />
                    <Label htmlFor="nearby-filter" className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" style={{ color: primaryColor }} />
                      <span>Marchandises à proximité</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-white/50 p-2 rounded-xl">
                    <Switch 
                      id="return-filter" 
                      checked={showReturnOnly}
                      onCheckedChange={setShowReturnOnly}
                      disabled={!hasReturnRoute}
                      className={switchClass}
                    />
                    <Label htmlFor="return-filter" className="flex items-center gap-1">
                      <TruckIcon className="h-4 w-4" style={{ color: primaryColor }} />
                      <span>{hasReturnRoute ? 'Compatible avec mon trajet retour' : 'Définissez votre trajet retour'}</span>
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

                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    Plus de filtres
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          <FreightList 
            showNearbyOnly={showNearbyOnly}
            showReturnOnly={showReturnOnly}
            showReturnPricing={userType === 'transporter'}
          />
        </div>
      </div>
    </>
  );
};

export default FreightMarketplace;
