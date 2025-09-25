import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icons } from '@components/icons'
import { Button } from '@components/ui-kit'
import SEO from '@components/SEO'
import { seoData } from '@lib/seoData'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const navigate = useNavigate()

  const faqs = [
    {
      question: 'What is Oentex and how does it work?',
      answer: 'Oentex is a trusted affiliate marketing platform that connects users with premium cryptocurrency exchanges, digital tools, and financial services. We partner with regulated brokers and established platforms to provide you with exclusive deals, bonuses, and comprehensive reviews. Our platform helps you discover and compare the best services while earning commissions from successful referrals.'
    },
    {
      question: 'How does Oentex make money and stay transparent?',
      answer: 'We earn affiliate commissions when you sign up with our partner platforms through our referral links. This business model allows us to offer our platform for free while providing you with exclusive bonuses and deals. We maintain complete transparency about our affiliate relationships and clearly disclose all partnerships in compliance with FTC guidelines. Our editorial independence ensures honest reviews regardless of commission rates.'
    },
    {
      question: 'What types of platforms and services do you offer?',
      answer: 'Oentex features a diverse range of platforms including cryptocurrency exchanges, forex brokers, prop trading firms, robo advisors, investment platforms, and digital tools. We carefully vet each partner to ensure they meet our standards for regulation, security, and user experience. Our categories include crypto exchanges, trading platforms, financial tools, and software solutions.'
    },
    {
      question: 'Are the platforms you recommend safe and regulated?',
      answer: 'Yes, we only partner with regulated and licensed platforms. All our cryptocurrency exchanges and financial service providers are vetted for proper licensing, security measures, and regulatory compliance in their respective jurisdictions. We prioritize platforms with strong track records, proper insurance coverage, and industry-standard security protocols including cold storage and two-factor authentication.'
    },
    {
      question: 'What exclusive deals and bonuses can I get through Oentex?',
      answer: 'Our members get access to exclusive bonuses that aren\'t available elsewhere, including welcome bonuses, trading credits, reduced fees, deposit matches, and special promotions. Deals vary by platform and can range from $10 to $500+ in value depending on the service and your activity level. We negotiate these exclusive offers specifically for our community members.'
    },
    {
      question: 'How does your rating and review system work?',
      answer: 'We use a comprehensive 5-star rating system that evaluates platforms across multiple criteria including security, features, user experience, customer support, and value for money. Our ratings combine expert reviews from our team with verified user feedback from actual platform users. All reviews go through moderation to ensure authenticity and quality before being published.'
    },
    {
      question: 'Do I pay extra fees when using your affiliate links?',
      answer: 'No, you never pay extra when using our links. Affiliate commissions are paid by the platforms from their marketing budgets, not added to your costs. In fact, you often save money and get better deals through our exclusive partnerships. The platforms benefit from our referrals, and we pass those savings and bonuses directly to our users.'
    },
    {
      question: 'Can I submit my own platform reviews and ratings?',
      answer: 'Absolutely! We encourage our registered users to share their experiences with the platforms they\'ve used. After creating an account, you can submit detailed reviews including star ratings, pros and cons, and even photos. Your reviews help other community members make informed decisions. All user-submitted content goes through our moderation process to maintain quality and authenticity.'
    },
    {
      question: 'What should I know about cryptocurrency and trading risks?',
      answer: 'All cryptocurrency and trading activities involve significant risk and you can lose money. Cryptocurrency prices are highly volatile and can change rapidly. Forex, CFDs, and leveraged trading carry additional risks including the possibility of losing more than your initial investment. We provide educational resources and risk disclosures, but you should never invest more than you can afford to lose and always do your own research.'
    },
    {
      question: 'How do I get started with Oentex?',
      answer: 'Getting started is simple! Browse our platform categories to find services that match your needs, read reviews and ratings from our community, and click through our affiliate links to get exclusive bonuses when you sign up. Create a free Oentex account to access your dashboard, save favorite platforms, submit reviews, and track your bonuses. We recommend starting with smaller amounts and platforms that match your experience level.'
    },
    {
      question: 'What if I have problems with a recommended platform?',
      answer: 'While we carefully vet our partners, if you experience issues with any platform we\'ve recommended, please contact our support team immediately. We\'ll investigate the matter, help coordinate with the platform\'s support team, and potentially update our review if systemic issues are identified. We take user feedback seriously and use it to maintain the quality of our partner network.'
    },
    {
      question: 'How often do you update reviews and platform information?',
      answer: 'We continuously monitor our partner platforms and update reviews when there are significant changes to features, fees, regulations, or user feedback. Platform information including bonuses and terms is updated in real-time. Major reviews are refreshed annually or when substantial changes occur. We also monitor user comments and industry news to identify when updates are needed to keep our information current and accurate.'
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const handleContactSupport = () => {
    navigate('/contact')
  }

  return (
    <>
      <SEO 
        title="Cryptocurrency Investment FAQ - How to Invest in Crypto Safely | Oentex"
        description="Get answers to common cryptocurrency investment questions. Learn how to invest in crypto safely, choose the best crypto exchange, understand trading fees, and discover the best crypto investment strategies for beginners and advanced investors."
        keywords="how to invest in cryptocurrency, crypto investment strategies, cryptocurrency for beginners, bitcoin investment guide, crypto market analysis, cryptocurrency investment tips, crypto portfolio diversification, altcoin investment opportunities, crypto investment platform with lowest fees, best crypto exchange for beginners, automated crypto investment platform, crypto staking rewards, DeFi investment platforms, NFT investment opportunities, cryptocurrency retirement accounts, crypto dollar-cost averaging, institutional crypto investment"
        url="https://oentex.com/faq"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        }}
      />
      <div className="min-h-screen pb-12 text-center">
        {/* Hero Section */}
        <section className="section-py-3xl relative">
          {/* Component-specific accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-secondary/4 to-primary/8 accent-transition" />
          
          <div className="container-page relative z-10 flex flex-col items-center justify-center">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground my-lg text-center">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Frequently Asked Questions
                </span>
              </h1>
              <p className="text-xl text-foreground/70 max-w-3xl mx-auto text-center">
                Find answers to common questions about Oentex, our affiliate partnerships, platform reviews, and how to get the best deals.
              </p>
            </div>
          </div>
        </section>

        <div className="container-page section-py-2xl text-center">
          {/* FAQ List */}
          <div>
            <div className="space-y-6 p-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-content1 rounded-2xl border border-border overflow-hidden text-center p-2">
                  <button
                    className="w-full container-px-xl container-py-lg hover:bg-content2 transition-all duration-300 text-center relative"
                    onClick={() => toggleFAQ(index)}
                  >
                    <h3 className="text-lg font-semibold text-foreground px-4">{faq.question}</h3>
                    <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                      {openIndex === index ? (
                        <Icons.chevronUp className="w-5 h-5 text-primary" />
                      ) : (
                        <Icons.chevronDown className="w-5 h-5 text-foreground/70" />
                      )}
                    </div>
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="container-px-xl container-pb-xl p-4">
                      <p className="text-foreground/70 leading-relaxed text-center">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Disclosure */}
          <div className="flex justify-center my-2xl p-6">
            <div className="bg-gradient-to-r from-warning/10 to-accent/10 rounded-2xl border border-warning/30 p-xl max-w-4xl">
              <div className="flex flex-col items-center p-4">
                <div className="flex justify-center mb-md">
                  <Icons.warning className="w-6 h-6 text-warning" />
                </div>
                <h3 className="text-lg font-semibold text-foreground my-sm">Important Disclosure</h3>
                <p className="text-foreground/70 leading-relaxed my-sm text-center p-2">
                  <strong>Oentex operates as an affiliate marketing platform.</strong> We earn commissions from our partner platforms when you sign up through our referral links. This allows us to offer our platform for free and provide you with exclusive bonuses. We maintain editorial independence and only partner with platforms we believe provide genuine value to our users.
                </p>
                <p className="text-foreground/70 text-sm text-center p-2">
                  All cryptocurrency and trading activities involve significant risk. Past performance does not guarantee future results. Please read all terms and conditions and risk disclosures before using any financial services.
                </p>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-xl lg:p-3xl border border-primary/20 m-6">
            <div className="flex flex-col items-center p-6">
              <h2 className="text-3xl font-bold text-foreground my-md">Still have questions?</h2>
              <p className="text-foreground/70 my-xl max-w-2xl text-center p-4">
                Can't find the answer you're looking for? Our support team is here to help you navigate our platform and find the best deals.
              </p>
              <Button 
                color="primary"
                rightIcon={<Icons.externalLink className="w-4 h-4" />}
                onClick={handleContactSupport}
                className="container-px-xl container-py-sm"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FAQ