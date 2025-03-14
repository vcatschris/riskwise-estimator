
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the form data and assessment ID from the request
    const { assessmentId, contactData } = await req.json();
    console.log('Received webhook request:', { assessmentId, contactData });

    // Fetch data from Zapier webhook
    console.log('Sending data to Zapier webhook');
    const response = await fetch('https://hooks.zapier.com/hooks/catch/3379103/2lry0on/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: contactData.name,
        email: contactData.email,
        company: contactData.company,
        phone: contactData.phone,
        newsletter: contactData.newsletter,
        submission_type: contactData.submission_type,
        risk_level: contactData.risk_level,
        assessment_id: assessmentId,
        submission_date: new Date().toISOString()
      }),
    });

    // Get the response body for more detailed error information
    const responseBody = await response.text();
    console.log('Zapier webhook response status:', response.status);
    console.log('Zapier webhook response body:', responseBody);

    if (!response.ok) {
      throw new Error(`Zapier webhook failed: ${response.status} ${response.statusText}. Response: ${responseBody}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
