
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, User, Building, Package } from "lucide-react";

const UserTypeSelection = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const userTypes = [
    {
      id: "individual_transporter",
      title: "Particulier - Transporteur",
      description: "Vous êtes un particulier qui propose des services de transport",
      icon: <Truck className="h-8 w-8 text-retourgo-orange" />
    },
    {
      id: "individual_shipper",
      title: "Particulier - Expéditeur",
      description: "Vous êtes un particulier qui souhaite expédier des marchandises",
      icon: <User className="h-8 w-8 text-retourgo-orange" />
    },
    {
      id: "company_transporter",
      title: "Société de transport",
      description: "Vous représentez une entreprise qui offre des services de transport",
      icon: <Building className="h-8 w-8 text-retourgo-orange" />
    },
    {
      id: "company_shipper",
      title: "Société expéditrice",
      description: "Vous représentez une entreprise qui expédie régulièrement des marchandises",
      icon: <Package className="h-8 w-8 text-retourgo-orange" />
    }
  ];

  const handleContinue = () => {
    if (!selectedType) return;

    // Determine the next step based on user type
    switch (selectedType) {
      case "individual_transporter":
        navigate("/register", { state: { userType: "individual_transporter" } });
        break;
      case "individual_shipper":
        navigate("/register", { state: { userType: "individual_shipper" } });
        break;
      case "company_transporter":
        navigate("/register", { state: { userType: "company_transporter" } });
        break;
      case "company_shipper":
        navigate("/register", { state: { userType: "company_shipper" } });
        break;
      default:
        navigate("/register");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Bienvenue sur RetourGo
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sélectionnez votre profil pour commencer
        </p>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <CardHeader>
            <CardTitle className="text-center">Quel est votre profil ?</CardTitle>
            <CardDescription className="text-center">
              Nous personnaliserons votre parcours d'inscription en fonction de votre profil
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {userTypes.map((type) => (
                <div
                  key={type.id}
                  className={`p-4 border rounded-lg flex items-center cursor-pointer transition-colors ${
                    selectedType === type.id
                      ? "border-retourgo-orange bg-orange-50"
                      : "border-gray-300 hover:border-retourgo-orange/70 hover:bg-orange-50/50"
                  }`}
                  onClick={() => setSelectedType(type.id)}
                >
                  <div className="mr-4">{type.icon}</div>
                  <div>
                    <h3 className="font-medium">{type.title}</h3>
                    <p className="text-sm text-gray-500">{type.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          
          <CardFooter>
            <Button
              onClick={handleContinue}
              className="w-full bg-retourgo-orange hover:bg-retourgo-orange/90"
              disabled={!selectedType}
            >
              Continuer
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default UserTypeSelection;
