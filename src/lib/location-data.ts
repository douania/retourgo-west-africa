
// Pour démarrer, nous utilisons une liste statique des villes principales
// Dans une version production, ces données viendraient d'une API externe

export interface City {
  name: string;
  country: string;
  code?: string;
}

export const cities: City[] = [
  // Sénégal
  { name: "Dakar", country: "Sénégal" },
  { name: "Thiès", country: "Sénégal" },
  { name: "Kaolack", country: "Sénégal" },
  { name: "Saint-Louis", country: "Sénégal" },
  { name: "Ziguinchor", country: "Sénégal" },
  { name: "Touba", country: "Sénégal" },
  { name: "Diourbel", country: "Sénégal" },
  
  // Côte d'Ivoire
  { name: "Abidjan", country: "Côte d'Ivoire" },
  { name: "Bouaké", country: "Côte d'Ivoire" },
  { name: "Daloa", country: "Côte d'Ivoire" },
  { name: "Yamoussoukro", country: "Côte d'Ivoire" },
  { name: "Korhogo", country: "Côte d'Ivoire" },
  
  // Mali
  { name: "Bamako", country: "Mali" },
  { name: "Sikasso", country: "Mali" },
  { name: "Mopti", country: "Mali" },
  { name: "Gao", country: "Mali" },
  
  // Burkina Faso
  { name: "Ouagadougou", country: "Burkina Faso" },
  { name: "Bobo-Dioulasso", country: "Burkina Faso" },
  { name: "Koudougou", country: "Burkina Faso" },
  
  // Ghana
  { name: "Accra", country: "Ghana" },
  { name: "Kumasi", country: "Ghana" },
  { name: "Tamale", country: "Ghana" },
  
  // Guinée
  { name: "Conakry", country: "Guinée" },
  { name: "Nzérékoré", country: "Guinée" },
  { name: "Kankan", country: "Guinée" },
  
  // Nigeria
  { name: "Lagos", country: "Nigeria" },
  { name: "Abuja", country: "Nigeria" },
  { name: "Kano", country: "Nigeria" },
  { name: "Ibadan", country: "Nigeria" },
  
  // Bénin
  { name: "Cotonou", country: "Bénin" },
  { name: "Porto-Novo", country: "Bénin" },
  { name: "Parakou", country: "Bénin" }
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
  { name: "Mauritanie", code: "MR" }
];

export function getCountryOptions() {
  return countries.map(country => ({
    value: country.name,
    label: country.name
  }));
}
