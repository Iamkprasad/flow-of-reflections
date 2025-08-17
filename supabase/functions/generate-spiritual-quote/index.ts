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
    const spiritualThemes = [
      "inner peace and mindfulness",
      "divine love and compassion",
      "spiritual awakening and enlightenment",
      "the unity of all beings",
      "finding strength in adversity",
      "the power of forgiveness",
      "living in the present moment",
      "transcending the ego",
      "sacred wisdom and ancient teachings",
      "the journey of the soul"
    ];

    const randomTheme = spiritualThemes[Math.floor(Math.random() * spiritualThemes.length)];
    
    const quotePrompt = `Generate an inspirational spiritual quote about ${randomTheme}. 
    The quote should be:
    - Original and profound
    - Between 15-40 words
    - Universally meaningful regardless of specific religious beliefs
    - Poetic and memorable
    
    Also provide:
    - A wise spiritual author name (can be fictional but should sound authentic)
    - A detailed description for a spiritual artwork that would complement this quote
    
    Return in this exact format:
    QUOTE: [the quote text]
    AUTHOR: [author name]
    IMAGE_DESCRIPTION: [detailed artwork description for image generation]`;

    // Generate quote with text
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
                text: quotePrompt
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
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }
    
    const content = data.candidates[0].content.parts[0].text;

    // Parse the response
    const quoteMatch = content.match(/QUOTE:\s*(.*)/);
    const authorMatch = content.match(/AUTHOR:\s*(.*)/);
    const imageDescMatch = content.match(/IMAGE_DESCRIPTION:\s*(.*)/);

    const quoteText = quoteMatch ? quoteMatch[1].trim().replace(/[""]/g, '') : "The light within you is eternal and infinite.";
    const author = authorMatch ? authorMatch[1].trim() : "Ancient Wisdom";
    const imageDescription = imageDescMatch ? imageDescMatch[1].trim() : "A serene spiritual scene with golden light";

    // Generate image using Gemini's image generation
    const imageUrl = await generateSpiritualImage(imageDescription);

    return new Response(JSON.stringify({ 
      text: quoteText,
      author: author,
      imageUrl: imageUrl
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-spiritual-quote function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateSpiritualImage(description: string): Promise<string> {
  try {
    // Use Gemini's image generation capability
    const imagePrompt = `Create a beautiful spiritual artwork: ${description}. 
    Style: ethereal, mystical, with soft lighting and peaceful colors.
    Size: 768x768 pixels. High quality, serene, and inspiring.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-thinking-exp-01-21:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: imagePrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          responseModalities: ['TEXT', 'IMAGE']
        }
      }),
    });

    if (!response.ok) {
      console.error('Gemini image generation failed, using fallback');
      return generateFallbackImage(description);
    }

    const data = await response.json();
    
    // Check if we have image data
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const parts = data.candidates[0].content.parts;
      
      for (const part of parts) {
        if (part.inlineData && part.inlineData.mimeType && part.inlineData.data) {
          // Return the base64 image
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    // Fallback if no image generated
    return generateFallbackImage(description);
    
  } catch (error) {
    console.error('Error generating image:', error);
    return generateFallbackImage(description);
  }
}

function generateFallbackImage(description: string): string {
  // Create a beautiful spiritual SVG as fallback
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
        <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <!-- Background -->
    <rect width="100%" height="100%" fill="url(#spiritual)"/>
    
    <!-- Sacred geometry circles -->
    <circle cx="384" cy="384" r="200" fill="none" stroke="#ffd700" stroke-width="3" opacity="0.6" filter="url(#glow)"/>
    <circle cx="384" cy="384" r="160" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.5"/>
    <circle cx="384" cy="384" r="120" fill="none" stroke="#ff6b9d" stroke-width="2" opacity="0.7"/>
    
    <!-- Central lotus -->
    <circle cx="384" cy="384" r="60" fill="url(#lotus)" opacity="0.8" filter="url(#glow)"/>
    
    <!-- Lotus petals -->
    <g transform="translate(384,384)" opacity="0.8">
      <ellipse cx="0" cy="-80" rx="20" ry="50" fill="#ffd700" opacity="0.7" filter="url(#glow)"/>
      <ellipse cx="56" cy="-56" rx="20" ry="50" fill="#ff6b9d" opacity="0.7" transform="rotate(45)" filter="url(#glow)"/>
      <ellipse cx="80" cy="0" rx="20" ry="50" fill="#ffd700" opacity="0.7" transform="rotate(90)" filter="url(#glow)"/>
      <ellipse cx="56" cy="56" rx="20" ry="50" fill="#ff6b9d" opacity="0.7" transform="rotate(135)" filter="url(#glow)"/>
      <ellipse cx="0" cy="80" rx="20" ry="50" fill="#ffd700" opacity="0.7" transform="rotate(180)" filter="url(#glow)"/>
      <ellipse cx="-56" cy="56" rx="20" ry="50" fill="#ff6b9d" opacity="0.7" transform="rotate(225)" filter="url(#glow)"/>
      <ellipse cx="-80" cy="0" rx="20" ry="50" fill="#ffd700" opacity="0.7" transform="rotate(270)" filter="url(#glow)"/>
      <ellipse cx="-56" cy="-56" rx="20" ry="50" fill="#ff6b9d" opacity="0.7" transform="rotate(315)" filter="url(#glow)"/>
    </g>
    
    <!-- Inner light -->
    <circle cx="384" cy="384" r="30" fill="#ffffff" opacity="0.9" filter="url(#glow)"/>
    
    <!-- Floating light particles -->
    <circle cx="200" cy="200" r="4" fill="#ffd700" opacity="0.8" filter="url(#glow)">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite"/>
    </circle>
    <circle cx="600" cy="300" r="3" fill="#ff6b9d" opacity="0.7" filter="url(#glow)">
      <animate attributeName="opacity" values="0.4;0.9;0.4" dur="4s" repeatCount="indefinite"/>
    </circle>
    <circle cx="300" cy="600" r="3.5" fill="#9370db" opacity="0.6" filter="url(#glow)">
      <animate attributeName="opacity" values="0.2;0.8;0.2" dur="5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="500" cy="150" r="2.5" fill="#ffffff" opacity="0.8" filter="url(#glow)">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite"/>
    </circle>
    
    <!-- Sacred text -->
    <text x="384" y="700" text-anchor="middle" fill="#ffffff" font-family="serif" font-size="24" opacity="0.9" font-style="italic">
      ✨ Divine Wisdom ✨
    </text>
  </svg>`;
  
  return `data:image/svg+xml;base64,${btoa(canvas)}`;
}