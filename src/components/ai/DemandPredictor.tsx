
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAIServices } from "@/services/AIService";
import { useTranslation } from "@/hooks/useTranslation";
import { Loader, TrendingUp } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DemandPredictor = () => {
  const { t } = useTranslation();
  const { getDemandPrediction } = useAIServices();
  const [region, setRegion] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [transportType, setTransportType] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const handlePredict = async () => {
    if (!region.trim() || !timeframe.trim()) return;
    
    setLoading(true);
    
    try {
      const response = await getDemandPrediction(
        region, 
        timeframe, 
        transportType || undefined
      );
      setResult(response);
    } catch (error) {
      console.error("Demand prediction error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (value: number) => {
    if (value < 0) return "bg-red-500";
    return "bg-green-500";
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t("ai.demand_predictor")}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="region">{t("ai.region")}</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger>
                <SelectValue placeholder={t("ai.select_region")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dakar">Dakar</SelectItem>
                <SelectItem value="thies">Thiès</SelectItem>
                <SelectItem value="saint_louis">Saint-Louis</SelectItem>
                <SelectItem value="diourbel">Diourbel</SelectItem>
                <SelectItem value="tambacounda">Tambacounda</SelectItem>
                <SelectItem value="kaolack">Kaolack</SelectItem>
                <SelectItem value="ziguinchor">Ziguinchor</SelectItem>
                <SelectItem value="fatick">Fatick</SelectItem>
                <SelectItem value="kolda">Kolda</SelectItem>
                <SelectItem value="matam">Matam</SelectItem>
                <SelectItem value="kedougou">Kédougou</SelectItem>
                <SelectItem value="sedhiou">Sédhiou</SelectItem>
                <SelectItem value="kaffrine">Kaffrine</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="timeframe">{t("ai.timeframe")}</Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger>
                <SelectValue placeholder={t("ai.select_timeframe")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="next_week">Semaine prochaine</SelectItem>
                <SelectItem value="next_month">Mois prochain</SelectItem>
                <SelectItem value="next_quarter">Trimestre prochain</SelectItem>
                <SelectItem value="rainy_season">Saison des pluies</SelectItem>
                <SelectItem value="dry_season">Saison sèche</SelectItem>
                <SelectItem value="harvest_season">Période de récolte</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="transportType">{t("ai.transport_type")} ({t("ai.optional")})</Label>
            <Select value={transportType} onValueChange={setTransportType}>
              <SelectTrigger>
                <SelectValue placeholder={t("ai.select_transport_type")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agricultural">Transport agricole</SelectItem>
                <SelectItem value="construction">Matériaux de construction</SelectItem>
                <SelectItem value="consumer_goods">Biens de consommation</SelectItem>
                <SelectItem value="industrial">Produits industriels</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {result && (
            <div className="mt-6 space-y-4 bg-secondary/30 p-4 rounded-lg">
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{t("ai.predicted_demand")}</h3>
                  <p className="text-sm text-gray-500">
                    {result.region} | {result.timeframe}
                  </p>
                </div>
                <div className="text-3xl font-bold">
                  {result.prediction.predictedDemand}/100
                </div>
              </div>
              
              <Progress value={result.prediction.predictedDemand} className="h-2" />
              
              <Alert>
                <AlertDescription className="text-sm">
                  {result.prediction.recommendation}
                </AlertDescription>
              </Alert>
              
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-medium">{t("ai.impact_factors")}</h4>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">{t("ai.seasonal_factor")}</span>
                    <span className="text-sm font-medium">{result.prediction.factors.seasonal.impact > 0 ? '+' : ''}{result.prediction.factors.seasonal.impact}</span>
                  </div>
                  <Progress 
                    value={50 + result.prediction.factors.seasonal.impact * 5} 
                    className={`h-1.5 ${getProgressColor(result.prediction.factors.seasonal.impact)}`} 
                  />
                  <p className="text-xs text-gray-500 mt-1">{result.prediction.factors.seasonal.explanation}</p>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">{t("ai.economic_factor")}</span>
                    <span className="text-sm font-medium">{result.prediction.factors.economic.impact > 0 ? '+' : ''}{result.prediction.factors.economic.impact}</span>
                  </div>
                  <Progress 
                    value={50 + result.prediction.factors.economic.impact * 5} 
                    className={`h-1.5 ${getProgressColor(result.prediction.factors.economic.impact)}`} 
                  />
                  <p className="text-xs text-gray-500 mt-1">{result.prediction.factors.economic.explanation}</p>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">{t("ai.weather_factor")}</span>
                    <span className="text-sm font-medium">{result.prediction.factors.weather.impact > 0 ? '+' : ''}{result.prediction.factors.weather.impact}</span>
                  </div>
                  <Progress 
                    value={50 + result.prediction.factors.weather.impact * 5} 
                    className={`h-1.5 ${getProgressColor(result.prediction.factors.weather.impact)}`} 
                  />
                  <p className="text-xs text-gray-500 mt-1">{result.prediction.factors.weather.explanation}</p>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">{t("ai.industrial_factor")}</span>
                    <span className="text-sm font-medium">{result.prediction.factors.industrial.impact > 0 ? '+' : ''}{result.prediction.factors.industrial.impact}</span>
                  </div>
                  <Progress 
                    value={50 + result.prediction.factors.industrial.impact * 5} 
                    className={`h-1.5 ${getProgressColor(result.prediction.factors.industrial.impact)}`} 
                  />
                  <p className="text-xs text-gray-500 mt-1">{result.prediction.factors.industrial.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <Button 
          onClick={handlePredict} 
          disabled={!region.trim() || !timeframe.trim() || loading}
          className="w-full"
        >
          {loading ? (
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <TrendingUp className="mr-2 h-4 w-4" />
          )}
          {t("ai.predict_demand")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DemandPredictor;
