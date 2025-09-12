import { Icons } from './icons'

const Security = () => {
  const securityFeatures = [
    {
      icon: Icons.shield,
      title: 'Bank-Level Security',
      description: 'All platforms are vetted for security compliance and use industry-standard encryption.'
    },
    {
      icon: Icons.lock,
      title: 'Regulated Partners',
      description: 'We only work with licensed and regulated financial institutions and exchanges.'
    },
    {
      icon: Icons.eye,
      title: 'Transparent Reviews',
      description: 'All reviews and ratings are based on real user experiences and verified data.'
    },
    {
      icon: Icons.shield,
      title: 'Data Protection',
      description: 'Your personal information is protected with enterprise-grade security measures.'
    },
    {
      icon: Icons.check,
      title: 'Regular Audits',
      description: 'We continuously monitor and audit our partner platforms for security compliance.'
    },
    {
      icon: Icons.users,
      title: 'Community Trust',
      description: 'Join thousands of users who trust our platform for their financial decisions.'
    }
  ]

  return (
    <section className="page-section">
      <div className="container-page">
        {/* Header */}
        <div className="text-center my-3xl">
          <h2 className="text-4xl lg:text-5xl font-bold text-text my-lg">
            <span className="gradient-text">Security &</span>
            <br />
            Trust First
          </h2>
          <div className="content-wide">
            <p className="text-xl text-textSecondary">
              Your security is our top priority. We ensure all recommended platforms meet the highest 
              security standards and regulatory requirements.
            </p>
          </div>
        </div>

        {/* Security Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl my-3xl">
          {securityFeatures.map((feature, index) => (
            <div 
              key={index}
              className="card-feature group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto my-lg group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="text-xl font-semibold text-text my-md">{feature.title}</h3>
                <p className="text-textSecondary leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="glass rounded-2xl p-xl border-primary/20">
          <div className="text-center my-xl">
            <h3 className="text-2xl font-bold text-text my-md">
              Trusted by Thousands
            </h3>
            <p className="text-textSecondary content-wide">
              Our platform is trusted by users worldwide for secure and reliable financial recommendations.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-xl">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary my-sm">500K+</div>
              <div className="text-sm text-textSecondary">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary my-sm">99.9%</div>
              <div className="text-sm text-textSecondary">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent my-sm">50+</div>
              <div className="text-sm text-textSecondary">Verified Platforms</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary my-sm">24/7</div>
              <div className="text-sm text-textSecondary">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Security
