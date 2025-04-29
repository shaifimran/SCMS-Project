import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Filter, CheckCircle, ArrowUpCircle, Clock, Search, SortAsc, SortDesc, Database } from 'lucide-react';
import Button from '../../components/ui/Button';
import ComplaintCard from '../../components/complaints/ComplaintCard';
import { getComplaints, updateComplaintStatus } from '../../services/complaintService';
import { COMPLAINT_STATUS } from '../../config/constants';

const StaffDashboard = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState<'assigned' | 'all'>('assigned');
  
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
    
    // Filter by assigned/all
    if (activeTab === 'assigned') {
      // In a real app, filter by staffId === current staff id
      result = result.filter(complaint => complaint.staffId === 's1' || complaint.staffId === 's3');
    }
    
    // Apply status filter
    if (filterStatus) {
      result = result.filter(complaint => complaint.status === filterStatus);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(complaint => 
        complaint.title.toLowerCase().includes(term) || 
        complaint.description.toLowerCase().includes(term) ||
        (complaint.userName && complaint.userName.toLowerCase().includes(term))
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
    setFilteredComplaints(result);
  }, [complaints, filterStatus, searchTerm, sortOrder, activeTab]);
  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  
  const clearFilters = () => {
    setFilterStatus('');
    setSearchTerm('');
    setSortOrder('desc');
  };
  
  const getStatusCounts = () => {
    const filtered = activeTab === 'assigned' 
      ? complaints.filter(c => c.staffId === 's1' || c.staffId === 's3')
      : complaints;
      
    return {
      pending: filtered.filter(c => c.status === COMPLAINT_STATUS.PENDING).length,
      inProgress: filtered.filter(c => c.status === COMPLAINT_STATUS.IN_PROGRESS).length,
      resolved: filtered.filter(c => c.status === COMPLAINT_STATUS.RESOLVED).length,
    };
  };
  
  const { pending, inProgress, resolved } = getStatusCounts();
  
  const handleClaimComplaint = async (id: string) => {
    try {
      await updateComplaintStatus(id, COMPLAINT_STATUS.IN_PROGRESS, 'Complaint claimed and being investigated');
      
      // Update local state
      const updatedComplaints = complaints.map(c => {
        if (c.id === id) {
          return {
            ...c,
            status: COMPLAINT_STATUS.IN_PROGRESS,
            staffId: 's1', // Mock staff ID
            staffName: 'Alice Johnson', // Mock staff name
            remarks: 'Complaint claimed and being investigated'
          };
        }
        return c;
      });
      
      setComplaints(updatedComplaints);
      toast.success('Complaint claimed successfully');
    } catch (error) {
      toast.error('Failed to claim complaint');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Staff Dashboard</h1>
        <p className="text-gray-600">Manage and resolve assigned complaints</p>
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('assigned')}
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'assigned'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Assigned to You
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`py-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'all'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Complaints
          </button>
        </div>
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
              <Clock className="text-yellow-600" size={20} />
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
              <ArrowUpCircle className="text-blue-600" size={20} />
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
              <CheckCircle className="text-emerald-600" size={20} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters and search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search complaints or users..."
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
          <p className="text-gray-600 mt-4">Loading complaints...</p>
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-200 text-center">
          <Database size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">No complaints found</p>
          <p className="text-gray-600">
            {searchTerm || filterStatus 
              ? 'Try changing your filters to see more results' 
              : activeTab === 'assigned' 
                ? 'You currently have no complaints assigned to you'
                : 'There are no complaints in the system yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeTab === 'all' && filterStatus !== COMPLAINT_STATUS.IN_PROGRESS && filterStatus !== COMPLAINT_STATUS.RESOLVED && (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
              <h2 className="text-lg font-semibold mb-4">Unclaimed Complaints</h2>
              {filteredComplaints
                .filter(c => c.status === COMPLAINT_STATUS.PENDING && !c.staffId)
                .length === 0 ? (
                <p className="text-gray-600">No unclaimed complaints at the moment.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredComplaints
                    .filter(c => c.status === COMPLAINT_STATUS.PENDING && !c.staffId)
                    .map(complaint => (
                      <div key={complaint.id} className="relative border border-gray-200 rounded-md p-4">
                        <h3 className="font-medium mb-2 pr-20">{complaint.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{complaint.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            {complaint.status}
                          </span>
                          <Button 
                            variant="primary" 
                            size="small"
                            onClick={() => handleClaimComplaint(complaint.id)}
                          >
                            Claim
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">
              {activeTab === 'assigned' ? 'Your Complaints' : 'All Complaints'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredComplaints
                .filter(c => activeTab !== 'all' || c.status !== COMPLAINT_STATUS.PENDING || c.staffId)
                .map(complaint => (
                  <ComplaintCard key={complaint.id} complaint={complaint} />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;