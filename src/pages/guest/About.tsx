import { Icons } from '@components/icons'
import AnimatedInnovation from '@components/AnimatedInnovation'
import '@components/AnimatedInnovation.css'
import { Button } from '@components/ui-kit'


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
      <div className="min-h-screen flex flex-col items-center">
        {/* Hero Section */}
        <section className="section-py-3xl relative w-full">
          {/* Component-specific accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-secondary/4 to-primary/8 accent-transition" />
          
          <div className="container-page relative z-10 flex flex-col items-center justify-center">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground my-lg text-center">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  About Oentex
                </span>
              </h1>
              <p className="text-xl text-foreground/70 max-w-3xl mx-auto text-center">
                Your trusted source for honest reviews, ratings, and the best deals across tech gadgets, 
                software tools, online courses, financial services
              </p>
            </div>
          </div>
        </section>

        <div className="container-page section-py-lg w-full flex flex-col items-center">
          {/* Stats Grid */}
          <section className="mb-2xl w-full flex flex-col items-center">
            <div className="text-center mb-2xl">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-lg">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Our Impact
                </span>
              </h2>
              <p className="text-lg text-foreground/70 max-w-3xl mx-auto text-center">
                Numbers that reflect our commitment to excellence and user satisfaction
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-lg max-w-6xl mx-auto w-full">
              {stats.map((stat, index) => (
                <div key={index} className="group text-center container-p-lg bg-content1/80 backdrop-blur-xl rounded-2xl border border-divider/40 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 transform hover:scale-[1.02] flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-md mx-auto shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-primary mb-xs text-center group-hover:text-primary transition-colors duration-300">{stat.value}</div>
                  <div className="text-sm font-semibold text-foreground text-center">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Mission Section */}
          <section className="mb-2xl w-full flex flex-col items-center">
            <div className="bg-content1/90 backdrop-blur-2xl rounded-2xl container-p-2xl border border-divider/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group overflow-hidden relative w-full max-w-6xl">
              <div className="grid lg:grid-cols-2 gap-2xl items-center">
                <div className="flex flex-col text-center">
                  <div className="inline-flex items-center gap-sm container-px-md container-py-xs bg-primary/10 rounded-full border border-primary/20 mb-lg w-fit mx-auto">
                    <Icons.trophy className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">Our Mission</span>
                  </div>
                  
                  <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-lg group-hover:text-primary transition-colors duration-300">
                    Empowering Smart Decisions
                  </h2>
                  
                  <p className="text-base text-foreground/70 mb-lg leading-relaxed">
                    At Oentex, we're dedicated to helping you make informed decisions by providing honest, comprehensive 
                    reviews and uncovering the best deals across a wide range of products and services.
                  </p>
                  
                  <p className="text-foreground/70 mb-xl leading-relaxed">
                    We believe that everyone deserves access to reliable information and great deals. Our team researches, 
                    tests, and reviews products to save you time and money while ensuring you get the best value for your investment.
                  </p>
                  
                  <div className="bg-gradient-to-r from-primary/15 to-secondary/15 rounded-2xl container-p-xl border border-primary/30 max-w-2xl mx-auto">
                    <div className="flex flex-col items-center text-center gap-md">
                      <Icons.chatBubble className="w-6 h-6 text-primary/60 flex-shrink-0" />
                      <div>
                        <p className="text-foreground font-medium italic text-lg leading-relaxed">
                          "Empowering smart decisions through honest reviews and unbeatable deals."
                        </p>
                        <p className="text-foreground/70 text-sm mt-sm font-medium">— Our Core Philosophy</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl"></div>
                  <AnimatedInnovation />
                </div>
              </div>
            </div>
          </section>

          {/* Services */}
          <section className="mb-2xl w-full flex flex-col items-center">
            <div className="text-center mb-2xl">
              <div className="inline-flex items-center gap-sm container-px-md container-py-xs bg-primary/10 rounded-full border border-primary/20 mb-lg">
                <Icons.star className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Our Services</span>
              </div>
              
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-lg">What We Do</h2>
              <p className="text-base text-foreground/70 max-w-3xl mx-auto">
                We help you navigate the complex world of products and services by providing clear, honest information and the best deals available.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-lg max-w-6xl mx-auto w-full">
              {services.map((service, index) => (
                <div key={index} className="group bg-content1/80 backdrop-blur-xl rounded-2xl container-p-lg border border-divider/40 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 transform hover:scale-[1.02] flex flex-col">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-lg mx-auto shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-foreground mb-sm text-center group-hover:text-primary transition-colors duration-300">{service.title}</h3>
                  <p className="text-foreground/70 mb-lg text-center leading-relaxed">{service.description}</p>
                  
                  <div className="space-y-sm mt-auto text-center">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center justify-center gap-xs text-sm text-foreground/70 group-hover:text-foreground transition-colors duration-200">
                        <Icons.success className="w-3 h-3 text-success flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>


          {/* Affiliate Disclosure */}
          <section className="mb-2xl w-full flex flex-col items-center">
            <div className="flex justify-center w-full">
              <div className="bg-gradient-to-r from-warning/15 to-primary/15 border border-warning/40 rounded-2xl container-p-2xl max-w-4xl backdrop-blur-sm w-full">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-warning/20 to-warning/10 rounded-xl flex items-center justify-center mb-lg">
                    <Icons.warning className="w-6 h-6 text-warning" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-lg">Transparency Disclosure</h3>
                  
                  <p className="text-foreground/70 leading-relaxed mb-lg text-base">
                    <strong className="text-foreground">We believe in complete transparency.</strong> Some of the links on our website are affiliate links, 
                    which means we may earn a commission if you make a purchase through them. This comes at no additional cost to you 
                    and helps us maintain our free service.
                  </p>
                  
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    Our reviews and recommendations are always honest and based on thorough research, regardless of affiliate partnerships. 
                    We only recommend products and services we believe provide genuine value to our users.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="w-full flex flex-col items-center">
            <div className="bg-gradient-to-r from-primary/15 to-secondary/15 rounded-2xl container-p-2xl border border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 group overflow-hidden relative w-full max-w-4xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-sm container-px-md container-py-xs bg-primary/20 rounded-full border border-primary/30 mb-lg">
                  <Icons.arrowTrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">Get Started Today</span>
                </div>
                
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-lg group-hover:text-primary transition-colors duration-300">
                  Ready to Discover Great Deals?
                </h2>
                
                <p className="text-base text-foreground/70 mb-xl max-w-3xl leading-relaxed">
                  Join smart shoppers who trust our reviews and discover amazing deals across all categories.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-lg justify-center items-center">
                  <Button 
                    color="primary"
                    size="md"
                    rightIcon={<Icons.externalLink className="w-4 h-4" />}
                    onClick={() => window.location.href = '/deals'}
                    className="container-px-xl container-py-md"
                  >
                    Browse Deals
                  </Button>
                  
                  <Button 
                    variant="bordered"
                    size="md"
                    rightIcon={<Icons.mail className="w-4 h-4" />}
                    onClick={() => window.location.href = '/contact'}
                    className="container-px-xl container-py-md"
                  >
                    Contact Us
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
  )
}

export default About