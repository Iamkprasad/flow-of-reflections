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

    // Use the generated description as a prompt for actual image generation
    const imageUrl = await generateActualImage(description);

    return new Response(JSON.stringify({ 
      description,
      imageUrl,
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

async function generateActualImage(description: string): Promise<string> {
  // For now, return a beautiful SVG-based spiritual artwork
  // Later this can be replaced with actual AI image generation
  return generateSpiritualArtwork(description);
}

function generateSpiritualArtwork(prompt: string): string {
  // Create a more beautiful spiritual artwork as data URL
  const canvas = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="spiritual" cx="50%" cy="50%">
        <stop offset="0%" style="stop-color:#ffd700;stop-opacity:0.9" />
        <stop offset="30%" style="stop-color:#ff6b9d;stop-opacity:0.7" />
        <stop offset="60%" style="stop-color:#9370db;stop-opacity:0.6" />
        <stop offset="100%" style="stop-color:#1e3a5f;stop-opacity:0.9" />
      </radialGradient>
      <linearGradient id="lotus" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ffd700;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#ff6b9d;stop-opacity:0.6" />
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <!-- Background -->
    <rect width="100%" height="100%" fill="url(#spiritual)"/>
    
    <!-- Sacred geometry -->
    <circle cx="256" cy="256" r="150" fill="none" stroke="#ffd700" stroke-width="2" opacity="0.5" filter="url(#glow)"/>
    <circle cx="256" cy="256" r="120" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.4"/>
    <circle cx="256" cy="256" r="90" fill="none" stroke="#ff6b9d" stroke-width="1.5" opacity="0.6"/>
    
    <!-- Lotus center -->
    <circle cx="256" cy="256" r="40" fill="url(#lotus)" opacity="0.8" filter="url(#glow)"/>
    
    <!-- Lotus petals -->
    <g transform="translate(256,256)" opacity="0.7">
      <!-- Outer petals -->
      <ellipse cx="0" cy="-60" rx="15" ry="40" fill="#ffd700" opacity="0.6" filter="url(#glow)"/>
      <ellipse cx="42" cy="-42" rx="15" ry="40" fill="#ff6b9d" opacity="0.6" transform="rotate(45)" filter="url(#glow)"/>
      <ellipse cx="60" cy="0" rx="15" ry="40" fill="#ffd700" opacity="0.6" transform="rotate(90)" filter="url(#glow)"/>
      <ellipse cx="42" cy="42" rx="15" ry="40" fill="#ff6b9d" opacity="0.6" transform="rotate(135)" filter="url(#glow)"/>
      <ellipse cx="0" cy="60" rx="15" ry="40" fill="#ffd700" opacity="0.6" transform="rotate(180)" filter="url(#glow)"/>
      <ellipse cx="-42" cy="42" rx="15" ry="40" fill="#ff6b9d" opacity="0.6" transform="rotate(225)" filter="url(#glow)"/>
      <ellipse cx="-60" cy="0" rx="15" ry="40" fill="#ffd700" opacity="0.6" transform="rotate(270)" filter="url(#glow)"/>
      <ellipse cx="-42" cy="-42" rx="15" ry="40" fill="#ff6b9d" opacity="0.6" transform="rotate(315)" filter="url(#glow)"/>
    </g>
    
    <!-- Inner light -->
    <circle cx="256" cy="256" r="20" fill="#ffffff" opacity="0.9" filter="url(#glow)"/>
    
    <!-- Floating particles -->
    <circle cx="180" cy="150" r="3" fill="#ffd700" opacity="0.8" filter="url(#glow)">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite"/>
    </circle>
    <circle cx="350" cy="200" r="2" fill="#ff6b9d" opacity="0.7" filter="url(#glow)">
      <animate attributeName="opacity" values="0.4;0.9;0.4" dur="4s" repeatCount="indefinite"/>
    </circle>
    <circle cx="200" cy="380" r="2.5" fill="#9370db" opacity="0.6" filter="url(#glow)">
      <animate attributeName="opacity" values="0.2;0.8;0.2" dur="5s" repeatCount="indefinite"/>
    </circle>
    
    <!-- Sacred text -->
    <text x="256" y="480" text-anchor="middle" fill="#ffffff" font-family="serif" font-size="16" opacity="0.9" font-style="italic">
      ✨ Sacred Art ✨
    </text>
  </svg>`;
  
  return `data:image/svg+xml;base64,${btoa(canvas)}`;
}