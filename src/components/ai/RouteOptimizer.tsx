
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { useRouteOptimizer } from "./route-optimizer/useRouteOptimizer";
import RouteForm from "./route-optimizer/RouteForm";
import ResultMap from "./route-optimizer/ResultMap";
import ResultSummary from "./route-optimizer/ResultSummary";
import ErrorAlert from "./route-optimizer/ErrorAlert";

const RouteOptimizer = () => {
  const { t } = useTranslation();
  const {
    origin,
    setOrigin,
    destination,
    setDestination,
    loading,
    result,
    error,
    routeMarkers,
    handleOptimize
  } = useRouteOptimizer();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t("ai.route_optimizer")}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <RouteForm
            origin={origin}
            destination={destination}
            loading={loading}
            onOriginChange={setOrigin}
            onDestinationChange={setDestination}
            onSubmit={handleOptimize}
          />

          <ErrorAlert error={error} />

          {result && (
            <>
              <ResultMap 
                markers={routeMarkers} 
                title={t("ai.optimized_route")} 
              />
              
              <ResultSummary result={result} />
            </>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center">
        {/* Footer content is moved to the form */}
      </CardFooter>
    </Card>
  );
};

export default RouteOptimizer;
