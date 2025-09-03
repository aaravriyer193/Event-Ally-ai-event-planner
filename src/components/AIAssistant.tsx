import React, { useState, useRef, useEffect } from 'react';
import { EventAIAssistant } from '../services/aiService';
import { OpenStreetMapService } from '../services/mapService';
import Button from './Button';
import anime from 'animejs';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Loader,
  X,
  Minimize2,
  Maximize2,
  Lightbulb,
  HelpCircle,
  RefreshCw,
  MapPin,
  DollarSign
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIAssistantProps {
  eventId: string;
  eventDetails: any;
  isOpen: boolean;
  onToggle: () => void;
}

export default function AIAssistant({ eventId, eventDetails, isOpen, onToggle }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hi! I'm your AI event planning assistant for "${eventDetails.title}". I can help you with vendor recommendations, timeline adjustments, budget optimization, and answer any questions about your event. What would you like to know?`,
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiAssistant = useRef(new EventAIAssistant(eventId, eventDetails));
  const chatRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && chatRef.current) {
      anime({
        targets: chatRef.current,
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 300,
        easing: 'easeOutCubic'
      });
    }
  }, [isOpen]);

  const searchNearbyVendors = async (category: string) => {
    setLoadingSuggestions(true);
    try {
      const results = await OpenStreetMapService.searchVendors(category, eventDetails.location);
      const vendorNames = results.slice(0, 3).map(place => 
        `${place.name} - ${place.rating.toFixed(1)}⭐ (${place.address})`
      );
      
      const message = `Found ${category} options near ${eventDetails.location}:\n\n${vendorNames.join('\n\n')}`;
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: message,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error searching vendors:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: `I encountered an error searching for ${category} vendors. Please try again or check your API configuration.`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const generateSuggestions = async (category: string) => {
    setLoadingSuggestions(true);
    try {
      const suggestions = await aiAssistant.current.generateSuggestions(
        category, 
        eventDetails.aiPlan?.[category] || []
      );
      
      const message = `Here are some ${category} suggestions for your event:\n\n${suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: message,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: `I encountered an error generating ${category} suggestions. Please try again.`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Check if user is asking for venue/vendor searches
      const lowerInput = inputMessage.toLowerCase();
      if (lowerInput.includes('find venues') || lowerInput.includes('venue near')) {
        await searchNearbyVendors('venues');
        setIsLoading(false);
        return;
      }
      
      if (lowerInput.includes('find catering') || lowerInput.includes('catering near')) {
        await searchNearbyVendors('catering');
        setIsLoading(false);
        return;
      }

      if (lowerInput.includes('find entertainment') || lowerInput.includes('dj near') || lowerInput.includes('music near')) {
        await searchNearbyVendors('entertainment');
        setIsLoading(false);
        return;
      }

      // Enhanced context with current event status
      const eventContext = `
      Current event status:
      - Venues found: ${eventDetails.aiPlan?.venues?.length || 0}
      - Catering options: ${eventDetails.aiPlan?.catering?.length || 0}
      - Timeline items: ${eventDetails.aiPlan?.timeline?.length || 0}
      - Checklist progress: ${eventDetails.aiPlan?.checklist?.filter((item: any) => item.completed).length || 0}/${eventDetails.aiPlan?.checklist?.length || 0}
      - Budget allocated: ${eventDetails.aiPlan?.budgetBreakdown ? Object.values(eventDetails.aiPlan.budgetBreakdown).reduce((a: number, b: number) => a + b, 0) : 0}%
      
      Recent conversation: ${messages.slice(-3).map(m => `${m.sender}: ${m.content}`).join('\n')}
      `;
      
      const aiResponse = await aiAssistant.current.askQuestion(
        inputMessage,
        eventContext
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I encountered an error. Please try your question again.',
        sender: 'ai',
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

  const quickQuestions = [
    "How can I reduce costs?",
    "What's missing from my plan?",
    "Timeline suggestions?",
    "Vendor alternatives?",
    "Weather backup plans?",
    "Guest accommodation tips?"
  ];

  const quickActions = [
    { label: 'Find Venues', action: () => searchNearbyVendors('venues') },
    { label: 'Catering Options', action: () => searchNearbyVendors('catering') },
    { label: 'Entertainment Ideas', action: () => generateSuggestions('entertainment') },
    { label: 'Budget Tips', action: () => handleQuickQuestion('How can I optimize my budget?') }
  ];

  const handleQuickQuestion = async (question: string) => {
    setInputMessage(question);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: question,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const aiResponse = await aiAssistant.current.askQuestion(question);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I encountered an error. Please try your question again.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setInputMessage('');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black p-4 rounded-full shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div ref={chatRef} className={`fixed bottom-6 right-6 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-2 rounded-lg">
            <Bot className="h-5 w-5 text-black" />
          </div>
          <div>
            <h3 className="text-white font-semibold">AI Assistant</h3>
            <p className="text-gray-400 text-xs">Event planning help</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={onToggle}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[400px]">
            {/* AI Status Indicator */}
            <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs font-medium">
                  AI Assistant Active
                </span>
              </div>
              <p className="text-gray-400 text-xs mt-1">
                Using OpenStreetMap for real venue data
              </p>
            </div>

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-orange-500/20' 
                    : 'bg-gray-700/50'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="h-4 w-4 text-orange-400" />
                  ) : (
                    <Bot className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <div className={`flex-1 ${message.sender === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block p-3 rounded-lg max-w-xs ${
                    message.sender === 'user'
                      ? 'bg-orange-500/20 text-orange-100'
                      : 'bg-gray-700/50 text-gray-200'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="bg-gray-700/50 p-2 rounded-lg">
                  <Bot className="h-4 w-4 text-gray-400" />
                </div>
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <Loader className="h-4 w-4 text-gray-400 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <div className="flex items-center space-x-1 mb-3">
                <Lightbulb className="h-3 w-3 text-yellow-400" />
                <p className="text-gray-400 text-xs">Quick questions:</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => handleQuickQuestion(question)}
                    className="px-2 py-1 bg-gray-700/50 hover:bg-orange-500/20 hover:text-orange-300 text-gray-300 text-xs rounded-lg transition-all duration-200 border border-transparent hover:border-orange-500/30"
                    disabled={isLoading}
                  >
                    {question}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center space-x-1 mt-4 mb-2">
                <RefreshCw className="h-3 w-3 text-blue-400" />
                <p className="text-gray-400 text-xs">Quick actions:</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={action.action}
                    className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 hover:text-blue-300 text-blue-400 text-xs rounded-lg transition-all duration-200 border border-blue-500/30 hover:border-blue-500/50"
                    disabled={isLoading}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
              
              {suggestions.length > 0 && (
                <div className="mt-4 p-3 bg-gray-700/30 rounded-lg">
                  <p className="text-gray-300 text-xs font-medium mb-2">AI Suggestions:</p>
                  <div className="space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <p key={index} className="text-gray-400 text-xs">• {suggestion}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-2 mb-2">
              <HelpCircle className="h-3 w-3 text-gray-400" />
              <p className="text-gray-400 text-xs">
                Ask about vendors, timeline, budget, or try: "Find venues near me" or "Suggest entertainment options"
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your event..."
                className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 resize-none"
                rows={1}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="p-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-black rounded-lg transition-all duration-200 shadow-lg shadow-orange-500/25"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}