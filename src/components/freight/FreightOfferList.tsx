
import { TransportOffer, FreightOfferItem } from "./FreightOfferItem";

interface FreightOfferListProps {
  offers: TransportOffer[];
  freightStatus: string;
  onAcceptOffer: (offerId: string) => void;
  processingId: string | null;
}

export const FreightOfferList = ({
  offers,
  freightStatus,
  onAcceptOffer,
  processingId
}: FreightOfferListProps) => {
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center pb-2 border-b text-sm font-medium text-gray-500">
        <div className="w-1/4">Transporteur</div>
        <div className="w-1/4 text-center">Date de l'offre</div>
        <div className="w-1/4 text-center">Prix offert</div>
        <div className="w-1/4"></div>
      </div>

      {offers.map((offer) => (
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
