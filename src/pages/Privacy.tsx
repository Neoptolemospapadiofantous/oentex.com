import React from 'react'

const Privacy = () => {
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Privacy Policy
            </span>
          </h1>
          <p className="text-textSecondary">Last updated: January 2025</p>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="bg-surface/50 rounded-3xl p-8 border border-border space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-text mb-4">1. Information We Collect</h2>
              <p className="text-textSecondary leading-relaxed mb-4">
                We collect information you provide directly to us, such as when you:
              </p>
              <ul className="text-textSecondary space-y-2 ml-6">
                <li>• Create an account or subscribe to our newsletter</li>
                <li>• Contact us for support or inquiries</li>
                <li>• Participate in surveys or promotions</li>
                <li>• Use our website and services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">2. How We Use Your Information</h2>
              <p className="text-textSecondary leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="text-textSecondary space-y-2 ml-6">
                <li>• Provide and improve our services</li>
                <li>• Send you updates about trading opportunities and platform news</li>
                <li>• Respond to your inquiries and provide customer support</li>
                <li>• Analyze usage patterns to enhance user experience</li>
                <li>• Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">3. Information Sharing</h2>
              <p className="text-textSecondary leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
                except as described in this policy. We may share information with trusted partners who assist us in operating 
                our website and conducting our business, provided they agree to keep this information confidential.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">4. Cookies and Tracking</h2>
              <p className="text-textSecondary leading-relaxed">
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, 
                and understand where our visitors are coming from. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">5. Data Security</h2>
              <p className="text-textSecondary leading-relaxed">
                We implement appropriate security measures to protect your personal information against unauthorized access, 
                alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">6. Third-Party Links</h2>
              <p className="text-textSecondary leading-relaxed">
                Our website may contain links to third-party sites. We are not responsible for the privacy practices or 
                content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">7. Your Rights</h2>
              <p className="text-textSecondary leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="text-textSecondary space-y-2 ml-6">
                <li>• Access and update your personal information</li>
                <li>• Request deletion of your data</li>
                <li>• Opt-out of marketing communications</li>
                <li>• Request a copy of your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">8. Children's Privacy</h2>
              <p className="text-textSecondary leading-relaxed">
                Our services are not intended for individuals under the age of 18. We do not knowingly collect personal 
                information from children under 18. If we become aware that we have collected such information, 
                we will take steps to delete it promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">9. Changes to This Policy</h2>
              <p className="text-textSecondary leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
                new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">10. Contact Us</h2>
              <p className="text-textSecondary leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at privacy@cryptovault.com 
                or through our contact page.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Privacy
