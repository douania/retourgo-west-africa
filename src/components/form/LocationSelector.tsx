
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import CityAutocomplete from "./CityAutocomplete";
import CountryAutocomplete from "./CountryAutocomplete";
import { parseCityString, getCitiesByCountry } from "@/lib/location-data";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface LocationSelectorProps {
  onLocationSelect: (location: {
    city: string;
    country: string;
    fullLocation: string;
  }) => void;
  initialLocation?: string;
  title?: string;
  required?: boolean;
}

const LocationSelector = ({
  onLocationSelect,
  initialLocation = "",
  title = "Localisation",
  required = false
}: LocationSelectorProps) => {
  const [selectedCity, setSelectedCity] = useState(initialLocation);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [usingLocationApi, setUsingLocationApi] = useState(false);

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
    }
  };

  // Handle getting current location (placeholder for now)
  const handleGetLocation = () => {
    setUsingLocationApi(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // In a real implementation, we would use reverse geocoding to get the city/country
        // For now, just show a toast message with coordinates
        console.log(`Location found: ${position.coords.latitude}, ${position.coords.longitude}`);
        setUsingLocationApi(false);
        
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
      },
      (error) => {
        console.error("Error getting location:", error);
        setUsingLocationApi(false);
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
        />
        
        <CityAutocomplete
          value={selectedCity}
          onChange={handleCitySelect}
          required={required}
        />
      </div>
      
      <div className="pt-2">
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleGetLocation}
          disabled={usingLocationApi}
        >
          <MapPin className="h-4 w-4" />
          {usingLocationApi ? "Recherche en cours..." : "Utiliser ma position actuelle"}
        </Button>
      </div>
    </div>
  );
};

export default LocationSelector;
