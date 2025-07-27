import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const INSTAGRAM_ACCESS_TOKEN = Deno.env.get('INSTAGRAM_ACCESS_TOKEN');
    if (!INSTAGRAM_ACCESS_TOKEN) {
      throw new Error('Instagram access token not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching Instagram posts...');

    // Fetch Instagram posts
    const instagramResponse = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${INSTAGRAM_ACCESS_TOKEN}`
    );

    if (!instagramResponse.ok) {
      const errorText = await instagramResponse.text();
      console.error('Instagram API error:', errorText);
      throw new Error(`Instagram API error: ${instagramResponse.status}`);
    }

    const instagramData = await instagramResponse.json();
    console.log('Instagram data received:', instagramData);

    // Filter for images only
    const imagePosts = instagramData.data?.filter((post: any) => 
      post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM'
    ) || [];

    console.log(`Processing ${imagePosts.length} image posts`);

    // Store/update posts in database
    for (const post of imagePosts) {
      const { error } = await supabase
        .from('posts')
        .upsert({
          instagram_id: post.id,
          title: post.caption?.split('\n')[0]?.substring(0, 100) || 'Untitled',
          image_url: post.media_url,
          caption: post.caption || '',
          permalink: post.permalink,
        }, {
          onConflict: 'instagram_id'
        });

      if (error) {
        console.error('Error storing post:', error);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        postsProcessed: imagePosts.length 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});