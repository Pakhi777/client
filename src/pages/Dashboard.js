import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/dashboard/stats')
      .then(({ data }) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center p-8 text-gray-500">Loading dashboard...</div>;
  if (!stats) return <div className="text-center p-8 text-red-500">Failed to load stats</div>;

  const cards = [
    { label: 'Total Projects', value: stats.totalProjects ?? 24 },
    { label: 'Active Tasks', value: stats.activeTasks ?? stats.todoTasks ?? 56 },
    { label: 'Completed Tasks', value: stats.doneTasks ?? 128 },
    { label: 'Team Members', value: stats.teamMembers ?? stats.totalMembers ?? 36 },
  ];

  const todoTasks = stats.recentTasks?.filter((t) => t.status === 'todo') ?? [];
  const inProgressTasks = stats.recentTasks?.filter((t) => t.status === 'in_progress') ?? [];
  const doneTasks = stats.recentTasks?.filter((t) => t.status === 'done') ?? [];

  const calendarDays = Array.from({ length: 21 }, (_, i) => i + 1);

  return (
    <div className="flex-1 p-6 bg-[#f4f6f9] min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <input
          type="text"
          placeholder="Search..."
          className="w-72 px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{user.name}</span>
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-5 shadow-sm">
            <h3 className="text-sm text-gray-500 mb-1">{card.label}</h3>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm h-60 flex items-center justify-center text-gray-400 text-lg">
            📊 Project Overview (Chart Placeholder)
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Tasks</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { title: 'To Do', tasks: todoTasks },
                { title: 'In Progress', tasks: inProgressTasks },
                { title: 'Done', tasks: doneTasks },
              ].map((col) => (
                <div key={col.title} className="bg-[#f1f5f9] rounded-xl p-3">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">{col.title}</h4>
                  {col.tasks.length === 0 ? (
                    <p className="text-xs text-gray-400 py-2">No tasks</p>
                  ) : (
                    col.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-white rounded-lg px-3 py-2.5 mb-2 text-sm shadow-sm"
                      >
                        {task.title}
                      </div>
                    ))
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm h-fit">
          <h3 className="font-semibold mb-4">Calendar</h3>
          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((day) => (
              <div
                key={day}
                className="text-center py-2.5 rounded-lg bg-[#f1f5f9] text-sm"
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
