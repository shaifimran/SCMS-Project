import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="container mx-auto p-4 text-center max-w-md">
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 bg-blue-100 flex items-center justify-center rounded-full mb-6">
          <AlertTriangle size={40} className="text-blue-600" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-3">
          <Link to="/">
            <Button variant="primary" className="min-w-[200px]">
              Go to Home
            </Button>
          </Link>
          
          <div>
            <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;