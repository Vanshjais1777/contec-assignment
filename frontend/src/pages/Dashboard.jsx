import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ListTodo, BarChart3 } from 'lucide-react';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await API.get('/tasks');
      const tasks = response.data.tasks;

      const completed = tasks.filter((t) => t.status === 'completed').length;
      const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
      const todo = tasks.filter((t) => t.status === 'todo').length;

      setStats({
        total: tasks.length,
        completed,
        inProgress,
        todo,
      });
    } catch (err) {
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color.includes('blue') ? 'bg-blue-100' : color.includes('green') ? 'bg-green-100' : color.includes('yellow') ? 'bg-yellow-100' : 'bg-gray-100'}`}>
          <Icon size={24} className={color} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name.split(' ')[0]}!
          </h1>
          <p className="text-gray-600">Here's your task overview at a glance</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={ListTodo}
            label="Total Tasks"
            value={stats.total}
            color="text-blue-600"
          />
          <StatCard
            icon={AlertCircle}
            label="To Do"
            value={stats.todo}
            color="text-gray-600"
          />
          <StatCard
            icon={BarChart3}
            label="In Progress"
            value={stats.inProgress}
            color="text-yellow-600"
          />
          <StatCard
            icon={CheckCircle2}
            label="Completed"
            value={stats.completed}
            color="text-green-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-8 border border-gray-200 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/tasks')}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Manage Tasks
              </button>
              <Link
                to="/tasks"
                className="block text-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                View All Tasks
              </Link>
            </div>
          </div>

          {user?.role === 'admin' && (
            <div className="bg-white rounded-lg p-8 border border-gray-200 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Admin Tools</h2>
              <div className="space-y-3">
                <Link
                  to="/audit"
                  className="block px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-center"
                >
                  View Audit Logs
                </Link>
                <p className="text-sm text-gray-600 pt-2">
                  Monitor all user activities and changes across the system
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
