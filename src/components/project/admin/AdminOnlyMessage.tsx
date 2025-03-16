import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AdminOnlyMessageProps {
  message?: string;
}

const AdminOnlyMessage: React.FC<AdminOnlyMessageProps> = ({ 
  message = "This action is restricted to administrators only."
}) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Access Restricted</AlertTitle>
      <AlertDescription>
        {message}
      </AlertDescription>
    </Alert>
  );
};

export default AdminOnlyMessage; 