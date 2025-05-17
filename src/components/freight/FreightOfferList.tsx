
import { useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { TransportOffer, FreightOfferItem } from "./FreightOfferItem";
import { Button } from "@/components/ui/button";

interface FreightOfferListProps {
  offers: TransportOffer[];
  freightStatus: string;
  onAcceptOffer: (offerId: string) => void;
  processingId: string | null;
}

type SortField = "price" | "date" | null;
type SortDirection = "asc" | "desc";

export const FreightOfferList = ({
  offers,
  freightStatus,
  onAcceptOffer,
  processingId
}: FreightOfferListProps) => {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedOffers = [...offers].sort((a, b) => {
    if (sortField === "price") {
      return sortDirection === "asc" 
        ? a.price_offered - b.price_offered 
        : b.price_offered - a.price_offered;
    } else if (sortField === "date") {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  if (offers.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-700">Aucune offre</h3>
        <p className="text-gray-500 mt-2">
          Votre fret n'a pas encore reçu d'offres de transporteurs.
        </p>
      </div>
    );
  }

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" 
      ? <ArrowUp className="h-4 w-4 ml-1" /> 
      : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center pb-2 border-b text-sm font-medium text-gray-500">
        <div className="w-1/4">Transporteur</div>
        <div className="w-1/4 text-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center justify-center p-0 h-auto font-medium"
            onClick={() => handleSort("date")}
          >
            Date de l'offre
            {renderSortIcon("date")}
          </Button>
        </div>
        <div className="w-1/4 text-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center justify-center p-0 h-auto font-medium"
            onClick={() => handleSort("price")}
          >
            Prix offert
            {renderSortIcon("price")}
          </Button>
        </div>
        <div className="w-1/4"></div>
      </div>

      {sortedOffers.map((offer) => (
        <FreightOfferItem
          key={offer.id}
          offer={offer}
          isAvailable={freightStatus === "available"}
          onAccept={onAcceptOffer}
          isProcessing={processingId === offer.id}
        />
      ))}
    </div>
  );
};
