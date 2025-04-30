import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

// Ensure RESEND_API_KEY and CONTACT_FORM_TARGET_EMAIL are set in Supabase Function environment variables
// const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const CONTACT_FORM_TARGET_EMAIL = Deno.env.get("CONTACT_FORM_TARGET_EMAIL"); // Keep this for potential future use

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Ensure environment variables are set
    // if (!RESEND_API_KEY) {
    //   throw new Error("Missing RESEND_API_KEY environment variable.");
    // }
    if (!CONTACT_FORM_TARGET_EMAIL) {
      // We might still need the target email for a different service
      console.warn("Missing CONTACT_FORM_TARGET_EMAIL environment variable, but proceeding.");
      // throw new Error("Missing CONTACT_FORM_TARGET_EMAIL environment variable.");
    }

    // Parse request body (include optional phone)
    const { name, email, phone, message } = await req.json();

    // Basic validation (phone is optional)
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields (name, email, message)." }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Construct HTML, adding phone if it exists
    let emailHtml = `<p>You received a new message from your website contact form.</p>
                     <p><strong>Name:</strong> ${name}</p>
                     <p><strong>Email:</strong> ${email}</p>`;
    
    if (phone) {
      emailHtml += `<p><strong>Phone:</strong> ${phone}</p>`;
    }
    
    emailHtml += `<p><strong>Message:</strong></p>
                  <p>${message.replace(/\n/g, '<br>')}</p>`;

    // Send email using Resend - COMMENTED OUT
    /*
    const resendUrl = 'https://api.resend.com/emails';
    const emailPayload = {
      from: 'Contact Form <onboarding@resend.dev>', // Required: Use a verified domain in Resend later
      to: CONTACT_FORM_TARGET_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      html: emailHtml, // Use the constructed HTML
      reply_to: email, // Set the sender's email as the reply-to address
    };

    const resendResponse = await fetch(resendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    if (!resendResponse.ok) {
      const errorBody = await resendResponse.text();
      console.error("Resend API error:", errorBody);
      throw new Error(`Resend API failed with status: ${resendResponse.status}`);
    }
    */

    // Return success response (simulated - no email sent)
    console.log(`Simulated email sending for contact form submission from ${name} (${email})`);
    return new Response(JSON.stringify({ success: true, message: "Message received (email sending disabled)." }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to send message." }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})

// Note: Ensure supabase/functions/_shared/cors.ts exists with appropriate headers, e.g.:
// export const corsHeaders = {
//   'Access-Control-Allow-Origin': '*', // Adjust for production
//   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
// } 