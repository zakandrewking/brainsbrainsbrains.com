import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://punkupwewvwsclbzcioj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1bmt1cHdld3Z3c2NsYnpjaW9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyODYyMjMsImV4cCI6MjA1Njg2MjIyM30.aZEppcc6R7hf81pli6wCkbq-q_b9pEzoxT4WXCTr_C4";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Interface for puzzle completion data
export interface PuzzleCompletionData {
  gridSize: number;
  timeInSeconds: number;
  city: string;
  moveCount: number;
}

/**
 * Record a puzzle completion and send an email notification
 */
export async function recordPuzzleCompletion(data: PuzzleCompletionData) {
  try {
    // Trigger the email sending function via Supabase Edge Function
    const { error: functionError } = await supabase.functions.invoke(
      "send-puzzle-completion-email",
      {
        body: {
          gridSize: data.gridSize,
          timeInSeconds: data.timeInSeconds,
          city: data.city,
          moveCount: data.moveCount,
        },
      }
    );

    if (functionError) {
      console.error("Error sending email notification:", functionError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in recordPuzzleCompletion:", error);
    return false;
  }
}

/**
 * Get the user's city based on their IP address
 * Uses a free geolocation API
 */
export async function getUserCity(): Promise<string> {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    return data.city || "Unknown";
  } catch (error) {
    console.error("Error getting user location:", error);
    return "Unknown";
  }
}
