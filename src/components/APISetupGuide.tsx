import React, { useState } from 'react';
import { X, Key, ExternalLink, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import Button from './Button';

interface APISetupGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function APISetupGuide({ isOpen, onClose }: APISetupGuideProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const hasOpenAI = !!import.meta.env.VITE_OPENAI_API_KEY;
  const hasGooglePlaces = !!import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Key className="h-6 w-6 text-orange-400" />
            <h2 className="text-xl font-bold text-white">API Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Overview */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg border ${hasOpenAI ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <div className="flex items-center space-x-2">
                {hasOpenAI ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )}
                <span className={`font-medium ${hasOpenAI ? 'text-green-400' : 'text-red-400'}`}>
                  OpenAI API
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-1">
                {hasOpenAI ? 'Configured - AI features active' : 'Not configured - AI features disabled'}
              </p>
            </div>

            <div className={`p-4 rounded-lg border ${hasGooglePlaces ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <div className="flex items-center space-x-2">
                {hasGooglePlaces ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )}
                <span className={`font-medium ${hasGooglePlaces ? 'text-green-400' : 'text-red-400'}`}>
                  Google Places API
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-1">
                {hasGooglePlaces ? 'Configured - Real venue data available' : 'Not configured - Using sample data'}
              </p>
            </div>
          </div>

          {/* OpenAI Setup */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">1. OpenAI API Setup</h3>
            <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-4">
              <p className="text-gray-300 mb-4">
                Get your OpenAI API key to enable AI-powered event planning and the intelligent assistant.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">1. Visit OpenAI Platform</span>
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <div className="text-gray-400">2. Create a new API key</div>
                <div className="text-gray-400">3. Add to your .env file:</div>
                <div className="bg-gray-800 border border-gray-600 rounded p-3 font-mono text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">VITE_OPENAI_API_KEY=your_key_here</span>
                    <button
                      onClick={() => copyToClipboard('VITE_OPENAI_API_KEY=your_key_here', 'openai')}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {copiedKey === 'openai' ? <CheckCircle className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Google Places Setup */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">2. Google Places API Setup</h3>
            <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-4">
              <p className="text-gray-300 mb-4">
                Get your Google Places API key to access real venue and vendor data.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">1. Visit Google Cloud Console</span>
                  <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <div className="text-gray-400">2. Enable Places API</div>
                <div className="text-gray-400">3. Create credentials (API key)</div>
                <div className="text-gray-400">4. Add to your .env file:</div>
                <div className="bg-gray-800 border border-gray-600 rounded p-3 font-mono text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">VITE_GOOGLE_PLACES_API_KEY=your_key_here</span>
                    <button
                      onClick={() => copyToClipboard('VITE_GOOGLE_PLACES_API_KEY=your_key_here', 'places')}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {copiedKey === 'places' ? <CheckCircle className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <h4 className="text-yellow-400 font-medium mb-2">Important Notes</h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Restart the development server after adding API keys</li>
              <li>• Keep your API keys secure and never commit them to version control</li>
              <li>• Monitor your API usage to avoid unexpected charges</li>
              <li>• The app will work with sample data if APIs aren't configured</li>
            </ul>
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose}>Got it!</Button>
          </div>
        </div>
      </div>
    </div>
  );
}