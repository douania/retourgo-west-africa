
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                <span className="font-medium">0</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Frets transportés:</span>
                <span className="font-medium">0</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Note moyenne:</span>
                <span className="font-medium">N/A</span>
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
                onClick={() => navigate("/map")}
              >
                Voir la carte
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
      </div>
    </div>
  );
};

export default Dashboard;
