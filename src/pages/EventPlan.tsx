import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../contexts/EventContext';
import Layout from '../components/Layout';
import Button from '../components/Button';
import AIAssistant from '../components/AIAssistant';
import AIEventPlanner from '../components/AIEventPlanner';
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  Circle,
  Star,
  Phone,
  Mail,
  Globe,
  Download,
  Share2,
  Edit,
  Plus
} from 'lucide-react';

export default function EventPlan() {
  const { id } = useParams<{ id: string }>();
  const { events, updateEvent, setCurrentEvent } = useEvents();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showAIPlanner, setShowAIPlanner] = useState(false);
  
  const event = events.find(e => e.id === id);

  useEffect(() => {
    if (event) {
      setCurrentEvent(event);
    }
  }, [event, setCurrentEvent]);

  if (!event) {
    return (
      <Layout showSidebar>
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Event Not Found</h1>
          <Button onClick={() => navigate('/dashboard')} icon={ArrowLeft}>
            Back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  const toggleChecklistItem = (itemId: string) => {
    if (event.aiPlan?.checklist) {
      const updatedChecklist = event.aiPlan.checklist.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );
      
      updateEvent(event.id, {
        aiPlan: {
          ...event.aiPlan,
          checklist: updatedChecklist
        }
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'vendors', label: 'Vendors' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'checklist', label: 'Checklist' },
    { id: 'budget', label: 'Budget' }
  ];

  return (
    <Layout showSidebar>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              icon={ArrowLeft}
            >
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">{event.title}</h1>
              <p className="text-gray-400">{formatDate(event.date)} • {event.location}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="secondary" icon={Share2}>Share</Button>
            <Button variant="secondary" icon={Download}>Export PDF</Button>
            <Button variant="secondary" onClick={() => setShowAIAssistant(true)}>
              AI Assistant
            </Button>
            <Button icon={Edit}>Edit Event</Button>
          </div>
        </div>

        {/* Event Summary Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Budget</p>
                <p className="text-2xl font-bold text-white">${event.budget.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-400" />
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Guests</p>
                <p className="text-2xl font-bold text-white">{event.guests}</p>
              </div>
              <Users className="h-8 w-8 text-orange-400" />
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Days Until</p>
                <p className="text-2xl font-bold text-white">
                  {Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-400" />
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Tasks Done</p>
                <p className="text-2xl font-bold text-white">
                  {event.aiPlan?.checklist?.filter(item => item.completed).length || 0}/
                  {event.aiPlan?.checklist?.length || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-700">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-400'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Event Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-300">
                      <Calendar className="h-5 w-5 mr-3 text-orange-400" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <MapPin className="h-5 w-5 mr-3 text-orange-400" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Users className="h-5 w-5 mr-3 text-orange-400" />
                      <span>{event.guests} guests</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <DollarSign className="h-5 w-5 mr-3 text-orange-400" />
                      <span>${event.budget.toLocaleString()} budget</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Next Steps</h3>
                  <div className="space-y-2">
                    {event.aiPlan?.checklist?.filter(item => !item.completed).slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                        <Circle className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">{item.task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">AI Recommendations</h3>
                <div className="space-y-4">
                  {event.aiPlan?.venues?.slice(0, 2).map((venue) => (
                    <div key={venue.id} className="border border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">{venue.name}</h4>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-gray-300 text-sm">{venue.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{venue.description}</p>
                      <p className="text-orange-400 font-semibold">${venue.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Vendors Tab */}
          {activeTab === 'vendors' && (
            <div className="space-y-8">
              {['venues', 'catering', 'entertainment', 'decor'].map((category) => (
                <div key={category} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white capitalize">{category}</h3>
                    <Button variant="ghost" size="sm" icon={Plus}>Add Vendor</Button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(event.aiPlan?.[category as keyof typeof event.aiPlan] as any[])?.map((vendor: any) => (
                      <div key={vendor.id} className="border border-gray-600 rounded-lg p-4 hover:border-orange-500/30 transition-all duration-200">
                        <img 
                          src={vendor.image} 
                          alt={vendor.name}
                          className="w-full h-32 object-cover rounded-lg mb-4"
                        />
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">{vendor.name}</h4>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-gray-300 text-sm">{vendor.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{vendor.description}</p>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-orange-400 font-semibold">${vendor.price.toLocaleString()}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors">
                            <Phone className="h-3 w-3" />
                            <span>Call</span>
                          </button>
                          <button className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors">
                            <Mail className="h-3 w-3" />
                            <span>Email</span>
                          </button>
                          <button className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors">
                            <Globe className="h-3 w-3" />
                            <span>Visit</span>
                          </button>
                        </div>
                      </div>
                    )) || (
                      <div className="col-span-full text-center py-8">
                        <p className="text-gray-400">No vendors in this category yet</p>
                        <Button variant="ghost" size="sm" className="mt-2" icon={Plus}>
                          Add {category} vendor
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Event Timeline</h3>
                <Button variant="ghost" size="sm" icon={Edit}>Edit Timeline</Button>
              </div>
              
              <div className="space-y-4">
                {event.aiPlan?.timeline?.map((item, index) => (
                  <div key={item.id} className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div className="bg-orange-500 rounded-full w-3 h-3"></div>
                      {index < (event.aiPlan?.timeline?.length || 0) - 1 && (
                        <div className="w-px h-16 bg-gray-600 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-orange-400 font-semibold">{formatTime(item.time)}</span>
                        <span className="text-gray-400 text-sm">{item.duration} min</span>
                      </div>
                      <h4 className="text-white font-medium">{item.activity}</h4>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No timeline created yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Checklist Tab */}
          {activeTab === 'checklist' && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Event Checklist</h3>
                <Button variant="ghost" size="sm" icon={Plus}>Add Task</Button>
              </div>
              
              <div className="space-y-3">
                {event.aiPlan?.checklist?.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <button
                      onClick={() => toggleChecklistItem(item.id)}
                      className="flex-shrink-0"
                    >
                      {item.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                      )}
                    </button>
                    <div className="flex-1">
                      <p className={`font-medium ${item.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                        {item.task}
                      </p>
                      <p className="text-gray-400 text-sm">Due: {formatDate(item.deadline)}</p>
                       {item.priority && (
                         <span className={`px-2 py-1 text-xs rounded-full ${
                           item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                           item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                           'bg-green-500/20 text-green-400'
                         }`}>
                           {item.priority}
                         </span>
                       )}
                       {item.description && (
                         <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                       )}
                       <div className="flex items-center justify-between text-xs text-gray-500">
                         {item.estimatedTime && (
                           <span>Est. time: {item.estimatedTime}</span>
                         )}
                       </div>
                       {item.dependencies && item.dependencies.length > 0 && (
                         <p className="text-gray-500 text-xs mt-1">
                           Depends on: {item.dependencies.join(', ')}
                         </p>
                       )}
                       {item.notes && (
                         <p className="text-gray-400 text-xs mt-1 italic">Note: {item.notes}</p>
                       )}
                     </div>
                     <div className="flex flex-col items-end space-y-1">
                       {item.category && (
                         <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded-full">
                           {item.category}
                         </span>
                       )}
                       {item.assignee && (
                         <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded-full">
                           {item.assignee}
                         </span>
                       )}
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No tasks created yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Budget Tab */}
          {activeTab === 'budget' && (
            <div className="space-y-6">
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-6">Budget Breakdown</h3>
                
                <div className="space-y-4">
                  {[
                    { category: 'Venue', allocated: event.budget * 0.3, spent: 0 },
                    { category: 'Catering', allocated: event.budget * 0.4, spent: 0 },
                    { category: 'Entertainment', allocated: event.budget * 0.15, spent: 0 },
                    { category: 'Decor & Other', allocated: event.budget * 0.15, spent: 0 }
                  ].map((item) => (
                    <div key={item.category} className="border border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">{item.category}</h4>
                        <span className="text-gray-400">${item.spent.toLocaleString()} / ${item.allocated.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(item.spent / item.allocated) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-600">
                  <div className="flex justify-between text-lg">
                    <span className="text-white font-semibold">Total Budget:</span>
                    <span className="text-orange-400 font-bold">${event.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>Remaining:</span>
                    <span>${event.budget.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Assistant */}
      {event && (
        <AIAssistant
          eventId={event.id}
          eventDetails={event}
          isOpen={showAIAssistant}
          onToggle={() => setShowAIAssistant(!showAIAssistant)}
        />
      )}

      {/* AI Event Planner Chat */}
      <AIEventPlanner
        isOpen={showAIPlanner}
        onClose={() => setShowAIPlanner(false)}
      />
    </Layout>
  );
}