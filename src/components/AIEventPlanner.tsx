import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Languages, Sparkles, Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import { useEvents } from '../contexts/EventContext';
import Button from './Button';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIEventPlannerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
];

export default function AIEventPlanner({ isOpen, onClose }: AIEventPlannerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI Event Planning Assistant. I can help you plan every aspect of your event, from venue selection to vendor coordination. What kind of event are you planning?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { generateAIPlan, addEvent } = useEvents();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Enhanced AI response with event planning capabilities
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are an expert event planning assistant. You help users plan all types of events including weddings, corporate events, parties, conferences, and more. 

              Provide detailed, actionable advice on:
              - Venue selection and booking
              - Catering and menu planning
              - Entertainment and activities
              - Budget management and cost optimization
              - Timeline and logistics coordination
              - Vendor recommendations and coordination
              - Guest management and invitations
              - Decoration and theme planning
              - Risk management and contingency planning

              Always respond in ${SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage)?.name || 'English'}.
              
              Be conversational, helpful, and provide specific recommendations when possible. If the user asks about creating an event, offer to help them set it up in the system.`
            },
            ...messages.map(msg => ({
              role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
              content: msg.content
            })),
            {
              role: 'user',
              content: inputMessage
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Check if the user wants to create an event
      if (inputMessage.toLowerCase().includes('create event') || inputMessage.toLowerCase().includes('plan event')) {
        setTimeout(() => {
          const createEventMessage: Message = {
            id: (Date.now() + 2).toString(),
            type: 'assistant',
            content: 'Would you like me to help you create this event in the system? I can set up the basic details and generate a comprehensive plan for you.',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, createEventMessage]);
        }, 1000);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I apologize, but I encountered an error. Please check your API key configuration and try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCreateEventFromChat = async () => {
    // Extract event details from the conversation
    const conversation = messages.map(m => m.content).join(' ');
    
    try {
      setIsLoading(true);
      
      // Use AI to extract event details from the conversation
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Extract event details from the conversation and return a JSON object with: title, date (YYYY-MM-DD format), location, guests (number), budget (number), and type. If information is missing, use reasonable defaults.'
            },
            {
              role: 'user',
              content: `Extract event details from this conversation: ${conversation}`
            }
          ],
          max_tokens: 500,
          temperature: 0.3
        })
      });

      const data = await response.json();
      const eventDetails = JSON.parse(data.choices[0]?.message?.content || '{}');

      // Create the event
      const newEvent = {
        id: Date.now().toString(),
        title: eventDetails.title || 'AI Planned Event',
        date: eventDetails.date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        location: eventDetails.location || 'TBD',
        guests: eventDetails.guests || 50,
        budget: eventDetails.budget || 5000,
        type: eventDetails.type || 'party',
        status: 'planning' as const,
        createdAt: new Date().toISOString()
      };

      addEvent(newEvent);

      // Generate AI plan
      await generateAIPlan(newEvent.id, newEvent);

      const successMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `Great! I've created your event "${newEvent.title}" and generated a comprehensive plan. You can view it in your dashboard. The event is scheduled for ${newEvent.date} in ${newEvent.location} with ${newEvent.guests} guests and a budget of $${newEvent.budget.toLocaleString()}.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, successMessage]);

    } catch (error) {
      console.error('Error creating event from chat:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: 'I encountered an error while creating the event. Please try using the manual event creation form instead.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-2 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Event Planner</h2>
              <p className="text-gray-400 text-sm">Your intelligent event planning assistant</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Languages className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-300">
                  {SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage)?.flag}
                </span>
              </button>
              
              {showLanguageDropdown && (
                <div className="absolute right-0 top-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 max-h-60 overflow-y-auto">
                  {SUPPORTED_LANGUAGES.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        setSelectedLanguage(language.code);
                        setShowLanguageDropdown(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-700 transition-colors ${
                        selectedLanguage === language.code ? 'bg-gray-700' : ''
                      }`}
                    >
                      <span className="text-lg">{language.flag}</span>
                      <span className="text-sm text-gray-300">{language.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' 
                  ? 'bg-orange-500' 
                  : 'bg-gradient-to-r from-orange-500 to-yellow-500'
              }`}>
                {message.type === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>
              
              <div className={`flex-1 max-w-[80%] ${
                message.type === 'user' ? 'text-right' : ''
              }`}>
                <div className={`inline-block p-4 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-100 border border-gray-700'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 w-8 h-8 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-3 border-t border-gray-700">
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => setInputMessage('Help me plan a wedding for 100 guests')}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-full transition-colors"
            >
              Wedding Planning
            </button>
            <button
              onClick={() => setInputMessage('I need help organizing a corporate event')}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-full transition-colors"
            >
              Corporate Event
            </button>
            <button
              onClick={() => setInputMessage('Plan a birthday party for 50 people')}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-full transition-colors"
            >
              Birthday Party
            </button>
            <button
              onClick={handleCreateEventFromChat}
              className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-full transition-colors"
            >
              Create Event from Chat
            </button>
          </div>
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-700">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Type your message in ${SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage)?.name}...`}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                rows={2}
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              icon={Send}
              className="self-end"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}