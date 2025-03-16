import axios from 'axios';

const testEmail = async () => {
  try {
    const response = await axios.post('http://localhost:3001/api/test-email', {
      email: 'test@example.com' // Replace with your email
    });
    
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};

testEmail(); 