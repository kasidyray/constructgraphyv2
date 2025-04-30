// import { Resend } from 'resend';
import { User, Project, ProjectImage } from '@/types';
import logger from '@/utils/logger';

// Initialize Resend client - COMMENTED OUT
// const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY || '');

// When in testing mode, you can only send to the email address associated with your Resend account
// For testing, you should use "onboarding@resend.dev" as FROM_EMAIL
// const FROM_EMAIL = import.meta.env.VITE_FROM_EMAIL || 'onboarding@resend.dev';

/**
 * Send a welcome email to a new user
 * @param user The user to send the welcome email to
 * @returns A boolean indicating whether the email was sent successfully
 */
export async function sendWelcomeEmail(user: User): Promise<boolean> {
  // try {
  //   logger.info(`Sending welcome email to ${user.email}`);
  //   
  //   const result = await resend.emails.send({
  //     from: `Constructography <${FROM_EMAIL}>`,
  //     to: [user.email],
  //     subject: 'Welcome to Constructography',
  //     html: `
  //       <h1>Welcome to Constructography, ${user.name}!</h1>
  //       <p>Your account has been created with the role: ${user.role}.</p>
  //       <p>You can log in at: <a href="${window.location.origin}/login">${window.location.origin}/login</a></p>
  //     `
  //   });
  //   
  //   logger.info(`Welcome email sent to ${user.email}`, result);
  //   return true;
  // } catch (error) {
  //   logger.error(`Error sending welcome email to ${user.email}:`, error);
  //   return false;
  // }
  logger.warn(`Email sending is disabled. Tried to send welcome email to ${user.email}.`);
  return false; // Indicate email not sent
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
  // try {
  //   logger.info(`Sending project photos notification to ${homeowner.email} for project ${project.id}`);
  //   
  //   // Get the first image as a preview (if available)
  //   const previewImage = images.length > 0 ? images[0].url : null;
  //   const projectUrl = `${window.location.origin}/projects/${project.id}`;
  //   
  //   const result = await resend.emails.send({
  //     from: `Constructography <${FROM_EMAIL}>`,
  //     to: [homeowner.email],
  //     subject: `New photos added to your project: ${project.title}`,
  //     html: `
  //       <h1>New Photos Added to Your Project</h1>
  //       <p>Hello ${homeowner.name},</p>
  //       <p>${adminName} has added ${images.length} new photo${images.length === 1 ? '' : 's'} to your project "${project.title}".</p>
  //       ${previewImage ? `<p><img src="${previewImage}" alt="Project Preview" style="max-width: 100%; max-height: 300px;" /></p>` : ''}
  //       <p><a href="${projectUrl}">View your project</a></p>
  //       <p>Date: ${new Date().toLocaleDateString()}</p>
  //     `
  //   });
  //   
  //   logger.info(`Project photos notification sent to ${homeowner.email}`, result);
  //   return true;
  // } catch (error) {
  //   logger.error(`Error sending project photos notification to ${homeowner.email}:`, error);
  //   return false;
  // }
  logger.warn(`Email sending is disabled. Tried to send project photos notification to ${homeowner.email} for project ${project.id}.`);
  return false; // Indicate email not sent
}

/**
 * Send a test email to verify the Resend configuration
 * @param to The email address to send the test email to
 * @returns A boolean indicating whether the email was sent successfully
 */
export async function sendTestEmail(to: string): Promise<boolean> {
  // try {
  //   logger.info(`Sending test email to ${to}`);
  //   
  //   const result = await resend.emails.send({
  //     from: `Constructography <${FROM_EMAIL}>`,
  //     to: [to],
  //     subject: 'Constructography Email Test',
  //     html: '<h1>Constructography Email Test</h1><p>This is a test email from Constructography to verify the Resend configuration.</p>'
  //   });
  //   
  //   logger.info(`Test email sent to ${to}`, result);
  //   return true;
  // } catch (error) {
  //   logger.error(`Error sending test email to ${to}:`, error);
  //   return false;
  // }
  logger.warn(`Email sending is disabled. Tried to send test email to ${to}.`);
  return false; // Indicate email not sent
} 