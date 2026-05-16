import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchProjects = () => {
    API.get('/projects')
      .then(({ data }) => setProjects(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  const createProject = async (e) => {
    e.preventDefault();
    try {
      await API.post('/projects', { name, description });
      setName('');
      setDescription('');
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create project');
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await API.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete');
    }
  };

  if (loading) return <div className="flex-1 p-8 text-gray-500 text-center">Loading...</div>;

  return (
    <div className="flex-1 p-6 bg-[#f4f6f9] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-[#1e1b4b] to-[#4338ca] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
        >
          {showForm ? 'Cancel' : '+ New Project'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={createProject} className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4338ca]"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4338ca]"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-[#1e1b4b] to-[#4338ca] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            Create
          </button>
        </form>
      )}

      {projects.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow-sm">
          No projects yet. Create your first project!
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{project.name}</h3>
                {user.role === 'admin' && (
                  <button onClick={() => deleteProject(project.id)} className="text-red-400 hover:text-red-600 text-sm">
                    Delete
                  </button>
                )}
              </div>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{project.description || 'No description'}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{project.Users?.length || 0} members</span>
                <Link to={`/projects/${project.id}`} className="text-[#4338ca] hover:underline text-sm font-medium">
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
