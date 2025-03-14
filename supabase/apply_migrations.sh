#!/bin/bash

# Load environment variables
source ../.env.local

# Extract Supabase URL and key from environment variables
SUPABASE_URL=${VITE_SUPABASE_URL}
SUPABASE_KEY=${VITE_SUPABASE_ANON_KEY}

echo "Applying migration to disable RLS..."

# Apply the migration using curl
curl -X POST "${SUPABASE_URL}/rest/v1/rpc/pgmigrate" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Content-Type: application/json" \
  -d @- << EOF
{
  "sql": "$(cat migrations/20240314_disable_rls/disable_rls.sql)"
}
EOF

echo "Migration applied successfully!" 