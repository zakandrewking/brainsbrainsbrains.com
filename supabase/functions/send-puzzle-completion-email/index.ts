import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

import { corsHeaders } from "../_shared/cors.ts";

interface PuzzleCompletionData {
  gridSize: number;
  timeInSeconds: number;
  city?: string;
  moveCount: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the request data
    const data: PuzzleCompletionData = await req.json();

    // Format the time
    const minutes = Math.floor(data.timeInSeconds / 60);
    const seconds = data.timeInSeconds % 60;
    const timeFormatted = `${minutes} minutes and ${seconds} seconds`;

    // Your email service configuration
    const RESEND_EMAIL_SERVICE_API_KEY = Deno.env.get(
      "RESEND_EMAIL_SERVICE_API_KEY"
    );
    const NOTIFICATION_EMAIL = Deno.env.get("NOTIFICATION_EMAIL");

    if (!RESEND_EMAIL_SERVICE_API_KEY || !NOTIFICATION_EMAIL) {
      throw new Error("Missing email configuration");
    }

    // Format the email content
    const subject = `Someone completed the slide puzzle in ${
      data.city || "Unknown location"
    }`;
    const body = `Completed the ${data.gridSize}x${data.gridSize} puzzle in ${timeFormatted} with ${data.moveCount} moves.`;

    // Send the email using your preferred email service
    // This example uses a generic fetch approach - you would replace this with your specific email service

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_EMAIL_SERVICE_API_KEY}`,
      },
      body: JSON.stringify({
        from: "robots@brainsbrainsbrains.com",
        to: NOTIFICATION_EMAIL,
        subject: subject,
        text: body,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to send email: ${error}`);
    }

    // Return a success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Email notification sent successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    // Return an error response
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
