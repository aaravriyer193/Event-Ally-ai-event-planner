import React, { createContext, useContext, useState } from 'react';

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
  };
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  contact: {
    phone: string;
    email: string;
    website: string;
  };
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
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockVenues: Vendor[] = [
      {
        id: '1',
        name: 'Grand Ballroom',
        category: 'venue',
        price: event.budget * 0.3,
        rating: 4.8,
        image: 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg',
        description: 'Elegant ballroom perfect for formal events',
        contact: { phone: '(555) 123-4567', email: 'info@grandballroom.com', website: 'grandballroom.com' }
      },
      {
        id: '2',
        name: 'Garden Pavilion',
        category: 'venue',
        price: event.budget * 0.25,
        rating: 4.6,
        image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
        description: 'Beautiful outdoor venue with garden views',
        contact: { phone: '(555) 234-5678', email: 'hello@gardenpavilion.com', website: 'gardenpavilion.com' }
      }
    ];

    const mockCatering: Vendor[] = [
      {
        id: '3',
        name: 'Gourmet Delights',
        category: 'catering',
        price: event.budget * 0.4,
        rating: 4.9,
        image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
        description: 'Premium catering with international cuisine',
        contact: { phone: '(555) 345-6789', email: 'orders@gourmetdelights.com', website: 'gourmetdelights.com' }
      }
    ];

    const mockTimeline: TimelineItem[] = [
      { id: '1', time: '17:00', activity: 'Guest arrival and cocktails', duration: 60 },
      { id: '2', time: '18:00', activity: 'Ceremony begins', duration: 30 },
      { id: '3', time: '18:30', activity: 'Reception and dinner', duration: 120 },
      { id: '4', time: '20:30', activity: 'Entertainment and dancing', duration: 150 }
    ];

    const mockChecklist: ChecklistItem[] = [
      { id: '1', task: 'Confirm venue booking', deadline: '2025-02-01', completed: false },
      { id: '2', task: 'Finalize guest list', deadline: '2025-02-15', completed: false },
      { id: '3', task: 'Send invitations', deadline: '2025-03-01', completed: false },
      { id: '4', task: 'Confirm catering menu', deadline: '2025-03-15', completed: false }
    ];

    const aiPlan = {
      venues: mockVenues,
      catering: mockCatering,
      entertainment: [],
      decor: [],
      timeline: mockTimeline,
      checklist: mockChecklist
    };

    const updatedEvent = { ...event, aiPlan, status: 'planned' as const };
    updateEvent(event.id, { aiPlan, status: 'planned' });
    
    return updatedEvent;
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