export const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // TODO: Lock this down to your production domain
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS', // Allow POST and OPTIONS for preflight
} 