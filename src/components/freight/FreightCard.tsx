
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, TruckIcon, Package, ArrowDown } from "lucide-react";
import { formatDistance } from "@/lib/utils";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

export interface Freight {
  id: string;
  title: string;
  description: string;
  origin: string;
  destination: string;
  pickup_date: string;
  delivery_date: string;
  weight: number;
  volume: number;
  price: number;
  status: string;
  user_id: string;
  isReturnTrip?: boolean;
  originalPrice?: number;
}

interface FreightCardProps {
  freight: Freight;
  showActions?: boolean;
  showReturnDiscount?: boolean;
  originalPrice?: number;
}

const FreightCard = ({ 
  freight, 
  showActions = true, 
  showReturnDiscount = false,
  originalPrice
}: FreightCardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleViewDetails = () => {
    navigate(`/freight/${freight.id}`);
  };

  const discountPercentage = originalPrice ? 
    Math.round(((originalPrice - freight.price) / originalPrice) * 100) : 0;

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-gray-800">{freight.title}</CardTitle>
          <Badge variant={freight.status === "available" ? "success" : "secondary"}>
            {freight.status === "available" ? t("status.available") : t("status.assigned")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-retourgo-orange" />
            <div className="flex flex-col">
              <span>{freight.origin}</span>
              <span className="font-semibold text-retourgo-green">→ {freight.destination}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-retourgo-orange" />
            <div className="flex flex-col">
              <span>{t("freight.loading_date")}: {new Date(freight.pickup_date).toLocaleDateString()}</span>
              <span>{t("freight.delivery_date")}: {new Date(freight.delivery_date).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Package className="h-4 w-4 text-retourgo-orange" />
              <span>{freight.weight} kg</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <TruckIcon className="h-4 w-4 text-retourgo-orange" />
              <span>{freight.volume} m³</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-retourgo-orange">
                {freight.price} FCFA
              </span>
              {showReturnDiscount && originalPrice && (
                <div className="flex items-center text-xs text-retourgo-green">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  <span className="font-medium">-{discountPercentage}% {t("freight.empty_return")}</span>
                </div>
              )}
            </div>
            {showActions && (
              <Button 
                onClick={handleViewDetails}
                className="bg-retourgo-orange hover:bg-retourgo-orange/90"
              >
                {t("freight.view_details")}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreightCard;
