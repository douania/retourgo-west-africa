
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import FreightCard, { Freight } from "./FreightCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { estimateDistance } from "@/lib/pricing";

interface FreightListProps {
  showNearbyOnly?: boolean;
  showReturnOnly?: boolean;
  showReturnPricing?: boolean;
}

const FreightList = ({ 
  showNearbyOnly = false, 
  showReturnOnly = false,
  showReturnPricing = false
}: FreightListProps) => {
  const [freights, setFreights] = useState<Freight[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPosition, setCurrentPosition] = useState<{lat: number; lng: number} | null>(null);
  const [returnDestination, setReturnDestination] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Récupération de la position actuelle si nécessaire
  useEffect(() => {
    if (showNearbyOnly && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          toast({
            title: "Erreur de localisation",
            description: "Impossible d'obtenir votre position actuelle. Veuillez l'autoriser dans les paramètres de votre navigateur.",
            variant: "destructive",
          });
        }
      );
    }
  }, [showNearbyOnly, toast]);

  // Récupération du trajet retour si nécessaire
  useEffect(() => {
    if (!user || !showReturnOnly) return;

    const fetchReturnRoute = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('return_destination')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération du trajet retour:', error);
        return;
      }

      setReturnDestination(data.return_destination);
    };

    fetchReturnRoute();
  }, [user, showReturnOnly]);

  useEffect(() => {
    const fetchFreights = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('freights')
          .select('*')
          .order('created_at', { ascending: false })
          .eq('status', 'available');

        if (error) throw error;
        
        // Filtrer les frets selon les critères
        let filteredFreights = data as Freight[];
        
        // Appliquer la réduction pour le retour à vide si demandé
        if (showReturnPricing && user) {
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('is_available')
            .eq('id', user.id)
            .single();
            
          if (userProfile?.is_available) {
            filteredFreights = filteredFreights.map(freight => ({
              ...freight,
              isReturnTrip: true,
              originalPrice: freight.price,
              price: Math.round(freight.price * 0.7) // 30% de réduction
            }));
          }
        }
        
        setFreights(filteredFreights);
      } catch (error: any) {
        toast({
          title: "Erreur lors du chargement des frets",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFreights();
  }, [toast, user, showReturnPricing, currentPosition, returnDestination]);

  const handleSearch = () => {
    if (!searchTerm) return;
    
    const filtered = freights.filter(
      freight =>
        freight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freight.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freight.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFreights(filtered);
  };

  const resetSearch = async () => {
    setSearchTerm("");
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('freights')
        .select('*')
        .order('created_at', { ascending: false })
        .eq('status', 'available');

      if (error) throw error;
      setFreights(data as Freight[]);
    } catch (error: any) {
      toast({
        title: "Erreur lors du chargement des frets",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <Input
            placeholder="Rechercher un fret par titre ou ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <Button onClick={handleSearch} className="bg-retourgo-green hover:bg-retourgo-green/90">
          Rechercher
        </Button>
        <Button variant="outline" onClick={resetSearch}>
          Réinitialiser
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-[300px] rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {freights.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700">Aucun fret disponible</h3>
              <p className="text-gray-500 mt-2">Aucun fret ne correspond à votre recherche ou il n'y a pas de frets disponibles actuellement.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {freights.map((freight) => (
                <FreightCard 
                  key={freight.id} 
                  freight={freight} 
                  showReturnDiscount={showReturnPricing && freight.isReturnTrip}
                  originalPrice={freight.originalPrice}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FreightList;
