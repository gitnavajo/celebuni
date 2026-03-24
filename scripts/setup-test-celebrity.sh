#!/bin/bash

# Setup script for John Pork test celebrity
# This script adds a test celebrity profile to your Supabase database

echo "🎭 Adding John Pork test celebrity profile..."

# Note: You need to set these environment variables or edit them directly:
# SUPABASE_PROJECT_ID
# SUPABASE_DB_PASSWORD

# Connect to Supabase and run the SQL script
# You can use either:

# Option 1: Using Supabase CLI (if installed)
# supabase db push --project-id $SUPABASE_PROJECT_ID < scripts/add-test-celebrity.sql

# Option 2: Using psql directly
# psql "postgres://postgres:$SUPABASE_DB_PASSWORD@db.SUPABASE_PROJECT_ID.supabase.co:5432/postgres" < scripts/add-test-celebrity.sql

# Option 3: Copy and paste the SQL from scripts/add-test-celebrity.sql into Supabase dashboard SQL editor

echo "✅ Instructions:"
echo "1. Go to https://supabase.com/dashboard"
echo "2. Select your project"
echo "3. Go to SQL Editor"
echo "4. Click 'New Query'"
echo "5. Copy the contents of scripts/add-test-celebrity.sql"
echo "6. Paste into the SQL editor"
echo "7. Click 'Run'"
echo ""
echo "After running, you can view John Pork at: https://v0-celebuni.vercel.app/search/john-pork"
