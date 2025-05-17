
import { Button } from "@/components/ui/button";
import { formatDate, getStatusLabel } from "@/lib/utils";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface TransporterProfile {
  first_name: string | null;
  last_name: string | null;
  rating: number | null;
  user_type: string;
  phone: string | null;
}

export interface TransportOffer {
  id: string;
  created_at: string;
  price_offered: number;
  status: string;
  transporter: TransporterProfile;
}

interface FreightOfferItemProps {
  offer: TransportOffer;
  isAvailable: boolean;
  onAccept: (id: string) => void;
  isProcessing: boolean;
}

export const FreightOfferItem = ({
  offer,
  isAvailable,
  onAccept,
  isProcessing
}: FreightOfferItemProps) => {
  // Fix for the error: compare with the string "available" instead of boolean
  const canAccept = isAvailable && offer.status === "pending";
  
  const transporterName = offer.transporter ? 
    `${offer.transporter.first_name || ''} ${offer.transporter.last_name || ''}`.trim() : 
    'Transporteur inconnu';
  
  const transporterRating = offer.transporter?.rating || 0;
  
  // Render stars based on rating
  const renderStars = () => {
    const stars = [];
    const rating = Math.round(transporterRating);
    
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }
    
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="py-4 flex items-center justify-between border-b last:border-b-0">
      <div className="w-1/4">
        <p className="font-medium">{transporterName}</p>
        {renderStars()}
      </div>
      
      <div className="w-1/4 text-center">
        <p>{formatDate(offer.created_at)}</p>
      </div>
      
      <div className="w-1/4 text-center">
        <p className="font-bold text-lg">{offer.price_offered} €</p>
        {offer.status !== "pending" && (
          <Badge variant={offer.status === "accepted" ? "success" : "destructive"} className="mt-1">
            {getStatusLabel(offer.status)}
          </Badge>
        )}
      </div>
      
      <div className="w-1/4 flex justify-end">
        {canAccept && (
          <Button
            onClick={() => onAccept(offer.id)}
            disabled={isProcessing}
            className={`${isProcessing ? "bg-gray-400" : "bg-retourgo-green hover:bg-retourgo-green/90"}`}
          >
            {isProcessing ? (
              "En cours..."
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" /> Accepter
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
