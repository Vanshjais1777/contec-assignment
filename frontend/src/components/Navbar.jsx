import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, CheckSquare, BarChart3 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
              <CheckSquare size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 hidden sm:inline">TaskHub</span>
          </Link>

          {user && (
            <div className="flex items-center gap-8">
              <div className="hidden md:flex gap-1">
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive('/')
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/tasks"
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive('/tasks')
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Tasks
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/audit"
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      isActive('/audit')
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Audit Logs
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-4 border-l border-gray-200 pl-4">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:bg-red-50 rounded-lg transition-colors hover:text-red-600"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
