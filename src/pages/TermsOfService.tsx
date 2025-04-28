import React from "react";
import AuthLayout from "@/components/layout/AuthLayout";

const TermsOfService: React.FC = () => {
  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-8 md:max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

        <div className="prose prose-lg max-w-none">
          <p><em>Last Updated: [Insert Last Updated Date Here]</em></p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the ConstructGraphy service ("Service"), you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. If you do not agree to these Terms, do not use the Service.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">2. Description of Service</h2>
          <p>
            ConstructGraphy provides a software-as-a-service platform for managing construction projects, including features for photo uploads, project tracking, and user collaboration.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">3. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
          </p>
          
          <h2 className="text-2xl font-semibold mt-6 mb-3">4. Use Restrictions</h2>
          <p>You agree not to use the Service for any purpose that is illegal or prohibited by these Terms.</p>
          {/* Add more specific use restrictions as needed */}

          <h2 className="text-2xl font-semibold mt-6 mb-3">5. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are owned by ConstructGraphy and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">6. Termination</h2>
          <p>
            We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">7. Disclaimer of Warranties</h2>
          <p>
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Your use of the Service is at your sole risk.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">8. Limitation of Liability</h2>
          <p>
            In no event shall ConstructGraphy, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages...
            {/* Add full limitation of liability clause */}
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">9. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">10. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">11. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at [Your Contact Email Address].</p>

        </div>
      </div>
    </AuthLayout>
  );
};

export default TermsOfService; 