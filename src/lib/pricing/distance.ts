
// Function to calculate distance between two points (to be replaced by a route calculation API)
export function estimateDistance(origin: string, destination: string): number {
  // This function is a placeholder and should be replaced by a real route calculation API
  // Updated with more realistic distances based on the provided rate chart
  
  const routes: Record<string, Record<string, number>> = {
    'Dakar': {
      'Kaolack': 189,
      'Saint-Louis': 268,
      'Touba': 186,
      'Thiès': 71,
      'Mbour': 83,
      'Ziguinchor': 881,
      'Tambacounda': 467,
      'Kébémer': 155,
      'Louga': 194,
      'Mbacké': 186,
      'Diourbel': 146,
      'Tivaouane': 95,
      'Richard Toll': 376
    },
    'Kaolack': {
      'Dakar': 189,
      'Saint-Louis': 320,
      'Touba': 130,
      'Thiès': 140,
      'Mbour': 160,
      'Ziguinchor': 650,
      'Tambacounda': 290
    },
    // Add more routes as needed
  };
  
  // Extract city names from strings (which may contain country, region, etc.)
  const extractCity = (location: string): string => {
    return location.split(',')[0].trim();
  };
  
  const originCity = extractCity(origin);
  const destinationCity = extractCity(destination);
  
  // Check if we have data for these cities
  if (routes[originCity] && routes[originCity][destinationCity]) {
    return routes[originCity][destinationCity];
  }
  
  if (routes[destinationCity] && routes[destinationCity][originCity]) {
    return routes[destinationCity][originCity]; // Symmetrical distance
  }
  
  // If we don't have data for these cities, make an approximation
  // Using approximate coordinates (ideally to be replaced by an API)
  return 100; // Default distance of 100km
}
