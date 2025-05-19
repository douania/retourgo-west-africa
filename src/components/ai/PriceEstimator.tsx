
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAIServices } from "@/services/AIService";
import { useTranslation } from "@/hooks/useTranslation";
import { Loader } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const PriceEstimator = () => {
  const { t } = useTranslation();
  const { getPriceEstimation } = useAIServices();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [weight, setWeight] = useState("");
  const [volume, setVolume] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const handleEstimate = async () => {
    if (!origin.trim() || !destination.trim() || !weight || !vehicleType) return;
    
    setLoading(true);
    
    try {
      const response = await getPriceEstimation(
        origin, 
        destination, 
        parseFloat(weight),
        vehicleType,
        volume ? parseFloat(volume) : undefined,
        specialRequirements || undefined
      );
      setResult(response);
    } catch (error) {
      console.error("Price estimation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t("ai.price_estimator")}</CardTitle>
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
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="weight">{t("ai.weight")} (kg)</Label>
              <Input
                id="weight"
                type="number"
                min="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="1000"
              />
            </div>
            <div>
              <Label htmlFor="volume">{t("ai.volume")} (m³) ({t("ai.optional")})</Label>
              <Input
                id="volume"
                type="number"
                min="0"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                placeholder="10"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="vehicleType">{t("ai.vehicle_type")}</Label>
            <Select value={vehicleType} onValueChange={setVehicleType}>
              <SelectTrigger>
                <SelectValue placeholder={t("ai.select_vehicle_type")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small_truck">Pick-up / petit camion</SelectItem>
                <SelectItem value="medium_truck">Camion moyen</SelectItem>
                <SelectItem value="large_truck">Grand camion</SelectItem>
                <SelectItem value="semi_truck">Semi-remorque</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="specialRequirements">{t("ai.special_requirements")} ({t("ai.optional")})</Label>
            <Textarea
              id="specialRequirements"
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              placeholder={t("ai.special_requirements_placeholder")}
              className="h-20"
            />
          </div>

          {result && (
            <div className="mt-6 space-y-4 bg-secondary/30 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{t("ai.estimated_price")}</h3>
                <div className="text-xl font-bold">
                  {result.priceEstimation.estimatedPrice.toLocaleString()} FCFA
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">{t("ai.price_range")}</h4>
                <p className="font-medium">
                  {result.priceEstimation.priceRange.min.toLocaleString()} - {result.priceEstimation.priceRange.max.toLocaleString()} FCFA
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">{t("ai.explanation")}</h4>
                <p className="text-sm">{result.priceEstimation.explanation}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">{t("ai.distance")}</h4>
                  <p>{result.priceEstimation.distance} km</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">{t("ai.fuel_cost")}</h4>
                  <p>{result.priceEstimation.factors.fuel.toLocaleString()} FCFA</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">{t("ai.operational_costs")}</h4>
                  <p>{result.priceEstimation.factors.operationalCosts.toLocaleString()} FCFA</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">{t("ai.road_conditions")}</h4>
                  <p>{result.priceEstimation.factors.roadConditions}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <Button 
          onClick={handleEstimate} 
          disabled={!origin.trim() || !destination.trim() || !weight || !vehicleType || loading}
          className="w-full"
        >
          {loading ? (
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            t("ai.estimate_price")
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PriceEstimator;
