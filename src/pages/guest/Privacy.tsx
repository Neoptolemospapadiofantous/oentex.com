import React from 'react';
import { Icons } from '@components/icons';

const Privacy = () => {
  const sections = [
    {
      id: 'overview',
      title: 'Privacy Policy Overview',
      icon: <Icons.eye className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-foreground/70 leading-relaxed">
            At RateWise LLC ("we," "us," or "our"), we are committed to protecting your privacy and ensuring 
            the security of your personal information. This Privacy Policy explains how we collect, use, 
            disclose, and safeguard your information when you use our website and services.
          </p>
          <p className="text-foreground/70 leading-relaxed">
            This policy applies to all users of our affiliate rating platform, including visitors who browse 
            our site, registered users who create accounts, and users who submit reviews and ratings.
          </p>
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icons.shield className="w-5 h-5 text-primary mt-0.5" />
              <p className="text-foreground text-sm">
                <strong>Your Privacy Matters:</strong> We believe in transparency and give you control over your data. 
                This policy is written in plain language to help you understand exactly how your information is handled.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: <Icons.users className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Information You Provide Directly</h3>
            <ul className="text-foreground/70 space-y-2 ml-6">
              <li>• Account information (name, email address, username, password)</li>
              <li>• Profile information (bio, profile picture, preferences)</li>
              <li>• Reviews and ratings you submit</li>
              <li>• Comments and responses to other users' content</li>
              <li>• Contact form submissions and support inquiries</li>
              <li>• Newsletter subscriptions and communication preferences</li>
              <li>• Survey responses and feedback</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Information Collected Automatically</h3>
            <ul className="text-foreground/70 space-y-2 ml-6">
              <li>• Device information (browser type, operating system, device model)</li>
              <li>• Usage data (pages visited, time spent, click patterns)</li>
              <li>• IP address and approximate location</li>
              <li>• Referral source and affiliate link tracking</li>
              <li>• Search queries and filter preferences</li>
              <li>• Performance and analytics data</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Information from Third Parties</h3>
            <ul className="text-foreground/70 space-y-2 ml-6">
              <li>• Social media profile information (if you connect social accounts)</li>
              <li>• Product information from manufacturer APIs</li>
              <li>• Affiliate network data and commission tracking</li>
              <li>• Analytics and advertising platform data</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'information-use',
      title: 'How We Use Your Information',
      icon: <Icons.settings className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <p className="text-foreground/70 leading-relaxed">
            We use the information we collect for legitimate business purposes, including:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Service Operation</h3>
              <ul className="text-foreground/70 space-y-2 text-sm">
                <li>• Providing and maintaining our platform</li>
                <li>• Processing user registrations and logins</li>
                <li>• Displaying and organizing reviews and ratings</li>
                <li>• Enabling search and filtering functionality</li>
                <li>• Facilitating user interactions and comments</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Personalization</h3>
              <ul className="text-foreground/70 space-y-2 text-sm">
                <li>• Customizing content recommendations</li>
                <li>• Remembering your preferences and settings</li>
                <li>• Providing personalized product suggestions</li>
                <li>• Tailoring email communications</li>
                <li>• Improving user experience based on behavior</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Communication</h3>
              <ul className="text-foreground/70 space-y-2 text-sm">
                <li>• Sending account-related notifications</li>
                <li>• Responding to support inquiries</li>
                <li>• Delivering newsletters and updates</li>
                <li>• Notifying about new reviews on followed products</li>
                <li>• Sending promotional offers (with consent)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Business Operations</h3>
              <ul className="text-foreground/70 space-y-2 text-sm">
                <li>• Tracking affiliate commissions and referrals</li>
                <li>• Analyzing platform performance and usage</li>
                <li>• Preventing fraud and abuse</li>
                <li>• Complying with legal obligations</li>
                <li>• Improving our services and features</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing and Disclosure',
      icon: <Icons.globe className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-foreground/70 leading-relaxed">
            We do not sell your personal information to third parties. However, we may share your information 
            in the following circumstances:
          </p>
          
          <div className="space-y-4">
            <div className="border-l-4 border-secondary pl-4">
              <h4 className="font-semibold text-foreground mb-2">With Affiliate Partners</h4>
              <p className="text-foreground/70 text-sm">
                When you click affiliate links or make purchases, we may share limited information (like referral 
                source) with our partners to track commissions and provide you with relevant offers.
              </p>
            </div>
            
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-semibold text-foreground mb-2">Service Providers</h4>
              <p className="text-foreground/70 text-sm">
                We work with trusted third-party service providers for hosting, analytics, email delivery, 
                payment processing, and customer support. These providers have access only to information 
                necessary to perform their services.
              </p>
            </div>
            
            <div className="border-l-4 border-warning pl-4">
              <h4 className="font-semibold text-foreground mb-2">Legal Requirements</h4>
              <p className="text-foreground/70 text-sm">
                We may disclose information when required by law, to protect our rights, or to investigate 
                potential violations of our terms of service.
              </p>
            </div>
            
            <div className="border-l-4 border-accent pl-4">
              <h4 className="font-semibold text-foreground mb-2">Business Transfers</h4>
              <p className="text-foreground/70 text-sm">
                If we undergo a merger, acquisition, or sale of assets, your information may be transferred 
                as part of that transaction, subject to the same privacy protections.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'cookies-tracking',
      title: 'Cookies and Tracking Technologies',
      icon: <Icons.cookie className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-foreground/70 leading-relaxed">
            We use cookies and similar tracking technologies to enhance your experience and gather information 
            about how our service is used. Here's what we collect:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-surface/30 rounded-lg p-4 border border-border">
              <h4 className="font-semibold text-foreground mb-2 flex items-center">
                <Icons.cookie className="w-4 h-4 mr-2" />
                Essential Cookies
              </h4>
              <p className="text-foreground/70 text-sm">
                Required for basic site functionality, user authentication, and security. These cannot be disabled.
              </p>
            </div>
            
            <div className="bg-surface/30 rounded-lg p-4 border border-border">
              <h4 className="font-semibold text-foreground mb-2 flex items-center">
                <Icons.settings className="w-4 h-4 mr-2" />
                Functional Cookies
              </h4>
              <p className="text-foreground/70 text-sm">
                Remember your preferences, settings, and login status to provide a personalized experience.
              </p>
            </div>
            
            <div className="bg-surface/30 rounded-lg p-4 border border-border">
              <h4 className="font-semibold text-foreground mb-2 flex items-center">
                <Icons.eye className="w-4 h-4 mr-2" />
                Analytics Cookies
              </h4>
              <p className="text-foreground/70 text-sm">
                Help us understand how visitors use our site, which pages are popular, and how to improve our service.
              </p>
            </div>
            
            <div className="bg-surface/30 rounded-lg p-4 border border-border">
              <h4 className="font-semibold text-foreground mb-2 flex items-center">
                <Icons.globe className="w-4 h-4 mr-2" />
                Advertising Cookies
              </h4>
              <p className="text-foreground/70 text-sm">
                Track affiliate referrals and display relevant advertisements based on your interests.
              </p>
            </div>
          </div>
          
          <p className="text-foreground/70 text-sm">
            You can control cookie settings through your browser preferences. However, disabling certain cookies 
            may limit some functionality of our service.
          </p>
        </div>
      )
    },
    {
      id: 'data-security',
      title: 'Data Security and Protection',
      icon: <Icons.lock className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-foreground/70 leading-relaxed">
            We implement industry-standard security measures to protect your personal information against 
            unauthorized access, alteration, disclosure, or destruction.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Technical Safeguards</h4>
              <ul className="text-foreground/70 space-y-1 text-sm">
                <li>• SSL/TLS encryption for data transmission</li>
                <li>• Encrypted password storage</li>
                <li>• Regular security audits and updates</li>
                <li>• Firewall and intrusion detection systems</li>
                <li>• Secure cloud hosting infrastructure</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-3">Administrative Safeguards</h4>
              <ul className="text-foreground/70 space-y-1 text-sm">
                <li>• Limited employee access to personal data</li>
                <li>• Privacy training for staff members</li>
                <li>• Data breach response procedures</li>
                <li>• Regular privacy impact assessments</li>
                <li>• Vendor security requirements</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-error/10 border border-error/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icons.warning className="w-5 h-5 text-error mt-0.5" />
              <p className="text-foreground text-sm">
                <strong>Important:</strong> While we use industry-standard security measures, no method of 
                transmission over the internet is 100% secure. We cannot guarantee absolute security of your information.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'user-rights',
      title: 'Your Privacy Rights and Choices',
      icon: <Icons.userCheck className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-foreground/70 leading-relaxed">
            You have several rights regarding your personal information, depending on your location and applicable laws:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Icons.eye className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">Access</h4>
                  <p className="text-foreground/70 text-sm">Request a copy of the personal information we hold about you</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Icons.settings className="w-5 h-5 text-secondary mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">Correction</h4>
                  <p className="text-foreground/70 text-sm">Update or correct inaccurate personal information</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Icons.trash className="w-5 h-5 text-error mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">Deletion</h4>
                  <p className="text-foreground/70 text-sm">Request deletion of your personal information (right to be forgotten)</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Icons.download className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">Portability</h4>
                  <p className="text-foreground/70 text-sm">Receive your data in a portable, machine-readable format</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Icons.shield className="w-5 h-5 text-warning mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">Restriction</h4>
                  <p className="text-foreground/70 text-sm">Limit how we process your personal information</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Icons.mail className="w-5 h-5 text-info mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">Opt-out</h4>
                  <p className="text-foreground/70 text-sm">Unsubscribe from marketing communications at any time</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-2">How to Exercise Your Rights</h4>
            <p className="text-foreground/70 text-sm mb-2">
              To exercise any of these rights, please contact us at privacy@ratewise.com or use the privacy controls in your account settings.
            </p>
            <p className="text-foreground/70 text-sm">
              We will respond to your request within 30 days and may require verification of your identity for security purposes.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'third-party',
      title: 'Third-Party Services and Links',
      icon: <Icons.globe className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-foreground/70 leading-relaxed">
            Our service contains links to third-party websites, products, and services. We also integrate with 
            various third-party tools and platforms to provide our service.
          </p>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Third-Party Integrations</h4>
              <ul className="text-foreground/70 space-y-1 text-sm ml-6">
                <li>• Google Analytics for website analytics</li>
                <li>• Social media platforms for sharing and login</li>
                <li>• Email service providers for communications</li>
                <li>• Payment processors for subscription services</li>
                <li>• Affiliate networks for tracking and commissions</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-2">External Links</h4>
              <p className="text-foreground/70 text-sm">
                When you click on affiliate links or visit external websites, you leave our platform and are 
                subject to the privacy policies of those sites. We are not responsible for the privacy practices 
                or content of external websites.
              </p>
            </div>
          </div>
          
          <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icons.warning className="w-5 h-5 text-warning mt-0.5" />
              <p className="text-foreground text-sm">
                <strong>Important:</strong> We encourage you to review the privacy policies of any third-party 
                services you use. We are not responsible for their data practices or privacy policies.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'contact-us',
      title: 'Contact Us About Privacy',
      icon: <Icons.mail className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-foreground/70 leading-relaxed">
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
            please don't hesitate to contact us.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-3">General Privacy Inquiries</h4>
              <div className="space-y-2 text-foreground/70 text-sm">
                <p><strong>Email:</strong> privacy@ratewise.com</p>
                <p><strong>Response Time:</strong> Within 48 hours</p>
                <p><strong>Phone:</strong> (555) 123-4567</p>
              </div>
            </div>
            
            <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-3">Data Subject Requests</h4>
              <div className="space-y-2 text-foreground/70 text-sm">
                <p><strong>Email:</strong> data-requests@ratewise.com</p>
                <p><strong>Response Time:</strong> Within 30 days</p>
                <p><strong>Secure Portal:</strong> Available in your account</p>
              </div>
            </div>
          </div>
          
          <div className="bg-surface/30 border border-border rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-2">Mailing Address</h4>
            <div className="text-foreground/70 text-sm space-y-1">
              <p>RateWise LLC</p>
              <p>Attention: Privacy Officer</p>
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
      <div className="min-h-screen pb-12">
        {/* Hero Section */}
        <section className="section-py-3xl relative">
          {/* Component-specific accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-secondary/4 to-primary/8 accent-transition" />
          
          <div className="container-page relative z-10 flex flex-col items-center justify-center">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground my-lg text-center">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Privacy Policy
                </span>
              </h1>
              <p className="text-xl text-foreground/70 max-w-3xl mx-auto text-center">
                Your privacy is important to us. Learn how we protect and use your information.
              </p>
              <p className="text-foreground/70">Last updated: January 30, 2025</p>
            </div>
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
                  <h3 className="font-semibold text-foreground mb-3 text-lg">Your Privacy is Our Priority</h3>
                  <p className="text-foreground/70 text-base leading-relaxed">
                    We are committed to protecting your privacy and being transparent about our data practices. 
                    If you have any questions or concerns about how we handle your information, please don't hesitate 
                    to contact our privacy team. We're here to help and ensure your data is protected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
  );
};

export default Privacy;