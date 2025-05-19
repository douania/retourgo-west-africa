
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
    const { origin, destination, weight, volume, vehicleType, specialRequirements } = await req.json();
    
    // Validate input
    if (!origin || !destination || !weight || !vehicleType) {
      throw new Error('Origin, destination, weight and vehicleType are required');
    }

    // Create a client for OpenAI
    const openAIKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAIKey) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    // Prompt for price estimation
    const prompt = `
    En tant qu'expert en logistique et transport routier au Sénégal et en Afrique de l'Ouest,
    estimez un prix juste pour le transport d'une marchandise avec les caractéristiques suivantes:
    
    - Origine: ${origin}
    - Destination: ${destination}
    - Poids: ${weight} kg
    - Volume: ${volume || "Non spécifié"} m³
    - Type de véhicule: ${vehicleType}
    - Exigences spéciales: ${specialRequirements || "Aucune"}
    
    Tenez compte des facteurs suivants dans votre estimation:
    - Prix du carburant actuel
    - Distance approximative
    - État des routes
    - Coûts opérationnels standards des transporteurs
    - Tarifs moyens du marché au Sénégal/Afrique de l'Ouest
    - Saisonnalité (si pertinent)
    
    Formatez votre réponse en JSON avec cette structure:
    {
      "estimatedPrice": nombre (en FCFA),
      "priceRange": {"min": nombre, "max": nombre},
      "distance": nombre (en km),
      "factors": {
        "fuel": nombre (en FCFA),
        "operationalCosts": nombre (en FCFA),
        "roadConditions": texte,
        "seasonalFactor": nombre (multiplicateur)
      },
      "explanation": "explication concise"
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
          { role: "system", content: "Vous êtes un expert en logistique et transport routier spécialisé dans l'estimation des coûts de transport." },
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
    const priceData = JSON.parse(data.choices[0].message.content);

    return new Response(
      JSON.stringify({ 
        priceEstimation: priceData,
        origin,
        destination,
        weight,
        volume: volume || null,
        vehicleType
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
