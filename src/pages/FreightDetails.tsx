
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, TruckIcon, Package, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Freight } from "@/components/freight/FreightCard";
import { Skeleton } from "@/components/ui/skeleton";

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  user_type: string;
  rating: number;
}

const FreightDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [freight, setFreight] = useState<Freight | null>(null);
  const [shipper, setShipper] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchFreightDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('freights')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        setFreight(data as Freight);
        
        // Fetch shipper profile
        if (data) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user_id)
            .single();
            
          if (profileError) throw profileError;
          setShipper(profileData as UserProfile);
        }
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails du fret",
          variant: "destructive",
        });
        console.error("Error fetching freight details:", error);
        navigate('/marketplace');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFreightDetails();
    }
  }, [id, toast, navigate]);

  const handleApplyForFreight = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour postuler à ce fret",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    try {
      const { error } = await supabase
        .from('transport_offers')
        .insert([
          {
            freight_id: id,
            transporter_id: user.id,
            status: 'pending',
            price_offered: freight?.price
          }
        ]);

      if (error) throw error;
      
      toast({
        title: "Demande envoyée",
        description: "Votre demande a été envoyée avec succès",
      });
      
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <Skeleton className="h-12 w-3/4 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Skeleton className="h-[400px] rounded-lg" />
            </div>
            <Skeleton className="h-[400px] rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!freight) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Fret non trouvé</h2>
          <p className="text-gray-600 mt-2">Le fret que vous recherchez n'existe pas ou a été supprimé.</p>
          <Button 
            onClick={() => navigate('/marketplace')}
            className="mt-6"
          >
            Retour à la place de marché
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{freight.title}</h1>
          <Button 
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Retour
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Détails du fret</CardTitle>
                  <Badge variant={freight.status === "available" ? "success" : "secondary"}>
                    {freight.status === "available" ? "Disponible" : "Attribué"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-700">{freight.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-retourgo-orange" />
                      <div>
                        <p className="text-sm text-gray-500">Origine</p>
                        <p className="font-medium">{freight.origin}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-retourgo-orange" />
                      <div>
                        <p className="text-sm text-gray-500">Date de chargement</p>
                        <p className="font-medium">{new Date(freight.pickup_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-retourgo-orange" />
                      <div>
                        <p className="text-sm text-gray-500">Poids</p>
                        <p className="font-medium">{freight.weight} kg</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-retourgo-green" />
                      <div>
                        <p className="text-sm text-gray-500">Destination</p>
                        <p className="font-medium">{freight.destination}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-retourgo-green" />
                      <div>
                        <p className="text-sm text-gray-500">Date de livraison</p>
                        <p className="font-medium">{new Date(freight.delivery_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <TruckIcon className="h-5 w-5 text-retourgo-green" />
                      <div>
                        <p className="text-sm text-gray-500">Volume</p>
                        <p className="font-medium">{freight.volume} m³</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-bold text-retourgo-orange">{freight.price} €</p>
                    {freight.status === "available" && user?.id !== freight.user_id && (
                      <Button 
                        onClick={handleApplyForFreight}
                        className="bg-retourgo-green hover:bg-retourgo-green/90"
                      >
                        Postuler pour ce fret
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Expéditeur</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {shipper ? (
                  <>
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-retourgo-orange" />
                      <div>
                        <p className="font-medium">{shipper.first_name} {shipper.last_name}</p>
                        <p className="text-sm text-gray-500">{shipper.user_type === "shipper" ? "Expéditeur" : shipper.user_type === "transporter" ? "Transporteur" : "Particulier"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex mr-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              star <= (shipper.rating || 0)
                                ? "text-yellow-300"
                                : "text-gray-300"
                            }`}
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500">
                        {shipper.rating ? `${shipper.rating}/5` : "Pas encore noté"}
                      </p>
                    </div>
                    
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => {/* Contact functionality would be added here */}}
                    >
                      Contacter l'expéditeur
                    </Button>
                  </>
                ) : (
                  <p className="text-gray-500">Informations sur l'expéditeur non disponibles</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreightDetails;
