/**
 * Script to remove Mailgun dependencies after migration to Resend
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Removing Mailgun dependencies...');

try {
  // Remove Mailgun packages
  execSync('npm uninstall mailgun.js form-data', { stdio: 'inherit' });
  console.log('✅ Successfully removed Mailgun packages');
  
  // Update .env.local file to remove Mailgun variables and add Resend ones
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Remove Mailgun variables
    envContent = envContent.replace(/VITE_MAILGUN_API_KEY=.*\n/g, '');
    envContent = envContent.replace(/VITE_MAILGUN_DOMAIN=.*\n/g, '');
    
    // Add Resend variable if it doesn't exist
    if (!envContent.includes('VITE_RESEND_API_KEY')) {
      envContent += '\n# Resend Email Service\nVITE_RESEND_API_KEY=\n';
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated .env.local file');
  } else {
    console.log('⚠️ .env.local file not found, skipping environment variable cleanup');
  }
  
  console.log('\n✅ Migration from Mailgun to Resend completed successfully');
  console.log('\n🔶 Next steps:');
  console.log('1. Sign up for a Resend account at https://resend.com');
  console.log('2. Add your Resend API key to the .env.local file');
  console.log('3. Update your FROM_EMAIL in .env.local if needed');
  console.log('4. Test the email functionality');
  
} catch (error) {
  console.error('❌ Error removing Mailgun dependencies:', error.message);
  process.exit(1);
} 