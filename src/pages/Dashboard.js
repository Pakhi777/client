import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  todo: 'bg-gray-200 text-gray-800',
  in_progress: 'bg-blue-200 text-blue-800',
  done: 'bg-green-200 text-green-800',
};

const priorityColors = {
  low: 'text-green-600',
  medium: 'text-yellow-600',
  high: 'text-red-600',
};

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
    { label: 'Total Tasks', value: stats.totalTasks, color: 'bg-indigo-600' },
    { label: 'To Do', value: stats.todoTasks, color: 'bg-gray-600' },
    { label: 'In Progress', value: stats.inProgressTasks, color: 'bg-blue-600' },
    { label: 'Completed', value: stats.doneTasks, color: 'bg-green-600' },
    { label: 'Overdue', value: stats.overdueTasks, color: 'bg-red-600' },
    { label: 'Projects', value: stats.totalProjects, color: 'bg-purple-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">
        Welcome, {user.name}
        <span className="ml-3 text-sm font-normal text-gray-500">({user.role})</span>
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg shadow p-4">
            <div className={`w-3 h-3 rounded-full ${card.color} mb-2`}></div>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="text-sm text-gray-500">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Tasks</h2>
        {stats.recentTasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet. <Link to="/projects" className="text-indigo-700 hover:underline">Create a project</Link></p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-sm text-gray-500">
                  <th className="pb-2">Title</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Priority</th>
                  <th className="pb-2">Assignee</th>
                  <th className="pb-2">Due</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTasks.map((task) => (
                  <tr key={task.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{task.title}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${statusColors[task.status]}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className={`py-3 capitalize ${priorityColors[task.priority]}`}>{task.priority}</td>
                    <td className="py-3 text-sm text-gray-600">{task.assignee?.name || '-'}</td>
                    <td className="py-3 text-sm">{task.dueDate || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
