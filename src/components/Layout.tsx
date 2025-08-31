import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Calendar, 
  Users, 
  Settings, 
  LogOut,
  Sparkles
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export default function Layout({ children, showSidebar = false }: LayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'New Event', path: '/create-event' },
    { icon: Users, label: 'Vendors', path: '/vendors' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold text-white">Event Ally</span>
            </Link>
            
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">Welcome, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {showSidebar && user && (
          <aside className="w-64 bg-black/10 backdrop-blur-sm border-r border-gray-800 min-h-[calc(100vh-4rem)]">
            <nav className="p-6">
              <ul className="space-y-2">
                {sidebarItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-orange-500/20 text-orange-400 shadow-lg shadow-orange-500/20'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>
        )}

        {/* Main content */}
        <main className={`flex-1 ${showSidebar ? 'ml-0' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
}