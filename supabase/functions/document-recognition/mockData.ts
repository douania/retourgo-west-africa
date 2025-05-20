
// Mock data for demo or when APIs are unavailable
export function getMockData(documentType: string) {
  switch (documentType) {
    case 'id_card':
      return {
        full_name: "Moustapha Diop",
        id_number: "123456789",
        birth_date: "15/04/1985",
        nationality: "Sénégalaise",
        address: "123 Rue de Dakar, Sénégal"
      };
    case 'driver_license':
      return {
        full_name: "Amadou Sow",
        license_number: "SN45678901",
        categories: "B, BE",
        expiry_date: "25/06/2025",
        issue_date: "25/06/2020"
      };
    case 'vehicle_registration':
      return {
        plate_number: "DK-234-AB",
        make: "Toyota",
        model: "Hilux",
        year: "2020",
        owner: "Samba Ndiaye",
        vehicle_type: "Pickup"
      };
    case 'business_registration':
      return {
        company_name: "Transport Sénégal SARL",
        ninea: "SN98765432",
        rc: "RC-DAK-2018-B-12345",
        address: "45 Avenue de la République, Dakar"
      };
    default:
      return {};
  }
}
