import React, { useState } from 'react';
import { X, Key, Eye, EyeOff, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import Button from './Button';

interface APIKeySetupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  currentApiKey?: string;
}

export default function APIKeySetup({ isOpen, onClose, onSave, currentApiKey }: APIKeySetupProps) {
  const [apiKey, setApiKey] = useState(currentApiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<'valid' | 'invalid' | null>(null);

  const validateApiKey = async (key: string) => {
    if (!key.startsWith('sk-')) {
      setValidationResult('invalid');
      return false;
    }

    setIsValidating(true);
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setValidationResult('valid');
        return true;
      } else {
        setValidationResult('invalid');
        return false;
      }
    } catch (error) {
      setValidationResult('invalid');
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = async () => {
    if (!apiKey.trim()) return;

    const isValid = await validateApiKey(apiKey);
    if (isValid) {
      onSave(apiKey);
      onClose();
    }
  };

  const handleKeyChange = (value: string) => {
    setApiKey(value);
    setValidationResult(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Key className="h-6 w-6 text-orange-400" />
            <h2 className="text-xl font-bold text-white">Setup OpenAI API Key</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-blue-400 font-medium mb-2">Why do you need this?</h3>
            <p className="text-gray-300 text-sm">
              Your OpenAI API key enables AI-powered event planning, intelligent vendor recommendations, 
              and the smart assistant features. Your key is stored securely in your browser only.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              OpenAI API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => handleKeyChange(e.target.value)}
                placeholder="sk-..."
                className="w-full px-4 py-3 pr-12 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            {validationResult && (
              <div className={`flex items-center space-x-2 mt-2 text-sm ${
                validationResult === 'valid' ? 'text-green-400' : 'text-red-400'
              }`}>
                {validationResult === 'valid' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span>
                  {validationResult === 'valid' 
                    ? 'API key is valid!' 
                    : 'Invalid API key. Please check and try again.'
                  }
                </span>
              </div>
            )}
          </div>

          <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">How to get your API key:</h4>
            <ol className="text-gray-300 text-sm space-y-1">
              <li>1. Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 inline-flex items-center">
                OpenAI Platform <ExternalLink className="h-3 w-3 ml-1" />
              </a></li>
              <li>2. Sign in or create an account</li>
              <li>3. Click "Create new secret key"</li>
              <li>4. Copy and paste it here</li>
            </ol>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <h4 className="text-yellow-400 font-medium mb-2">Security Notice</h4>
            <p className="text-gray-300 text-sm">
              Your API key is stored locally in your browser and never sent to our servers. 
              It's only used to communicate directly with OpenAI's API.
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              Skip for now
            </Button>
            <Button
              onClick={handleSave}
              disabled={!apiKey.trim() || isValidating}
              className="flex-1"
            >
              {isValidating ? 'Validating...' : 'Save & Continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}