import { sendTestEmail } from '@/services/emailService';
import logger from '@/utils/logger';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    logger.info(`Sending test email to ${email}`);
    const success = await sendTestEmail(email);

    if (success) {
      return res.status(200).json({ message: 'Test email sent successfully' });
    } else {
      return res.status(500).json({ error: 'Failed to send test email' });
    }
  } catch (error) {
    logger.error('Error sending test email:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 