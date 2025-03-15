#!/bin/bash

# Script to apply RLS policies to Supabase database

# Load environment variables
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
else
  echo "Error: .env.local file not found"
  exit 1
fi

# Check if required environment variables are set
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Error: Supabase URL or service role key not found in environment variables"
  exit 1
fi

# Extract the project reference from the URL
PROJECT_REF=$(echo $VITE_SUPABASE_URL | awk -F[/:] '{print $4}')

if [ -z "$PROJECT_REF" ]; then
  echo "Error: Could not extract project reference from Supabase URL"
  exit 1
fi

echo "Applying RLS policies to Supabase project: $PROJECT_REF"

# Apply the SQL file using the Supabase REST API
curl -X POST \
  "${VITE_SUPABASE_URL}/rest/v1/rpc/pg_dump" \
  -H "apikey: ${VITE_SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${VITE_SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d @supabase/setup-rls.sql

echo "RLS policies applied successfully" 