import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../contexts/EventContext';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import AnimatedButton from '../components/AnimatedButton';
import AIEventPlanner from '../components/AIEventPlanner';
import AnimatedCard from '../components/AnimatedCard';
import AIAssistant from '../components/AIAssistant';
import APISetupGuide from '../components/APISetupGuide';
import { 
  Plus, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users,
  Clock,
  Sparkles,
  MoreVertical,
  Settings as SettingsIcon
} from 'lucide-react';

export default function Dashboard() {
  const { events } = useEvents();
  const { user } = useAuth();
  const [showAIPlanner, setShowAIPlanner] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showAPIGuide, setShowAPIGuide] = useState(false);

  const hasOpenAI = !!import.meta.env.VITE_OPENAI_API_KEY;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'planned': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'active': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Layout showSidebar>
      <div className="p-6 lg:p-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-400">
            {events.length === 0 
              ? "Ready to plan your first event?" 
              : `You have ${events.length} event${events.length !== 1 ? 's' : ''} in progress`
            }
          </p>
          
          {/* API Setup Notice */}
          {!hasOpenAI && (
            <div className="mt-4 bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <SettingsIcon className="h-5 w-5 text-orange-400" />
                  <div>
                    <p className="text-orange-400 font-medium">Setup Required</p>
                    <p className="text-gray-300 text-sm">Configure OpenAI API key to unlock AI features</p>
                  </div>
                </div>
                <AnimatedButton variant="secondary" size="sm" onClick={() => setShowAPIGuide(true)} animation="pulse">
                  Setup API
                </AnimatedButton>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link to="/create-event">
            <AnimatedCard className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 cursor-pointer group" delay={0}>
              <div className="flex items-center justify-between mb-4">
                <Plus className="h-8 w-8 text-orange-400 group-hover:scale-110 transition-transform duration-200" />
                <Sparkles className="h-5 w-5 text-yellow-400 opacity-60" />
              </div>
              <h3 className="text-white font-semibold mb-1">New Event</h3>
              <p className="text-gray-400 text-sm">Start planning with AI</p>
            </AnimatedCard>
          </Link>

          <Link to="/vendors">
            <AnimatedCard className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 cursor-pointer group" delay={100}>
              <Users className="h-8 w-8 text-gray-400 group-hover:text-orange-400 mb-4 transition-colors duration-200" />
              <h3 className="text-white font-semibold mb-1">Browse Vendors</h3>
              <p className="text-gray-400 text-sm">Find perfect partners</p>
            </AnimatedCard>
          </Link>

          <AnimatedCard className="bg-gray-800/50 border border-gray-700 rounded-xl p-6" delay={200}>
            <Calendar className="h-8 w-8 text-gray-400 mb-4" />
            <h3 className="text-white font-semibold mb-1">Upcoming</h3>
            <p className="text-gray-400 text-sm">
              {events.filter(e => new Date(e.date) > new Date()).length} events
            </p>
          </AnimatedCard>

          <AnimatedCard className="bg-gray-800/50 border border-gray-700 rounded-xl p-6" delay={300}>
            <DollarSign className="h-8 w-8 text-gray-400 mb-4" />
            <h3 className="text-white font-semibold mb-1">Total Budget</h3>
            <p className="text-gray-400 text-sm">
              ${events.reduce((sum, e) => sum + e.budget, 0).toLocaleString()}
            </p>
          </AnimatedCard>
        </div>

        {/* Events List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Your Events</h2>
            <Link to="/create-event">
              <AnimatedButton icon={Plus} animation="bounce">Create Event</AnimatedButton>
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-12 text-center">
              <Sparkles className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Events Yet</h3>
              <p className="text-gray-400 mb-6">Create your first event and let AI do the heavy lifting</p>
              <Link to="/create-event">
                <AnimatedButton animation="glow">Plan Your First Event</AnimatedButton>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {events.map((event) => (
                <AnimatedCard
                  key={event.id}
                  delay={events.indexOf(event) * 100}
                  animation="fadeInLeft"
                >
                  <Link
                    to={`/event/${event.id}`}
                    className="block bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-white group-hover:text-orange-400 transition-colors">
                          {event.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center text-gray-400">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(event.date)}
                        </div>
                        <div className="flex items-center text-gray-400">
                          <MapPin className="h-4 w-4 mr-2" />
                          {event.location}
                        </div>
                        <div className="flex items-center text-gray-400">
                          <DollarSign className="h-4 w-4 mr-2" />
                          ${event.budget.toLocaleString()}
                        </div>
                        <div className="flex items-center text-gray-400">
                          <Users className="h-4 w-4 mr-2" />
                          {event.guests} guests
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {event.aiPlan && (
                        <div className="flex items-center text-green-400 text-sm">
                          <Sparkles className="h-4 w-4 mr-1" />
                          AI Plan Ready
                        </div>
                      )}
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedEvent(event);
                          setShowAIAssistant(true);
                        }}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                    </div>
                  </Link>
                </AnimatedCard>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="space-y-4">
              {events.slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-center space-x-4">
                  <div className="bg-orange-500/20 p-2 rounded-lg">
                    <Clock className="h-4 w-4 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white">Created event plan for <span className="font-medium">{event.title}</span></p>
                    <p className="text-gray-400 text-sm">{formatDate(event.createdAt)}</p>
                  </div>
                </div>
              ))}
              
              {events.length === 0 && (
                <p className="text-gray-400 text-center py-4">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      {selectedEvent && (
        <AIAssistant
          eventId={selectedEvent.id}
          eventDetails={selectedEvent}
          isOpen={showAIAssistant}
          onToggle={() => setShowAIAssistant(!showAIAssistant)}
        />
      )}

      {/* API Setup Guide */}
      <APISetupGuide 
        isOpen={showAPIGuide}
        onClose={() => setShowAPIGuide(false)}
      />
    </Layout>
  );
}