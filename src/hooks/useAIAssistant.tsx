
import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAIServices } from "@/services/AIService";
import { supabase } from "@/integrations/supabase/client";

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export function useAIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { user } = useAuth();
  const aiServices = useAIServices();

  const createConversation = async () => {
    if (!user?.id) return null;
    
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .insert([{ user_id: user.id }])
        .select('id')
        .single();
        
      if (error) throw error;
      
      setConversationId(data.id);
      return data.id;
    } catch (error) {
      console.error("Error creating conversation:", error);
      return null;
    }
  };

  const storeMessage = async (message: ChatMessage, convId?: string) => {
    if (!user?.id) return;
    
    const currentConvId = convId || conversationId;
    if (!currentConvId) return;
    
    try {
      await supabase
        .from('ai_messages')
        .insert([{
          conversation_id: currentConvId,
          content: message.content,
          role: message.role
        }]);
    } catch (error) {
      console.error("Error storing message:", error);
    }
  };

  const sendMessage = useCallback(async (content: string) => {
    if (!user?.id || !content.trim()) return;
    
    setLoading(true);
    
    try {
      const userMessage: ChatMessage = {
        role: 'user',
        content,
        timestamp: new Date()
      };
      
      // Add user message to UI
      setMessages(prev => [...prev, userMessage]);
      
      // Create conversation if needed
      const currentConvId = conversationId || await createConversation();
      if (!currentConvId) throw new Error("Couldn't create conversation");
      
      // Store user message
      await storeMessage(userMessage, currentConvId);
      
      // Get current conversation for context
      const messagesToSend = messages.slice(-5).map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add current message
      messagesToSend.push({
        role: 'user',
        content
      });
      
      // Get AI response
      const response = await aiServices.getAssistantResponse(messagesToSend, user.id);
      
      // Add assistant message to UI
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.response.content,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Store assistant message
      await storeMessage(assistantMessage, currentConvId);
      
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  }, [messages, conversationId, user, aiServices]);

  const clearConversation = useCallback(() => {
    setMessages([]);
    setConversationId(null);
  }, []);

  return {
    messages,
    loading,
    sendMessage,
    clearConversation
  };
}
