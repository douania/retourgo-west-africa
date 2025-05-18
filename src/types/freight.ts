
export interface Freight {
  id: string;
  user_id: string;
  title: string;
  description: string;
  origin: string;
  destination: string;
  pickup_date: string;
  delivery_date: string;
  weight: number;
  volume: number;
  price: number;
  status: 'available' | 'in-progress' | 'completed';
  created_at: string;
}

export interface TransportOffer {
  id: string;
  freight_id: string;
  transporter_id: string;
  price_offered: number;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  freights: Freight;
}
