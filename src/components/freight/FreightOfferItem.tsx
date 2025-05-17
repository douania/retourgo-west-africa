
import { User, Calendar, TruckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface TransporterProfile {
  first_name: string | null;
  last_name: string | null;
  user_type: string;
  phone: string | null;
  rating: number | null;
}

export interface TransportOffer {
  id: string;
  freight_id: string;
  transporter_id: string;
  price_offered: number;
  status: string;
  created_at: string;
  updated_at: string;
  transporter?: TransporterProfile;
}

interface FreightOfferItemProps {
  offer: TransportOffer;
  isAvailable: boolean;
  onAccept: (offerId: string) => void;
  isProcessing: boolean;
}

export const FreightOfferItem = ({
  offer,
  isAvailable,
  onAccept,
  isProcessing
}: FreightOfferItemProps) => {
  return (
    <div 
      key={offer.id} 
      className="flex justify-between items-center p-4 border rounded-md bg-white hover:shadow-sm transition-shadow"
    >
      <div className="w-1/4">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-retourgo-green" />
          <span className="font-medium">
            {offer.transporter?.first_name || ''} {offer.transporter?.last_name || ''}
          </span>
        </div>
      </div>
      <div className="w-1/4 text-center text-gray-600">
        <div className="flex items-center justify-center gap-2">
          <Calendar className="h-4 w-4 text-retourgo-orange" />
          {new Date(offer.created_at).toLocaleDateString()}
        </div>
      </div>
      <div className="w-1/4 text-center">
        <span className="text-lg font-bold text-retourgo-orange">
          {offer.price_offered} €
        </span>
      </div>
      <div className="w-1/4 flex justify-end">
        {offer.status === 'pending' && isAvailable ? (
          <Button
            className="bg-retourgo-green hover:bg-retourgo-green/90"
            onClick={() => onAccept(offer.id)}
            disabled={isProcessing}
          >
            <TruckIcon className="mr-2 h-4 w-4" />
            {isProcessing && offer.id === isProcessing ? "En cours..." : "Accepter"}
          </Button>
        ) : (
          <Badge variant={offer.status === 'accepted' ? 'success' : 'secondary'}>
            {offer.status === 'accepted' ? 'Accepté' : 'Refusé'}
          </Badge>
        )}
      </div>
    </div>
  );
};
