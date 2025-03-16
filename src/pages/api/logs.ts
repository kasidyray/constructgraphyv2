import { getLogs, clearLogs } from '@/utils/logger';

// Simple API endpoint to retrieve logs
export default function handler(req: any, res: any) {
  if (req.method === 'GET') {
    // Return all logs
    res.status(200).json({ logs: getLogs() });
  } else if (req.method === 'DELETE') {
    // Clear all logs
    clearLogs();
    res.status(200).json({ message: 'Logs cleared' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
} 