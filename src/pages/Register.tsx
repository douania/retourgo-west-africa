import { Card } from "@/components/ui/card";
import RegisterHeader from "@/components/auth/RegisterHeader";
import RegisterForm from "@/components/auth/RegisterForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
    } else {
      // If no user type is provided, redirect to selection page
      navigate("/user-type-selection");
    }
  }, [location.state, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <RegisterHeader />
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
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
        </Card>
      </div>
    </div>
  );
};

export default Register;
