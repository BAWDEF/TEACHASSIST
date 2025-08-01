import React from 'react';
import { Library, Star, BookOpen, FileText, FileCheck, Sparkles } from 'lucide-react';

const ResourcesSection = () => {
  const popularResources = [
    {
      title: "Interactive Science Experiments",
      type: "Lesson Plan",
      subject: "Science",
      rating: 4.9,
      icon: <BookOpen size={16} className="text-blue-500" />
    },
    {
      title: "Historical Timeline Creator",
      type: "Activity",
      subject: "History",
      rating: 4.7,
      icon: <FileText size={16} className="text-purple-500" />
    },
    {
      title: "Math Problem Generator",
      type: "Assessment",
      subject: "Mathematics",
      rating: 4.8,
      icon: <FileCheck size={16} className="text-teal-500" />
    },
    {
      title: "Language Arts Essay Rubric",
      type: "Template",
      subject: "English",
      rating: 4.6,
      icon: <FileText size={16} className="text-amber-500" />
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Library size={18} className="mr-2 text-gray-500" />
          Popular Resources
        </h3>
        <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
          Browse library
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {popularResources.map((resource, index) => (
          <div 
            key={index} 
            className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-3">
              <div className="bg-white rounded-md p-2 shadow-sm group-hover:shadow-md transition-shadow">
                {resource.icon}
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">
                  {resource.type} • {resource.subject}
                </div>
                <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {resource.title}
                </h4>
                <div className="flex items-center mt-1">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-medium ml-1">{resource.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2">
          <Sparkles size={16} />
          <span>Generate AI Resources</span>
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center">
          <span>View All Resources</span>
        </button>
      </div>
    </div>
  );
};

export default ResourcesSection;