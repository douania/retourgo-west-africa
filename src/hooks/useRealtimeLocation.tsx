import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  heading?: number | null;
  speed?: number | null;
  timestamp: Date;
}

interface UserLocation extends LocationData {
  user_id: string;
  user_name?: string;
  user_type: 'shipper' | 'transporter' | 'individual';
  is_available: boolean;
}

interface RealtimeLocationOptions {
  enableSharing?: boolean;
  updateInterval?: number;
  highAccuracy?: boolean;
  enableTracking?: boolean;
}

export function useRealtimeLocation(options: RealtimeLocationOptions = {}) {
  const {
    enableSharing = false,
    updateInterval = 10000, // 10 seconds
    highAccuracy = true,
    enableTracking = false
  } = options;

  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [nearbyUsers, setNearbyUsers] = useState<UserLocation[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();
  
  const watchIdRef = useRef<number | null>(null);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const realtimeChannelRef = useRef<any>(null);

  // Start location tracking
  const startTracking = () => {
    if (!navigator.geolocation) {
      setError('La géolocalisation n\'est pas supportée');
      return;
    }

    setIsTracking(true);
    setError(null);

    const options: PositionOptions = {
      enableHighAccuracy: highAccuracy,
      timeout: 15000,
      maximumAge: 5000
    };

    // Watch position changes
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: new Date(position.timestamp)
        };

        setCurrentLocation(locationData);
        
        // Share location if enabled
        if (isSharing && user) {
          updateUserLocation(locationData);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Erreur de géolocalisation';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Autorisation de géolocalisation refusée';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Position non disponible';
            break;
          case error.TIMEOUT:
            errorMessage = 'Timeout de géolocalisation';
            break;
        }
        
        setError(errorMessage);
        toast({
          title: "Erreur de localisation",
          description: errorMessage,
          variant: "destructive",
        });
      },
      options
    );
  };

  // Stop location tracking
  const stopTracking = () => {
    setIsTracking(false);
    
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }
  };

  // Start sharing location
  const startSharing = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour partager votre position",
        variant: "destructive",
      });
      return;
    }

    setIsSharing(true);
    
    // Start tracking if not already started
    if (!isTracking) {
      startTracking();
    }

    // Subscribe to nearby users updates
    subscribeToNearbyUsers();
    
    toast({
      title: "Partage activé",
      description: "Votre position est maintenant partagée",
    });
  };

  // Stop sharing location
  const stopSharing = async () => {
    setIsSharing(false);
    
    if (user) {
      // Update availability to false
      await updateUserAvailability(false);
    }
    
    // Unsubscribe from realtime updates
    if (realtimeChannelRef.current) {
      supabase.removeChannel(realtimeChannelRef.current);
      realtimeChannelRef.current = null;
    }
    
    setNearbyUsers([]);
    
    toast({
      title: "Partage désactivé",
      description: "Votre position n'est plus partagée",
    });
  };

  // Update user location in database
  const updateUserLocation = async (location: LocationData) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          current_latitude: location.latitude,
          current_longitude: location.longitude,
          location_updated_at: new Date().toISOString(),
          is_available: true
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating location:', error);
      }
    } catch (error) {
      console.error('Failed to update location:', error);
    }
  };

  // Update user availability
  const updateUserAvailability = async (isAvailable: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_available: isAvailable })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating availability:', error);
      }
    } catch (error) {
      console.error('Failed to update availability:', error);
    }
  };

  // Subscribe to nearby users updates
  const subscribeToNearbyUsers = () => {
    if (realtimeChannelRef.current) {
      supabase.removeChannel(realtimeChannelRef.current);
    }

    realtimeChannelRef.current = supabase
      .channel('location-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: 'is_available=eq.true'
        },
        (payload) => {
          handleLocationUpdate(payload);
        }
      )
      .subscribe();

    // Also fetch initial nearby users
    fetchNearbyUsers();
  };

  // Handle realtime location updates
  const handleLocationUpdate = (payload: any) => {
    const { new: newRecord, old: oldRecord, eventType } = payload;
    
    if (eventType === 'DELETE' || !newRecord?.is_available) {
      // Remove user from nearby list
      setNearbyUsers(prev => prev.filter(u => u.user_id !== (oldRecord?.id || newRecord?.id)));
      return;
    }

    if (newRecord?.current_latitude && newRecord?.current_longitude) {
      const userLocation: UserLocation = {
        user_id: newRecord.id,
        user_name: `${newRecord.first_name || ''} ${newRecord.last_name || ''}`.trim(),
        user_type: newRecord.user_type,
        latitude: newRecord.current_latitude,
        longitude: newRecord.current_longitude,
        is_available: newRecord.is_available,
        timestamp: new Date(newRecord.location_updated_at || new Date())
      };

      // Filter nearby users (within 50km radius)
      if (currentLocation && calculateDistance(currentLocation, userLocation) <= 50) {
        setNearbyUsers(prev => {
          const filtered = prev.filter(u => u.user_id !== userLocation.user_id);
          return [...filtered, userLocation];
        });
      }
    }
  };

  // Fetch nearby users initially
  const fetchNearbyUsers = async () => {
    if (!currentLocation || !user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, user_type, current_latitude, current_longitude, is_available, location_updated_at')
        .eq('is_available', true)
        .neq('id', user.id)
        .not('current_latitude', 'is', null)
        .not('current_longitude', 'is', null);

      if (error) {
        console.error('Error fetching nearby users:', error);
        return;
      }

      const nearby = data
        ?.map(profile => ({
          user_id: profile.id,
          user_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
          user_type: profile.user_type,
          latitude: profile.current_latitude!,
          longitude: profile.current_longitude!,
          is_available: profile.is_available,
          timestamp: new Date(profile.location_updated_at || new Date())
        }))
        .filter(userLoc => calculateDistance(currentLocation, userLoc) <= 50) || [];

      setNearbyUsers(nearby);
    } catch (error) {
      console.error('Failed to fetch nearby users:', error);
    }
  };

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (pos1: LocationData, pos2: LocationData): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(pos2.latitude - pos1.latitude);
    const dLon = toRadians(pos2.longitude - pos1.longitude);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(pos1.latitude)) * Math.cos(toRadians(pos2.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

  // Auto-start tracking if enabled
  useEffect(() => {
    if (enableTracking) {
      startTracking();
    }

    return () => {
      stopTracking();
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
      }
    };
  }, [enableTracking]);

  // Auto-start sharing if enabled
  useEffect(() => {
    if (enableSharing && user) {
      startSharing();
    }

    return () => {
      if (isSharing) {
        stopSharing();
      }
    };
  }, [enableSharing, user]);

  // Update nearby users when current location changes
  useEffect(() => {
    if (currentLocation && isSharing) {
      fetchNearbyUsers();
    }
  }, [currentLocation, isSharing]);

  return {
    currentLocation,
    nearbyUsers,
    isTracking,
    isSharing,
    error,
    startTracking,
    stopTracking,
    startSharing,
    stopSharing,
    calculateDistance
  };
}