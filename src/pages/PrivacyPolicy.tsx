import React from "react";
import AuthLayout from "@/components/layout/AuthLayout"; // Use AuthLayout for now

const PrivacyPolicy: React.FC = () => {
  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-8 md:max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <div className="prose prose-lg max-w-none">
          <p><em>Last Updated: [Insert Last Updated Date Here, e.g., March 15, 2024]</em></p>

          <p>Welcome to ConstructGraphy! This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our software-as-a-service platform (the "Service"). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the Service.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">1. INFORMATION WE COLLECT</h2>
          <p>We may collect information about you in a variety of ways. The information we may collect via the Service depends on the content and materials you use, and includes:</p>
          <ul>
            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, phone number, company name, job title, and user role (e.g., Admin, Builder, Homeowner) that you voluntarily give to us when you register with the Service or when you choose to participate in various activities related to the Service.</li>
            <li><strong>Project Data:</strong> Information related to construction projects managed through the Service, including project titles, descriptions, addresses, statuses, progress percentages, homeowner details (name, ID), builder details (name, ID), and associated images, captions, and categories.</li>
            <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Service, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Service.</li>
            <li><strong>Data From Third-Party Services:</strong> We may collect information if you connect your account to third-party services (e.g., through Supabase authentication).</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-3">2. USE OF YOUR INFORMATION</h2>
          <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Service to:</p>
          <ul>
            <li>Create and manage your account.</li>
            <li>Provide the core functionality of the Service, including project management, photo uploads, and user collaboration.</li>
            <li>Email you regarding your account or project updates (e.g., new photos uploaded).</li>
            <li>Improve the efficiency and operation of the Service.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the Service.</li>
            <li>Notify you of updates to the Service.</li>
            <li>Perform other business activities as needed.</li>
            <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
            <li>Process payments and refunds (if applicable).</li>
            <li>Resolve disputes and troubleshoot problems.</li>
            <li>Respond to product and customer service requests.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-3">3. DISCLOSURE OF YOUR INFORMATION</h2>
          <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
          <ul>
            <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
            <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including data storage (Supabase), email delivery, hosting services, customer service, and marketing assistance.</li>
            <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
            <li><strong>With your Consent:</strong> We may disclose your personal information for any other purpose with your consent.</li>
          </ul>
          <p>We do not sell your personal information.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">4. SECURITY OF YOUR INFORMATION</h2>
          <p>We use administrative, technical, and physical security measures to help protect your personal information. We utilize Supabase for backend services, which provides robust security features including Row Level Security (RLS) on database tables and secure authentication methods. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">5. POLICY FOR CHILDREN</h2>
          <p>We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us using the contact information provided below.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">6. YOUR DATA RIGHTS</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, or delete your data. Please contact us to exercise these rights.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">7. CHANGES TO THIS PRIVACY POLICY</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.</p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">8. CONTACT US</h2>
          <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
          <p>[Your Company Name/Contact Person]</p>
          <p>[Your Company Address]</p>
          <p>[Your Contact Email Address]</p>
          <p><em>Source: <a href="https://constructgraphy.com/privacy-policy" target="_blank" rel="noopener noreferrer">https://constructgraphy.com/privacy-policy</a></em></p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default PrivacyPolicy; 