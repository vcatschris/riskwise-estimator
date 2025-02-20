
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the form data and assessment ID from the request
    const { assessmentId, contactData } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch the assessment data
    const { data: assessment, error } = await supabase
      .from('ss_risk_survey')
      .select('*')
      .eq('id', assessmentId)
      .single();

    if (error || !assessment) {
      console.error('Error fetching assessment:', error);
      return new Response(
        JSON.stringify({ error: 'Assessment not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Calculate the monthly and annual prices (simplified version, you may want to adjust this)
    const basePrice = assessment.business_size === '1-5' ? 700 :
      assessment.business_size === '6-20' ? 1250 :
      assessment.business_size === '21-50' ? 2500 :
      assessment.business_size === '51-100' ? 4250 : 6000;

    const isHighCompliance = ['Legal', 'Finance', 'Healthcare', 'Accounting'].includes(assessment.industry);
    const finalPrice = isHighCompliance ? basePrice * 1.3 : basePrice;
    const annualPrice = finalPrice * 12;

    // Format the package inclusions
    const packageInclusions = [
      "24/7 Monitoring & Support",
      "Security Incident Response",
      "Regular Security Updates",
      "Data Backup & Recovery",
    ];

    if (isHighCompliance) {
      packageInclusions.push(
        "Compliance Reporting & Auditing",
        "Enhanced Security Controls"
      );
    }

    // Create a narrative based on the assessment results
    const narrative = `New IT Security Assessment Submission
Business: ${assessment.business_name}
Contact: ${contactData.name} (${contactData.email})
${contactData.phone ? `Phone: ${contactData.phone}` : ''}

Risk Assessment Results:
- Risk Level: ${assessment.risk_level}
- Risk Score: ${assessment.risk_score}/${assessment.max_possible_score}
- Value Score: ${assessment.value_score}/${assessment.max_value_possible}

Business Profile:
- Industry: ${assessment.industry}
- Size: ${assessment.business_size} employees
- Current Provider: ${assessment.current_provider ? 'Yes' : 'No'}
${assessment.current_provider ? `- Provider Duration: ${assessment.provider_duration}` : ''}

Pricing Estimate:
- Monthly Investment: ${formatCurrency(finalPrice)}
- Annual Investment: ${formatCurrency(annualPrice)}

Package Includes:
${packageInclusions.map(item => `- ${item}`).join('\n')}

Key Risk Areas:
${assessment.executive_summary.topRisks.map((risk: string) => `- ${risk}`).join('\n')}

Opportunity Summary:
This ${assessment.risk_level.toLowerCase()} risk assessment indicates ${
      assessment.risk_level === 'High' ? 'urgent security needs' :
      assessment.risk_level === 'Medium' ? 'significant improvement opportunities' :
      'potential for security enhancement'
    } in ${assessment.business_name}'s IT infrastructure. 
${isHighCompliance ? 'The business operates in a high-compliance industry, requiring enhanced security measures.' : ''}

Contact Preferences:
- Newsletter Subscription: ${contactData.newsletter ? 'Yes' : 'No'}
- Submission Type: ${contactData.submission_type}`;

    // Return the formatted data for Zapier
    return new Response(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        assessment_id: assessmentId,
        contact_info: contactData,
        assessment_data: assessment,
        pricing: {
          monthly: finalPrice,
          annual: annualPrice,
          is_high_compliance: isHighCompliance
        },
        package_inclusions: packageInclusions,
        narrative: narrative
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
