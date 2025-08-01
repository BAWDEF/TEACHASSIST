import React, { useState, useEffect } from 'react';
import { CalendarClock, Clock, Users, ChevronRight } from 'lucide-react';
import { format, isToday, parseISO } from 'date-fns';

const UpcomingLessons = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lessons, setLessons] = useState(initialLessons);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateLessonStatuses();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const updateLessonStatuses = () => {
    setLessons(prevLessons => 
      prevLessons.map(lesson => {
        const [startTime] = lesson.time.split(' - ');
        const lessonDate = parseISO(lesson.dateISO);
        const lessonTime = parseISO(`${format(lessonDate, 'yyyy-MM-dd')}T${startTime}`);
        
        return {
          ...lesson,
          status: getLessonStatus(lessonTime)
        };
      })
    );
  };

  const getLessonStatus = (lessonTime: Date) => {
    const now = new Date();
    const timeDiff = lessonTime.getTime() - now.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    if (minutesDiff < 0) return 'completed';
    if (minutesDiff < 15) return 'upcoming';
    return 'scheduled';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">Completed</span>;
      case 'upcoming':
        return <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full animate-pulse">Starting Soon</span>;
      default:
        return <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">Scheduled</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <CalendarClock size={18} className="mr-2 text-gray-500" />
          Today's Lessons
        </h3>
        <div className="text-sm text-gray-500">
          {format(currentTime, 'h:mm:ss a')}
        </div>
      </div>

      <div className="space-y-4">
        {lessons.map((lesson, index) => (
          <div 
            key={index} 
            className={`bg-gray-50 rounded-lg p-4 border transition-all duration-200 ${
              lesson.status === 'upcoming' 
                ? 'border-amber-200 shadow-md' 
                : 'border-gray-100 hover:border-blue-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getStatusBadge(lesson.status)}
                </div>
                <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                <p className="text-sm text-gray-500">{lesson.className}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={14} />
                <span>{lesson.time}</span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-3">
                <div className="flex items-center gap-1 text-sm text-gray-700">
                  <Users size={14} />
                  <span>{lesson.students} students</span>
                </div>
                <div className="text-sm text-gray-700">
                  <span className="text-blue-600 font-medium">{lesson.resources}</span> resources
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 text-sm font-medium">
                <span>Details</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const initialLessons = [
  {
    title: "Advanced Biology",
    time: "9:00 AM - 10:30 AM",
    dateISO: "2025-04-15T09:00:00",
    students: 24,
    topic: "Cellular Respiration",
    resources: 3,
    className: "Grade 11 Biology",
    status: 'scheduled'
  },
  {
    title: "World History",
    time: "11:00 AM - 12:30 PM",
    dateISO: "2025-04-15T11:00:00",
    students: 28,
    topic: "Ancient Civilizations",
    resources: 5,
    className: "Grade 10 History",
    status: 'scheduled'
  },
  {
    title: "Mathematics",
    time: "1:30 PM - 3:00 PM",
    dateISO: "2025-04-15T13:30:00",
    students: 22,
    topic: "Quadratic Equations",
    resources: 4,
    className: "Grade 9 Algebra",
    status: 'scheduled'
  }
];

export default UpcomingLessons;