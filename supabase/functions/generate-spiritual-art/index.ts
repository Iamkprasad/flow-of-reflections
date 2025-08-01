import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const spiritualPrompts = [
      "A luminous tree of life with golden leaves floating in a cosmic void, representing the interconnectedness of all souls",
      "A meditating figure dissolving into starlight beside a tranquil lake that reflects infinite galaxies",
      "Ancient lotus flowers blooming through cracks in weathered stone, symbolizing resilience and spiritual awakening",
      "A spiral pathway of light ascending through layers of ethereal clouds toward a radiant source",
      "Hands releasing a flock of luminous birds that transform into constellation patterns in a twilight sky",
      "A serene mountain peak where earth meets heaven, with streams of light flowing down like waterfalls of wisdom",
      "A mandala garden where each petal contains a different scene of spiritual transformation and inner peace",
      "Two souls connected by threads of golden light across a bridge of rainbow colors spanning an endless chasm"
    ];

    const randomPrompt = spiritualPrompts[Math.floor(Math.random() * spiritualPrompts.length)];
    
    const fullPrompt = `Create a detailed description of a spiritual painting: ${randomPrompt}. 
    
    Describe the artwork in vivid detail, including:
    - Visual elements and composition
    - Color palette and lighting
    - Symbolic meaning and spiritual significance
    - The emotional atmosphere it evokes
    - How it might inspire reflection on inner growth, forgiveness, or enlightenment
    
    Write this as if describing an actual painting that exists, with rich artistic and spiritual language.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: fullPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const description = data.candidates[0].content.parts[0].text;

    // Generate a simple image placeholder with spiritual colors and the prompt text
    const imageDataUrl = generateSpiritualArtwork(randomPrompt);

    return new Response(JSON.stringify({ 
      description,
      imageUrl: imageDataUrl,
      title: randomPrompt.split(',')[0] // Use first part as title
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-spiritual-art function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateSpiritualArtwork(prompt: string): string {
  // Create a canvas-like spiritual artwork as data URL
  const canvas = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="spiritual" cx="50%" cy="50%">
        <stop offset="0%" style="stop-color:#ffd700;stop-opacity:0.8" />
        <stop offset="50%" style="stop-color:#9370db;stop-opacity:0.6" />
        <stop offset="100%" style="stop-color:#191970;stop-opacity:0.9" />
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#spiritual)"/>
    <circle cx="256" cy="256" r="100" fill="none" stroke="#ffd700" stroke-width="2" opacity="0.7" filter="url(#glow)"/>
    <circle cx="256" cy="256" r="60" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.5"/>
    <circle cx="256" cy="256" r="30" fill="#ffd700" opacity="0.6" filter="url(#glow)"/>
    <text x="256" y="400" text-anchor="middle" fill="#ffffff" font-family="serif" font-size="14" opacity="0.8">Spiritual Artwork</text>
  </svg>`;
  
  return `data:image/svg+xml;base64,${btoa(canvas)}`;
}