
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDistance(origin: string, destination: string): string {
  // This is a placeholder for a real distance calculation
  // In a real application, you would use a mapping API to calculate the distance
  return `${origin} → ${destination}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR',
    minimumFractionDigits: 0
  }).format(amount);
}

export function calculateDaysLeft(dateString: string): number {
  const targetDate = new Date(dateString);
  const today = new Date();
  const timeDiff = targetDate.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

export function getStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    'available': 'Disponible',
    'assigned': 'Attribué',
    'in_transit': 'En transit',
    'completed': 'Livré',
    'cancelled': 'Annulé',
    'pending': 'En attente',
    'accepted': 'Accepté',
    'rejected': 'Refusé'
  };
  
  return statusMap[status] || status;
}
