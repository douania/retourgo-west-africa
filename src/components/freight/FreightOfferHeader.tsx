
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Freight } from "@/components/freight/FreightCard";

interface FreightOfferHeaderProps {
  freight: Freight;
}

export const FreightOfferHeader = ({ freight }: FreightOfferHeaderProps) => {
  return (
    <Card className="mb-6">
      <CardHeader className="border-b">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Offres pour {freight.title}
            </CardTitle>
            <p className="text-gray-600 mt-1">
              {freight.origin} → {freight.destination}
            </p>
          </div>
          <Badge variant={freight.status === "available" ? "success" : "secondary"}>
            {freight.status === "available" ? "Disponible" : "Attribué"}
          </Badge>
        </div>
      </CardHeader>
    </Card>
  );
};
