import React from 'react'
import { Icon } from './icons'

const Platforms = () => {
  const platforms = [
    {
      icon: 'mobile',
      name: 'Mobile App',
      description: 'Trade on the go with our award-winning mobile app',
      features: ['Real-time notifications', 'Biometric login', 'Offline mode'],
      rating: 4.8,
      downloads: '1M+',
      image: 'https://images.pexels.com/photos/887751/pexels-photo-887751.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      icon: 'desktop',
      name: 'Web Platform',
      description: 'Full-featured trading platform in your browser',
      features: ['Advanced charting', 'Multi-monitor support', 'Custom layouts'],
      rating: 4.9,
      downloads: '500K+',
      image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      icon: 'tablet',
      name: 'Tablet App',
      description: 'Optimized experience for tablet trading',
      features: ['Split-screen trading', 'Gesture controls', 'Portfolio overview'],
      rating: 4.7,
      downloads: '250K+',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ]

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-text mb-6">
            Trade Anywhere,
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Anytime
            </span>
          </h2>
          <p className="text-xl text-textSecondary max-w-3xl mx-auto">
            Access your portfolio and trade across all your devices with seamless synchronization 
            and consistent user experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {platforms.map((platform, index) => (
            <div 
              key={index}
              className="group bg-surface/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={platform.image} 
                  alt={platform.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                    <Icon name={platform.icon} size="lg" className="text-white" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Icon name="star" size="sm" color="warning" />
                      <span className="text-white font-medium">{platform.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="download" size="sm" className="text-white" />
                      <span className="text-white font-medium">{platform.downloads}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-text mb-2">{platform.name}</h3>
                <p className="text-textSecondary mb-4">{platform.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {platform.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-textSecondary">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className="group w-full bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center">
                  Download Now
                  <Icon name="arrowRight" size="sm" className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Platform Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">99.9%</span>
            </div>
            <h3 className="text-lg font-semibold text-text mb-2">Uptime</h3>
            <p className="text-textSecondary">Reliable platform with minimal downtime</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-secondary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">{'<1ms'}</span>
            </div>
            <h3 className="text-lg font-semibold text-text mb-2">Latency</h3>
            <p className="text-textSecondary">Lightning-fast order execution</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">24/7</span>
            </div>
            <h3 className="text-lg font-semibold text-text mb-2">Support</h3>
            <p className="text-textSecondary">Round-the-clock customer assistance</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Platforms
