// src/pages/guest/Cookies.tsx - Professional Cookie Policy Page
import React, { useState } from 'react';
import { Icons } from '@components/icons/index';
import SEO from '@components/SEO';
import { seoData } from '@lib/seoData';

const Cookies = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    {
      id: 'overview',
      title: 'Cookie Policy Overview',
      icon: <Icons.cookie className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <p className="text-foreground/70 leading-relaxed text-lg">
            This Cookie Policy explains how Oentex, operated by RateWise LLC ("we," "us," or "our"), 
            uses cookies and similar technologies when you visit our website and use our services.
          </p>
          <p className="text-foreground/70 leading-relaxed text-lg">
            Cookies are small text files that are stored on your device when you visit a website. 
            They help us provide you with a better experience by remembering your preferences and 
            understanding how you use our site.
          </p>
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <Icons.shield className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-3 text-lg">Your Control</h3>
                <p className="text-foreground/70 text-base">
                  You have control over cookies. You can manage your cookie preferences at any time 
                  through our cookie consent manager or your browser settings. We respect your choices.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'what-are-cookies',
      title: 'What Are Cookies?',
      icon: <Icons.info className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <p className="text-foreground/70 leading-relaxed text-lg">
            Cookies are small pieces of data stored on your device that help websites function properly 
            and provide personalized experiences. They can be either "session cookies" (temporary) 
            or "persistent cookies" (stored for longer periods).
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-content1/50 border border-divider/30 rounded-2xl p-6">
              <h4 className="font-semibold text-foreground mb-4 text-lg">Session Cookies</h4>
              <ul className="text-foreground/70 space-y-2 text-base">
                <li>• Temporary cookies that expire when you close your browser</li>
                <li>• Used for essential website functionality</li>
                <li>• Help maintain your session while browsing</li>
                <li>• Automatically deleted when browser is closed</li>
              </ul>
            </div>
            
            <div className="bg-content1/50 border border-divider/30 rounded-2xl p-6">
              <h4 className="font-semibold text-foreground mb-4 text-lg">Persistent Cookies</h4>
              <ul className="text-foreground/70 space-y-2 text-base">
                <li>• Remain on your device for a set period</li>
                <li>• Remember your preferences across visits</li>
                <li>• Help improve your user experience</li>
                <li>• Can be manually deleted through browser settings</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'types-of-cookies',
      title: 'Types of Cookies We Use',
      icon: <Icons.settings className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <p className="text-foreground/70 leading-relaxed text-lg">
            We use different types of cookies for various purposes. Each category serves a specific 
            function to enhance your experience on our platform.
          </p>
          
          <div className="space-y-6">
            <div className="bg-success/10 border border-success/20 rounded-2xl p-6">
              <h4 className="font-semibold text-foreground mb-4 text-lg flex items-center">
                <Icons.check className="w-5 h-5 text-success mr-2" />
                Essential Cookies (Always Active)
              </h4>
              <p className="text-foreground/70 text-base mb-4">
                These cookies are necessary for the website to function and cannot be switched off. 
                They are usually set in response to actions made by you.
              </p>
              <ul className="text-foreground/70 space-y-2 text-base">
                <li>• Authentication and login status</li>
                <li>• Shopping cart functionality</li>
                <li>• Security and fraud prevention</li>
                <li>• Basic website navigation</li>
              </ul>
            </div>
            
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
              <h4 className="font-semibold text-foreground mb-4 text-lg flex items-center">
                <Icons.chart className="w-5 h-5 text-primary mr-2" />
                Analytics Cookies (Optional)
              </h4>
              <p className="text-foreground/70 text-base mb-4">
                These cookies help us understand how visitors interact with our website by collecting 
                and reporting information anonymously.
              </p>
              <ul className="text-foreground/70 space-y-2 text-base">
                <li>• Page views and user behavior</li>
                <li>• Popular content and features</li>
                <li>• Performance monitoring</li>
                <li>• User journey analysis</li>
              </ul>
            </div>
            
            <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-6">
              <h4 className="font-semibold text-foreground mb-4 text-lg flex items-center">
                <Icons.heart className="w-5 h-5 text-secondary mr-2" />
                Preference Cookies (Optional)
              </h4>
              <p className="text-foreground/70 text-base mb-4">
                These cookies enable the website to remember choices you make and provide enhanced, 
                more personal features.
              </p>
              <ul className="text-foreground/70 space-y-2 text-base">
                <li>• Language and region settings</li>
                <li>• Customized content display</li>
                <li>• User interface preferences</li>
                <li>• Personalized recommendations</li>
              </ul>
            </div>
            
            <div className="bg-warning/10 border border-warning/20 rounded-2xl p-6">
              <h4 className="font-semibold text-foreground mb-4 text-lg flex items-center">
                <Icons.megaphone className="w-5 h-5 text-warning mr-2" />
                Marketing Cookies (Optional)
              </h4>
              <p className="text-foreground/70 text-base mb-4">
                These cookies may be set through our site by our advertising partners to build 
                a profile of your interests.
              </p>
              <ul className="text-foreground/70 space-y-2 text-base">
                <li>• Targeted advertising</li>
                <li>• Social media integration</li>
                <li>• Campaign effectiveness tracking</li>
                <li>• Cross-site advertising</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'third-party-cookies',
      title: 'Third-Party Cookies',
      icon: <Icons.globe className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <p className="text-foreground/70 leading-relaxed text-lg">
            We may use third-party services that set their own cookies on our website. These services 
            help us provide better functionality and analyze our website performance.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-content1/50 border border-divider/30 rounded-2xl p-6">
              <h4 className="font-semibold text-foreground mb-4 text-lg">Google Services</h4>
              <ul className="text-foreground/70 space-y-2 text-base">
                <li>• Google Analytics - Website analytics</li>
                <li>• Google Ads - Advertising and conversion tracking</li>
                <li>• Google Tag Manager - Tag management</li>
                <li>• reCAPTCHA - Security and spam prevention</li>
              </ul>
            </div>
            
            <div className="bg-content1/50 border border-divider/30 rounded-2xl p-6">
              <h4 className="font-semibold text-foreground mb-4 text-lg">Other Services</h4>
              <ul className="text-foreground/70 space-y-2 text-base">
                <li>• Supabase - Authentication and database</li>
                <li>• Social Media Widgets - Social sharing</li>
                <li>• Customer Support Tools - Help desk integration</li>
                <li>• Performance Monitoring - Site optimization</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-warning/10 border border-warning/20 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <Icons.warning className="w-6 h-6 text-warning mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2 text-lg">Important Note</h4>
                <p className="text-foreground/70 text-base">
                  Third-party cookies are subject to the privacy policies of their respective providers. 
                  We recommend reviewing their policies to understand how they handle your data.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'manage-cookies',
      title: 'Managing Your Cookie Preferences',
      icon: <Icons.settings className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <p className="text-foreground/70 leading-relaxed text-lg">
            You have several options for managing cookies. You can control cookie settings through 
            our website, your browser, or use third-party tools.
          </p>
          
          <div className="space-y-6">
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
              <h4 className="font-semibold text-foreground mb-4 text-lg">Cookie Consent Manager</h4>
              <p className="text-foreground/70 text-base mb-4">
                Use our cookie consent manager to customize your cookie preferences:
              </p>
              <ul className="text-foreground/70 space-y-2 text-base">
                <li>• Click the "Cookie Settings" link in our footer</li>
                <li>• Choose which categories of cookies to allow</li>
                <li>• Save your preferences for future visits</li>
                <li>• Update your choices at any time</li>
              </ul>
            </div>
            
            <div className="bg-content1/50 border border-divider/30 rounded-2xl p-6">
              <h4 className="font-semibold text-foreground mb-4 text-lg">Browser Settings</h4>
              <p className="text-foreground/70 text-base mb-4">
                Most browsers allow you to control cookies through their settings:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-foreground mb-2">Desktop Browsers</h5>
                  <ul className="text-foreground/70 space-y-1 text-sm">
                    <li>• Chrome: Settings → Privacy and security → Cookies</li>
                    <li>• Firefox: Options → Privacy & Security</li>
                    <li>• Safari: Preferences → Privacy</li>
                    <li>• Edge: Settings → Cookies and site permissions</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-foreground mb-2">Mobile Browsers</h5>
                  <ul className="text-foreground/70 space-y-1 text-sm">
                    <li>• Chrome Mobile: Settings → Site settings</li>
                    <li>• Safari Mobile: Settings → Safari → Privacy</li>
                    <li>• Firefox Mobile: Menu → Settings → Privacy</li>
                    <li>• Samsung Internet: Menu → Settings → Privacy</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-warning/10 border border-warning/20 rounded-2xl p-6">
              <div className="flex items-start space-x-4">
                <Icons.warning className="w-6 h-6 text-warning mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2 text-lg">Impact of Disabling Cookies</h4>
                  <p className="text-foreground/70 text-base">
                    Disabling certain cookies may affect website functionality. Essential cookies 
                    are required for basic site operation and cannot be disabled without impacting 
                    your user experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'data-retention',
      title: 'Data Retention and Security',
      icon: <Icons.shield className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <p className="text-foreground/70 leading-relaxed text-lg">
            We take the security and retention of data collected through cookies seriously. 
            This section explains our data practices and security measures.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-success/10 border border-success/20 rounded-2xl p-6">
              <h4 className="font-semibold text-foreground mb-4 text-lg">Data Retention</h4>
              <ul className="text-foreground/70 space-y-2 text-base">
                <li>• Session cookies: Deleted when browser closes</li>
                <li>• Analytics data: Up to 26 months</li>
                <li>• Preference cookies: Up to 12 months</li>
                <li>• Marketing cookies: Up to 13 months</li>
                <li>• Legal compliance: As required by law</li>
              </ul>
            </div>
            
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
              <h4 className="font-semibold text-foreground mb-4 text-lg">Security Measures</h4>
              <ul className="text-foreground/70 space-y-2 text-base">
                <li>• HTTPS encryption for all data transmission</li>
                <li>• Secure cookie storage practices</li>
                <li>• Regular security audits and updates</li>
                <li>• Access controls and monitoring</li>
                <li>• Compliance with data protection laws</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-content1/50 border border-divider/30 rounded-2xl p-6">
            <h4 className="font-semibold text-foreground mb-4 text-lg">Your Rights</h4>
            <p className="text-foreground/70 text-base mb-4">
              Under applicable data protection laws, you have the right to:
            </p>
            <ul className="text-foreground/70 space-y-2 text-base">
              <li>• Access your personal data collected through cookies</li>
              <li>• Request correction of inaccurate data</li>
              <li>• Request deletion of your data</li>
              <li>• Object to processing of your data</li>
              <li>• Request data portability</li>
              <li>• Withdraw consent at any time</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'updates-changes',
      title: 'Updates to This Policy',
      icon: <Icons.clock className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <p className="text-foreground/70 leading-relaxed text-lg">
            We may update this Cookie Policy from time to time to reflect changes in our practices, 
            technology, or legal requirements. We will notify you of any significant changes.
          </p>
          
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
            <h4 className="font-semibold text-foreground mb-4 text-lg">How We Notify You</h4>
            <ul className="text-foreground/70 space-y-2 text-base">
              <li>• Updated policy posted on our website</li>
              <li>• Email notification for significant changes</li>
              <li>• In-app notification when you visit our site</li>
              <li>• Updated cookie consent banner if needed</li>
            </ul>
          </div>
          
          <div className="bg-content1/50 border border-divider/30 rounded-2xl p-6">
            <h4 className="font-semibold text-foreground mb-4 text-lg">Effective Date</h4>
            <p className="text-foreground/70 text-base">
              This Cookie Policy was last updated on January 30, 2025. We recommend reviewing 
              this policy periodically to stay informed about how we use cookies and similar technologies.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'contact-information',
      title: 'Contact Us About Cookies',
      icon: <Icons.mail className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <p className="text-foreground/70 leading-relaxed text-lg">
            If you have questions about our use of cookies or this Cookie Policy, please contact us. 
            We're here to help clarify any concerns you may have.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
              <h4 className="font-semibold text-foreground mb-4 text-lg">General Inquiries</h4>
              <div className="space-y-3 text-foreground/70 text-base">
                <p><strong>Email:</strong> privacy@oentex.com</p>
                <p><strong>Response Time:</strong> Within 24 hours</p>
                <p><strong>Phone:</strong> (555) 123-4567</p>
                <p><strong>Hours:</strong> Monday-Friday, 9 AM - 6 PM EST</p>
              </div>
            </div>
            
            <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-6">
              <h4 className="font-semibold text-foreground mb-4 text-lg">Data Protection Officer</h4>
              <div className="space-y-3 text-foreground/70 text-base">
                <p><strong>Email:</strong> dpo@oentex.com</p>
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
              <p>Attention: Privacy Department</p>
              <p>123 Review Street</p>
              <p>San Francisco, CA 94105</p>
              <p>United States</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <SEO {...seoData.cookies} />
      <div className="min-h-screen bg-background">
      {/* Enhanced Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Professional background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-3xl" />
        
        <div className="container-page relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Icons.cookie className="w-4 h-4" />
              Privacy & Cookies
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Cookie Policy
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/70 max-w-4xl mx-auto mb-8 leading-relaxed px-4">
              Understanding how we use cookies and similar technologies to enhance your experience on our platform
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-foreground/60">
              <div className="flex items-center gap-2">
                <Icons.calendar className="w-4 h-4" />
                <span>Last updated: January 30, 2025</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-foreground/30 rounded-full" />
              <div className="flex items-center gap-2">
                <Icons.clock className="w-4 h-4" />
                <span>Effective immediately</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-12 bg-content1/30">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Table of Contents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`p-3 sm:p-4 rounded-xl border text-left transition-all duration-300 hover:scale-105 ${
                    activeSection === section.id
                      ? 'bg-primary/10 border-primary/30 text-primary shadow-lg'
                      : 'bg-content1 border-divider/50 hover:border-primary/30 hover:bg-content2/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium text-xs sm:text-sm">{section.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Content Section */}
      <section className="py-20">
        <div className="container-page">
          <div className="max-w-5xl mx-auto">
            <div className="space-y-16">
              {sections.map((section, index) => (
                <div 
                  key={section.id} 
                  id={section.id}
                  className="scroll-mt-24 bg-content1/60 backdrop-blur-xl rounded-3xl border border-divider/30 overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500"
                >
                  <div className="p-4 sm:p-6 md:p-8 lg:p-12">
                    <div className="flex items-start gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10">
                      <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white shadow-lg">
                        {section.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <span className="text-2xl sm:text-3xl font-bold text-primary">{index + 1}</span>
                          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                            {section.title}
                          </h2>
                        </div>
                        <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                      </div>
                    </div>
                    <div className="prose prose-lg max-w-none">
                      {section.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Footer Notice */}
            <div className="mt-20 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 border border-primary/20 rounded-3xl p-8 lg:p-12 shadow-2xl">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Icons.cookie className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-4">Cookie Consent</h3>
                  <p className="text-foreground/80 text-lg leading-relaxed mb-6">
                    By continuing to use our website, you consent to our use of cookies as described in this policy. 
                    You can manage your cookie preferences at any time through our cookie settings or your browser.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-content1/50 rounded-2xl p-6 border border-divider/30">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Icons.check className="w-5 h-5 text-success" />
                        Your Control
                      </h4>
                      <ul className="text-foreground/70 space-y-2 text-sm">
                        <li>• Manage cookie preferences anytime</li>
                        <li>• Disable non-essential cookies</li>
                        <li>• Clear cookies through browser settings</li>
                        <li>• Opt-out of marketing cookies</li>
                      </ul>
                    </div>
                    <div className="bg-content1/50 rounded-2xl p-6 border border-divider/30">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Icons.shield className="w-5 h-5 text-primary" />
                        Our Commitment
                      </h4>
                      <ul className="text-foreground/70 space-y-2 text-sm">
                        <li>• Transparent cookie practices</li>
                        <li>• Regular policy updates</li>
                        <li>• Secure data handling</li>
                        <li>• Respect for your privacy choices</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default Cookies;
