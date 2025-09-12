// src/pages/guest/Terms.tsx - Terms and Conditions Page
import { Icons } from '@components/icons';
import GuestLayout from '../../layouts/GuestLayout';

const Terms = () => {
  const sections = [
    {
      id: 'overview',
      title: 'Terms of Service Overview',
      icon: <Icons.document className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <p className="text-foreground/70 leading-relaxed text-lg">
            Welcome to Oentex, operated by RateWise LLC ("we," "us," or "our"). These Terms of Service 
            ("Terms") govern your use of our affiliate rating platform and services. By accessing or using 
            our platform, you agree to be bound by these Terms.
          </p>
          <p className="text-foreground/70 leading-relaxed text-lg">
            These Terms apply to all users of our platform, including visitors, registered users, and 
            anyone who submits reviews, ratings, or other content.
          </p>
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <Icons.shield className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-3 text-lg">Important Notice</h3>
                <p className="text-foreground/70 text-base">
                  Please read these Terms carefully. If you do not agree to these Terms, please do not use our platform. 
                  We may update these Terms from time to time, and your continued use constitutes acceptance of any changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: <Icons.check className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <p className="text-foreground/70 leading-relaxed text-lg">
            By accessing, browsing, or using our platform, you acknowledge that you have read, understood, 
            and agree to be bound by these Terms and our Privacy Policy.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-success/10 border border-success/20 rounded-2xl p-6">
              <h4 className="font-semibold text-foreground mb-3 flex items-center">
                <Icons.check className="w-5 h-5 text-success mr-2" />
                What You Agree To
              </h4>
              <ul className="text-foreground/70 space-y-2 text-base">
                <li>• Comply with all applicable laws and regulations</li>
                <li>• Provide accurate and truthful information</li>
                <li>• Respect other users and their content</li>
                <li>• Use the platform for lawful purposes only</li>
                <li>• Maintain the security of your account</li>
              </ul>
            </div>
            
            <div className="bg-warning/10 border border-warning/20 rounded-2xl p-6">
              <h4 className="font-semibold text-foreground mb-3 flex items-center">
                <Icons.warning className="w-5 h-5 text-warning mr-2" />
                What You Cannot Do
              </h4>
              <ul className="text-foreground/70 space-y-2 text-base">
                <li>• Violate any laws or regulations</li>
                <li>• Post false, misleading, or harmful content</li>
                <li>• Infringe on intellectual property rights</li>
                <li>• Attempt to gain unauthorized access</li>
                <li>• Interfere with platform operations</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'account-security',
      title: 'Account Security',
      icon: <Icons.lock className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <p className="text-foreground/70 leading-relaxed text-lg">
            You are responsible for maintaining the security of your account and all activities that occur 
            under your account. We strongly recommend implementing additional security measures.
          </p>
          
          <div className="space-y-6">
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
              <h4 className="font-semibold text-foreground mb-4 text-lg">Security Requirements</h4>
              <ul className="text-foreground/70 space-y-3 text-base">
                <li className="flex items-start space-x-3">
                  <Icons.check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span>Two-factor authentication strongly recommended for all accounts</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Icons.check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span>Users are responsible for maintaining account security and password strength</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Icons.check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span>Regular security updates and notifications will be provided</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Icons.check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span>Suspicious activity monitoring is in place to protect users</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-warning/10 border border-warning/20 rounded-2xl p-6">
              <div className="flex items-start space-x-4">
                <Icons.warning className="w-6 h-6 text-warning mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2 text-lg">Important Security Notice</h4>
                  <p className="text-foreground/70 text-base">
                    If you suspect unauthorized access to your account, immediately change your password 
                    and contact our support team. We are not responsible for losses due to compromised accounts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'technical-requirements',
      title: 'Technical Requirements',
      icon: <Icons.settings className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <p className="text-foreground/70 leading-relaxed text-lg">
            To use our platform effectively, you need to meet certain technical requirements and use 
            compatible devices and software.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-surface/30 border border-border rounded-2xl p-6">
              <h4 className="font-semibold text-foreground mb-4 text-lg flex items-center">
                <Icons.desktop className="w-5 h-5 text-primary mr-2" />
                System Requirements
              </h4>
              <ul className="text-foreground/70 space-y-2 text-base">
                <li>• Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                <li>• Mobile app available for iOS and Android</li>
                <li>• Stable internet connection required</li>
                <li>• JavaScript enabled in browser</li>
                <li>• Cookies enabled for functionality</li>
              </ul>
            </div>
            
            <div className="bg-surface/30 border border-border rounded-2xl p-6">
              <h4 className="font-semibold text-foreground mb-4 text-lg flex items-center">
                <Icons.wifi className="w-5 h-5 text-secondary mr-2" />
                Performance
              </h4>
              <ul className="text-foreground/70 space-y-2 text-base">
                <li>• Minimum 2GB RAM recommended</li>
                <li>• 4G/WiFi connection for optimal experience</li>
                <li>• Regular browser updates recommended</li>
                <li>• Ad blockers may affect functionality</li>
                <li>• VPN usage may impact performance</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'trading-guidelines',
      title: 'Trading Guidelines and Risk Warnings',
      icon: <Icons.chart className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div className="bg-danger/10 border border-danger/20 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <Icons.warning className="w-6 h-6 text-danger mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-3 text-lg">Important Risk Warning</h3>
                <p className="text-foreground/70 text-base mb-4">
                  Trading and investing involve significant risk. You should only trade with funds you can afford to lose. 
                  Past performance does not guarantee future results.
                </p>
                <ul className="text-foreground/70 space-y-2 text-base">
                  <li>• Educational resources are strongly recommended for beginners</li>
                  <li>• Start with small amounts and gradually increase as you gain experience</li>
                  <li>• Never invest more than you can afford to lose</li>
                  <li>• Consider seeking professional financial advice</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
              <h4 className="font-semibold text-foreground mb-4 text-lg">Best Practices</h4>
              <ul className="text-foreground/70 space-y-2 text-base">
                <li>• Research thoroughly before making decisions</li>
                <li>• Diversify your investments</li>
                <li>• Keep detailed records of your trades</li>
                <li>• Stay informed about market conditions</li>
                <li>• Use stop-loss orders when appropriate</li>
              </ul>
            </div>
            
            <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-6">
              <h4 className="font-semibold text-foreground mb-4 text-lg">Platform Guidelines</h4>
              <ul className="text-foreground/70 space-y-2 text-base">
                <li>• Reviews must be based on personal experience</li>
                <li>• Provide constructive and helpful feedback</li>
                <li>• Respect other users' opinions</li>
                <li>• Report suspicious or inappropriate content</li>
                <li>• Follow community guidelines at all times</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'content-policy',
      title: 'Content Policy and User-Generated Content',
      icon: <Icons.document className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <p className="text-foreground/70 leading-relaxed text-lg">
            Our platform allows users to submit reviews, ratings, comments, and other content. 
            By submitting content, you grant us certain rights and agree to follow our content policies.
          </p>
          
          <div className="space-y-6">
            <div className="bg-success/10 border border-success/20 rounded-2xl p-6">
              <h4 className="font-semibold text-foreground mb-4 text-lg">Content Guidelines</h4>
              <ul className="text-foreground/70 space-y-3 text-base">
                <li className="flex items-start space-x-3">
                  <Icons.check className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                  <span>Content must be accurate, truthful, and based on personal experience</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Icons.check className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                  <span>Reviews should be constructive and helpful to other users</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Icons.check className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                  <span>Respect intellectual property rights of others</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Icons.check className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                  <span>Follow community standards and be respectful</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-warning/10 border border-warning/20 rounded-2xl p-6">
              <h4 className="font-semibold text-foreground mb-4 text-lg">Prohibited Content</h4>
              <ul className="text-foreground/70 space-y-2 text-base">
                <li>• False, misleading, or fraudulent information</li>
                <li>• Spam, promotional content, or affiliate links</li>
                <li>• Harassment, abuse, or threatening language</li>
                <li>• Copyrighted material without permission</li>
                <li>• Content that violates laws or regulations</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'affiliate-disclosure',
      title: 'Affiliate Disclosure and Commissions',
      icon: <Icons.dollar className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <p className="text-foreground/70 leading-relaxed text-lg">
            Oentex operates as an affiliate platform. We may receive commissions when users make 
            purchases through our affiliate links. This section explains our affiliate relationships and policies.
          </p>
          
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
            <h4 className="font-semibold text-foreground mb-4 text-lg">Transparency Commitment</h4>
            <p className="text-foreground/70 text-base mb-4">
              We are committed to transparency in our affiliate relationships. All affiliate links are clearly 
              marked, and we only recommend products and services we believe provide value to our users.
            </p>
            <ul className="text-foreground/70 space-y-2 text-base">
              <li>• Affiliate links are clearly identified and marked</li>
              <li>• Commissions do not influence our editorial content</li>
              <li>• We maintain editorial independence in our reviews</li>
              <li>• Users are not obligated to use our affiliate links</li>
            </ul>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-surface/30 border border-border rounded-2xl p-6">
              <h4 className="font-semibold text-foreground mb-4 text-lg">How It Works</h4>
              <ul className="text-foreground/70 space-y-2 text-base">
                <li>• We partner with reputable trading platforms</li>
                <li>• Users can access exclusive offers and bonuses</li>
                <li>• We track referrals through secure systems</li>
                <li>• Commissions help support our platform</li>
              </ul>
            </div>
            
            <div className="bg-surface/30 border border-border rounded-2xl p-6">
              <h4 className="font-semibold text-foreground mb-4 text-lg">User Benefits</h4>
              <ul className="text-foreground/70 space-y-2 text-base">
                <li>• Access to exclusive promotions</li>
                <li>• Free account upgrades and bonuses</li>
                <li>• Lower fees and better rates</li>
                <li>• Priority customer support</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'limitation-liability',
      title: 'Limitation of Liability and Disclaimers',
      icon: <Icons.shield className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div className="bg-warning/10 border border-warning/20 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <Icons.warning className="w-6 h-6 text-warning mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-3 text-lg">Important Legal Notice</h3>
                <p className="text-foreground/70 text-base">
                  Our platform is provided "as is" without warranties of any kind. We are not responsible 
                  for any losses, damages, or consequences resulting from your use of our platform or 
                  any third-party services.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-lg">Limitations</h4>
              <ul className="text-foreground/70 space-y-3 text-base">
                <li>• We do not guarantee the accuracy of user-generated content</li>
                <li>• We are not responsible for third-party platform performance</li>
                <li>• Trading decisions and their consequences are your responsibility</li>
                <li>• We do not provide financial or investment advice</li>
                <li>• Platform availability is not guaranteed 100% of the time</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-lg">Disclaimers</h4>
              <ul className="text-foreground/70 space-y-3 text-base">
                <li>• Information is for educational purposes only</li>
                <li>• Past performance does not guarantee future results</li>
                <li>• Market conditions can change rapidly</li>
                <li>• Always conduct your own research</li>
                <li>• Consider consulting with financial professionals</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'contact-support',
      title: 'Contact Information and Support',
      icon: <Icons.mail className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <p className="text-foreground/70 leading-relaxed text-lg">
            If you have questions about these Terms or need support, we're here to help. 
            Contact us through any of the channels below.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
              <h4 className="font-semibold text-foreground mb-4 text-lg">General Support</h4>
              <div className="space-y-3 text-foreground/70 text-base">
                <p><strong>Email:</strong> support@oentex.com</p>
                <p><strong>Response Time:</strong> Within 24 hours</p>
                <p><strong>Phone:</strong> (555) 123-4567</p>
                <p><strong>Hours:</strong> Monday-Friday, 9 AM - 6 PM EST</p>
              </div>
            </div>
            
            <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-6">
              <h4 className="font-semibold text-foreground mb-4 text-lg">Legal Inquiries</h4>
              <div className="space-y-3 text-foreground/70 text-base">
                <p><strong>Email:</strong> legal@oentex.com</p>
                <p><strong>Response Time:</strong> Within 48 hours</p>
                <p><strong>Address:</strong> RateWise LLC</p>
                <p>123 Review Street, San Francisco, CA 94105</p>
              </div>
            </div>
          </div>
          
          <div className="bg-surface/30 border border-border rounded-2xl p-6">
            <h4 className="font-semibold text-foreground mb-3 text-lg">Mailing Address</h4>
            <div className="text-foreground/70 text-base space-y-1">
              <p>RateWise LLC</p>
              <p>Attention: Legal Department</p>
              <p>123 Review Street</p>
              <p>San Francisco, CA 94105</p>
              <p>United States</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <GuestLayout>
      <div className="min-h-screen pb-12">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Terms & Conditions
            </h1>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-4">
              Please read these terms carefully before using our platform.
            </p>
            <p className="text-foreground/70">Last updated: January 30, 2025</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="space-y-12">
              {sections.map((section, index) => (
                <div key={section.id} className="bg-content1 rounded-2xl border border-divider overflow-hidden shadow-lg">
                  <div className="p-8">
                    <div className="flex items-center space-x-6 mb-8">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center text-white">
                        {section.icon}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">
                          {index + 1}. {section.title}
                        </h2>
                      </div>
                    </div>
                    {section.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Notice */}
            <div className="mt-20 bg-secondary/10 border border-secondary/20 rounded-2xl p-8">
              <div className="flex items-start space-x-4">
                <Icons.shield className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-3 text-lg">Your Agreement Matters</h3>
                  <p className="text-foreground/70 text-base leading-relaxed">
                    By using our platform, you acknowledge that you have read, understood, and agree to be bound 
                    by these Terms of Service. If you have any questions or concerns, please don't hesitate to 
                    contact our support team. We're committed to providing a transparent and fair service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </GuestLayout>
  );
};

export default Terms;