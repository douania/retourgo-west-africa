
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AuthButtons = () => {
  const { user, signOut } = useAuth();
  const [isTransporter, setIsTransporter] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const { toast } = useToast();

  // Vérifier si l'utilisateur est un transporteur
  useEffect(() => {
    if (!user) return;

    const fetchUserType = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('user_type, is_available')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Erreur lors de la récupération du type d\'utilisateur:', error);
          return;
        }

        if (data) {
          setIsTransporter(data.user_type === 'transporter');
          
          // Si l'utilisateur est un transporteur, récupérer son statut de disponibilité
          if (data.user_type === 'transporter') {
            setIsAvailable(data.is_available || false);
          }
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
      }
    };

    fetchUserType();
  }, [user]);

  const toggleAvailability = async () => {
    if (!user) return;
    
    const newStatus = !isAvailable;
    setIsAvailable(newStatus);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_available: newStatus })
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour votre disponibilité",
          variant: "destructive",
        });
        setIsAvailable(!newStatus); // Revenir à l'état précédent
        return;
      }
      
      toast({
        title: newStatus ? "Disponible" : "Non disponible",
        description: newStatus 
          ? "Vous êtes maintenant disponible pour des frets retour" 
          : "Vous n'êtes plus disponible pour des frets retour",
      });
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la disponibilité:", err);
      setIsAvailable(!newStatus);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
      {user ? (
        <>
          {isTransporter && (
            <div className="flex items-center mr-2 gap-2">
              <Switch 
                id="availability-toggle" 
                checked={isAvailable}
                onCheckedChange={toggleAvailability}
                className="data-[state=checked]:bg-retourgo-green"
              />
              <span className="text-sm font-medium text-gray-600">
                {isAvailable ? 'Disponible' : 'Non disponible'}
              </span>
            </div>
          )}
          <Link to="/dashboard">
            <Button variant="outline" size="sm">
              Tableau de bord
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => signOut()}>
            Déconnexion
          </Button>
        </>
      ) : (
        <>
          <Link to="/login">
            <Button variant="outline" size="sm">
              Connexion
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-retourgo-orange hover:bg-retourgo-orange/90" size="sm">
              Inscription
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default AuthButtons;
