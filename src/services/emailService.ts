import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { User, Project, ProjectImage } from '@/types';
import logger from '@/utils/logger';

// Initialize Mailgun client
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.VITE_MAILGUN_API_KEY || ''
});

const DOMAIN = process.env.VITE_MAILGUN_DOMAIN || 'sandbox-domain.mailgun.org';
const FROM_EMAIL = process.env.VITE_FROM_EMAIL || 'noreply@constructography.com';

/**
 * Send a welcome email to a new user
 * @param user The user to send the welcome email to
 * @returns A boolean indicating whether the email was sent successfully
 */
export async function sendWelcomeEmail(user: User): Promise<boolean> {
  try {
    logger.info(`Sending welcome email to ${user.email}`);
    
    const data = {
      from: `Constructography <${FROM_EMAIL}>`,
      to: user.email,
      subject: 'Welcome to Constructography',
      template: 'welcome_email',
      'h:X-Mailgun-Variables': JSON.stringify({
        name: user.name,
        role: user.role,
        login_url: `${window.location.origin}/login`
      })
    };

    const result = await mg.messages.create(DOMAIN, data);
    logger.info(`Welcome email sent to ${user.email}`, result);
    return true;
  } catch (error) {
    logger.error(`Error sending welcome email to ${user.email}:`, error);
    return false;
  }
}

/**
 * Send a notification email to a homeowner when new photos are added to their project
 * @param homeowner The homeowner to send the notification to
 * @param project The project that had photos added
 * @param images The images that were added
 * @param adminName The name of the admin who added the photos
 * @returns A boolean indicating whether the email was sent successfully
 */
export async function sendProjectPhotosNotification(
  homeowner: User,
  project: Project,
  images: ProjectImage[],
  adminName: string
): Promise<boolean> {
  try {
    logger.info(`Sending project photos notification to ${homeowner.email} for project ${project.id}`);
    
    // Get the first image as a preview (if available)
    const previewImage = images.length > 0 ? images[0].url : null;
    
    const data = {
      from: `Constructography <${FROM_EMAIL}>`,
      to: homeowner.email,
      subject: `New photos added to your project: ${project.title}`,
      template: 'new_photos_email',
      'h:X-Mailgun-Variables': JSON.stringify({
        homeowner_name: homeowner.name,
        project_title: project.title,
        admin_name: adminName,
        photos_count: images.length,
        preview_image: previewImage,
        project_url: `${window.location.origin}/projects/${project.id}`,
        date: new Date().toLocaleDateString()
      })
    };

    const result = await mg.messages.create(DOMAIN, data);
    logger.info(`Project photos notification sent to ${homeowner.email}`, result);
    return true;
  } catch (error) {
    logger.error(`Error sending project photos notification to ${homeowner.email}:`, error);
    return false;
  }
}

/**
 * Send a test email to verify the Mailgun configuration
 * @param to The email address to send the test email to
 * @returns A boolean indicating whether the email was sent successfully
 */
export async function sendTestEmail(to: string): Promise<boolean> {
  try {
    logger.info(`Sending test email to ${to}`);
    
    const data = {
      from: `Constructography <${FROM_EMAIL}>`,
      to: to,
      subject: 'Constructography Email Test',
      text: 'This is a test email from Constructography to verify the Mailgun configuration.',
      html: '<h1>Constructography Email Test</h1><p>This is a test email from Constructography to verify the Mailgun configuration.</p>'
    };

    const result = await mg.messages.create(DOMAIN, data);
    logger.info(`Test email sent to ${to}`, result);
    return true;
  } catch (error) {
    logger.error(`Error sending test email to ${to}:`, error);
    return false;
  }
} 