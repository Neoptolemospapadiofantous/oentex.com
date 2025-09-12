import { Icons } from '@components/icons'
import AnimatedInnovation from '@components/AnimatedInnovation'
import '@components/AnimatedInnovation.css'
import GuestLayout from '../../layouts/GuestLayout'


const About = () => {
  const stats = [
    { icon: Icons.users, value: 'Growing', label: 'User Community' },
    { icon: Icons.star, value: 'Curated', label: 'Quality Reviews' },
    { icon: Icons.arrowTrendingUp, value: 'High', label: 'User Satisfaction' },
    { icon: Icons.trophy, value: 'Trusted', label: 'Recommendations' }
  ]

  const services = [
    {
      icon: Icons.star,
      title: 'Product Reviews & Ratings',
      description: 'We provide comprehensive reviews and ratings for trading platforms, software tools, courses, and services to help you make informed decisions.',
      features: ['Detailed Reviews', 'User Ratings', 'Pros & Cons Analysis', 'Expert Insights']
    },
    {
      icon: Icons.search,
      title: 'Deal Discovery',
      description: 'Find the best deals, discounts, and exclusive offers across multiple categories including tech, finance, education, and wellness.',
      features: ['Curated Deals', 'Price Comparisons', 'Exclusive Discounts', 'Deal Alerts']
    },
    {
      icon: Icons.arrowTrendingUp,
      title: 'Platform Comparisons',
      description: 'Compare features, pricing, and user experiences across different platforms to find the perfect solution for your needs.',
      features: ['Side-by-Side Comparisons', 'Feature Analysis', 'Pricing Breakdown', 'User Feedback']
    },
    {
      icon: Icons.success,
      title: 'Verified Information',
      description: 'All our reviews and recommendations are based on thorough research, user feedback, and real-world testing.',
      features: ['Fact-Checked Content', 'Regular Updates', 'User Verification', 'Quality Assurance']
    }
  ]

  return (
    <GuestLayout>
      <div className="min-h-screen pb-12 text-center">
        {/* Hero Section */}
        <section className="section-py-3xl relative">
          {/* Component-specific accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-secondary/4 to-primary/8 accent-transition" />
          <div className="container-page relative z-10 flex flex-col items-center justify-center">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground my-lg text-center">
                About Oentex
              </h1>
              <p className="text-xl text-foreground/70 max-w-3xl mx-auto text-center">
                Your trusted source for honest reviews, ratings, and the best deals across tech gadgets, 
                software tools, online courses, financial services, and wellness products.
              </p>
            </div>
          </div>
        </section>

        <div className="container-page section-py-2xl text-center">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-xl my-2xl max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-lg bg-content1/50 rounded-2xl border border-divider hover:bg-content1/70 transition-all duration-300 flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center my-md mx-auto">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-foreground my-sm text-center">{stat.value}</div>
                <div className="text-sm text-foreground/70 text-center">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Mission Section */}
          <div className="bg-content1/30 rounded-3xl p-xl lg:p-3xl my-2xl">
            <div className="grid lg:grid-cols-2 gap-3xl items-center">
              <div className="flex flex-col items-center text-center">
                <h2 className="text-3xl font-bold text-foreground my-lg">Our Mission</h2>
                <p className="text-foreground/70 my-lg leading-relaxed">
                  At Oentex, we're dedicated to helping you make informed decisions by providing honest, comprehensive 
                  reviews and uncovering the best deals across a wide range of products and services.
                </p>
                <p className="text-foreground/70 my-lg leading-relaxed">
                  We believe that everyone deserves access to reliable information and great deals. Our team researches, 
                  tests, and reviews products to save you time and money while ensuring you get the best value for your investment.
                </p>
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-lg border border-primary/20 max-w-2xl">
                  <p className="text-foreground font-medium italic">
                    "Empowering smart decisions through honest reviews and unbeatable deals."
                  </p>
                  <p className="text-foreground/70 text-sm mt-sm">— Our Core Philosophy</p>
                </div>
              </div>
              <div className="relative">
                <AnimatedInnovation />
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="my-2xl text-center">
            <div className="flex flex-col items-center my-3xl">
              <h2 className="text-3xl font-bold text-foreground my-md">What We Do</h2>
              <p className="text-foreground/70 max-w-2xl text-center">
                We help you navigate the complex world of products and services by providing clear, honest information and the best deals available.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-xl max-w-6xl mx-auto">
              {services.map((service, index) => (
                <div key={index} className="text-center bg-content1/50 rounded-2xl p-lg border border-divider hover:bg-content1/70 transition-all duration-300 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center my-md mx-auto">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground my-sm text-center">{service.title}</h3>
                  <p className="text-foreground/70 my-md text-center">{service.description}</p>
                  <div className="space-y-sm text-center w-full">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center justify-center text-sm text-foreground/70">
                        <Icons.success className="w-4 h-4 text-secondary mr-sm flex-shrink-0" />
                        <span className="text-center">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* Affiliate Disclosure */}
          <div className="flex justify-center my-2xl">
            <div className="bg-gradient-to-r from-warning/10 to-primary/10 border border-warning/30 rounded-2xl p-lg max-w-4xl">
            <div className="flex flex-col items-center">
              <div className="flex justify-center mb-md">
                <Icons.warning className="w-6 h-6 text-warning" />
              </div>
              <h3 className="text-lg font-semibold text-foreground my-sm">Transparency Disclosure</h3>
              <p className="text-foreground/70 leading-relaxed my-sm text-center">
                <strong>We believe in complete transparency.</strong> Some of the links on our website are affiliate links, 
                which means we may earn a commission if you make a purchase through them. This comes at no additional cost to you 
                and helps us maintain our free service.
              </p>
              <p className="text-foreground/70 text-sm text-center">
                Our reviews and recommendations are always honest and based on thorough research, regardless of affiliate partnerships. 
                We only recommend products and services we believe provide genuine value to our users.
              </p>
            </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-xl lg:p-3xl border border-primary/20">
            <div className="flex flex-col items-center">
              <h2 className="text-3xl font-bold text-foreground my-md">Ready to Discover Great Deals?</h2>
              <p className="text-foreground/70 my-xl max-w-2xl text-center">
                Join smart shoppers who trust our reviews and discover amazing deals across all categories.
              </p>
              <div className="flex flex-col sm:flex-row gap-md justify-center items-center">
                <button 
                  onClick={() => window.location.href = '/deals'}
                  className="bg-gradient-to-r from-primary to-secondary container-px-xl container-py-sm rounded-full text-white font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  Browse Deals
                  <Icons.externalLink className="w-4 h-4 ml-sm" />
                </button>
                <button 
                  onClick={() => window.location.href = '/contact'}
                  className="border border-primary text-primary container-px-xl container-py-sm rounded-full font-medium hover:bg-primary hover:text-white transition-colors duration-300"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GuestLayout>
  )
}

export default About