
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIAssistantChat from "@/components/ai/AIAssistantChat";
import RouteOptimizer from "@/components/ai/RouteOptimizer";
import PriceEstimator from "@/components/ai/PriceEstimator";
import DocumentScanner from "@/components/ai/DocumentScanner";
import DemandPredictor from "@/components/ai/DemandPredictor";
import { useTranslation } from "@/hooks/useTranslation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

const AIAssistant = () => {
  const { t, language } = useTranslation();
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto pt-24 pb-16 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          {t("ai.title")}
        </h1>
        
        <Alert className="mb-6 border-green-500 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700">
            {language === 'en' ? 'AI features enabled' : 
             language === 'wo' ? 'Jumtukaay AI jàpp na' : 
             'Fonctionnalités IA activées'}
          </AlertTitle>
          <AlertDescription className="text-green-600">
            {language === 'en' ? 'AI features are now fully operational. Feel free to use them to optimize your transport operations.' : 
             language === 'wo' ? 'Jumtukaay yi AI dëpp na. Bul tiit di leen jëfandikoo ngir xelal say transport.' : 
             'Les fonctionnalités d\'IA sont maintenant pleinement opérationnelles. N\'hésitez pas à les utiliser pour optimiser vos opérations de transport.'}
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
