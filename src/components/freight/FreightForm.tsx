
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Autocomplete } from "@/components/ui/autocomplete";
import { getCityOptions } from "@/lib/location-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  calculatePrice,
  estimateDistance,
  VehicleType,
  AdditionalFeeType,
} from "@/lib/pricing";
import PriceEstimation from "./PriceEstimation";
import PricingOptions from "./PricingOptions";

interface FreightFormData {
  title: string;
  description: string;
  origin: string;
  destination: string;
  pickup_date: string;
  delivery_date: string;
  weight: number;
  volume: number;
  price: number;
}

const FreightForm = () => {
  const { register, handleSubmit, control, formState: { errors }, setValue, watch } = useForm<FreightFormData>({
    defaultValues: {
      price: 0
    }
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cityOptions = getCityOptions();
  
  // Nouvelles variables pour le système de tarification
  const [vehicleType, setVehicleType] = useState<VehicleType>('truck');
  const [additionalFees, setAdditionalFees] = useState<AdditionalFeeType[]>([]);
  const [emptyReturn, setEmptyReturn] = useState(false);
  const [priceEstimation, setPriceEstimation] = useState({
    total: 0,
    breakdown: {
      baseFee: 0,
      distanceFee: 0,
      additionalFees: [] as { type: string; amount: number }[],
      emptyReturnDiscount: 0
    }
  });
  const [distance, setDistance] = useState(0);
  
  // Surveiller les changements des champs origine et destination
  const origin = watch("origin");
  const destination = watch("destination");
  
  // Recalculer le prix lorsque les paramètres changent
  useEffect(() => {
    if (origin && destination) {
      const calculatedDistance = estimateDistance(origin, destination);
      setDistance(calculatedDistance);
      
      const pricing = calculatePrice({
        distance: calculatedDistance,
        vehicleType,
        additionalFees,
        emptyReturn
      });
      
      setPriceEstimation(pricing);
      
      // Mettre à jour le champ de prix dans le formulaire
      setValue("price", pricing.total);
    }
  }, [origin, destination, vehicleType, additionalFees, emptyReturn, setValue]);

  const onSubmit = async (data: FreightFormData) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour publier un fret",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('freights')
        .insert({
          ...data,
          user_id: user.id,
          status: 'available'
        });

      if (error) throw error;

      toast({
        title: "Fret publié",
        description: "Votre fret a été publié avec succès",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la publication du fret",
        variant: "destructive",
      });
      console.error("Error creating freight:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Publier un nouveau fret</CardTitle>
        <CardDescription>
          Remplissez les détails de votre fret pour le publier sur RetourGo
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="title">Titre du fret</Label>
            <Input
              id="title"
              {...register("title", { required: "Le titre est requis" })}
              placeholder="Ex: Palettes de matériaux de construction"
            />
            {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description", { required: "La description est requise" })}
              placeholder="Décrivez votre fret en détail"
              className="min-h-[100px]"
            />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="origin">Origine</Label>
              <Controller
                name="origin"
                control={control}
                rules={{ required: "L'origine est requise" }}
                render={({ field }) => (
                  <Autocomplete
                    options={cityOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Ville d'origine"
                  />
                )}
              />
              {errors.origin && <p className="text-sm text-red-500 mt-1">{errors.origin.message}</p>}
            </div>

            <div>
              <Label htmlFor="destination">Destination</Label>
              <Controller
                name="destination"
                control={control}
                rules={{ required: "La destination est requise" }}
                render={({ field }) => (
                  <Autocomplete
                    options={cityOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Ville de destination"
                  />
                )}
              />
              {errors.destination && <p className="text-sm text-red-500 mt-1">{errors.destination.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="pickup_date">Date de chargement</Label>
              <Input
                id="pickup_date"
                type="date"
                {...register("pickup_date", { required: "La date de chargement est requise" })}
              />
              {errors.pickup_date && <p className="text-sm text-red-500 mt-1">{errors.pickup_date.message}</p>}
            </div>

            <div>
              <Label htmlFor="delivery_date">Date de livraison</Label>
              <Input
                id="delivery_date"
                type="date"
                {...register("delivery_date", { required: "La date de livraison est requise" })}
              />
              {errors.delivery_date && <p className="text-sm text-red-500 mt-1">{errors.delivery_date.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="weight">Poids (kg)</Label>
              <Input
                id="weight"
                type="number"
                {...register("weight", { 
                  required: "Le poids est requis",
                  valueAsNumber: true,
                  min: { value: 1, message: "Le poids minimum est 1 kg" }
                })}
                placeholder="Ex: 500"
              />
              {errors.weight && <p className="text-sm text-red-500 mt-1">{errors.weight.message}</p>}
            </div>

            <div>
              <Label htmlFor="volume">Volume (m³)</Label>
              <Input
                id="volume"
                type="number"
                step="0.01"
                {...register("volume", { 
                  required: "Le volume est requis",
                  valueAsNumber: true,
                  min: { value: 0.01, message: "Le volume minimum est 0.01 m³" }
                })}
                placeholder="Ex: 2.5"
              />
              {errors.volume && <p className="text-sm text-red-500 mt-1">{errors.volume.message}</p>}
            </div>
          </div>
          
          {/* Options de tarification */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <PricingOptions
              vehicleType={vehicleType}
              additionalFees={additionalFees}
              emptyReturn={emptyReturn}
              onVehicleTypeChange={setVehicleType}
              onAdditionalFeesChange={setAdditionalFees}
              onEmptyReturnChange={setEmptyReturn}
            />
            
            {origin && destination && (
              <PriceEstimation
                baseFee={priceEstimation.breakdown.baseFee}
                distanceFee={priceEstimation.breakdown.distanceFee}
                distance={distance}
                origin={origin}
                destination={destination}
                vehicleType={vehicleType}
                additionalFees={priceEstimation.breakdown.additionalFees}
                emptyReturnDiscount={priceEstimation.breakdown.emptyReturnDiscount}
                total={priceEstimation.total}
              />
            )}
          </div>
          
          {/* Champ de prix caché mis à jour automatiquement */}
          <input type="hidden" {...register("price", { valueAsNumber: true })} />
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => navigate(-1)}>
            Annuler
          </Button>
          <Button 
            type="submit" 
            className="bg-retourgo-orange hover:bg-retourgo-orange/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Publication en cours..." : "Publier le fret"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FreightForm;
