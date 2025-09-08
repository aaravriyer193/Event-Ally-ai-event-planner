# Event Ally - AI-Powered Event Planning Platform

A modern, intelligent event planning web application that uses AI to create comprehensive event plans in minutes, not weeks.

## 🌟 Features

### Core Functionality
- **AI-Powered Planning**: Generate complete event plans with venue, catering, entertainment, and timeline recommendations
- **Smart Vendor Matching**: Curated directory of verified vendors with intelligent matching based on budget and preferences
- **Interactive Timeline**: Visual event schedules with drag-and-drop customization
- **Collaborative Planning**: Team features for shared planning and task assignment
- **Budget Management**: Real-time budget tracking with category breakdowns
- **Task Management**: Automated checklists with deadline tracking

### User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Theme**: Modern matte dark interface with orange accent colors
- **Smooth Animations**: Micro-interactions and transitions throughout the app
- **Intuitive Navigation**: Clean sidebar navigation with contextual actions

## 🚀 Live Demo

Visit the live application: [Event-Ally](https://event-ally.netlify.app)

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **AI Integration**: OpenAI GPT-4 for intelligent planning
- **Location Services**: Google Places API for real venue data
- **HTTP Client**: Axios for API requests
- **Build Tool**: Vite
- **Deployment**: Bolt Hosting

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/event-ally.git
cd event-ally
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Configure API keys (optional but recommended):
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key for AI features
   - Add your Google Places API key for real venue data

5. Open your browser and navigate to `http://localhost:5173`

## 🔑 API Configuration

To unlock the full potential of Event Ally, configure these APIs:

### OpenAI API (Required for AI Features)
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add to your `.env` file: `VITE_OPENAI_API_KEY=your_key_here`

### Google Places API (Required for Real Venue Data)
1. Visit [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Enable the Places API
3. Create an API key
4. Add to your `.env` file: `VITE_GOOGLE_PLACES_API_KEY=your_key_here`

**Note**: The app will work with sample data if APIs aren't configured, but you'll miss out on the intelligent planning and real venue recommendations.

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with sidebar
│   └── Button.tsx      # Custom button component
├── contexts/           # React context providers
│   ├── AuthContext.tsx # Authentication state management
│   └── EventContext.tsx # Event data management
├── pages/              # Application pages
│   ├── LandingPage.tsx # Marketing landing page
│   ├── LoginPage.tsx   # User authentication
│   ├── SignUpPage.tsx  # User registration
│   ├── Dashboard.tsx   # Main user dashboard
│   ├── EventCreation.tsx # Event creation wizard
│   ├── EventPlan.tsx   # Detailed event planning
│   ├── VendorDirectory.tsx # Vendor browsing
│   ├── Settings.tsx    # User preferences
│   └── Pricing.tsx     # Subscription plans
└── App.tsx             # Main application component
```

## 🎨 Design System

### Color Palette
- **Background**: Gray-900 (dark matte)
- **Cards**: Gray-800/50 with backdrop blur
- **Accent**: Orange-500 to Yellow-500 gradient
- **Text**: White primary, Gray-400 secondary
- **Borders**: Gray-700 with hover states

### Typography
- **Headings**: Bold system fonts with proper hierarchy
- **Body**: Regular weight with 150% line height
- **Code**: Monospace for technical elements

### Components
- **Buttons**: Gradient backgrounds with glow effects
- **Cards**: Glass morphism with subtle shadows
- **Forms**: Consistent styling with focus states
- **Navigation**: Smooth transitions and active states

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚀 Deployment

The application is configured for easy deployment to various platforms:

### Bolt Hosting (Current)
Already deployed at: https://event-ally-ai-event-yq09.bolt.host

### Other Platforms
- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `dist` folder after running `npm run build`
- **GitHub Pages**: Use GitHub Actions for automated deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from modern SaaS applications
- Icons provided by [Lucide React](https://lucide.dev)
- Stock photos from [Pexels](https://pexels.com)
- Built with [Vite](https://vitejs.dev) and [React](https://reactjs.org)

## Website: [Event Ally](https://event-ally.netlify.app)

---

Made with ❤️ for event planners everywhere
