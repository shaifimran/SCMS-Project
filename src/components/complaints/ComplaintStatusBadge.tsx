import { COMPLAINT_STATUS } from '../../config/constants';

interface ComplaintStatusBadgeProps {
  status: string;
  size?: 'small' | 'medium' | 'large';
}

const ComplaintStatusBadge: React.FC<ComplaintStatusBadgeProps> = ({ 
  status, 
  size = 'medium' 
}) => {
  const getStatusClass = () => {
    switch (status) {
      case COMPLAINT_STATUS.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case COMPLAINT_STATUS.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case COMPLAINT_STATUS.RESOLVED:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const sizeClasses = {
    small: 'text-xs px-2 py-0.5',
    medium: 'text-sm px-2.5 py-1',
    large: 'text-base px-3 py-1.5',
  };

  return (
    <span className={`
      inline-flex items-center font-medium rounded-full
      ${getStatusClass()}
      ${sizeClasses[size]}
      border
    `}>
      {status}
    </span>
  );
};

export default ComplaintStatusBadge;