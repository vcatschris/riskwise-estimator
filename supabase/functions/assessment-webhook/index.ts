
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
    const requestBodyText = await req.text();
    console.log('Raw request body:', requestBodyText);
    
    let assessmentId, contactData, survey_data_json;
    try {
      const requestBody = JSON.parse(requestBodyText);
      assessmentId = requestBody.assessmentId;
      contactData = requestBody.contactData;
      survey_data_json = requestBody.survey_data_json;

      console.log('Parsed webhook request data:', { 
        assessmentId, 
        contactData, 
        survey_data_json_length: survey_data_json ? survey_data_json.length : 0 
      });
    } catch (parseError) {
      console.error('Error parsing JSON request body:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body', details: parseError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (!contactData || typeof contactData !== 'object') {
      console.error('Missing or invalid contactData in request:', contactData);
      return new Response(
        JSON.stringify({ error: 'Missing or invalid contactData in request' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Format the data for Zapier
    const zapierPayload = {
      // Contact data
      name: contactData.name || 'Anonymous',
      email: contactData.email || 'noemail@example.com',
      company: contactData.company || 'Unknown',
      phone: contactData.phone || 'Not provided',
      newsletter: contactData.newsletter === true,
      submission_type: contactData.submission_type || 'website',
      risk_level: contactData.risk_level || 'Unknown',
      assessment_id: assessmentId || 'No ID',
      submission_date: new Date().toISOString(),
      
      // Include the raw survey data JSON string
      survey_data_json: survey_data_json || ''
    };
    
    console.log('Sending data to Zapier webhook:', JSON.stringify({
      ...zapierPayload,
      survey_data_json_length: zapierPayload.survey_data_json.length
    }, null, 2));
    
    console.log('Zapier webhook URL:', 'https://hooks.zapier.com/hooks/catch/3379103/2lry0on/');
    
    // Using the direct Zapier URL to ensure it's correctly targeted
    const response = await fetch('https://hooks.zapier.com/hooks/catch/3379103/2lry0on/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(zapierPayload),
    });

    // Get the response body for more detailed error information
    const responseBody = await response.text();
    console.log('Zapier webhook response status:', response.status);
    console.log('Zapier webhook response body:', responseBody);

    if (!response.ok) {
      throw new Error(`Zapier webhook failed: ${response.status} ${response.statusText}. Response: ${responseBody}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Data successfully sent to Zapier" }),
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
