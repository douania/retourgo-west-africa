
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, TruckIcon, MapPin, Calendar } from "lucide-react";
import { Freight } from "./FreightCard";
import { useTranslation } from "@/hooks/useTranslation";

interface ShipperProfile {
  first_name: string | null;
  last_name: string | null;
}

interface FreightDetailsCardProps {
  freight: Freight;
  shipper: ShipperProfile | null;
}

export const FreightDetailsCard = ({ freight, shipper }: FreightDetailsCardProps) => {
  const { t } = useTranslation();
  
  return (
    <Card className="mb-6">
      <CardHeader className="border-b pb-6">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">{freight.title}</CardTitle>
            <p className="text-gray-600 mt-1">
              {t("freight.published_by")} {shipper ? `${shipper.first_name || ''} ${shipper.last_name || ''}` : t("freight.unknown_shipper")}
            </p>
          </div>
          <Badge variant={freight.status === "available" ? "success" : "secondary"}>
            {freight.status === "available" ? t("status.available") : t("status.assigned")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("freight.merchandise_details")}</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-retourgo-orange mt-0.5" />
                <div>
                  <p className="font-medium">{t("freight.route")}:</p>
                  <p className="text-lg font-semibold text-retourgo-green">
                    {freight.origin} → {freight.destination}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-retourgo-orange mt-0.5" />
                <div>
                  <p className="font-medium">{t("freight.dates")}:</p>
                  <p>{t("freight.loading")}: {new Date(freight.pickup_date).toLocaleDateString()}</p>
                  <p>{t("freight.delivery")}: {new Date(freight.delivery_date).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-retourgo-orange mt-0.5" />
                <div>
                  <p className="font-medium">{t("freight.dimensions")}:</p>
                  <p>{t("freight.weight")}: {freight.weight} kg</p>
                  <p>{t("freight.volume")}: {freight.volume} m³</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("freight.description")}</h3>
            <p className="text-gray-700 whitespace-pre-line">{freight.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
