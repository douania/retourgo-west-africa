
import { supabase } from "@/integrations/supabase/client";
import { AIAssistantResponse } from "./types";

export async function getAssistantResponse(
  messages: { role: string; content: string }[], 
  userId: string
): Promise<AIAssistantResponse> {
  console.log("Calling AI assistant with userId:", userId);
  
  const { data, error } = await supabase.functions.invoke('ai-assistant', {
    body: { messages, userId }
  });
  
  if (error) {
    console.error("AI assistant error:", error);
    throw new Error(`Error getting AI assistant response: ${error.message}`);
  }
  
  return data as AIAssistantResponse;
}
