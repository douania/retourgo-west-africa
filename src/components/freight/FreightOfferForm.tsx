
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TruckIcon } from "lucide-react";
import { Freight } from "./FreightCard";
import { useTranslation } from "@/hooks/useTranslation";

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
  const { t } = useTranslation();
  
  return (
    <div className="mt-6 pt-6 border-t">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-bold">{t("price.asked")}</span>
        <span className="text-2xl font-bold text-retourgo-orange">{freight.price} FCFA</span>
      </div>

      {!isOwnFreight && freight.status === "available" && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="offerPrice">{t("price.your_offer")}</Label>
            <Input
              id="offerPrice"
              type="number"
              value={offerPrice}
              onChange={(e) => onOfferPriceChange(e.target.value)}
              placeholder={t("price.enter_offer")}
              min={1}
            />
          </div>
          <Button
            onClick={onMakeOffer}
            className="w-full bg-retourgo-green hover:bg-retourgo-green/90"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? t("offer.sending")
              : userOffer 
                ? t("offer.update")
                : t("offer.make")}
          </Button>
          {userOffer && (
            <p className="text-sm text-gray-500 text-center">
              {t("offer.already_made")} {userOffer.price_offered} FCFA {t("offer.for_this_merchandise")}
              {userOffer.status !== 'pending' && ` (${t("offer.status")} ${userOffer.status === 'accepted' ? t("offer.status.accepted") : t("offer.status.rejected")})`}
            </p>
          )}
        </div>
      )}

      {isOwnFreight && (
        <Button
          onClick={onViewOffers}
          className="w-full bg-retourgo-green hover:bg-retourgo-green/90"
        >
          <TruckIcon className="mr-2 h-4 w-4" /> {t("offer.view_transport")}
        </Button>
      )}
    </div>
  );
};
