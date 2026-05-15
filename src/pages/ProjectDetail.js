import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
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

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState('member');
  const [editingTask, setEditingTask] = useState(null);

  const [form, setForm] = useState({
    title: '', description: '', status: 'todo', priority: 'medium', dueDate: '', assignedTo: '',
  });

  const fetchData = useCallback(() => {
    Promise.all([
      API.get(`/projects/${id}`),
      API.get(`/tasks/project/${id}`),
      API.get(`/projects/${id}/members`),
    ])
      .then(([p, t, m]) => {
        setProject(p.data);
        setTasks(t.data);
        setMembers(m.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const isProjectAdmin = project?.Users?.some(
    (u) => u.ProjectMember?.role === 'admin' && u.id === user.id
  ) || user.role === 'admin';

  const resetForm = () => {
    setForm({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '', assignedTo: '' });
    setEditingTask(null);
    setShowTaskForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        const payload = { ...form };
        delete payload.projectId;
        await API.put(`/tasks/${editingTask.id}`, payload);
      } else {
        await API.post('/tasks', { ...form, projectId: id });
      }
      resetForm();
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save task');
    }
  };

  const editTask = (task) => {
    setForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate || '',
      assignedTo: task.assignedTo || '',
    });
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete');
    }
  };

  const addMember = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/projects/${id}/members`, { email: memberEmail, role: memberRole });
      setMemberEmail('');
      setShowMemberForm(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add member');
    }
  };

  const removeMember = async (userId) => {
    if (!window.confirm('Remove this member?')) return;
    try {
      await API.delete(`/projects/${id}/members/${userId}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to remove member');
    }
  };

  if (loading) return <div className="text-center p-8 text-gray-500">Loading...</div>;
  if (!project) return <div className="text-center p-8 text-red-500">Project not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Link to="/projects" className="text-indigo-700 hover:underline text-sm mb-4 inline-block">&larr; Back to Projects</Link>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-gray-600 mt-1">{project.description || 'No description'}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${
            project.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'
          }`}>{project.status}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Tasks</h2>
              <button
                onClick={() => { resetForm(); setShowTaskForm(!showTaskForm); }}
                className="bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-indigo-800"
              >
                {showTaskForm ? 'Cancel' : '+ Add Task'}
              </button>
            </div>

            {showTaskForm && (
              <form onSubmit={handleSubmit} className="border rounded-lg p-4 mb-4 bg-gray-50">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" rows={2} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2">
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                    <select value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2">
                      <option value="">Unassigned</option>
                      {members.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button type="submit" className="bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-800">
                    {editingTask ? 'Update' : 'Create'} Task
                  </button>
                  {editingTask && (
                    <button type="button" onClick={resetForm} className="text-gray-600 px-4 py-2 text-sm">Cancel Edit</button>
                  )}
                </div>
              </form>
            )}

            {tasks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No tasks yet.</p>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="border rounded-lg p-4 hover:shadow-sm transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{task.title}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs ${statusColors[task.status]}`}>
                            {task.status.replace('_', ' ')}
                          </span>
                          <span className={`text-xs capitalize ${priorityColors[task.priority]}`}>{task.priority}</span>
                        </div>
                        {task.description && (
                          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        )}
                        <div className="flex gap-4 text-xs text-gray-500">
                          <span>Assigned to: {task.assignee?.name || 'Unassigned'}</span>
                          {task.dueDate && (
                            <span className={new Date(task.dueDate) < new Date() && task.status !== 'done' ? 'text-red-600 font-medium' : ''}>
                              Due: {task.dueDate}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {(isProjectAdmin || task.assignedTo === user.id) && (
                          <button onClick={() => editTask(task)} className="text-indigo-700 hover:underline text-sm">Edit</button>
                        )}
                        {isProjectAdmin && (
                          <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:underline text-sm">Delete</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Members</h2>
              {isProjectAdmin && (
                <button onClick={() => setShowMemberForm(!showMemberForm)} className="text-indigo-700 hover:underline text-sm">
                  {showMemberForm ? 'Cancel' : '+ Add'}
                </button>
              )}
            </div>

            {showMemberForm && (
              <form onSubmit={addMember} className="border rounded-lg p-3 mb-4 bg-gray-50">
                <div className="mb-2">
                  <input type="email" placeholder="User email" value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    className="w-full border rounded px-2 py-1.5 text-sm" required />
                </div>
                <div className="mb-2">
                  <select value={memberRole} onChange={(e) => setMemberRole(e.target.value)}
                    className="w-full border rounded px-2 py-1.5 text-sm">
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button type="submit" className="bg-indigo-700 text-white px-3 py-1.5 rounded text-sm w-full">Add</button>
              </form>
            )}

            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium">{member.name}</div>
                    <div className="text-xs text-gray-500">{member.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      member.role === 'admin' ? 'bg-purple-200 text-purple-800' : 'bg-gray-200 text-gray-800'
                    }`}>{member.role}</span>
                    {isProjectAdmin && member.id !== user.id && (
                      <button onClick={() => removeMember(member.id)} className="text-red-500 hover:text-red-700 text-xs">✕</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
