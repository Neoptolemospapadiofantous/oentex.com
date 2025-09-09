import React from 'react'
import { ShieldCheckIcon, LockClosedIcon, EyeIcon, ServerIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

const Security = () => {
  const securityFeatures = [
    {
      icon: ShieldCheckIcon,
      title: 'Multi-Layer Protection',
      description: 'Advanced encryption and security protocols'
    },
    {
      icon: LockClosedIcon,
      title: 'Cold Storage',
      description: '95% of funds stored offline securely'
    },
    {
      icon: EyeIcon,
      title: 'Real-time Monitoring',
      description: '24/7 threat detection and prevention'
    },
    {
      icon: ServerIcon,
      title: 'Distributed Infrastructure',
      description: 'Redundant systems across multiple regions'
    }
  ]

  const certifications = [
    'SOC 2 Type II Certified',
    'ISO 27001 Compliant',
    'CCSS Level 3 Security',
    'PCI DSS Compliant',
    'GDPR Compliant',
    'BitLicense Approved'
  ]

  return (
    <section id="security" className="py-20 bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-success/10 rounded-full border border-success/20 mb-6">
              <Shield className="w-4 h-4 text-success mr-2" />
              <span className="text-sm text-success font-medium">Bank-Grade Security</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-text mb-6">
              <span className="bg-gradient-to-r from-success to-primary bg-clip-text text-transparent">
                Bulletproof
              </span>
              <br />
              Security by Design
            </h2>
            
            <p className="text-xl text-textSecondary mb-8">
              Your assets are protected by military-grade security measures. 
              We've never been hacked and maintain the highest security standards in the industry.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-success to-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text mb-1">{feature.title}</h3>
                    <p className="text-sm text-textSecondary">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-background/50 rounded-2xl p-6 border border-border">
              <h3 className="font-semibold text-text mb-4">Security Certifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                    <span className="text-sm text-textSecondary">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Security Visualization */}
          <div className="relative">
            <div className="relative">
              {/* Central Security Hub */}
              <div className="bg-gradient-to-br from-surface to-surface/50 backdrop-blur-lg rounded-3xl p-8 border border-border shadow-2xl">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-success to-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-glow">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-text">Security Score</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-textSecondary">Encryption</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-border rounded-full overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-r from-success to-primary"></div>
                      </div>
                      <span className="text-success font-medium">256</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-textSecondary">Authentication</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-border rounded-full overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-r from-success to-primary"></div>
                      </div>
                      <span className="text-success font-medium">100</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-textSecondary">Cold Storage</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-border rounded-full overflow-hidden">
                        <div className="w-11/12 h-full bg-gradient-to-r from-success to-primary"></div>
                      </div>
                      <span className="text-success font-medium">95%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-textSecondary">Monitoring</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-border rounded-full overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-r from-success to-primary"></div>
                      </div>
                      <span className="text-success font-medium">24/7</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-success/10 rounded-xl border border-success/20">
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="text-success font-medium">All Systems Secure</span>
                  </div>
                </div>
              </div>

              {/* Floating Security Elements */}
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-success/20 rounded-full animate-float flex items-center justify-center">
                <Lock className="w-6 h-6 text-success" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-primary/20 rounded-full animate-float flex items-center justify-center" style={{animationDelay: '2s'}}>
                <Eye className="w-8 h-8 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Security
