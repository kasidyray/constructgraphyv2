# Mailgun to Resend Migration Guide

This guide outlines the steps taken to migrate the email service from Mailgun to Resend in the Constography application.

## Changes Made

The following changes have been implemented:

1. Installed the Resend package: `npm install resend`
2. Updated `src/services/emailService.ts` to use Resend instead of Mailgun
3. Updated `src/server.js` to handle email requests with Resend
4. Updated `direct-mailgun-test.js` to use Resend for testing
5. Updated admin email test page to reference Resend instead of Mailgun
6. Created a cleanup script to remove Mailgun dependencies

## Configuration

To configure Resend in your environment:

1. Sign up for a Resend account at [https://resend.com](https://resend.com)
2. Create an API key in the Resend dashboard
3. Update your `.env.local` file with:
   ```
   VITE_RESEND_API_KEY=your_resend_api_key
   VITE_FROM_EMAIL=your_verified_email@yourdomain.com
   ```

> **Note**: The `VITE_FROM_EMAIL` must be a verified sender in your Resend account or use the default `onboarding@resend.dev` address for testing.

## Testing the Migration

To test the email functionality:

1. Navigate to `/admin/email-test` in the application (requires admin access)
2. Enter an email address and click "Send Test Email"
3. You can also run the direct test script: `node direct-mailgun-test.js`

## Removing Mailgun Dependencies

After confirming that the Resend implementation works correctly, you can remove the Mailgun dependencies:

```bash
node clean-mailgun-deps.js
```

This script will:
- Uninstall the Mailgun and form-data packages
- Remove Mailgun environment variables from your `.env.local` file
- Add Resend environment variables if they don't exist

## Troubleshooting

If you encounter issues:

1. Check that your Resend API key is correct
2. Verify that your sender email is verified in Resend
3. Check the browser console and server logs for error messages
4. For development, you can use the default `onboarding@resend.dev` address

## API Differences

Key differences between Mailgun and Resend APIs:

1. Resend requires email addresses in an array format for the `to` field
2. Resend uses a more straightforward configuration with a single API key
3. Resend has different error codes and error handling patterns
4. The response structure from successful email sending is different 