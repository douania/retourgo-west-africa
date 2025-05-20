import { Card } from "@/components/ui/card";
import RegisterHeader from "@/components/auth/RegisterHeader";
import RegisterForm from "@/components/auth/RegisterForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, User, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedUserType, setSelectedUserType] = useState<string>("shipper");

  // Check if we have a user type from the state
  useEffect(() => {
    const state = location.state as { userType?: string } | undefined;
    
    if (state?.userType) {
      // Map the detailed user types to simple types for the form
      switch (state.userType) {
        case "individual_transporter":
        case "company_transporter":
          setSelectedUserType("transporter");
          break;
        case "individual_shipper":
        case "company_shipper":
          setSelectedUserType("shipper");
          break;
        default:
          // Keep default
          break;
      }
    }
  }, [location.state, navigate]);
  
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button 
          onClick={handleGoBack} 
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 mx-auto"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour
        </button>
      </div>
      
      <RegisterHeader />
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6 text-center">
            <h3 className="text-lg font-medium">Choisir votre type de compte</h3>
            <p className="text-sm text-gray-500 mt-1">
              Sélectionnez le type qui correspond à votre profil
            </p>
          </div>
          
          <Tabs 
            value={selectedUserType} 
            className="mb-6"
            onValueChange={(value) => setSelectedUserType(value)}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="shipper">Expéditeur</TabsTrigger>
              <TabsTrigger value="transporter">Transporteur</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <RegisterForm preselectedUserType={selectedUserType} />
          
          <div className="mt-6 text-center">
            <div className="text-sm">
              Vous avez déjà un compte?{" "}
              <Link
                to="/login"
                className="font-medium text-retourgo-orange hover:text-retourgo-orange/80"
              >
                Se connecter
              </Link>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate("/user-type-selection")}>
                <User className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <h3 className="text-sm font-medium">Particulier</h3>
                <p className="text-xs text-gray-500 mt-1">Inscription personnelle</p>
              </div>
              <div className="text-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate("/user-type-selection")}>
                <Building className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <h3 className="text-sm font-medium">Entreprise</h3>
                <p className="text-xs text-gray-500 mt-1">Inscription professionnelle</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
