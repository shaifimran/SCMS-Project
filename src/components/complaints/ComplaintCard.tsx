import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, AlertTriangle, ArrowUpCircle } from 'lucide-react';
import { COMPLAINT_STATUS } from '../../config/constants';

interface ComplaintCardProps {
  complaint: {
    id: string;
    title: string;
    status: string;
    priority: string;
    department: string;
    createdAt: string;
    updatedAt: string;
  };
  compact?: boolean;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, compact = false }) => {
  const { id, title, status, priority, department, createdAt } = complaint;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const getStatusIcon = () => {
    switch (status) {
      case COMPLAINT_STATUS.PENDING:
        return <Clock className="text-yellow-500" size={compact ? 16 : 20} />;
      case COMPLAINT_STATUS.IN_PROGRESS:
        return <ArrowUpCircle className="text-blue-500" size={compact ? 16 : 20} />;
      case COMPLAINT_STATUS.RESOLVED:
        return <CheckCircle className="text-emerald-500" size={compact ? 16 : 20} />;
      default:
        return <Clock className="text-gray-400" size={compact ? 16 : 20} />;
    }
  };
  
  const getPriorityClass = () => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-orange-100 text-orange-700';
      case 'Low':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  
  if (compact) {
    return (
      <Link 
        to={`/complaints/${id}`}
        className="block p-3 border border-gray-200 rounded-md hover:border-blue-300 hover:shadow-sm transition-all"
      >
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-gray-900 line-clamp-1">{title}</h3>
          {getStatusIcon()}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className={`text-xs px-2 py-1 rounded ${getPriorityClass()}`}>
            {priority}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(createdAt)}
          </span>
        </div>
      </Link>
    );
  }
  
  return (
    <Link 
      to={`/complaints/${id}`}
      className="block p-5 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between">
        <h3 className="font-medium text-lg text-gray-900">{title}</h3>
        <div className="flex items-center">
          {getStatusIcon()}
          <span className="ml-2 text-sm font-medium" style={{ 
            color: status === COMPLAINT_STATUS.PENDING ? '#EAB308' : 
                  status === COMPLAINT_STATUS.IN_PROGRESS ? '#3B82F6' : 
                  status === COMPLAINT_STATUS.RESOLVED ? '#10B981' : '#9CA3AF'
          }}>
            {status}
          </span>
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-3">
        <span className={`text-xs px-2 py-1 rounded ${getPriorityClass()}`}>
          {priority}
        </span>
        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
          {department}
        </span>
        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
          {formatDate(createdAt)}
        </span>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {status === COMPLAINT_STATUS.PENDING ? (
            <span className="flex items-center">
              <AlertTriangle size={14} className="mr-1 text-yellow-500" />
              Awaiting review
            </span>
          ) : status === COMPLAINT_STATUS.IN_PROGRESS ? (
            <span>Being processed</span>
          ) : (
            <span>Completed</span>
          )}
        </div>
        <span className="text-sm text-blue-600">View details →</span>
      </div>
    </Link>
  );
};

export default ComplaintCard;