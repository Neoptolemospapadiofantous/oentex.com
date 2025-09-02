import React from 'react';
import { Shield, Users, AlertTriangle, Star, Link, FileText, Mail, Clock } from 'lucide-react';
import GuestLayout from '../layouts/GuestLayout';

const Terms = () => {
  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: <FileText className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-textSecondary leading-relaxed">
            By accessing and using RateWise (the "Service"), operated by RateWise LLC ("we," "us," or "our"), 
            you accept and agree to be bound by the terms and provisions of this agreement ("Terms of Service"). 
            If you do not agree to abide by these terms, please do not use this service.
          </p>
          <p className="text-textSecondary leading-relaxed">
            These Terms of Service apply to all visitors, users, and others who access or use the Service, 
            including registered users who create accounts and submit reviews.
          </p>
        </div>
      )
    },
    {
      id: 'description',
      title: 'Description of Service',
      icon: <Star className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-textSecondary leading-relaxed">
            RateWise is an affiliate marketing platform that provides product and service reviews, ratings, 
            and recommendations across multiple categories including:
          </p>
          <ul className="text-textSecondary space-y-2 ml-6">
            <li>• Tech Gadgets and Electronics</li>
            <li>• Software Tools and Applications</li>
            <li>• Online Courses and Educational Platforms</li>
            <li>• Financial Services and Investment Platforms</li>
            <li>• Health & Wellness Products and Services</li>
          </ul>
          <p className="text-textSecondary leading-relaxed">
            We connect users with third-party merchants and service providers through affiliate relationships 
            and may receive compensation for referrals, purchases, or sign-ups made through our platform.
          </p>
        </div>
      )
    },
    {
      id: 'user-accounts',
      title: 'User Accounts and Registration',
      icon: <Users className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-textSecondary leading-relaxed">
            To access certain features of our Service, you may be required to create an account. When creating an account, you agree to:
          </p>
          <ul className="text-textSecondary space-y-2 ml-6">
            <li>• Provide accurate, current, and complete information</li>
            <li>• Maintain and update your account information</li>
            <li>• Maintain the security and confidentiality of your login credentials</li>
            <li>• Accept responsibility for all activities under your account</li>
            <li>• Notify us immediately of any unauthorized use of your account</li>
          </ul>
          <p className="text-textSecondary leading-relaxed">
            You must be at least 18 years old to create an account. We reserve the right to refuse service, 
            terminate accounts, or remove content at our sole discretion.
          </p>
        </div>
      )
    },
    {
      id: 'user-content',
      title: 'User-Generated Content and Reviews',
      icon: <Star className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-textSecondary leading-relaxed">
            Our Service allows users to submit reviews, ratings, comments, photos, and other content ("User Content"). 
            By submitting User Content, you agree that:
          </p>
          <ul className="text-textSecondary space-y-2 ml-6">
            <li>• Your content is based on your genuine experience with the product or service</li>
            <li>• You will not submit false, misleading, or fraudulent reviews</li>
            <li>• Your content does not violate any laws or third-party rights</li>
            <li>• You grant us a worldwide, non-exclusive, royalty-free license to use, modify, and display your content</li>
            <li>• You will not submit content that is defamatory, offensive, or inappropriate</li>
            <li>• You will not attempt to manipulate ratings or reviews through fake accounts or incentives</li>
          </ul>
          <p className="text-textSecondary leading-relaxed">
            We reserve the right to moderate, edit, or remove any User Content that violates these terms or our community guidelines.
          </p>
        </div>
      )
    },
    {
      id: 'affiliate-disclosure',
      title: 'Affiliate Relationships and Compensation',
      icon: <Link className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-textSecondary leading-relaxed">
            RateWise participates in various affiliate marketing programs and may receive compensation when users:
          </p>
          <ul className="text-textSecondary space-y-2 ml-6">
            <li>• Click on affiliate links</li>
            <li>• Make purchases through our referral links</li>
            <li>• Sign up for services through our platform</li>
            <li>• Complete specific actions with partner companies</li>
          </ul>
          <p className="text-textSecondary leading-relaxed">
            This compensation does not affect the price you pay for products or services. Our affiliate relationships 
            are disclosed throughout the site, and we strive to maintain editorial independence in our reviews and recommendations.
          </p>
          <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <p className="text-text text-sm">
                <strong>Important:</strong> We may earn commissions from affiliate partnerships, but this does not 
                influence our honest reviews and recommendations. We are committed to providing unbiased information to help you make informed decisions.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'prohibited-uses',
      title: 'Prohibited Uses and Conduct',
      icon: <Shield className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-textSecondary leading-relaxed">
            You agree not to use the Service for any unlawful purpose or in any way that could damage, disable, 
            overburden, or impair our servers. Prohibited activities include:
          </p>
          <ul className="text-textSecondary space-y-2 ml-6">
            <li>• Submitting false, fraudulent, or misleading reviews</li>
            <li>• Creating multiple accounts to manipulate ratings</li>
            <li>• Harassing, threatening, or defaming other users</li>
            <li>• Attempting to gain unauthorized access to our systems</li>
            <li>• Distributing malware, viruses, or harmful code</li>
            <li>• Scraping or harvesting user data without permission</li>
            <li>• Violating any applicable laws or regulations</li>
            <li>• Impersonating others or providing false identity information</li>
          </ul>
        </div>
      )
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property Rights',
      icon: <FileText className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-textSecondary leading-relaxed">
            The Service and its original content, features, and functionality are owned by RateWise LLC and are 
            protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>
          <p className="text-textSecondary leading-relaxed">
            You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, 
            republish, download, store, or transmit any of the material on our Service without our prior written consent.
          </p>
          <p className="text-textSecondary leading-relaxed">
            Product names, logos, and brands mentioned on our Service are property of their respective owners and 
            are used for identification purposes only.
          </p>
        </div>
      )
    },
    {
      id: 'disclaimers',
      title: 'Disclaimers and Warranties',
      icon: <AlertTriangle className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-textSecondary leading-relaxed">
            The information provided on RateWise is for general informational purposes only. We make no representations 
            or warranties of any kind, express or implied, about:
          </p>
          <ul className="text-textSecondary space-y-2 ml-6">
            <li>• The accuracy, reliability, or completeness of product information</li>
            <li>• The availability or functionality of third-party products and services</li>
            <li>• The results you may achieve from using recommended products</li>
            <li>• The uninterrupted or error-free operation of our Service</li>
          </ul>
          <p className="text-textSecondary leading-relaxed">
            User reviews and ratings represent individual opinions and experiences. Results may vary, and we cannot 
            guarantee that you will have the same experience as other users.
          </p>
        </div>
      )
    },
    {
      id: 'limitation-liability',
      title: 'Limitation of Liability',
      icon: <Shield className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-textSecondary leading-relaxed">
            To the fullest extent permitted by applicable law, RateWise LLC shall not be liable for any indirect, 
            incidental, special, consequential, or punitive damages, including but not limited to:
          </p>
          <ul className="text-textSecondary space-y-2 ml-6">
            <li>• Loss of profits, data, or business opportunities</li>
            <li>• Damages resulting from third-party products or services</li>
            <li>• Technical failures or service interruptions</li>
            <li>• Actions or omissions of other users</li>
            <li>• Unauthorized access to your account or data</li>
          </ul>
          <p className="text-textSecondary leading-relaxed">
            Our total liability to you for all claims shall not exceed the amount you paid us in the twelve months 
            preceding the claim, or $100, whichever is greater.
          </p>
        </div>
      )
    },
    {
      id: 'modifications',
      title: 'Modifications to Terms and Service',
      icon: <Clock className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-textSecondary leading-relaxed">
            We reserve the right to modify or replace these Terms of Service at any time. If a revision is material, 
            we will provide at least 30 days' notice prior to any new terms taking effect.
          </p>
          <p className="text-textSecondary leading-relaxed">
            We may also modify, suspend, or discontinue any part of our Service at any time. We will provide reasonable 
            notice of significant changes when possible.
          </p>
          <p className="text-textSecondary leading-relaxed">
            Your continued use of the Service after any changes constitutes acceptance of the new Terms of Service.
          </p>
        </div>
      )
    },
    {
      id: 'termination',
      title: 'Account Termination',
      icon: <Users className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-textSecondary leading-relaxed">
            You may terminate your account at any time by contacting us or using the account deletion feature in your profile.
          </p>
          <p className="text-textSecondary leading-relaxed">
            We may terminate or suspend your account and access to the Service immediately, without prior notice, 
            if you breach these Terms of Service or engage in prohibited activities.
          </p>
          <p className="text-textSecondary leading-relaxed">
            Upon termination, your right to use the Service will cease immediately, but these Terms will remain in 
            effect regarding your past use of the Service.
          </p>
        </div>
      )
    },
    {
      id: 'contact',
      title: 'Contact Information',
      icon: <Mail className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-textSecondary leading-relaxed">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="space-y-2">
              <p className="text-text font-medium">RateWise LLC</p>
              <p className="text-textSecondary">Email: legal@ratewise.com</p>
              <p className="text-textSecondary">Address: 123 Review Street, San Francisco, CA 94105</p>
              <p className="text-textSecondary">Phone: (555) 123-4567</p>
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-text mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-textSecondary max-w-3xl mx-auto mb-4">
              Please read these terms carefully before using our service
            </p>
            <p className="text-textSecondary">Last updated: January 30, 2025</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {sections.map((section, index) => (
                <div key={section.id} className="bg-surface/50 rounded-2xl border border-border overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center text-white">
                        {section.icon}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-text">
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
            <div className="mt-16 p-6 bg-warning/10 border border-warning/30 rounded-2xl">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-text mb-2">Important Legal Notice</h3>
                  <p className="text-textSecondary text-sm leading-relaxed">
                    These Terms of Service constitute a legally binding agreement between you and RateWise LLC. 
                    By using our service, you acknowledge that you have read, understood, and agree to be bound by these terms. 
                    If you do not agree with any part of these terms, you must not use our service.
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