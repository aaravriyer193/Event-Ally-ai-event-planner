import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../contexts/EventContext';
import Layout from '../components/Layout';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedCard from '../components/AnimatedCard';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users,
  Sparkles,
  Loader
} from 'lucide-react';

const eventTypes = [
  { id: 'wedding', label: 'Wedding', icon: '💍' },
  { id: 'birthday', label: 'Birthday Party', icon: '🎂' },
  { id: 'corporate', label: 'Corporate Event', icon: '🏢' },
  { id: 'anniversary', label: 'Anniversary', icon: '💖' },
  { id: 'graduation', label: 'Graduation', icon: '🎓' },
  { id: 'baby-shower', label: 'Baby Shower', icon: '👶' },
  { id: 'holiday', label: 'Holiday Party', icon: '🎄' },
  { id: 'fundraiser', label: 'Fundraiser', icon: '🎯' }
];

const styles = [
  { id: 'elegant', label: 'Elegant & Formal', description: 'Sophisticated, black-tie affair' },
  { id: 'casual', label: 'Casual & Relaxed', description: 'Laid-back, comfortable atmosphere' },
  { id: 'modern', label: 'Modern & Trendy', description: 'Contemporary design and style' },
  { id: 'traditional', label: 'Traditional & Classic', description: 'Timeless, conventional approach' },
  { id: 'rustic', label: 'Rustic & Natural', description: 'Outdoor, country-inspired theme' },
  { id: 'glamorous', label: 'Glamorous & Luxe', description: 'High-end, luxury experience' }
];

export default function EventCreation() {
  const [currentStep, setCurrentStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    date: '',
    location: '',
    budget: 5000,
    guests: 50,
    style: ''
  });

  const { createEvent, generateAIPlan, setCurrentEvent } = useEvents();
  const navigate = useNavigate();

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setGenerating(true);
    
    try {
      const event = await createEvent(formData);
      const eventWithPlan = await generateAIPlan(event);
      setCurrentEvent(eventWithPlan);
      navigate(`/event/${eventWithPlan.id}`);
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setGenerating(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.title && formData.type && formData.date && formData.location;
      case 2: return formData.budget > 0 && formData.guests > 0;
      case 3: return formData.style;
      case 4: return true;
      default: return false;
    }
  };

  return (
    <Layout showSidebar>
      <div className="max-w-4xl mx-auto p-6 lg:p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-white">Create New Event</h1>
            <span className="text-gray-400">Step {currentStep} of {totalSteps}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
        <AnimatedCard animation="scaleIn" delay={200}>
          {/* Step 1: Event Basics */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Event Basics</h2>
                <p className="text-gray-400">Let's start with the fundamentals</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Event Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                  placeholder="Sarah's 30th Birthday Celebration"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Event Type</label>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {eventTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                      className={`p-4 border rounded-lg text-left transition-all duration-200 ${
                        formData.type === type.id
                          ? 'border-orange-500 bg-orange-500/20 text-orange-400'
                          : 'border-gray-600 bg-gray-700/30 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <div className="text-sm font-medium">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Event Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                      placeholder="New York, NY"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Budget & Size */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Budget & Guest Count</h2>
                <p className="text-gray-400">Help us understand the scale of your event</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Budget (${formData.budget.toLocaleString()})
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="range"
                    min="1000"
                    max="50000"
                    step="500"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
                    className="w-full mt-4"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>$1,000</span>
                    <span>$50,000+</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Expected Guests ({formData.guests})
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    value={formData.guests}
                    onChange={(e) => setFormData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                    className="w-full mt-4"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>10</span>
                    <span>500+</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-2">Budget Breakdown Estimate</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Venue (30%)</span>
                    <span>${(formData.budget * 0.3).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Catering (40%)</span>
                    <span>${(formData.budget * 0.4).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Entertainment (15%)</span>
                    <span>${(formData.budget * 0.15).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Decor & Other (15%)</span>
                    <span>${(formData.budget * 0.15).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Style & Preferences */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Style & Vibe</h2>
                <p className="text-gray-400">Choose the atmosphere you want to create</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {styles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setFormData(prev => ({ ...prev, style: style.id }))}
                    className={`p-6 border rounded-xl text-left transition-all duration-200 ${
                      formData.style === style.id
                        ? 'border-orange-500 bg-orange-500/20'
                        : 'border-gray-600 bg-gray-700/30 hover:border-gray-500'
                    }`}
                  >
                    <h3 className={`font-semibold mb-2 ${
                      formData.style === style.id ? 'text-orange-400' : 'text-white'
                    }`}>
                      {style.label}
                    </h3>
                    <p className="text-gray-400 text-sm">{style.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: AI Generation */}
          {currentStep === 4 && (
            <div className="text-center space-y-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Review & Generate</h2>
                <p className="text-gray-400">Ready to create your AI-powered event plan?</p>
              </div>

              {/* Event Summary */}
              <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-6 text-left">
                <h3 className="text-white font-semibold mb-4">Event Summary</h3>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-300">
                    <Calendar className="h-4 w-4 mr-3 text-orange-400" />
                    <span className="font-medium mr-2">Title:</span>
                    {formData.title}
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Calendar className="h-4 w-4 mr-3 text-orange-400" />
                    <span className="font-medium mr-2">Type:</span>
                    {eventTypes.find(t => t.id === formData.type)?.label}
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Calendar className="h-4 w-4 mr-3 text-orange-400" />
                    <span className="font-medium mr-2">Date:</span>
                    {new Date(formData.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-gray-300">
                    <MapPin className="h-4 w-4 mr-3 text-orange-400" />
                    <span className="font-medium mr-2">Location:</span>
                    {formData.location}
                  </div>
                  <div className="flex items-center text-gray-300">
                    <DollarSign className="h-4 w-4 mr-3 text-orange-400" />
                    <span className="font-medium mr-2">Budget:</span>
                    ${formData.budget.toLocaleString()}
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Users className="h-4 w-4 mr-3 text-orange-400" />
                    <span className="font-medium mr-2">Guests:</span>
                    {formData.guests}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={generating}
                size="lg"
                className="px-8 py-4"
                icon={generating ? Loader : Sparkles}
                animation="glow"
              >
                {generating ? 'Generating AI Plan...' : 'Generate AI Event Plan'}
              </Button>
            </div>
          )}
        </AnimatedCard>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <AnimatedButton
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1}
              icon={ArrowLeft}
              animation="bounce"
            >
              Back
            </AnimatedButton>

            {currentStep < totalSteps ? (
              <AnimatedButton
                onClick={handleNext}
                disabled={!canProceed()}
                icon={ArrowRight}
                animation="pulse"
              >
                Next
              </AnimatedButton>
            ) : null}
          </div>
        </div>
      </div>
    </Layout>
  );
}