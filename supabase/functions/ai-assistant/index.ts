
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userId } = await req.json();
    
    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error('Invalid messages format');
    }
    
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Create a client for OpenAI
    const openAIKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAIKey) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    // System message to provide context about RetourGO
    const systemMessage = {
      role: "system",
      content: `Vous êtes l'assistant IA de RetourGO, une plateforme de mise en relation entre transporteurs et expéditeurs de marchandises.
      RetourGO aide à optimiser les trajets retour des camions en les connectant avec des expéditeurs ayant des marchandises à transporter.
      Vous êtes très utile et amical. Vos réponses sont concises et précises. Vous pouvez aider avec les problèmes de transport, 
      de logistique, répondre aux questions sur la plateforme RetourGO, et fournir des informations générales liées au transport routier.
      Vous parlez principalement en français, mais vous pouvez aussi répondre en anglais ou en wolof si nécessaire.`
    };

    // Combine system message with user messages
    const fullMessages = [
      systemMessage,
      ...messages
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: fullMessages,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || JSON.stringify(error)}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message;

    // Store conversation in Supabase if needed
    // (This would be done on the client-side in this implementation)

    return new Response(
      JSON.stringify({ response: assistantMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
