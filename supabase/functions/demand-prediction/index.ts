
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
    const { region, timeframe, transportType } = await req.json();
    
    // Validate input
    if (!region || !timeframe) {
      throw new Error('Region and timeframe are required');
    }

    // Create a client for OpenAI
    const openAIKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAIKey) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    // Prompt for demand prediction
    const prompt = `
    En tant qu'analyste de données spécialisé dans le transport et la logistique au Sénégal et en Afrique de l'Ouest,
    prédisez la demande de transport pour la région "${region}" pour la période "${timeframe}" 
    ${transportType ? `pour le type de transport "${transportType}"` : ''}.
    
    Considérez les facteurs suivants:
    - Saisonnalité agricole et commerciale
    - Événements économiques récents ou à venir
    - Tendances historiques du transport dans cette région
    - Facteurs météorologiques saisonniers
    - Activités industrielles et commerciales
    
    Formatez votre réponse en JSON avec cette structure:
    {
      "region": "${region}",
      "timeframe": "${timeframe}",
      "predictedDemand": nombre (indice de 1-100),
      "confidenceScore": nombre (0.0-1.0),
      "factors": {
        "seasonal": {
          "impact": nombre (-10 à +10),
          "explanation": "explication"
        },
        "economic": {
          "impact": nombre (-10 à +10),
          "explanation": "explication"
        },
        "weather": {
          "impact": nombre (-10 à +10),
          "explanation": "explication"
        },
        "industrial": {
          "impact": nombre (-10 à +10),
          "explanation": "explication"
        }
      },
      "recommendation": "recommandation concise pour les transporteurs"
    }
    
    Ne retournez que le JSON, pas d'autre texte.
    `;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: "system", content: "Vous êtes un analyste de données spécialisé dans la prédiction de demande pour le transport et la logistique." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || JSON.stringify(error)}`);
    }

    const data = await response.json();
    const predictionData = JSON.parse(data.choices[0].message.content);

    return new Response(
      JSON.stringify({ 
        prediction: predictionData,
        region,
        timeframe
      }),
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
