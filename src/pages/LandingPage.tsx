import React from 'react';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as anime from 'animejs';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';
import { 
  Sparkles, 
  Calendar, 
  Users, 
  Clock, 
  Star,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Hero section animations
    if (titleRef.current) {
      anime({
        targets: titleRef.current,
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1000,
        easing: 'easeOutCubic'
      });
    }

    // Floating animation for sparkles
    anime({
      targets: '.floating-sparkle',
      translateY: [-10, 10],
      duration: 2000,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine'
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold text-white">Event Ally</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/signup">
                <AnimatedButton size="sm" animation="glow">Get Started</AnimatedButton>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-yellow-500/10"></div>
        <div className="absolute top-20 left-20 floating-sparkle">
          <Sparkles className="h-6 w-6 text-orange-400/30" />
        </div>
        <div className="absolute top-40 right-32 floating-sparkle">
          <Sparkles className="h-4 w-4 text-yellow-400/40" />
        </div>
        <div className="absolute bottom-32 left-1/4 floating-sparkle">
          <Sparkles className="h-5 w-5 text-orange-300/20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 ref={titleRef} className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Plan your event in{' '}
            <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              minutes
            </span>
            , not weeks
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Let our AI create the perfect event plan tailored to your budget, style, and preferences. 
            From intimate gatherings to grand celebrations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup">
              <AnimatedButton size="lg" className="px-8 py-4 text-lg" animation="glow">
                Start Planning Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </AnimatedButton>
            </Link>
            <AnimatedButton variant="ghost" size="lg" className="px-8 py-4 text-lg" animation="pulse">
              Watch Demo
            </AnimatedButton>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How Event Ally Works</h2>
            <p className="text-xl text-gray-300">Three simple steps to your perfect event</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedCard className="text-center group" delay={0} animation="fadeInUp">
              <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-orange-500/30 transition-all duration-300">
                <Calendar className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">1. Enter Your Details</h3>
              <p className="text-gray-400">Tell us about your event type, budget, guest count, and style preferences</p>
            </AnimatedCard>
            
            <AnimatedCard className="text-center group" delay={200} animation="fadeInUp">
              <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-orange-500/30 transition-all duration-300">
                <Sparkles className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">2. AI Creates Your Plan</h3>
              <p className="text-gray-400">Our AI analyzes your needs and generates a comprehensive event plan with vendor recommendations</p>
            </AnimatedCard>
            
            <AnimatedCard className="text-center group" delay={400} animation="fadeInUp">
              <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-orange-500/30 transition-all duration-300">
                <Users className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">3. Connect & Execute</h3>
              <p className="text-gray-400">Review, customize, and connect directly with recommended vendors to bring your event to life</p>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-300">Powerful features to make event planning effortless</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Clock,
                title: 'Save Time',
                description: 'AI generates plans in seconds, not hours of research'
              },
              {
                icon: Star,
                title: 'Curated Vendors',
                description: 'Only verified, high-quality service providers'
              },
              {
                icon: CheckCircle,
                title: 'Smart Checklists',
                description: 'Never miss important deadlines or tasks'
              },
              {
                icon: Calendar,
                title: 'Timeline Planning',
                description: 'Detailed schedules for seamless event execution'
              }
            ].map((feature, index) => (
              <AnimatedCard 
                key={index} 
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10"
                delay={index * 150}
                animation="scaleIn"
              >
                <feature.icon className="h-10 w-10 text-orange-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">What Our Users Say</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Wedding Planner',
                quote: 'Event Ally cut my planning time by 80%. The AI recommendations are spot-on!'
              },
              {
                name: 'Mike Chen',
                role: 'Corporate Event Manager',
                quote: 'Finally, a tool that understands both budget constraints and quality requirements.'
              },
              {
                name: 'Emily Rodriguez',
                role: 'Birthday Party Host',
                quote: 'Planned my daughter\'s sweet 16 in under an hour. Amazing experience!'
              }
            ].map((testimonial, index) => (
              <AnimatedCard 
                key={index} 
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
                delay={index * 200}
                animation="fadeInLeft"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">"{testimonial.quote}"</p>
                <div>
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Plan Your Perfect Event?</h2>
          <p className="text-xl text-gray-300 mb-8">Join thousands of satisfied event planners</p>
          <Link to="/signup">
            <AnimatedButton size="lg" className="px-8 py-4 text-lg" animation="glow">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </AnimatedButton>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="h-6 w-6 text-orange-500" />
                <span className="text-lg font-bold text-white">Event Ally</span>
              </div>
              <p className="text-gray-400">AI-powered event planning for the modern world.</p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">&copy; 2025 Event Ally. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}