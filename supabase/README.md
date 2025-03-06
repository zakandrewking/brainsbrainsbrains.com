# Puzzle Completion Email Notifications

This directory contains Supabase Edge Functions and database configurations to handle email notifications when users complete the slide puzzle.

## Setup Instructions

### 1. Install the Supabase CLI

If you haven't already, install the Supabase CLI:

```bash
npm install -g supabase
```

### 2. Setup Email Service

This solution uses Resend as the email service, but you can modify it to use any email provider of your choice.

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Verify your domain

### 3. Configure Environment Variables

Create a `.env` file in the functions directory with the following environment variables:

```bash
EMAIL_SERVICE_API_KEY=your_resend_api_key
NOTIFICATION_EMAIL=your@email.com
```

### 4. Deploy the Database Schema

Run this command to deploy the database schema:

```bash
supabase db push
```

### 5. Deploy the Edge Functions

Deploy the Edge Functions to your Supabase project:

```bash
supabase functions deploy send-puzzle-completion-email --no-verify-jwt
```

### 6. Set Environment Variables in Supabase

Go to your Supabase dashboard, navigate to Settings > API, and set these environment variables:

1. `EMAIL_SERVICE_API_KEY`: Your Resend API key
2. `NOTIFICATION_EMAIL`: The email where you want to receive notifications

## Testing

You can test the function using the Supabase CLI:

```bash
supabase functions serve send-puzzle-completion-email
```

Then in another terminal:

```bash
curl -X POST http://localhost:54321/functions/v1/send-puzzle-completion-email \
  -H "Content-Type: application/json" \
  -d '{"gridSize": 4, "timeInSeconds": 120, "city": "San Francisco", "moveCount": 42}'
```

## Troubleshooting

- If you encounter CORS issues, make sure the 'Access-Control-Allow-Origin' header in `_shared/cors.ts` matches your application's domain.
- Check the Supabase logs for any errors.
- Verify that you've set the environment variables correctly.

## Monitoring

You can monitor the function invocations and errors from the Supabase dashboard under "Edge Functions".
