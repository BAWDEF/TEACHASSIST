import React from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';

const AiInsights = () => {
  const insights = [
    {
      title: "Student engagement tips",
      description: "5 strategies to boost participation in your History class",
      type: "Teaching Strategy"
    },
    {
      title: "Content suggestion",
      description: "Add more visual elements to your Math lessons for better understanding",
      type: "Lesson Improvement"
    },
    {
      title: "Time-saving technique",
      description: "Batch create assessments using AI templates",
      type: "Productivity"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm p-5 border border-blue-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Sparkles size={18} className="mr-2 text-blue-500" />
          AI Insights
        </h3>
        <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
          View all
        </button>
      </div>
      
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="text-xs font-medium text-blue-600 mb-1">
              {insight.type}
            </div>
            <h4 className="font-medium text-gray-900">{insight.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
            <div className="flex justify-end mt-2">
              <button className="text-blue-600 hover:text-blue-800 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-blue-600 bg-blue-50 hover:bg-blue-100 font-medium py-2 rounded-lg transition-colors flex items-center justify-center">
        <Sparkles size={16} className="mr-2" />
        Generate new insights
      </button>
    </div>
  );
};

export default AiInsights;