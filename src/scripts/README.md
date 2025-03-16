# User Management Migration Scripts

This directory contains scripts to migrate from using both `public.users` and `public.profiles` tables to using only `public.profiles` with a foreign key to `auth.users`.

## Prerequisites

- Node.js installed
- Supabase project with admin access
- Environment variables set up (VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY)

## Migration Steps

Follow these steps in order:

### 1. Backup Your Database

Before running any migration, make sure to backup your database:

```bash
# Using Supabase CLI
supabase db dump -f backup.sql
```

### 2. Run the Migration Script

This script will create auth users for existing users in the `public.users` table and ensure they have corresponding profiles:

```bash
node src/scripts/migrate-to-profiles.js
```

### 3. Update the Database Schema

This script will update foreign key constraints and drop the `public.users` table:

```bash
node src/scripts/update-db-schema.js
```

### 4. Verify the Migration

After running the migration, verify that:

1. All users have corresponding entries in both `auth.users` and `public.profiles`
2. The `public.users` table has been dropped
3. All foreign key constraints have been updated to reference `public.profiles`
4. The application works correctly with the new schema

## Troubleshooting

If you encounter any issues during the migration:

1. Check the error messages in the console
2. Restore from your backup if necessary
3. Make sure you have the correct permissions for your Supabase service role key

## Additional Notes

- The migration creates temporary passwords for all users. Users should reset their passwords on first login.
- The trigger function `handle_new_user()` automatically creates profiles for new auth users.
- Make sure to update your application code to use the new schema. 