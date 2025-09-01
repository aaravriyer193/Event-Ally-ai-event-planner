import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface AIEventPlan {
  venues: VenueRecommendation[];
  catering: CateringRecommendation[];
  entertainment: EntertainmentRecommendation[];
  decor: DecorRecommendation[];
  timeline: TimelineItem[];
  checklist: ChecklistItem[];
  recommendations: string;
  budgetBreakdown: BudgetBreakdown;
}

export interface VenueRecommendation {
  name: string;
  type: string;
  capacity: number;
  priceRange: string;
  features: string[];
  description: string;
  searchTerms: string[];
}

export interface CateringRecommendation {
  name: string;
  cuisine: string;
  serviceStyle: string;
  pricePerPerson: number;
  menuItems: string[];
  description: string;
  searchTerms: string[];
}

export interface EntertainmentRecommendation {
  type: string;
  description: string;
  estimatedCost: number;
  duration: string;
  searchTerms: string[];
}

export interface DecorRecommendation {
  theme: string;
  items: string[];
  estimatedCost: number;
  colorScheme: string[];
  description: string;
}

export interface TimelineItem {
  time: string;
  activity: string;
  duration: number;
  notes: string;
  responsible: string;
}

export interface ChecklistItem {
  task: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  description: string;
}

export interface BudgetBreakdown {
  venue: number;
  catering: number;
  entertainment: number;
  decor: number;
  photography: number;
  miscellaneous: number;
}

export class EventAIAssistant {
  private eventId: string;
  private eventDetails: any;

  constructor(eventId: string, eventDetails: any) {
    this.eventId = eventId;
    this.eventDetails = eventDetails;
  }

  async generateEventPlan(): Promise<AIEventPlan> {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your environment variables.');
    }

    const prompt = this.buildEventPlanPrompt();

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert event planner with 20+ years of experience planning events of all types and budgets. You have deep knowledge of:
            - Venue selection and capacity planning
            - Catering options and dietary requirements
            - Entertainment booking and coordination
            - Event timeline management
            - Budget optimization
            - Vendor coordination
            - Risk management and contingency planning
            
            Always provide specific, actionable recommendations with realistic pricing based on current market rates. Include search terms that would help find actual vendors in the specified location.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from AI');

      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Invalid JSON response from AI');

      const aiPlan = JSON.parse(jsonMatch[0]);
      return this.validateAndFormatPlan(aiPlan);
    } catch (error) {
      console.error('AI Plan Generation Error:', error);
      throw new Error(`Failed to generate AI plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async askQuestion(question: string, context?: string): Promise<string> {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      return 'AI assistant is not available. Please configure your OpenAI API key.';
    }

    const prompt = `
    You are an AI assistant helping with event planning for: ${this.eventDetails.title}
    
    Event Details:
    - Type: ${this.eventDetails.type}
    - Date: ${this.eventDetails.date}
    - Location: ${this.eventDetails.location}
    - Budget: $${this.eventDetails.budget?.toLocaleString()}
    - Guests: ${this.eventDetails.guests}
    - Style: ${this.eventDetails.style}
    
    ${context ? `Additional Context: ${context}` : ''}
    
    User Question: ${question}
    
    Provide a helpful, specific answer related to their event planning needs. Be practical and actionable.
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful event planning assistant with expertise in all aspects of event coordination. Provide practical, actionable advice that considers budget constraints, timeline, and logistics. Be concise but thorough. Always consider the user's specific event details when answering."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      });

      return response.choices[0]?.message?.content || 'I apologize, but I could not generate a response at this time. Please try rephrasing your question.';
    } catch (error) {
      console.error('AI Assistant Error:', error);
      return 'I apologize, but I encountered an error processing your request. Please check your API configuration and try again.';
    }
  }

  async generateSuggestions(category: string, currentOptions?: any[]): Promise<string[]> {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      return ['AI suggestions unavailable - please configure OpenAI API key'];
    }

    const prompt = `
    Generate 5 specific, realistic suggestions for ${category} for this event:
    - Type: ${this.eventDetails.type}
    - Budget: $${this.eventDetails.budget?.toLocaleString()}
    - Guests: ${this.eventDetails.guests}
    - Style: ${this.eventDetails.style}
    - Location: ${this.eventDetails.location}
    - Date: ${this.eventDetails.date}
    
    ${currentOptions ? `Current options: ${currentOptions.map(opt => opt.name).join(', ')}` : ''}
    
    Provide realistic, actionable suggestions with specific names or ideas that would be available in ${this.eventDetails.location}. Include estimated costs where relevant.
    
    Format as a simple list, one suggestion per line.
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert event planner. Provide specific, realistic suggestions that match the event details and budget. Focus on options that would actually be available in the specified location."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 500
      });

      const content = response.choices[0]?.message?.content || '';
      return content
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .slice(0, 5);
    } catch (error) {
      console.error('AI Suggestions Error:', error);
      return ['Unable to generate suggestions at this time. Please check your API configuration.'];
    }
  }

  private buildEventPlanPrompt(): string {
    return `
    Create a comprehensive, realistic event plan for the following event:
    
    Event Type: ${this.eventDetails.type}
    Title: ${this.eventDetails.title}
    Date: ${this.eventDetails.date}
    Location: ${this.eventDetails.location}
    Budget: $${this.eventDetails.budget?.toLocaleString()}
    Guests: ${this.eventDetails.guests}
    Style: ${this.eventDetails.style}
    
    Please provide a detailed JSON response with the following structure:
    
    {
      "venues": [
        {
          "name": "Specific venue name",
          "type": "venue type",
          "capacity": number,
          "priceRange": "$X,XXX - $X,XXX",
          "features": ["feature1", "feature2"],
          "description": "detailed description",
          "searchTerms": ["term1", "term2"]
        }
      ],
      "catering": [
        {
          "name": "Catering company name",
          "cuisine": "cuisine type",
          "serviceStyle": "buffet/plated/family style",
          "pricePerPerson": number,
          "menuItems": ["item1", "item2"],
          "description": "service description",
          "searchTerms": ["term1", "term2"]
        }
      ],
      "entertainment": [
        {
          "type": "entertainment type",
          "description": "detailed description",
          "estimatedCost": number,
          "duration": "X hours",
          "searchTerms": ["term1", "term2"]
        }
      ],
      "decor": [
        {
          "theme": "theme name",
          "items": ["item1", "item2"],
          "estimatedCost": number,
          "colorScheme": ["color1", "color2"],
          "description": "theme description"
        }
      ],
      "timeline": [
        {
          "time": "HH:MM",
          "activity": "activity description",
          "duration": minutes,
          "notes": "additional notes",
          "responsible": "who handles this"
        }
      ],
      "checklist": [
        {
          "task": "specific task",
          "deadline": "YYYY-MM-DD",
          "priority": "high/medium/low",
          "category": "category name",
          "description": "task details"
        }
      ],
      "budgetBreakdown": {
        "venue": percentage_of_budget,
        "catering": percentage_of_budget,
        "entertainment": percentage_of_budget,
        "decor": percentage_of_budget,
        "photography": percentage_of_budget,
        "miscellaneous": percentage_of_budget
      },
      "recommendations": "Overall planning advice and tips"
    }
    
    Ensure all recommendations are:
    - Realistic for the specified budget and location
    - Appropriate for the event type and style
    - Include specific search terms for finding actual vendors
    - Consider the guest count and venue capacity
    - Account for seasonal availability and pricing
    `;
  }

  private validateAndFormatPlan(plan: any): AIEventPlan {
    // Ensure all required fields exist with defaults
    return {
      venues: plan.venues || [],
      catering: plan.catering || [],
      entertainment: plan.entertainment || [],
      decor: plan.decor || [],
      timeline: plan.timeline || [],
      checklist: plan.checklist || [],
      recommendations: plan.recommendations || 'Plan generated successfully.',
      budgetBreakdown: plan.budgetBreakdown || {
        venue: 30,
        catering: 40,
        entertainment: 15,
        decor: 10,
        photography: 5,
        miscellaneous: 0
      }
    };
  }
}