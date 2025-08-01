import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  stats?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon, 
  path,
  stats 
}) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(path)}
      className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between">
        <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-blue-50 transition-colors">
          {icon}
        </div>
        <button className="p-1 rounded-full text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all">
          <ArrowRight size={16} />
        </button>
      </div>
      
      <h3 className="mt-4 font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      
      <p className="mt-2 text-sm text-gray-600">
        {description}
      </p>
      
      {stats && (
        <div className="mt-3 text-xs font-medium text-gray-500">
          {stats}
        </div>
      )}
    </div>
  );
};

export default FeatureCard;