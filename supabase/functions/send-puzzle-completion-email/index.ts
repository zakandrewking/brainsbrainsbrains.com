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

    // Validate the data
    console.log("Received puzzle completion data:", JSON.stringify(data));

    if (!data.gridSize || data.gridSize <= 0) {
      throw new Error(`Invalid grid size: ${data.gridSize}`);
    }

    if (data.timeInSeconds === undefined || data.timeInSeconds < 0) {
      throw new Error(`Invalid time: ${data.timeInSeconds}`);
    }

    if (data.moveCount === undefined || data.moveCount < 0) {
      throw new Error(`Invalid move count: ${data.moveCount}`);
    }

    // Format the time
    const minutes = Math.floor(data.timeInSeconds / 60);
    const seconds = data.timeInSeconds % 60;
    const timeFormatted = `${minutes} ${
      minutes === 1 ? "minute" : "minutes"
    } and ${seconds} ${seconds === 1 ? "second" : "seconds"}`;

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

    console.log("Sending email with subject:", subject);
    console.log("Email body:", body);

    // Send the email using Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_EMAIL_SERVICE_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Brainsx3 Robots <robots@brainsbrainsbrains.com>",
        to: NOTIFICATION_EMAIL,
        subject: subject,
        text: body,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Email service error:", errorText);
      throw new Error(`Failed to send email: ${errorText}`);
    }

    // Return a success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Email notification sent successfully",
        data: {
          subject,
          body,
          recipient: NOTIFICATION_EMAIL,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    // Log the error
    console.error("Error in send-puzzle-completion-email:", error);

    // Return an error response
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
