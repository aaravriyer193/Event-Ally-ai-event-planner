import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles,
  Check,
  ArrowRight,
  Crown,
  Zap,
  Shield
} from 'lucide-react';
import Button from '../components/Button';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for occasional event planners',
    features: [
      '3 events per month',
      'Basic AI planning',
      'Vendor recommendations',
      'Simple timeline creation',
      'Email support'
    ],
    limitations: [
      'No custom branding',
      'Limited vendor filters',
      'Basic export options'
    ],
    cta: 'Get Started',
    popular: false,
    icon: Sparkles
  },
  {
    name: 'Pro',
    price: '$29',
    period: 'per month',
    description: 'For professional event planners',
    features: [
      'Unlimited events',
      'Advanced AI customization',
      'Premium vendor matching',
      'Collaborative planning',
      'Custom checklists & timelines',
      'PDF & Excel exports',
      'Priority support',
      'Analytics & insights'
    ],
    limitations: [],
    cta: 'Start Free Trial',
    popular: true,
    icon: Crown
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: 'per month',
    description: 'For teams and event agencies',
    features: [
      'Everything in Pro',
      'Team collaboration tools',
      'White-label branding',
      'API access',
      'Advanced vendor partnerships',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee'
    ],
    limitations: [],
    cta: 'Contact Sales',
    popular: false,
    icon: Shield
  }
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold text-white">Event Ally</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">
              Choose your{' '}
              <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                perfect plan
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Start free and upgrade as your event planning needs grow. No hidden fees, cancel anytime.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-gray-800/50 border rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl ${
                  plan.popular
                    ? 'border-orange-500/50 shadow-xl shadow-orange-500/20 transform scale-105'
                    : 'border-gray-700 hover:border-orange-500/30'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-orange-500 to-yellow-500 text-black px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <plan.icon className={`h-12 w-12 mx-auto mb-4 ${plan.popular ? 'text-orange-400' : 'text-gray-400'}`} />
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-2">/{plan.period}</span>
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link to="/signup" className="block">
                  <Button 
                    className={`w-full py-3 ${plan.popular ? '' : 'variant-secondary'}`}
                    variant={plan.popular ? 'primary' : 'secondary'}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              {[
                {
                  question: 'Can I change plans at any time?',
                  answer: 'Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect immediately.'
                },
                {
                  question: 'Is there a free trial for Pro plans?',
                  answer: 'Absolutely! All paid plans come with a 14-day free trial. No credit card required to start.'
                },
                {
                  question: 'What happens to my events if I downgrade?',
                  answer: 'Your events remain accessible, but some premium features may be limited based on your new plan.'
                },
                {
                  question: 'Do you offer refunds?',
                  answer: 'We offer a 30-day money-back guarantee for all paid plans. Contact support for assistance.'
                }
              ].map((faq, index) => (
                <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                  <p className="text-gray-400">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-20">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to start planning?</h2>
            <p className="text-gray-400 mb-8">Join thousands of event planners using Event Ally</p>
            <Link to="/signup">
              <Button size="lg" className="px-8 py-4">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}