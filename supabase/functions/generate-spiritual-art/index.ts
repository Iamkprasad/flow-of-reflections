import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const spiritualThemes = [
      "divine consciousness and inner awakening",
      "unity of all beings in cosmic love",
      "the eternal dance of creation and dissolution",
      "sacred geometry and universal harmony",
      "transcendental meditation and enlightenment",
      "the journey from darkness to light"
    ];

    const randomTheme = spiritualThemes[Math.floor(Math.random() * spiritualThemes.length)];
    
    console.log('Generating spiritual artwork prompt with NVIDIA API...');
    const NVIDIA_API_KEY = Deno.env.get('NVIDIA_API_KEY');
    
    if (!NVIDIA_API_KEY) {
      throw new Error('NVIDIA_API_KEY is not configured');
    }

    // Generate creative prompt using NVIDIA API
    const nvidiaResponse = await fetch(
      'https://integrate.api.nvidia.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NVIDIA_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'qwen/qwen3-coder-480b-a35b-instruct',
          messages: [
            {
              role: 'system',
              content: 'You are a spiritual art director. Create vivid, mystical descriptions for spiritual artwork. Be poetic and detailed.'
            },
            {
              role: 'user',
              content: `Create a detailed visual description for a spiritual artwork about "${randomTheme}". Include colors, symbols, and ethereal elements. Keep it to 2-3 sentences, suitable for image generation.`
            }
          ],
          temperature: 0.8,
          max_tokens: 200
        })
      }
    );

    if (!nvidiaResponse.ok) {
      const errorText = await nvidiaResponse.text();
      console.error('NVIDIA API error:', nvidiaResponse.status, errorText);
      throw new Error(`NVIDIA API error: ${nvidiaResponse.status}`);
    }

    const nvidiaData = await nvidiaResponse.json();
    const generatedPrompt = nvidiaData.choices[0].message.content.trim();
    
    console.log('Generated prompt:', generatedPrompt);
    
    // Generate image using HuggingFace
    const imageUrl = await generateImage(generatedPrompt);
    
    // Create description
    const description = `A beautiful spiritual artwork depicting ${randomTheme}. ${generatedPrompt}`;
    
    const title = randomTheme.charAt(0).toUpperCase() + randomTheme.slice(0, 47) + "...";

    return new Response(JSON.stringify({ 
      description: description,
      imageUrl: imageUrl,
      title: title
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

async function generateImage(prompt: string): Promise<string> {
  try {
    // Use HuggingFace FLUX model
    const HF_TOKEN = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    
    if (HF_TOKEN) {
      console.log('Using HuggingFace for image generation');
      const response = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
        {
          headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            inputs: `Beautiful spiritual artwork: ${prompt}. Ethereal, mystical, peaceful, high quality, detailed, 768x768`,
          }),
        }
      );

      if (response.ok) {
        console.log('HuggingFace API success');
        const imageBlob = await response.blob();
        const arrayBuffer = await imageBlob.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        return `data:image/png;base64,${base64}`;
      } else {
        const errorText = await response.text();
        console.log('HuggingFace API failed:', response.status, errorText);
      }
    } else {
      console.log('No HuggingFace token found');
    }

    // Fallback to SVG
    return generateSVGImage(prompt);
    
  } catch (error) {
    console.error('Error generating image:', error);
    return generateSVGImage(prompt);
  }
}

function generateSVGImage(prompt: string): string {
  // Generate a beautiful SVG based on prompt
  const canvas = `<svg width="768" height="768" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="spiritual" cx="50%" cy="30%">
        <stop offset="0%" style="stop-color:#ffd700;stop-opacity:0.9" />
        <stop offset="30%" style="stop-color:#ff6b9d;stop-opacity:0.7" />
        <stop offset="70%" style="stop-color:#9370db;stop-opacity:0.6" />
        <stop offset="100%" style="stop-color:#1e3a5f;stop-opacity:0.9" />
      </radialGradient>
      <linearGradient id="lotus" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ffd700;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#ff6b9d;stop-opacity:0.6" />
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <!-- Background -->
    <rect width="100%" height="100%" fill="url(#spiritual)"/>
    
    <!-- Sacred geometry circles -->
    <circle cx="384" cy="384" r="250" fill="none" stroke="#ffd700" stroke-width="3" opacity="0.6" filter="url(#glow)"/>
    <circle cx="384" cy="384" r="200" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.5"/>
    <circle cx="384" cy="384" r="150" fill="none" stroke="#ff6b9d" stroke-width="2" opacity="0.7"/>
    
    <!-- Central lotus -->
    <circle cx="384" cy="384" r="80" fill="url(#lotus)" opacity="0.8" filter="url(#glow)"/>
    
    <!-- Lotus petals -->
    <g transform="translate(384,384)" opacity="0.8">
      <ellipse cx="0" cy="-100" rx="25" ry="60" fill="#ffd700" opacity="0.7" filter="url(#glow)"/>
      <ellipse cx="70" cy="-70" rx="25" ry="60" fill="#ff6b9d" opacity="0.7" transform="rotate(45)" filter="url(#glow)"/>
      <ellipse cx="100" cy="0" rx="25" ry="60" fill="#ffd700" opacity="0.7" transform="rotate(90)" filter="url(#glow)"/>
      <ellipse cx="70" cy="70" rx="25" ry="60" fill="#ff6b9d" opacity="0.7" transform="rotate(135)" filter="url(#glow)"/>
      <ellipse cx="0" cy="100" rx="25" ry="60" fill="#ffd700" opacity="0.7" transform="rotate(180)" filter="url(#glow)"/>
      <ellipse cx="-70" cy="70" rx="25" ry="60" fill="#ff6b9d" opacity="0.7" transform="rotate(225)" filter="url(#glow)"/>
      <ellipse cx="-100" cy="0" rx="25" ry="60" fill="#ffd700" opacity="0.7" transform="rotate(270)" filter="url(#glow)"/>
      <ellipse cx="-70" cy="-70" rx="25" ry="60" fill="#ff6b9d" opacity="0.7" transform="rotate(315)" filter="url(#glow)"/>
    </g>
    
    <!-- Inner light -->
    <circle cx="384" cy="384" r="40" fill="#ffffff" opacity="0.9" filter="url(#glow)"/>
    
    <!-- Floating light particles -->
    <circle cx="250" cy="250" r="5" fill="#ffd700" opacity="0.8" filter="url(#glow)">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite"/>
    </circle>
    <circle cx="550" cy="300" r="4" fill="#ff6b9d" opacity="0.7" filter="url(#glow)">
      <animate attributeName="opacity" values="0.4;0.9;0.4" dur="4s" repeatCount="indefinite"/>
    </circle>
    <circle cx="300" cy="550" r="4.5" fill="#9370db" opacity="0.6" filter="url(#glow)">
      <animate attributeName="opacity" values="0.2;0.8;0.2" dur="5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="500" cy="200" r="3.5" fill="#ffffff" opacity="0.8" filter="url(#glow)">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite"/>
    </circle>
    
    <!-- Sacred text -->
    <text x="384" y="700" text-anchor="middle" fill="#ffffff" font-family="serif" font-size="28" opacity="0.9" font-style="italic">
      Sacred Art
    </text>
  </svg>`;
  
  return `data:image/svg+xml;base64,${btoa(canvas)}`;
}