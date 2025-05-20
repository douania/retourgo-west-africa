
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('default', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  }).format(date);
}

export function formatDistance(meters: number) {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  } else {
    return `${(meters / 1000).toFixed(1)} km`;
  }
}

export function getStatusLabel(status: string, t?: any) {
  switch (status) {
    case 'pending':
      return t ? t("freight.status_pending") : "En attente";
    case 'accepted':
      return t ? t("freight.status_accepted") : "Acceptée";
    case 'rejected':
      return t ? t("freight.status_rejected") : "Refusée";
    case 'completed':
      return t ? t("freight.status_completed") : "Terminée";
    case 'cancelled':
      return t ? t("freight.status_cancelled") : "Annulée";
    default:
      return status;
  }
}

export function generateRandomId() {
  return Math.random().toString(36).substring(2, 15);
}
