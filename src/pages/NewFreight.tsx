
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import FreightForm from "@/components/freight/FreightForm";
import { useUserTheme } from "@/hooks/useUserTheme";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const NewFreight = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { userType } = useUserTheme();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
      return;
    }
    
    // Rediriger les transporteurs vers la page marketplace
    if (!isLoading && user && userType === 'transporter') {
      navigate("/marketplace");
    }
  }, [user, isLoading, navigate, userType]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-xl text-gray-700">Chargement...</p>
      </div>
    );
  }

  // Afficher un message d'accès refusé pour les transporteurs (au cas où la redirection échoue)
  if (userType === 'transporter') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <AlertCircle className="h-12 w-12 text-orange-500 mb-4" />
                <h2 className="text-xl font-bold mb-2">Accès limité</h2>
                <p className="text-gray-600 mb-4">
                  En tant que transporteur, vous ne pouvez pas publier de marchandise. 
                  Vous pouvez rechercher des marchandises disponibles pour le transport.
                </p>
                <Button 
                  onClick={() => navigate("/marketplace")}
                  className="bg-transporter hover:bg-transporter/90"
                >
                  Voir les marchandises disponibles
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <FreightForm />
      </div>
    </div>
  );
};

export default NewFreight;
