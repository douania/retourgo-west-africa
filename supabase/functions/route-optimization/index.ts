
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
    const { origin, destination, userId } = await req.json();
    
    // Validate input
    if (!origin || !destination || !userId) {
      throw new Error('Origin, destination and userId are required');
    }

    // Create a client for OpenAI
    const openAIKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAIKey) {
      throw new Error("OPENAI_API_KEY is not set");
    }

    // Prompt for route optimization
    const prompt = `
    En tant qu'expert en logistique et transport routier au Sénégal et en Afrique de l'Ouest,
    proposez un itinéraire optimisé pour un transporteur qui voyage de "${origin}" à "${destination}".
    
    Incluez les informations suivantes:
    1. Distance estimée en kilomètres
    2. Temps de trajet estimé
    3. Axes routiers principaux à emprunter
    4. Points de repos recommandés
    5. Zones à éviter (travaux, routes en mauvais état, zones dangereuses)
    6. Postes de contrôle connus
    
    Formatez votre réponse en JSON avec cette structure:
    {
      "distance": nombre (en km),
      "duration": nombre (en heures),
      "route": ["étape1", "étape2", ...],
      "restPoints": ["point1", "point2", ...],
      "avoidAreas": ["zone1", "zone2", ...],
      "checkpoints": ["poste1", "poste2", ...],
      "summary": "description textuelle concise"
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
          { role: "system", content: "Vous êtes un expert en logistique et transport routier au Sénégal et en Afrique de l'Ouest." },
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
    const routeData = JSON.parse(data.choices[0].message.content);

    return new Response(
      JSON.stringify({ 
        route: routeData,
        origin,
        destination,
        distance: routeData.distance,
        duration: routeData.duration
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
