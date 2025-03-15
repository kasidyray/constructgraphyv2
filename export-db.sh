#!/bin/bash

# Script to export Supabase database tables

# Set timestamp for the snapshot
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
OUTPUT_DIR="db_snapshots"
OUTPUT_FILE="${OUTPUT_DIR}/db_snapshot_${TIMESTAMP}.json"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

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

# Tables to export
TABLES=("projects" "project_images" "users")

# Initialize the output JSON
echo "{" > "$OUTPUT_FILE"

# Export each table
for TABLE in "${TABLES[@]}"; do
  echo "Fetching data from $TABLE..."
  
  # Use curl to fetch data from Supabase REST API
  RESPONSE=$(curl -s \
    -H "apikey: $VITE_SUPABASE_SERVICE_ROLE_KEY" \
    -H "Authorization: Bearer $VITE_SUPABASE_SERVICE_ROLE_KEY" \
    "$VITE_SUPABASE_URL/rest/v1/$TABLE?select=*")
  
  # Add table data to the output JSON
  echo "  \"$TABLE\": $RESPONSE," >> "$OUTPUT_FILE"
  
  echo "Data from $TABLE exported"
done

# Remove the trailing comma from the last entry and close the JSON object
sed -i '' '$ s/,$//' "$OUTPUT_FILE"
echo "}" >> "$OUTPUT_FILE"

echo "Database snapshot saved to $OUTPUT_FILE" 