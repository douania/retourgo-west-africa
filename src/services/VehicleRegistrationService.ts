
import { useToast } from "@/hooks/use-toast";

interface VehicleInfo {
  plate_number: string;
  make: string;
  model: string;
  year: string;
  type: string;
  capacity: string;
}

export const registerVehicle = async (vehicleInfo: VehicleInfo, registrationImage?: string | null): Promise<void> => {
  // In a real implementation, this would send data to your backend
  // Simulate API call
  return new Promise((resolve) => setTimeout(resolve, 1500));
};
