import React from 'react'

const Terms = () => {
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Terms of Service
            </span>
          </h1>
          <p className="text-textSecondary">Last updated: January 2025</p>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="bg-surface/50 rounded-3xl p-8 border border-border space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-text mb-4">1. Acceptance of Terms</h2>
              <p className="text-textSecondary leading-relaxed">
                By accessing and using CryptoVault, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">2. Description of Service</h2>
              <p className="text-textSecondary leading-relaxed">
                CryptoVault is an affiliate marketing platform that provides information about cryptocurrency and stock trading platforms. 
                We connect users with third-party trading platforms and may receive compensation for referrals.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">3. User Responsibilities</h2>
              <ul className="text-textSecondary space-y-2 ml-6">
                <li>• You must be at least 18 years old to use our services</li>
                <li>• You are responsible for maintaining the confidentiality of your account information</li>
                <li>• You agree to provide accurate and complete information</li>
                <li>• You will not use our service for any illegal or unauthorized purpose</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">4. Investment Risks</h2>
              <p className="text-textSecondary leading-relaxed">
                Trading cryptocurrencies and stocks involves substantial risk of loss and is not suitable for all investors. 
                Past performance does not guarantee future results. You should carefully consider your investment objectives, 
                level of experience, and risk appetite before making any investment decisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">5. Affiliate Relationships</h2>
              <p className="text-textSecondary leading-relaxed">
                CryptoVault may receive compensation from third-party platforms when users sign up through our referral links. 
                This does not affect the price you pay or the quality of service you receive from these platforms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">6. Limitation of Liability</h2>
              <p className="text-textSecondary leading-relaxed">
                CryptoVault shall not be liable for any direct, indirect, incidental, special, or consequential damages 
                resulting from the use or inability to use our service, including but not limited to trading losses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">7. Privacy Policy</h2>
              <p className="text-textSecondary leading-relaxed">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, 
                to understand our practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">8. Changes to Terms</h2>
              <p className="text-textSecondary leading-relaxed">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting 
                on our website. Your continued use of the service constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-text mb-4">9. Contact Information</h2>
              <p className="text-textSecondary leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at support@cryptovault.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Terms
