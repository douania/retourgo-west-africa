
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import FreightCard, { Freight } from "./FreightCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const FreightList = () => {
  const [freights, setFreights] = useState<Freight[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchFreights = async () => {
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

    fetchFreights();
  }, [toast]);

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
                <FreightCard key={freight.id} freight={freight} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FreightList;
