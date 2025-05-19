
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Freight } from "@/components/freight/FreightCard";
import { useTranslation } from "@/hooks/useTranslation";

interface FreightOfferHeaderProps {
  freight: Freight;
}

export const FreightOfferHeader = ({ freight }: FreightOfferHeaderProps) => {
  const { t } = useTranslation();
  
  return (
    <Card className="mb-6">
      <CardHeader className="border-b">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              {t("offer.for")} {freight.title}
            </CardTitle>
            <p className="text-gray-600 mt-1">
              {freight.origin} → {freight.destination}
            </p>
          </div>
          <Badge variant={freight.status === "available" ? "success" : "secondary"}>
            {freight.status === "available" ? t("status.available") : t("status.assigned")}
          </Badge>
        </div>
      </CardHeader>
    </Card>
  );
};
