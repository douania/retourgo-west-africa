import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface NotificationSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Check if push notifications are supported
  useEffect(() => {
    const supported = 'serviceWorker' in navigator && 'PushManager' in window;
    setIsSupported(supported);
    
    if (supported) {
      checkSubscriptionStatus();
    }
  }, [user]);

  // Check current subscription status
  const checkSubscriptionStatus = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  // Request notification permission
  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      toast({
        title: "Non supporté",
        description: "Les notifications ne sont pas supportées sur cet appareil",
        variant: "destructive",
      });
      return false;
    }

    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      toast({
        title: "Autorisé",
        description: "Notifications activées avec succès",
      });
      return true;
    } else if (permission === 'denied') {
      toast({
        title: "Refusé",
        description: "Veuillez autoriser les notifications dans les paramètres de votre navigateur",
        variant: "destructive",
      });
      return false;
    }
    
    return false;
  };

  // Subscribe to push notifications
  const subscribe = async () => {
    if (!isSupported || !user) return;

    setIsLoading(true);
    
    try {
      // Request permission first
      const hasPermission = await requestPermission();
      if (!hasPermission) return;

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;
      
      // Check if already subscribed
      let subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        // Create new subscription
        const vapidKey = await getVapidKey();
        
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey)
        });
      }

      // Save subscription to database
      if (subscription) {
        await saveSubscriptionToDatabase(subscription);
        setIsSubscribed(true);
        
        toast({
          title: "Notifications activées",
          description: "Vous recevrez désormais les notifications push",
        });
      }
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'activer les notifications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Unsubscribe from push notifications
  const unsubscribe = async () => {
    if (!isSupported || !user) return;

    setIsLoading(true);
    
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        await removeSubscriptionFromDatabase();
        setIsSubscribed(false);
        
        toast({
          title: "Notifications désactivées",
          description: "Vous ne recevrez plus de notifications push",
        });
      }
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      toast({
        title: "Erreur",
        description: "Impossible de désactiver les notifications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get VAPID key from server
  const getVapidKey = async (): Promise<string> => {
    // For demo purposes, using a placeholder key
    // In production, this should come from your server/edge function
    return 'BEl62iUYgUivxIkv69yViEuiBIa40HI80NM-2CqAwWqPowWAk5Zap1_LQN2OU1R3H3g7u5HjsEyGOz1O0wF8aII';
  };

  // Save subscription to Supabase (temporarily disabled until migration is approved)
  const saveSubscriptionToDatabase = async (subscription: PushSubscription) => {
    const subscriptionData: NotificationSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
        auth: arrayBufferToBase64(subscription.getKey('auth')!)
      }
    };

    // TODO: Enable after push_subscriptions table migration is approved
    console.log('Push subscription would be saved:', subscriptionData);
    /*
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: user!.id,
        subscription_data: subscriptionData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      throw error;
    }
    */
  };

  // Remove subscription from database (temporarily disabled until migration is approved)
  const removeSubscriptionFromDatabase = async () => {
    // TODO: Enable after push_subscriptions table migration is approved
    console.log('Push subscription would be removed for user:', user!.id);
    /*
    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('user_id', user!.id);

    if (error) {
      throw error;
    }
    */
  };

  // Send a test notification
  const sendTestNotification = async () => {
    try {
      const { error } = await supabase.functions.invoke('send-notification', {
        body: {
          user_id: user!.id,
          title: 'Test RetourGo',
          body: 'Ceci est une notification de test',
          data: { test: true }
        }
      });

      if (error) throw error;
      
      toast({
        title: "Test envoyé",
        description: "Une notification de test a été envoyée",
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la notification de test",
        variant: "destructive",
      });
    }
  };

  return {
    isSupported,
    isSubscribed,
    isLoading,
    subscribe,
    unsubscribe,
    sendTestNotification,
    permission: Notification.permission
  };
}

// Utility functions
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}