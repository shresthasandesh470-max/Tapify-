
import React, { useState } from 'react';
import { editImageWithAI } from '../services/gemini';

interface AIImageModifierProps {
  currentImage: string;
  onUpdate: (newImage: string) => void;
}

const AIImageModifier: React.FC<AIImageModifierProps> = ({ currentImage, onUpdate }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAIEdit = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await editImageWithAI(currentImage, prompt);
      onUpdate(result);
      setPrompt('');
    } catch (err) {
      setError("Failed to generate image. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-100 shadow-sm mt-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-indigo-600 text-lg">✨</span>
        <h3 className="font-semibold text-indigo-900 text-sm">AI Profile Enhancer</h3>
      </div>
      
      <p className="text-xs text-indigo-700 mb-3">
        Tell Gemini to edit your photo. Try "Make it professional", "Add a sunset background", or "Apply a black and white filter".
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Change background to a modern office..."
          className="flex-1 bg-white border border-indigo-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          disabled={loading}
        />
        <button
          onClick={handleAIEdit}
          disabled={loading || !prompt.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg text-xs transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : 'Generate'}
        </button>
      </div>
      
      {error && <p className="text-red-500 text-[10px] mt-2">{error}</p>}
    </div>
  );
};

export default AIImageModifier;
