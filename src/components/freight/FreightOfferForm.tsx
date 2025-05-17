
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TruckIcon } from "lucide-react";
import { Freight } from "./FreightCard";

interface UserOffer {
  id: string;
  price_offered: number;
  status: string;
}

interface FreightOfferFormProps {
  freight: Freight;
  isOwnFreight: boolean;
  userOffer: UserOffer | null;
  offerPrice: string;
  isSubmitting: boolean;
  onOfferPriceChange: (value: string) => void;
  onMakeOffer: () => void;
  onViewOffers: () => void;
}

export const FreightOfferForm = ({
  freight,
  isOwnFreight,
  userOffer,
  offerPrice,
  isSubmitting,
  onOfferPriceChange,
  onMakeOffer,
  onViewOffers
}: FreightOfferFormProps) => {
  return (
    <div className="mt-6 pt-6 border-t">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-bold">Prix demandé:</span>
        <span className="text-2xl font-bold text-retourgo-orange">{freight.price} €</span>
      </div>

      {!isOwnFreight && freight.status === "available" && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="offerPrice">Votre offre (€)</Label>
            <Input
              id="offerPrice"
              type="number"
              value={offerPrice}
              onChange={(e) => onOfferPriceChange(e.target.value)}
              placeholder="Saisir votre offre"
              min={1}
            />
          </div>
          <Button
            onClick={onMakeOffer}
            className="w-full bg-retourgo-green hover:bg-retourgo-green/90"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? "Envoi en cours..." 
              : userOffer 
                ? "Mettre à jour mon offre" 
                : "Faire une offre"}
          </Button>
          {userOffer && (
            <p className="text-sm text-gray-500 text-center">
              Vous avez déjà fait une offre de {userOffer.price_offered}€ pour ce fret.
              {userOffer.status !== 'pending' && ` (Statut: ${userOffer.status === 'accepted' ? 'Acceptée' : 'Refusée'})`}
            </p>
          )}
        </div>
      )}

      {isOwnFreight && (
        <Button
          onClick={onViewOffers}
          className="w-full bg-retourgo-green hover:bg-retourgo-green/90"
        >
          <TruckIcon className="mr-2 h-4 w-4" /> Voir les offres de transport
        </Button>
      )}
    </div>
  );
};
