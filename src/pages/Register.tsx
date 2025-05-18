
import { Card } from "@/components/ui/card";
import RegisterHeader from "@/components/auth/RegisterHeader";
import RegisterForm from "@/components/auth/RegisterForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const Register = () => {
  const [selectedUserType, setSelectedUserType] = useState<string>("shipper");

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <RegisterHeader />
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Tabs 
            defaultValue="shipper" 
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
