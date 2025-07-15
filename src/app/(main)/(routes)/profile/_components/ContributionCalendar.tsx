"use client";

import React, { useState } from 'react';
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { useUser } from "@clerk/clerk-react";

interface ContributionDay {
  date: string;
  count: number;
  level: number; // 0-4 for different shades of green
}

const ContributionCalendar = () => {
  const { user } = useUser();
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Calculate date range for the last year
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1);

  // Format dates for the query
  const startDateStr = startDate.toISOString().split('T')[0];
  const endDateStr = endDate.toISOString().split('T')[0];

  // Fetch work sessions data
  const workSessions = useQuery(
    api.workSessions.getWorkSessions,
    user ? {
      userId: user.id,
      startDate: startDateStr,
      endDate: endDateStr,
    } : "skip"
  );

  const stats = useQuery(
    api.workSessions.getWorkSessionStats,
    user ? { userId: user.id } : "skip"
  );

  // Generate calendar data
  const generateCalendarData = (): ContributionDay[] => {
    const days: ContributionDay[] = [];
    const sessionsMap = new Map<string, number>();

    // Create a map of date -> session count
    workSessions?.forEach(session => {
      sessionsMap.set(session.date, session.sessionsCount);
    });

    // Generate all days for the past year
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const count = sessionsMap.get(dateStr) || 0;
      
      // Calculate intensity level (0-4)
      let level = 0;
      if (count > 0) {
        if (count >= 8) level = 4;
        else if (count >= 6) level = 3;
        else if (count >= 4) level = 2;
        else level = 1;
      }

      days.push({
        date: dateStr,
        count,
        level,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const calendarData = generateCalendarData();

  // Get color class based on level
  const getColorClass = (level: number): string => {
    switch (level) {
      case 0: return 'bg-gray-100 dark:bg-gray-800';
      case 1: return 'bg-green-100 dark:bg-green-900';
      case 2: return 'bg-green-300 dark:bg-green-700';
      case 3: return 'bg-green-500 dark:bg-green-500';
      case 4: return 'bg-green-700 dark:bg-green-300';
      default: return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  // Format date for tooltip
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get week day names
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get month labels with positions for horizontal layout
  const getMonthLabels = (): { month: string; position: number }[] => {
    const labels: { month: string; position: number }[] = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    let currentMonth = startDate.getMonth();
    
    calendarData.forEach((day, index) => {
      const dayDate = new Date(day.date);
      const dayMonth = dayDate.getMonth();
      
      // Check if we've entered a new month and it's the first week of that month
      if (dayMonth !== currentMonth && dayDate.getDate() <= 7) {
        labels.push({
          month: months[dayMonth],
          position: Math.floor(index / 7)
        });
        currentMonth = dayMonth;
      }
      
      // Add the first month
      if (index === 0) {
        labels.unshift({
          month: months[dayMonth],
          position: 0
        });
      }
    });
    
    return labels;
  };

  // Organize data by weeks for horizontal display (weeks as columns)
  const organizeByWeeksHorizontal = (): ContributionDay[][] => {
    const weeks: ContributionDay[][] = [];
    
    // Add empty days to align with Sunday start
    const firstDay = new Date(startDate);
    const dayOfWeek = firstDay.getDay();
    const paddedData = [...calendarData];
    
    // Add empty days at the beginning
    for (let i = 0; i < dayOfWeek; i++) {
      paddedData.unshift({
        date: '',
        count: 0,
        level: 0,
      });
    }

    // Group by weeks
    for (let i = 0; i < paddedData.length; i += 7) {
      const week = paddedData.slice(i, i + 7);
      // Pad the last week if needed
      while (week.length < 7) {
        week.push({
          date: '',
          count: 0,
          level: 0,
        });
      }
      weeks.push(week);
    }

    return weeks;
  };

  const weeks = organizeByWeeksHorizontal();
  const monthLabels = getMonthLabels();

  const handleMouseEnter = (day: ContributionDay, event: React.MouseEvent) => {
    if (day.date) {
      setHoveredDay(day);
      setMousePosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  if (!user) {
    return (
      <div className="p-4">
        <p className="text-gray-500">Please sign in to see your contribution calendar.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-transparent dark:border rounded-lg shadow-lg">
      {/* Header with stats */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Work Session Activity
        </h2>
        
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalSessions}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Sessions
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.currentStreak}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Current Streak
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.longestStreak}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Longest Streak
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.averagePerDay}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Avg per Day
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Calendar */}
      <div className="relative overflow-x-auto">
        {/* Month labels */}
        <div className="relative mb-2 ml-8 h-4">
          {monthLabels.map((label, index) => (
            <div
              key={index}
              className="absolute text-xs text-gray-600 dark:text-gray-400"
              style={{ left: `${label.position * 16}px` }}
            >
              {label.month}
            </div>
          ))}
        </div>

        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col mr-2 flex-shrink-0">
            {weekDays.map((day, index) => (
              <div
                key={index}
                className="h-3 mb-1 text-xs text-gray-600 dark:text-gray-400 flex items-center w-6"
              >
                {index % 2 === 1 ? day : ''}
              </div>
            ))}
          </div>

          {/* Calendar grid - horizontal layout */}
          <div className="flex overflow-x-auto min-w-0">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col mr-1 flex-shrink-0">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`
                      w-3 h-3 mb-1 rounded-sm cursor-pointer border border-gray-200 dark:border-gray-700
                      ${day.date ? getColorClass(day.level) : 'bg-transparent border-transparent'}
                      hover:ring-1 hover:ring-gray-400 transition-all duration-150
                    `}
                    onMouseEnter={(e) => handleMouseEnter(day, e)}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={handleMouseMove}
                    title={day.date ? `${formatDate(day.date)}: ${day.count} sessions` : ''}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Less
          </div>
          <div className="flex items-center space-x-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm border border-gray-200 dark:border-gray-700 ${getColorClass(level)}`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            More
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <div
          className="fixed z-50 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y - 40,
          }}
        >
          <div className="font-medium">
            {hoveredDay.count} session{hoveredDay.count !== 1 ? 's' : ''}
          </div>
          <div className="text-gray-300">
            {formatDate(hoveredDay.date)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContributionCalendar;