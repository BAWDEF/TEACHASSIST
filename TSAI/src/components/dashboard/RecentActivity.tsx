import React from 'react';
import { Clock, FileText, FileCheck, BookOpen, Users } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      action: "Created lesson",
      subject: "Introduction to Photosynthesis",
      time: "2 hours ago",
      icon: <BookOpen size={16} className="text-blue-500" />
    },
    {
      action: "Generated quiz",
      subject: "World War II Timeline",
      time: "Yesterday",
      icon: <FileCheck size={16} className="text-teal-500" />
    },
    {
      action: "Shared worksheet",
      subject: "Algebra Equations Practice",
      time: "Yesterday",
      icon: <FileText size={16} className="text-purple-500" />
    },
    {
      action: "Joined group",
      subject: "Science Teachers Network",
      time: "2 days ago",
      icon: <Users size={16} className="text-amber-500" />
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Clock size={18} className="mr-2 text-gray-500" />
          Recent Activity
        </h3>
        <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
          View all
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="bg-gray-100 rounded-full p-2 mt-0.5">
              {activity.icon}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{activity.action}</div>
              <div className="text-sm text-gray-600">{activity.subject}</div>
              <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;