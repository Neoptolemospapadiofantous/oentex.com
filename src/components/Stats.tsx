import React from 'react'
import { TrendingUp, Users, Shield, Zap } from 'lucide-react'

const Stats = () => {
  const stats = [
    {
      icon: TrendingUp,
      value: '$2.5B+',
      label: 'Trading Volume',
      description: 'Total volume traded on our platform'
    },
    {
      icon: Users,
      value: '500K+',
      label: 'Active Traders',
      description: 'Trusted by traders worldwide'
    },
    {
      icon: Shield,
      value: '99.9%',
      label: 'Security Score',
      description: 'Bank-grade security standards'
    },
    {
      icon: Zap,
      value: '<1ms',
      label: 'Execution Speed',
      description: 'Lightning-fast trade execution'
    }
  ]

  return (
    <section className="py-20 bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center group hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl mb-4 group-hover:shadow-lg group-hover:shadow-primary/25">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-text mb-2">{stat.value}</div>
              <div className="text-lg font-semibold text-text mb-1">{stat.label}</div>
              <div className="text-sm text-textSecondary">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats
