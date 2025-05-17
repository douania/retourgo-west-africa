
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Autocomplete } from "@/components/ui/autocomplete";
import { getCityOptions } from "@/lib/location-data";
import { Control, FieldErrors } from "react-hook-form";

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

interface FormFieldsProps {
  control: Control<FreightFormData>;
  register: any;
  errors: FieldErrors<FreightFormData>;
  watch: any;
}

export const TitleDescriptionFields = ({ register, errors }: FormFieldsProps) => (
  <>
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
  </>
);

export const LocationFields = ({ control, errors }: FormFieldsProps) => {
  const cityOptions = getCityOptions();
  
  return (
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
  );
};

export const DateFields = ({ register, errors }: FormFieldsProps) => (
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
);

export const CargoFields = ({ register, errors }: FormFieldsProps) => (
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
);
