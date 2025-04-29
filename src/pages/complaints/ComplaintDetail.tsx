import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Clock, User, Building, Flag, FileText, AlertTriangle, ArrowUpRight, MessageSquare } from 'lucide-react';
import { COMPLAINT_STATUS } from '../../config/constants';
import ComplaintStatusBadge from '../../components/complaints/ComplaintStatusBadge';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { getComplaintById, updateComplaintStatus, submitFeedback, appealComplaint } from '../../services/complaintService';

const ComplaintDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [appealReason, setAppealReason] = useState('');
  const [remarks, setRemarks] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showAppealForm, setShowAppealForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchComplaint = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const complaintData = await getComplaintById(id);
        setComplaint(complaintData);
      } catch (error) {
        toast.error("Failed to load complaint details");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    
    fetchComplaint();
  }, [id, navigate]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStatus) return;
    
    setIsSubmitting(true);
    try {
      const updatedComplaint = await updateComplaintStatus(id!, selectedStatus, remarks);
      setComplaint(updatedComplaint);
      setShowUpdateForm(false);
      setRemarks('');
      toast.success(`Complaint status updated to ${selectedStatus}`);
    } catch (error) {
      toast.error("Failed to update complaint status");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    
    setIsSubmitting(true);
    try {
      await submitFeedback(id!, feedback);
      setComplaint({ ...complaint, feedback });
      setShowFeedbackForm(false);
      setFeedback('');
      toast.success("Feedback submitted successfully");
    } catch (error) {
      toast.error("Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAppealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealReason.trim()) return;
    
    setIsSubmitting(true);
    try {
      await appealComplaint(id!, appealReason);
      setComplaint({ ...complaint, isAppealed: true });
      setShowAppealForm(false);
      setAppealReason('');
      toast.success("Appeal submitted successfully");
    } catch (error) {
      toast.error("Failed to submit appeal");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-3 rounded-full border-blue-300 border-t-blue-600 animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!complaint) {
    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <h1 className="text-xl font-medium text-gray-900">Complaint not found</h1>
          <p className="text-gray-600 mt-2">The complaint you're looking for doesn't exist or has been removed.</p>
          <Button 
            variant="primary" 
            className="mt-4" 
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-start mb-5">
          <h1 className="text-2xl font-bold text-gray-900">{complaint.title}</h1>
          <ComplaintStatusBadge status={complaint.status} size="large" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <Clock size={18} className="text-gray-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Submitted on</p>
              <p className="font-medium">{formatDate(complaint.createdAt)}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <User size={18} className="text-gray-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Submitted by</p>
              <p className="font-medium">{complaint.userName}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Building size={18} className="text-gray-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-medium">{complaint.department}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Flag size={18} className="text-gray-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Priority</p>
              <p className={`font-medium ${
                complaint.priority === 'High' ? 'text-red-600' : 
                complaint.priority === 'Medium' ? 'text-orange-600' : 
                'text-blue-600'
              }`}>
                {complaint.priority}
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-5 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <FileText size={18} className="mr-2" />
            Description
          </h2>
          <p className="text-gray-700 whitespace-pre-line">{complaint.description}</p>
        </div>
        
        {complaint.staffId && (
          <div className="border-t border-gray-200 pt-5 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <User size={18} className="mr-2" />
              Assigned Staff
            </h2>
            <p className="text-gray-700">{complaint.staffName}</p>
          </div>
        )}
        
        {complaint.remarks && (
          <div className="border-t border-gray-200 pt-5 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <MessageSquare size={18} className="mr-2" />
              Staff Remarks
            </h2>
            <p className="text-gray-700">{complaint.remarks}</p>
          </div>
        )}
        
        {complaint.feedback && (
          <div className="border-t border-gray-200 pt-5 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <MessageSquare size={18} className="mr-2" />
              User Feedback
            </h2>
            <p className="text-gray-700">{complaint.feedback}</p>
          </div>
        )}
        
        {complaint.isAppealed && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="text-yellow-500 mr-3 mt-0.5" size={20} />
              <div>
                <h3 className="font-medium text-yellow-800">Complaint has been appealed</h3>
                <p className="text-yellow-700 text-sm mt-1">
                  This complaint was previously marked as resolved but has been appealed by the user.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Action buttons - different based on role and complaint status */}
        <div className="border-t border-gray-200 pt-5">
          <div className="flex flex-wrap gap-3">
            {/* User actions */}
            {user?.role === 'User' && complaint.status === COMPLAINT_STATUS.RESOLVED && !complaint.feedback && !showFeedbackForm && (
              <Button 
                variant="primary" 
                onClick={() => setShowFeedbackForm(true)}
              >
                Provide Feedback
              </Button>
            )}
            
            {user?.role === 'User' && complaint.status === COMPLAINT_STATUS.RESOLVED && !complaint.isAppealed && !showAppealForm && (
              <Button 
                variant="outline" 
                onClick={() => setShowAppealForm(true)}
              >
                Appeal Resolution
              </Button>
            )}
            
            {/* Staff actions */}
            {user?.role === 'Staff' && !showUpdateForm && (
              <Button 
                variant="primary" 
                onClick={() => {
                  setSelectedStatus(complaint.status);
                  setShowUpdateForm(true);
                }}
              >
                Update Status
              </Button>
            )}
            
            {/* Admin actions */}
            {user?.role === 'Admin' && !showUpdateForm && (
              <>
                <Button 
                  variant="primary" 
                  onClick={() => {
                    setSelectedStatus(complaint.status);
                    setShowUpdateForm(true);
                  }}
                >
                  Update Status
                </Button>
                
                {!complaint.priority.includes('High') && (
                  <Button variant="outline">
                    Mark as High Priority
                  </Button>
                )}
              </>
            )}
            
            <Button 
              variant="secondary" 
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </div>
          
          {/* Update status form */}
          {showUpdateForm && (
            <form onSubmit={handleStatusUpdate} className="mt-5 border border-gray-200 rounded-md p-4">
              <h3 className="font-medium text-lg mb-3">Update Complaint Status</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                  required
                >
                  {Object.values(COMPLAINT_STATUS).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Add any additional information about this status update"
                ></textarea>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  variant="primary"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Update Status
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowUpdateForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
          
          {/* Feedback form */}
          {showFeedbackForm && (
            <form onSubmit={handleFeedbackSubmit} className="mt-5 border border-gray-200 rounded-md p-4">
              <h3 className="font-medium text-lg mb-3">Provide Feedback</h3>
              
              <div className="mb-4">
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Share your feedback about the resolution of this complaint"
                  required
                ></textarea>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  variant="primary"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Submit Feedback
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowFeedbackForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
          
          {/* Appeal form */}
          {showAppealForm && (
            <form onSubmit={handleAppealSubmit} className="mt-5 border border-gray-200 rounded-md p-4">
              <h3 className="font-medium text-lg mb-3">Appeal Resolution</h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  If you're not satisfied with the resolution, you can appeal to have your complaint reviewed again.
                </p>
                <textarea
                  value={appealReason}
                  onChange={(e) => setAppealReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Please explain why you're appealing the resolution"
                  required
                ></textarea>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  variant="primary"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Submit Appeal
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowAppealForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;