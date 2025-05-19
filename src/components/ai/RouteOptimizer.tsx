
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useAIServices } from "@/services/AIService";
import { useTranslation } from "@/hooks/useTranslation";
import { Loader, Map } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const RouteOptimizer = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { getRouteOptimization } = useAIServices();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  
  const handleOptimize = async () => {
    if (!origin.trim() || !destination.trim() || !user?.id) return;
    
    setLoading(true);
    setError("");
    
    try {
      const response = await getRouteOptimization(origin, destination, user.id);
      setResult(response);
    } catch (err: any) {
      setError(err.message || t("ai.route_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t("ai.route_optimizer")}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="origin">{t("ai.origin")}</Label>
              <Input
                id="origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder={t("ai.origin_placeholder")}
              />
            </div>
            <div>
              <Label htmlFor="destination">{t("ai.destination")}</Label>
              <Input
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder={t("ai.destination_placeholder")}
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>{t("ai.error_title")}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="mt-6 space-y-4 bg-secondary/30 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{t("ai.optimized_route")}</h3>
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-sm text-gray-500">{t("ai.distance")}</span>
                    <p className="font-medium">{result.route.distance} km</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">{t("ai.duration")}</span>
                    <p className="font-medium">{result.route.duration} h</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">{t("ai.route_summary")}</h4>
                <p className="mt-1">{result.route.summary}</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">{t("ai.route_path")}</h4>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    {result.route.route.map((step: string, i: number) => (
                      <li key={i} className="text-sm">{step}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">{t("ai.rest_points")}</h4>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    {result.route.restPoints.map((point: string, i: number) => (
                      <li key={i} className="text-sm">{point}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">{t("ai.avoid_areas")}</h4>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  {result.route.avoidAreas.map((area: string, i: number) => (
                    <li key={i} className="text-sm">{area}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">{t("ai.checkpoints")}</h4>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  {result.route.checkpoints.map((checkpoint: string, i: number) => (
                    <li key={i} className="text-sm">{checkpoint}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <Button 
          onClick={handleOptimize} 
          disabled={!origin.trim() || !destination.trim() || loading}
          className="w-full"
        >
          {loading ? (
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Map className="mr-2 h-4 w-4" />
          )}
          {t("ai.optimize_route")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RouteOptimizer;
