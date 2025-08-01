
import React, { useState } from 'react';
import { HelpCircle, X, Search, ExternalLink } from 'lucide-react';

interface HelpItem {
  id: string;
  title: string;
  description: string;
  category: 'getting-started' | 'features' | 'troubleshooting';
  link?: string;
}

const HelpPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const helpItems: HelpItem[] = [
    {
      id: '1',
      title: 'Getting Started with AI Lesson Planning',
      description: 'Learn how to create your first AI-powered lesson plan',
      category: 'getting-started',
      link: '/help/getting-started'
    },
    {
      id: '2',
      title: 'Creating Assessments',
      description: 'Step-by-step guide to building quizzes and tests',
      category: 'features',
      link: '/help/assessments'
    },
    {
      id: '3',
      title: 'Troubleshooting Common Issues',
      description: 'Solutions to frequently encountered problems',
      category: 'troubleshooting',
      link: '/help/troubleshooting'
    },
    {
      id: '4',
      title: 'Using the Question Bank',
      description: 'Manage and organize your question collections',
      category: 'features',
      link: '/help/question-bank'
    },
    {
      id: '5',
      title: 'AI Generation Not Working',
      description: 'Fix issues with AI-powered content generation',
      category: 'troubleshooting',
      link: '/help/ai-issues'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Topics' },
    { id: 'getting-started', label: 'Getting Started' },
    { id: 'features', label: 'Features' },
    { id: 'troubleshooting', label: 'Troubleshooting' }
  ];

  const filteredItems = helpItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Help"
      >
        <HelpCircle size={20} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900">Help Center</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="relative mb-3">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search help topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="flex gap-1 flex-wrap">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      activeCategory === category.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No help topics found
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      // Handle navigation to help article
                      console.log('Navigate to:', item.link);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm mb-1">
                          {item.title}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {item.description}
                        </p>
                      </div>
                      <ExternalLink size={14} className="text-gray-400 ml-2 flex-shrink-0" />
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All Documentation
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HelpPanel;