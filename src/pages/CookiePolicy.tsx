import React from "react";
import AuthLayout from "@/components/layout/AuthLayout";

const CookiePolicy: React.FC = () => {
  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-8 md:max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>

        <div className="prose prose-lg max-w-none">
          <p><em>Last Updated: [Insert Last Updated Date Here]</em></p>

          <p>
            This Cookie Policy explains how ConstructGraphy ("we", "us", and "ours") uses cookies and similar technologies to recognize you when you visit our website and use our Service.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">1. What Are Cookies?</h2>
          <p>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">2. How We Use Cookies</h2>
          <p>We use cookies for several reasons. Some cookies are required for technical reasons in order for our Service to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies enable us to track and target the interests of our users to enhance the experience on our Service. Specifically, we use cookies for:</p>
          <ul>
            <li><strong>Authentication:</strong> To keep you logged in as you navigate the Service.</li>
            <li><strong>Preferences:</strong> To remember settings like your theme preference.</li>
            <li><strong>Security:</strong> To help detect fraud and abuse.</li>
            <li><strong>Analytics:</strong> To understand how our Service is used, allowing us to improve it (we may use third-party analytics services like Google Analytics).</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-3">3. Types of Cookies Used</h2>
          <ul>
            <li><strong>Session Cookies:</strong> These are temporary cookies that expire when you close your browser.</li>
            <li><strong>Persistent Cookies:</strong> These remain on your device for a set period or until you delete them.</li>
            {/* List specific first-party and third-party cookies if known */}
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-3">4. Your Choices Regarding Cookies</h2>
          <p>
            You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by setting or amending your web browser controls. If you choose to reject cookies, you may still use our website though your access to some functionality and areas may be restricted.
          </p>
          {/* Link to browser guides on managing cookies */}

          <h2 className="text-2xl font-semibold mt-6 mb-3">5. Changes to This Cookie Policy</h2>
          <p>
            We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">6. Contact Us</h2>
          <p>If you have any questions about our use of cookies, please contact us at [Your Contact Email Address].</p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default CookiePolicy; 