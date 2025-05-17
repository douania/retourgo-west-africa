
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import FreightList from "@/components/freight/FreightList";

const FreightMarketplace = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
        
        <FreightList />
      </div>
    </div>
  );
};

export default FreightMarketplace;
