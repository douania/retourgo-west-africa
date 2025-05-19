
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIAssistantChat from "@/components/ai/AIAssistantChat";
import RouteOptimizer from "@/components/ai/RouteOptimizer";
import PriceEstimator from "@/components/ai/PriceEstimator";
import DocumentScanner from "@/components/ai/DocumentScanner";
import DemandPredictor from "@/components/ai/DemandPredictor";
import { useTranslation } from "@/hooks/useTranslation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const AIAssistant = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto pt-24 pb-16 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          {t("ai.title")}
        </h1>
        
        <Alert variant="warning" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Fonctionnalités en mode démo</AlertTitle>
          <AlertDescription>
            Les fonctionnalités d'IA sont actuellement en mode démo et peuvent ne pas répondre correctement en raison de limites d'API. 
            Nous travaillons à l'intégration d'alternatives gratuites pour améliorer la fiabilité.
          </AlertDescription>
        </Alert>
        
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="assistant" className="w-full">
            <TabsList className="w-full flex justify-between mb-8 overflow-x-auto">
              <TabsTrigger value="assistant" className="flex-1">
                {t("ai.tab_assistant")}
              </TabsTrigger>
              <TabsTrigger value="routes" className="flex-1">
                {t("ai.tab_routes")}
              </TabsTrigger>
              <TabsTrigger value="pricing" className="flex-1">
                {t("ai.tab_pricing")}
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex-1">
                {t("ai.tab_documents")}
              </TabsTrigger>
              <TabsTrigger value="demand" className="flex-1">
                {t("ai.tab_demand")}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="assistant" className="mt-6">
              <AIAssistantChat />
            </TabsContent>
            
            <TabsContent value="routes" className="mt-6">
              <RouteOptimizer />
            </TabsContent>
            
            <TabsContent value="pricing" className="mt-6">
              <PriceEstimator />
            </TabsContent>
            
            <TabsContent value="documents" className="mt-6">
              <DocumentScanner />
            </TabsContent>
            
            <TabsContent value="demand" className="mt-6">
              <DemandPredictor />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
