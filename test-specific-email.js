import axios from 'axios';

const testEmail = async () => {
  try {
    console.log('Sending test email to ikedinekpere.eze@gmail.com...');
    const response = await axios.post('http://localhost:3001/api/test-email', {
      email: 'ikedinekpere.eze@gmail.com'
    });
    
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    }
  }
};

testEmail(); 