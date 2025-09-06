import React, { createContext, useContext, useState } from 'react';
import { EventAIAssistant, AIEventPlan } from '../services/aiService';
import { OpenStreetMapService } from '../services/mapService';

export interface Event {
  id: string;
  title: string;
  type: string;
  date: string;
  location: string;
  budget: number;
  guests: number;
  style: string;
  status: 'draft' | 'planned' | 'active';
  aiPlan?: {
    venues: Vendor[];
    catering: Vendor[];
    entertainment: Vendor[];
    decor: Vendor[];
    timeline: TimelineItem[];
    checklist: ChecklistItem[];
    recommendations?: string;
    budgetBreakdown?: {
      venue: number;
      catering: number;
      entertainment: number;
      decor: number;
      photography: number;
      miscellaneous: number;
    };
  };
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  description: string;
  contact: {
    phone: string;
    email: string;
    website: string;
    address?: string;
  };
  specialties?: string[];
  services?: string[];
}

export interface TimelineItem {
  id: string;
  time: string;
  activity: string;
  duration: number;
}

export interface ChecklistItem {
  id: string;
  task: string;
  deadline: string;
  completed: boolean;
  assignee?: string;
  description?: string;
  estimatedTime?: string;
  dependencies?: string[];
  notes?: string;
  priority?: 'high' | 'medium' | 'low';
  category?: string;
}

interface EventContextType {
  events: Event[];
  currentEvent: Event | null;
  createEvent: (eventData: Partial<Event>) => Promise<Event>;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  generateAIPlan: (event: Event) => Promise<Event>;
  setCurrentEvent: (event: Event | null) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);

  const createEvent = async (eventData: Partial<Event>): Promise<Event> => {
    const newEvent: Event = {
      id: Math.random().toString(36),
      title: eventData.title || 'Untitled Event',
      type: eventData.type || 'birthday',
      date: eventData.date || '',
      location: eventData.location || '',
      budget: eventData.budget || 5000,
      guests: eventData.guests || 50,
      style: eventData.style || 'casual',
      status: 'draft',
      createdAt: new Date().toISOString(),
    };

    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, ...updates } : event
    ));
    
    if (currentEvent?.id === id) {
      setCurrentEvent(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const generateAIPlan = async (event: Event): Promise<Event> => {
    try {
      // Initialize AI assistant for this event
      const aiAssistant = new EventAIAssistant(event.id, event);
      
      // Generate comprehensive AI plan
      const aiPlanData: AIEventPlan = await aiAssistant.generateEventPlan();
      
      // Fetch real venue data based on AI recommendations
      const venueResults = await OpenStreetMapService.searchVenues(event.location, event.type, event.budget);
      
      // Fetch real vendor data for different categories
      const [cateringResults, entertainmentResults, photographyResults] = await Promise.all([
        OpenStreetMapService.searchVendors('catering', event.location),
        OpenStreetMapService.searchVendors('entertainment', event.location),
        OpenStreetMapService.searchVendors('photography', event.location)
      ]);

      // Convert real data to our vendor format with AI recommendations
      const venues: Vendor[] = venueResults.slice(0, 3).map((place, index) => {
        const aiVenue = aiPlanData.venues[index];
        return {
          id: place.id,
          name: place.name,
          category: 'venue',
          price: calculateVenuePrice(event.budget, place.priceLevel, aiVenue?.priceRange),
          rating: place.rating,
          image: place.photos[0],
          description: aiVenue?.description || `${place.types.filter(t => !['establishment', 'point_of_interest'].includes(t)).join(', ')} located at ${place.address}`,
          contact: {
            phone: place.phone || '(555) 000-0000',
            email: generateEmail(place.name),
            website: place.website || generateWebsite(place.name)
          }
        };
      });

      const catering: Vendor[] = cateringResults.slice(0, 3).map((place, index) => {
        const aiCatering = aiPlanData.catering[index];
        return {
          id: place.id,
          name: place.name,
          category: 'catering',
          price: aiCatering?.pricePerPerson || Math.round((event.budget * 0.4) / event.guests),
          rating: place.rating,
          image: place.photos[0],
          description: aiCatering?.description || `${aiCatering?.cuisine || 'Full service'} catering with ${aiCatering?.serviceStyle || 'professional'} service style`,
          contact: {
            phone: place.phone || '(555) 000-0000',
            email: generateEmail(place.name, 'orders'),
            website: place.website || generateWebsite(place.name)
          }
        };
      });

      const entertainment: Vendor[] = entertainmentResults.slice(0, 2).map((place, index) => {
        const aiEntertainment = aiPlanData.entertainment[index];
        return {
          id: place.id,
          name: place.name,
          category: 'entertainment',
          price: aiEntertainment?.estimatedCost || Math.round(event.budget * 0.15),
          rating: place.rating,
          image: place.photos[0],
          description: aiEntertainment?.description || `Professional ${aiEntertainment?.type || 'entertainment'} services`,
          contact: {
            phone: place.phone || '(555) 000-0000',
            email: generateEmail(place.name, 'book'),
            website: place.website || generateWebsite(place.name)
          }
        };
      });

      // Convert AI timeline and checklist to our format
      const timeline: TimelineItem[] = aiPlanData.timeline.map((item: any, index: number) => ({
        id: (index + 1).toString(),
        time: item.time,
        activity: item.activity,
        duration: item.duration || 60
      }));

      const checklist: ChecklistItem[] = aiPlanData.checklist.map((item: any, index: number) => ({
        id: (index + 1).toString(),
        task: item.task,
        deadline: item.deadline || calculateDeadline(event.date, index),
        completed: false,
        assignee: undefined
      }));

      const aiPlan = {
        venues,
        catering,
        entertainment,
        decor: aiPlanData.decor || [],
        timeline,
        checklist,
        recommendations: aiPlanData.recommendations,
        budgetBreakdown: aiPlanData.budgetBreakdown
      };

      const updatedEvent = { ...event, aiPlan, status: 'planned' as const };
      updateEvent(event.id, { aiPlan, status: 'planned' });
      
      return updatedEvent;
    } catch (error) {
      console.error('Error generating AI plan:', error);
      
      // Create a basic fallback plan
      const fallbackPlan = await createFallbackPlan(event);
      const updatedEvent = { ...event, aiPlan: fallbackPlan, status: 'planned' as const };
      updateEvent(event.id, { aiPlan: fallbackPlan, status: 'planned' });
      
      return updatedEvent;
    }
  };

  const createFallbackPlan = async (event: Event) => {
    // Try to get real venue data even if AI fails
    const venueResults = await OpenStreetMapService.searchVenues(event.location, event.type, event.budget);
    const cateringResults = await OpenStreetMapService.searchVendors('catering', event.location);
    
    const venues: Vendor[] = venueResults.slice(0, 2).map(place => ({
      id: place.id,
      name: place.name,
      category: 'venue',
      price: Math.round(event.budget * 0.3),
      rating: place.rating,
      description: `Professional event venue - ${place.address}`,
      contact: {
        phone: place.phone || '(555) 123-4567',
        email: generateEmail(place.name),
        website: place.website || generateWebsite(place.name),
        address: place.address
      }
    }));

    const catering: Vendor[] = cateringResults.slice(0, 2).map(place => ({
      id: place.id,
      name: place.name,
      category: 'catering',
      price: Math.round((event.budget * 0.4) / event.guests),
      rating: place.rating,
      description: 'Full-service catering with professional staff',
      contact: {
        phone: place.phone || '(555) 234-5678',
        email: generateEmail(place.name, 'orders'),
        website: place.website || generateWebsite(place.name)
      }
    }));

    return {
      venues,
      catering,
      entertainment: [],
      decor: [],
      timeline: [
        { id: '1', time: '17:00', activity: 'Setup and preparation', duration: 60 },
        { id: '2', time: '18:00', activity: 'Guest arrival and welcome', duration: 30 },
        { id: '3', time: '18:30', activity: 'Main event activities', duration: 120 },
        { id: '4', time: '20:30', activity: 'Closing and cleanup', duration: 60 }
      ],
      checklist: [
        { 
          id: '1', 
          task: 'Confirm venue booking and contract details', 
          deadline: calculateDeadline(event.date, 0), 
          completed: false,
          description: 'Review and sign venue contract, confirm date, time, and all included services',
          estimatedTime: '2-3 hours',
          priority: 'high',
          category: 'Venue'
        },
        { 
          id: '2', 
          task: 'Finalize guest list and collect RSVPs', 
          deadline: calculateDeadline(event.date, 1), 
          completed: false,
          description: 'Create final guest list, send invitations, and track responses',
          estimatedTime: '3-4 hours',
          priority: 'high',
          category: 'Guest Management'
        },
        { 
          id: '3', 
          task: 'Book catering services and finalize menu', 
          deadline: calculateDeadline(event.date, 2), 
          completed: false,
          description: 'Select caterer, finalize menu options, confirm dietary restrictions',
          estimatedTime: '2-3 hours',
          priority: 'high',
          category: 'Catering'
        }
      ],
      recommendations: 'Basic event plan created. Consider adding more vendors and customizing your timeline.',
      budgetBreakdown: {
        venue: 30,
        catering: 40,
        entertainment: 15,
        decor: 10,
        photography: 5,
        miscellaneous: 0
      }
    };
  };

  const calculateVenuePrice = (budget: number, priceLevel: number, aiPriceRange?: string): number => {
    if (aiPriceRange) {
      const match = aiPriceRange.match(/\$?([\d,]+)/);
      if (match) {
        return parseInt(match[1].replace(/,/g, ''));
      }
    }
    return Math.round(budget * (0.25 + priceLevel * 0.05));
  };

  const generateEmail = (name: string, prefix: string = 'info'): string => {
    const domain = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 15);
    return `${prefix}@${domain}.com`;
  };

  const generateWebsite = (name: string): string => {
    const domain = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 15);
    return `https://${domain}.com`;
  };

  const calculateDeadline = (eventDate: string, weeksBeforeEvent: number): string => {
    const date = new Date(eventDate);
    date.setDate(date.getDate() - (weeksBeforeEvent + 1) * 7);
    return date.toISOString().split('T')[0];
  };

  return (
    <EventContext.Provider value={{
      events,
      currentEvent,
      createEvent,
      updateEvent,
      generateAIPlan,
      setCurrentEvent
    }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}