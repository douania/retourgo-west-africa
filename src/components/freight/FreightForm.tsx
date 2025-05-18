
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Custom hook and component imports
import { useFreightFormSubmission } from "./freight-form/useFreightFormSubmission";
import { usePricingCalculation } from "./freight-form/usePricingCalculation";
import { PricingConfiguration } from "./freight-form/PricingConfiguration";
import { FreightFormData } from "./freight-form/types";
import { 
  TitleDescriptionFields,
  LocationFields, 
  DateFields,
  CargoFields
} from "./freight-form/FormFields";

const FreightForm = () => {
  const { register, handleSubmit, control, formState: { errors }, setValue, watch } = useForm<FreightFormData>({
    defaultValues: {
      price: 0,
      weight: 0,
      volume: 0
    }
  });
  const navigate = useNavigate();
  
  // Form submission hook
  const { handleSubmit: submitForm, isSubmitting } = useFreightFormSubmission();
  
  // Watch form fields for price calculation
  const origin = watch("origin");
  const destination = watch("destination");
  const weight = watch("weight");
  
  // Pricing calculation hook
  const {
    vehicleType,
    additionalFees,
    emptyReturn,
    priceEstimation,
    distance,
    pricingError,
    setVehicleType,
    setAdditionalFees,
    setEmptyReturn
  } = usePricingCalculation({
    origin,
    destination,
    weight,
    setValue
  });

  const onSubmit = (data: FreightFormData) => {
    submitForm(data);
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
          {/* Title and Description Fields */}
          <TitleDescriptionFields register={register} control={control} errors={errors} watch={watch} />
          
          {/* Location Fields */}
          <LocationFields register={register} control={control} errors={errors} watch={watch} />
          
          {/* Date Fields */}
          <DateFields register={register} control={control} errors={errors} watch={watch} />
          
          {/* Cargo Fields */}
          <CargoFields register={register} control={control} errors={errors} watch={watch} />
          
          {/* Pricing Configuration */}
          <PricingConfiguration 
            vehicleType={vehicleType}
            additionalFees={additionalFees}
            emptyReturn={emptyReturn}
            distance={distance}
            origin={origin}
            destination={destination}
            weight={weight}
            priceEstimation={priceEstimation}
            pricingError={pricingError}
            onVehicleTypeChange={setVehicleType}
            onAdditionalFeesChange={setAdditionalFees}
            onEmptyReturnChange={setEmptyReturn}
          />
          
          {/* Hidden price field updated automatically */}
          <input type="hidden" {...register("price", { valueAsNumber: true })} />
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => navigate(-1)}>
            Annuler
          </Button>
          <Button 
            type="submit" 
            className="bg-retourgo-orange hover:bg-retourgo-orange/90"
            disabled={isSubmitting || !!pricingError}
          >
            {isSubmitting ? "Publication en cours..." : "Publier le fret"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FreightForm;
