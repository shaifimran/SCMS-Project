import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Building, 
  Users, 
  CheckCircle, 
  XCircle, 
  Filter, 
  Search, 
  UserCheck, 
  AlertTriangle,
  BarChart,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import ComplaintCard from '../../components/complaints/ComplaintCard';
import { getComplaints } from '../../services/complaintService';
import { COMPLAINT_STATUS } from '../../config/constants';

// For demo purposes only - in a real app, these would come from API
const pendingStaff = [
  { id: 'ps1', name: 'Robert Green', email: 'robert.green@example.com', department: 'Technical Support' },
  { id: 'ps2', name: 'Linda Taylor', email: 'linda.taylor@example.com', department: 'Billing' },
];

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [recentComplaints, setRecentComplaints] = useState<any[]>([]);
  const [highPriorityComplaints, setHighPriorityComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      try {
        const complaintsData = await getComplaints();
        setComplaints(complaintsData);
        
        // Get recent complaints (last 5)
        const sortedByDate = [...complaintsData].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentComplaints(sortedByDate.slice(0, 5));
        
        // Get high priority complaints
        setHighPriorityComplaints(
          complaintsData.filter(c => c.priority === 'High' && c.status !== COMPLAINT_STATUS.RESOLVED)
        );
      } catch (error) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchComplaints();
  }, []);
  
  const getStatusCounts = () => {
    return {
      pending: complaints.filter(c => c.status === COMPLAINT_STATUS.PENDING).length,
      inProgress: complaints.filter(c => c.status === COMPLAINT_STATUS.IN_PROGRESS).length,
      resolved: complaints.filter(c => c.status === COMPLAINT_STATUS.RESOLVED).length,
      high: complaints.filter(c => c.priority === 'High').length,
      appealed: complaints.filter(c => c.isAppealed).length,
    };
  };
  
  const { pending, inProgress, resolved, high, appealed } = getStatusCounts();
  
  const getDepartmentMetrics = () => {
    const departments = complaints.reduce((acc: any, complaint) => {
      const dept = complaint.department;
      if (!acc[dept]) {
        acc[dept] = { total: 0, resolved: 0 };
      }
      acc[dept].total++;
      if (complaint.status === COMPLAINT_STATUS.RESOLVED) {
        acc[dept].resolved++;
      }
      return acc;
    }, {});
    
    return Object.entries(departments).map(([name, data]: [string, any]) => ({
      name,
      total: data.total,
      resolved: data.resolved,
      rate: data.total > 0 ? Math.round((data.resolved / data.total) * 100) : 0
    }));
  };
  
  const departmentMetrics = getDepartmentMetrics();

  const renderOverviewTab = () => (
    <>
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Complaints</p>
              <p className="text-3xl font-bold text-gray-800">{complaints.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 text-xl">📋</span>
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm">
            <span className="text-green-500 font-medium">{resolved}</span>
            <span className="mx-1 text-gray-500">resolved of</span>
            <span className="font-medium">{complaints.length}</span>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">High Priority</p>
              <p className="text-3xl font-bold text-red-600">{high}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 text-xl">🔥</span>
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm">
            <span className={`${highPriorityComplaints.length > 0 ? 'text-red-500' : 'text-green-500'} font-medium`}>
              {highPriorityComplaints.length}
            </span>
            <span className="mx-1 text-gray-500">still unresolved</span>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Staff</p>
              <p className="text-3xl font-bold text-amber-600">{pendingStaff.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <UserCheck className="text-amber-600" size={24} />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm">
            <span className="text-amber-500 font-medium">
              {pendingStaff.length}
            </span>
            <span className="mx-1 text-gray-500">staff awaiting verification</span>
          </div>
        </div>
      </div>
      
      {/* Status breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
              <span className="text-yellow-600">⌛</span>
            </div>
            <div>
              <p className="text-gray-500">Pending</p>
              <p className="text-xl font-bold text-yellow-600">{pending}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <span className="text-blue-600">🔄</span>
            </div>
            <div>
              <p className="text-gray-500">In Progress</p>
              <p className="text-xl font-bold text-blue-600">{inProgress}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
              <span className="text-emerald-600">✅</span>
            </div>
            <div>
              <p className="text-gray-500">Resolved</p>
              <p className="text-xl font-bold text-emerald-600">{resolved}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Department performance */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Department Performance</h2>
          <BarChart size={20} className="text-gray-400" />
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resolved
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resolution Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departmentMetrics.map((dept, index) => (
                <tr key={index}>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {dept.name}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dept.total}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dept.resolved}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${dept.rate}%` }}
                        ></div>
                      </div>
                      <span className={dept.rate >= 70 ? 'text-green-600' : dept.rate >= 40 ? 'text-yellow-600' : 'text-red-600'}>
                        {dept.rate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Recent complaints and pending staff verification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Complaints</h2>
            <Button 
              variant="outline" 
              size="small" 
              onClick={() => setActiveTab('complaints')}
            >
              View All
            </Button>
          </div>
          
          {recentComplaints.length === 0 ? (
            <p className="text-gray-500 text-sm">No complaints yet.</p>
          ) : (
            <div className="space-y-3">
              {recentComplaints.map(complaint => (
                <Link 
                  key={complaint.id} 
                  to={`/complaints/${complaint.id}`}
                  className="block p-3 border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{complaint.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{complaint.userName}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      complaint.status === COMPLAINT_STATUS.PENDING 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : complaint.status === COMPLAINT_STATUS.IN_PROGRESS 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {complaint.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Pending Staff Verification</h2>
            <Button 
              variant="outline" 
              size="small"
            >
              View All
            </Button>
          </div>
          
          {pendingStaff.length === 0 ? (
            <p className="text-gray-500 text-sm">No staff awaiting verification.</p>
          ) : (
            <div className="space-y-3">
              {pendingStaff.map(staff => (
                <div 
                  key={staff.id} 
                  className="p-3 border border-gray-200 rounded-md"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">{staff.name}</h3>
                      <p className="text-sm text-gray-500">{staff.email}</p>
                      <p className="text-xs text-gray-500 mt-1">{staff.department}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1.5 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors">
                        <CheckCircle size={16} />
                      </button>
                      <button className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                        <XCircle size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* High priority complaints */}
      {highPriorityComplaints.length > 0 && (
        <div className="mt-6 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <AlertTriangle size={20} className="text-red-500 mr-2" />
            <h2 className="text-lg font-semibold">High Priority Complaints</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highPriorityComplaints.map(complaint => (
              <ComplaintCard key={complaint.id} complaint={complaint} compact />
            ))}
          </div>
        </div>
      )}
    </>
  );
  
  const renderComplaintsTab = () => (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">All Complaints</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search complaints..." 
              className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <select className="pr-8 pl-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-200">
            <option value="">All Statuses</option>
            {Object.values(COMPLAINT_STATUS).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block w-8 h-8 border-3 rounded-full border-blue-300 border-t-blue-600 animate-spin"></div>
          <p className="text-gray-600 mt-4">Loading complaints...</p>
        </div>
      ) : complaints.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No complaints found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {complaints.map(complaint => {
                  const formattedDate = new Date(complaint.createdAt).toLocaleDateString();
                  
                  return (
                    <tr key={complaint.id} className="hover:bg-gray-50">
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {complaint.id.substring(0, 5)}...
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {complaint.title.length > 30 
                          ? `${complaint.title.substring(0, 30)}...` 
                          : complaint.title}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {complaint.userName}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {complaint.department}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex text-xs px-2 py-1 rounded-full ${
                          complaint.status === COMPLAINT_STATUS.PENDING 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : complaint.status === COMPLAINT_STATUS.IN_PROGRESS 
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex text-xs px-2 py-1 rounded-full ${
                          complaint.priority === 'High' 
                            ? 'bg-red-100 text-red-800' 
                            : complaint.priority === 'Medium' 
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {complaint.priority}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formattedDate}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Link 
                          to={`/complaints/${complaint.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{complaints.length}</span> results
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
  
  const renderStaffTab = () => (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Staff Management</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search staff..." 
              className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <select className="pr-8 pl-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-200">
            <option value="">All Departments</option>
            <option value="technical">Technical Support</option>
            <option value="billing">Billing</option>
            <option value="sales">Sales</option>
            <option value="customer">Customer Support</option>
          </select>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-md font-medium mb-4 flex items-center">
          <UserCheck size={16} className="text-amber-600 mr-2" />
          Pending Verification
        </h3>
        
        {pendingStaff.length === 0 ? (
          <p className="text-gray-500 text-sm">No staff members awaiting verification.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingStaff.map(staff => (
                  <tr key={staff.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {staff.name}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {staff.email}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {staff.department}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="success" size="small">
                          Approve
                        </Button>
                        <Button variant="danger" size="small">
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-md font-medium mb-4">Verified Staff</h3>
        <p className="text-gray-500 text-sm italic">This section would display a list of verified staff members with options to manage them.</p>
      </div>
    </div>
  );
  
  const renderDepartmentsTab = () => (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Department Management</h2>
        <Button variant="primary" size="small">
          Add Department
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department Name
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created By
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Complaints
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resolution Rate
              </th>
              <th className="px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {departmentMetrics.map((dept, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {dept.name}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                  Admin
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                  {dept.total}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${dept.rate}%` }}
                      ></div>
                    </div>
                    <span className={dept.rate >= 70 ? 'text-green-600' : dept.rate >= 40 ? 'text-yellow-600' : 'text-red-600'}>
                      {dept.rate}%
                    </span>
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="small">
                      Edit
                    </Button>
                    <Button variant="danger" size="small">
                
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage complaints, staff, and departments</p>
      </div>
      
      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            className={`py-2 px-4 rounded-md flex items-center ${
              activeTab === 'overview' 
                ? 'bg-white shadow-sm' 
                : 'hover:bg-gray-200 text-gray-600'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            <BarChart size={18} className="mr-2" />
            Overview
          </button>
          <button
            className={`py-2 px-4 rounded-md flex items-center ${
              activeTab === 'complaints' 
                ? 'bg-white shadow-sm' 
                : 'hover:bg-gray-200 text-gray-600'
            }`}
            onClick={() => setActiveTab('complaints')}
          >
            <AlertCircle size={18} className="mr-2" />
            Complaints
          </button>
          <button
            className={`py-2 px-4 rounded-md flex items-center ${
              activeTab === 'staff' 
                ? 'bg-white shadow-sm' 
                : 'hover:bg-gray-200 text-gray-600'
            }`}
            onClick={() => setActiveTab('staff')}
          >
            <Users size={18} className="mr-2" />
            Staff
          </button>
          <button
            className={`py-2 px-4 rounded-md flex items-center ${
              activeTab === 'departments' 
                ? 'bg-white shadow-sm' 
                : 'hover:bg-gray-200 text-gray-600'
            }`}
            onClick={() => setActiveTab('departments')}
          >
            <Building size={18} className="mr-2" />
            Departments
          </button>
        </div>
      </div>
      
      {loading && (
        <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="inline-block w-8 h-8 border-3 rounded-full border-blue-300 border-t-blue-600 animate-spin"></div>
          <p className="text-gray-600 mt-4">Loading dashboard data...</p>
        </div>
      )}
      
      {!loading && activeTab === 'overview' && renderOverviewTab()}
      {!loading && activeTab === 'complaints' && renderComplaintsTab()}
      {!loading && activeTab === 'staff' && renderStaffTab()}
      {!loading && activeTab === 'departments' && renderDepartmentsTab()}
    </div>
  );
};

export default AdminDashboard;