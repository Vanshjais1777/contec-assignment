import React from 'react';
import { Edit2, Trash2, Calendar } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const statusColors = {
    'todo': { bg: 'bg-gray-100', text: 'text-gray-700', badge: 'bg-gray-200' },
    'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700', badge: 'bg-blue-200' },
    'completed': { bg: 'bg-green-100', text: 'text-green-700', badge: 'bg-green-200' },
  };

  const priorityColors = {
    low: 'text-blue-600',
    medium: 'text-yellow-600',
    high: 'text-red-600',
  };

  const colors = statusColors[task.status] || statusColors.todo;

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div className={`rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow ${colors.bg}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 break-words">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${colors.badge} ${colors.text}`}>
              {task.status.replace('-', ' ')}
            </span>
            <span className={`text-xs font-medium capitalize ${priorityColors[task.priority] || 'text-gray-600'}`}>
              {task.priority} priority
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-600 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors"
            title="Edit task"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-2 text-gray-600 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
            title="Delete task"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {task.dueDate && (
        <div className={`mt-3 flex items-center gap-2 text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
          <Calendar size={14} />
          <span>{formatDate(task.dueDate)}</span>
          {isOverdue && <span className="text-red-600">• Overdue</span>}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
