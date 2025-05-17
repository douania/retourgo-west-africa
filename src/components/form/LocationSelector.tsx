
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CityAutocomplete } from "./CityAutocomplete";
import CountryAutocomplete from "./CountryAutocomplete";
import { parseCityString } from "@/lib/location-data";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationSelectorProps {
  onLocationSelect: (location: {
    city: string;
    country: string;
    fullLocation: string;
  }) => void;
  initialLocation?: string;
  title?: string;
  required?: boolean;
  disabled?: boolean;
}

const LocationSelector = ({
  onLocationSelect,
  initialLocation = "",
  title = "Localisation",
  required = false,
  disabled = false
}: LocationSelectorProps) => {
  const [selectedCity, setSelectedCity] = useState(initialLocation);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [usingLocationApi, setUsingLocationApi] = useState(false);
  const { toast } = useToast();

  // Parse initial location if provided
  useEffect(() => {
    if (initialLocation) {
      const { countryName } = parseCityString(initialLocation);
      setSelectedCountry(countryName);
    }
  }, [initialLocation]);

  // When city is selected, update the country and notify parent
  const handleCitySelect = (cityValue: string) => {
    setSelectedCity(cityValue);
    const { cityName, countryName } = parseCityString(cityValue);
    
    if (countryName && countryName !== selectedCountry) {
      setSelectedCountry(countryName);
    }
    
    onLocationSelect({
      city: cityName,
      country: countryName,
      fullLocation: cityValue
    });
  };

  // When country is selected, clear city if it doesn't match the country
  const handleCountrySelect = (countryValue: string) => {
    setSelectedCountry(countryValue);
    
    const { countryName } = parseCityString(selectedCity);
    
    if (countryName && countryName !== countryValue) {
      setSelectedCity("");
      onLocationSelect({
        city: "",
        country: countryValue,
        fullLocation: ""
      });
    }
  };

  // Handle getting current location with improved feedback
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Géolocalisation non supportée",
        description: "Votre navigateur ne supporte pas la géolocalisation.",
        variant: "destructive"
      });
      return;
    }
    
    setUsingLocationApi(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // In a real implementation, we would use reverse geocoding to get the city/country
        console.log(`Location found: ${position.coords.latitude}, ${position.coords.longitude}`);
        
        // For demo purposes, just set a hardcoded location
        // In production, this would come from a geocoding API
        const demoCity = "Dakar, Sénégal";
        setSelectedCity(demoCity);
        setSelectedCountry("Sénégal");
        
        onLocationSelect({
          city: "Dakar",
          country: "Sénégal",
          fullLocation: demoCity
        });
        
        toast({
          title: "Position localisée",
          description: "Votre position a été détectée: Dakar, Sénégal",
        });
        
        setUsingLocationApi(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        let errorMessage = "Une erreur est survenue lors de la détection de votre position.";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Vous avez refusé l'accès à votre position.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Les informations de position ne sont pas disponibles.";
            break;
          case error.TIMEOUT:
            errorMessage = "La demande de localisation a expiré.";
            break;
        }
        
        toast({
          title: "Erreur de localisation",
          description: errorMessage,
          variant: "destructive"
        });
        
        setUsingLocationApi(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg flex items-center gap-2">
        <MapPin className="h-5 w-5 text-retourgo-orange" /> {title}
      </h3>
      
      <div className="grid grid-cols-1 gap-6">
        <CountryAutocomplete
          value={selectedCountry}
          onChange={handleCountrySelect}
          required={required}
          disabled={disabled || usingLocationApi}
        />
        
        <CityAutocomplete
          value={selectedCity}
          onChange={handleCitySelect}
          required={required}
          countryFilter={selectedCountry}
          disabled={disabled || usingLocationApi}
        />
      </div>
      
      <div className="pt-2">
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleGetLocation}
          disabled={disabled || usingLocationApi}
        >
          {usingLocationApi ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Recherche en cours...
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4" />
              Utiliser ma position actuelle
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default LocationSelector;
