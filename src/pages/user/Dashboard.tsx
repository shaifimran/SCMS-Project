import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PlusCircle, Filter, Search, SortAsc, SortDesc } from 'lucide-react';
import Button from '../../components/ui/Button';
import ComplaintCard from '../../components/complaints/ComplaintCard';
import { getComplaints } from '../../services/complaintService';
import { COMPLAINT_STATUS } from '../../config/constants';

const UserDashboard = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      try {
        const complaintsData = await getComplaints();
        setComplaints(complaintsData);
        setFilteredComplaints(complaintsData);
      } catch (error) {
        toast.error("Failed to load complaints");
      } finally {
        setLoading(false);
      }
    };
    
    fetchComplaints();
  }, []);
  
  useEffect(() => {
    let result = [...complaints];
    
    // Apply status filter
    if (filterStatus) {
      result = result.filter(complaint => complaint.status === filterStatus);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(complaint => 
        complaint.title.toLowerCase().includes(term) || 
        complaint.description.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
    setFilteredComplaints(result);
  }, [complaints, filterStatus, searchTerm, sortOrder]);
  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  
  const clearFilters = () => {
    setFilterStatus('');
    setSearchTerm('');
    setSortOrder('desc');
  };
  
  const getStatusCounts = () => {
    return {
      pending: complaints.filter(c => c.status === COMPLAINT_STATUS.PENDING).length,
      inProgress: complaints.filter(c => c.status === COMPLAINT_STATUS.IN_PROGRESS).length,
      resolved: complaints.filter(c => c.status === COMPLAINT_STATUS.RESOLVED).length,
    };
  };
  
  const { pending, inProgress, resolved } = getStatusCounts();

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Complaints</h1>
        <p className="text-gray-600">View and manage all your submitted complaints</p>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pending}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <span className="text-yellow-600">⌛</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{inProgress}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600">🔄</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Resolved</p>
              <p className="text-2xl font-bold text-emerald-600">{resolved}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-emerald-600">✅</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Link to="/complaints/new">
          <Button variant="primary" className="flex items-center gap-2">
            <PlusCircle size={18} />
            New Complaint
          </Button>
        </Link>
      </div>
      
      {/* Filters and search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="">All Statuses</option>
                {Object.values(COMPLAINT_STATUS).map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={toggleSortOrder}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? (
                <>
                  <SortAsc size={18} />
                  <span className="hidden sm:inline">Oldest</span>
                </>
              ) : (
                <>
                  <SortDesc size={18} />
                  <span className="hidden sm:inline">Newest</span>
                </>
              )}
            </button>
            
            {(filterStatus || searchTerm || sortOrder !== 'desc') && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Complaints list */}
      {loading ? (
        <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="inline-block w-8 h-8 border-3 rounded-full border-blue-300 border-t-blue-600 animate-spin"></div>
          <p className="text-gray-600 mt-4">Loading your complaints...</p>
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-lg font-medium text-gray-900 mb-2">No complaints found</p>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus ? 'Try changing your filters' : 'You have not submitted any complaints yet'}
          </p>
          <Link to="/complaints/new">
            <Button variant="primary">
              Submit a Complaint
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredComplaints.map(complaint => (
            <ComplaintCard key={complaint.id} complaint={complaint} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;