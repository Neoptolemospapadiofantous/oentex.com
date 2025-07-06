import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'What is CryptoVault?',
      answer: 'CryptoVault is a comprehensive platform that connects you with the best cryptocurrency and stock trading platforms. We provide exclusive deals, bonuses, and educational resources to help you make informed trading decisions.'
    },
    {
      question: 'How do I get started with trading?',
      answer: 'Getting started is easy! Browse our exclusive deals, choose a platform that suits your needs, and sign up through our links to get special bonuses. We recommend starting with a small amount and gradually increasing your investment as you gain experience.'
    },
    {
      question: 'Are the trading platforms safe?',
      answer: 'Yes, all platforms we recommend are regulated and have strong security measures in place. They use industry-standard encryption, cold storage for funds, and are compliant with financial regulations in their respective jurisdictions.'
    },
    {
      question: 'What kind of bonuses can I get?',
      answer: 'Our exclusive deals include welcome bonuses, trading credits, reduced fees, and special promotions. Bonuses vary by platform and can range from $10 to $100 or more, depending on your deposit amount and trading activity.'
    },
    {
      question: 'Do I need experience to start trading?',
      answer: 'No prior experience is required! Many of our recommended platforms offer educational resources, demo accounts, and user-friendly interfaces perfect for beginners. We also provide guides and tips to help you get started.'
    },
    {
      question: 'How does CryptoVault make money?',
      answer: 'CryptoVault earns commissions from our partner platforms when you sign up through our referral links. This allows us to offer you exclusive bonuses and maintain our platform at no cost to you.'
    },
    {
      question: 'Can I trade both crypto and stocks?',
      answer: 'Yes! Many of our partner platforms offer both cryptocurrency and stock trading. Some platforms specialize in one or the other, so you can choose based on your investment preferences.'
    },
    {
      question: 'What are the risks of trading?',
      answer: 'Trading involves significant risk and you can lose money. Cryptocurrency and stock prices are volatile and can change rapidly. Never invest more than you can afford to lose, and always do your own research before making investment decisions.'
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </h1>
          <p className="text-xl text-textSecondary">
            Find answers to common questions about trading, our platform, and getting started.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-surface/50 rounded-2xl border border-border overflow-hidden">
              <button
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-surface/70 transition-all duration-300"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg font-semibold text-text pr-4">{faq.question}</h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-primary" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-textSecondary" />
                  )}
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-6 pb-6">
                  <p className="text-textSecondary leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center p-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl border border-primary/20">
          <h2 className="text-2xl font-bold text-text mb-4">Still have questions?</h2>
          <p className="text-textSecondary mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <button className="bg-gradient-to-r from-primary to-secondary px-8 py-3 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  )
}

export default FAQ
