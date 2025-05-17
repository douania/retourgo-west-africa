
// Pour démarrer, nous utilisons une liste statique des villes principales
// Dans une version production, ces données viendraient d'une API externe

export interface City {
  name: string;
  country: string;
  code?: string;
  population?: number;
}

export const cities: City[] = [
  // Sénégal
  { name: "Dakar", country: "Sénégal", population: 1146053 },
  { name: "Thiès", country: "Sénégal", population: 320000 },
  { name: "Kaolack", country: "Sénégal", population: 172305 },
  { name: "Saint-Louis", country: "Sénégal", population: 176000 },
  { name: "Ziguinchor", country: "Sénégal", population: 205294 },
  { name: "Touba", country: "Sénégal", population: 529176 },
  { name: "Diourbel", country: "Sénégal", population: 58700 },
  { name: "Mbour", country: "Sénégal", population: 232177 },
  { name: "Rufisque", country: "Sénégal", population: 221066 },
  { name: "Louga", country: "Sénégal", population: 83000 },
  
  // Côte d'Ivoire
  { name: "Abidjan", country: "Côte d'Ivoire", population: 4395243 },
  { name: "Bouaké", country: "Côte d'Ivoire", population: 567481 },
  { name: "Daloa", country: "Côte d'Ivoire", population: 215652 },
  { name: "Yamoussoukro", country: "Côte d'Ivoire", population: 200659 },
  { name: "Korhogo", country: "Côte d'Ivoire", population: 167359 },
  { name: "San-Pédro", country: "Côte d'Ivoire", population: 164944 },
  { name: "Divo", country: "Côte d'Ivoire", population: 127867 },
  
  // Mali
  { name: "Bamako", country: "Mali", population: 1809106 },
  { name: "Sikasso", country: "Mali", population: 225753 },
  { name: "Mopti", country: "Mali", population: 114296 },
  { name: "Gao", country: "Mali", population: 87000 },
  { name: "Kayes", country: "Mali", population: 127368 },
  { name: "Koutiala", country: "Mali", population: 99353 },
  
  // Burkina Faso
  { name: "Ouagadougou", country: "Burkina Faso", population: 1626950 },
  { name: "Bobo-Dioulasso", country: "Burkina Faso", population: 537728 },
  { name: "Koudougou", country: "Burkina Faso", population: 91981 },
  { name: "Banfora", country: "Burkina Faso", population: 75917 },
  { name: "Ouahigouya", country: "Burkina Faso", population: 73153 },
  
  // Ghana
  { name: "Accra", country: "Ghana", population: 2291352 },
  { name: "Kumasi", country: "Ghana", population: 1989062 },
  { name: "Tamale", country: "Ghana", population: 360579 },
  { name: "Sekondi-Takoradi", country: "Ghana", population: 335000 },
  { name: "Sunyani", country: "Ghana", population: 70299 },
  
  // Guinée
  { name: "Conakry", country: "Guinée", population: 1660973 },
  { name: "Nzérékoré", country: "Guinée", population: 295384 },
  { name: "Kankan", country: "Guinée", population: 114009 },
  { name: "Kindia", country: "Guinée", population: 94730 },
  
  // Nigeria
  { name: "Lagos", country: "Nigeria", population: 8048430 },
  { name: "Abuja", country: "Nigeria", population: 1235880 },
  { name: "Kano", country: "Nigeria", population: 3626068 },
  { name: "Ibadan", country: "Nigeria", population: 3565108 },
  { name: "Port Harcourt", country: "Nigeria", population: 1005904 },
  
  // Bénin
  { name: "Cotonou", country: "Bénin", population: 679012 },
  { name: "Porto-Novo", country: "Bénin", population: 267191 },
  { name: "Parakou", country: "Bénin", population: 163753 },
  { name: "Djougou", country: "Bénin", population: 63626 },
  
  // Togo
  { name: "Lomé", country: "Togo", population: 837437 },
  { name: "Sokodé", country: "Togo", population: 86500 },
  { name: "Kara", country: "Togo", population: 104207 },
  
  // Mauritanie
  { name: "Nouakchott", country: "Mauritanie", population: 661400 },
  { name: "Nouadhibou", country: "Mauritanie", population: 72337 },
  { name: "Kaédi", country: "Mauritanie", population: 34227 },
];

export function getCityOptions() {
  return cities.map(city => ({
    value: `${city.name}, ${city.country}`,
    label: `${city.name}, ${city.country}`
  }));
}

export const countries = [
  { name: "Sénégal", code: "SN" },
  { name: "Côte d'Ivoire", code: "CI" },
  { name: "Mali", code: "ML" },
  { name: "Burkina Faso", code: "BF" },
  { name: "Ghana", code: "GH" },
  { name: "Guinée", code: "GN" },
  { name: "Nigeria", code: "NG" },
  { name: "Bénin", code: "BJ" },
  { name: "Togo", code: "TG" },
  { name: "Niger", code: "NE" },
  { name: "Gambie", code: "GM" },
  { name: "Sierra Leone", code: "SL" },
  { name: "Liberia", code: "LR" },
  { name: "Guinée-Bissau", code: "GW" },
  { name: "Mauritanie", code: "MR" },
  { name: "Cap-Vert", code: "CV" },
];

export function getCountryOptions() {
  return countries.map(country => ({
    value: country.name,
    label: country.name
  }));
}

// Get cities from a specific country
export function getCitiesByCountry(countryName: string) {
  return cities
    .filter(city => city.country === countryName)
    .map(city => ({
      value: city.name,
      label: city.name
    }));
}

// Get country code by country name
export function getCountryCode(countryName: string) {
  const country = countries.find(country => country.name === countryName);
  return country?.code || "";
}

// Parse city string (e.g., "Dakar, Sénégal") into city and country
export function parseCityString(cityString: string): { cityName: string, countryName: string } {
  const parts = cityString.split(", ");
  if (parts.length > 1) {
    return {
      cityName: parts[0],
      countryName: parts[1]
    };
  }
  return {
    cityName: parts[0],
    countryName: ""
  };
}
