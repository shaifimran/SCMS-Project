import api from './authService';

// Get complaints based on user role
export const getComplaints = async (filters = {}) => {
  try {
    // In a real app: const { data } = await api.get('/complaints', { params: filters });
    
    // Mock data
    return mockComplaints;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get complaints');
  }
};

// Get a single complaint by ID
export const getComplaintById = async (id: string) => {
  try {
    // In a real app: const { data } = await api.get(`/complaints/${id}`);
    
    // Mock data
    return mockComplaints.find(complaint => complaint.id === id) || null;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get complaint details');
  }
};

// Create a new complaint
export const createComplaint = async (complaintData: any) => {
  try {
    // In a real app: const { data } = await api.post('/complaints', complaintData);
    
    // Mock response
    return {
      id: 'new-id-' + Date.now(),
      ...complaintData,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create complaint');
  }
};

// Update complaint status (for staff)
export const updateComplaintStatus = async (id: string, status: string, remarks: string = '') => {
  try {
    // In a real app: const { data } = await api.put(`/complaints/${id}`, { status, remarks });
    
    // Mock response
    const complaint = mockComplaints.find(c => c.id === id);
    if (!complaint) throw new Error('Complaint not found');
    
    return {
      ...complaint,
      status,
      remarks: remarks || complaint.remarks
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update complaint status');
  }
};

// Submit feedback on resolved complaint (for users)
export const submitFeedback = async (id: string, feedback: string) => {
  try {
    // In a real app: const { data } = await api.post(`/complaints/${id}/feedback`, { feedback });
    
    // Mock response
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to submit feedback');
  }
};

// Appeal a resolved complaint (for users)
export const appealComplaint = async (id: string, reason: string) => {
  try {
    // In a real app: const { data } = await api.put(`/complaints/${id}/appeal`, { reason });
    
    // Mock response
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to appeal complaint');
  }
};

// Mock data for UI development
const mockComplaints = [
  {
    id: 'c1',
    title: 'Internet Service Disruption',
    description: 'Internet has been down for the past 3 days in my area. Need urgent resolution.',
    status: 'Pending',
    priority: 'High',
    department: 'Technical Support',
    departmentId: 'd1',
    userId: 'u1',
    userName: 'John Doe',
    staffId: null,
    staffName: null,
    isAppealed: false,
    feedback: '',
    remarks: '',
    createdAt: '2023-04-15T10:30:00Z',
    updatedAt: '2023-04-15T10:30:00Z'
  },
  {
    id: 'c2',
    title: 'Billing Discrepancy',
    description: 'I was charged twice for my last month\'s subscription. Please rectify.',
    status: 'In Progress',
    priority: 'Medium',
    department: 'Billing',
    departmentId: 'd2',
    userId: 'u1',
    userName: 'John Doe',
    staffId: 's1',
    staffName: 'Alice Johnson',
    isAppealed: false,
    feedback: '',
    remarks: 'Investigating the duplicate charge. Will update soon.',
    createdAt: '2023-04-10T14:20:00Z',
    updatedAt: '2023-04-12T09:15:00Z'
  },
  {
    id: 'c3',
    title: 'Request for Service Upgrade',
    description: 'I would like to upgrade my current plan to the premium tier.',
    status: 'Resolved',
    priority: 'Low',
    department: 'Sales',
    departmentId: 'd3',
    userId: 'u2',
    userName: 'Jane Smith',
    staffId: 's2',
    staffName: 'Bob Williams',
    isAppealed: false,
    feedback: 'Great service! Plan was upgraded quickly.',
    remarks: 'Upgrade completed. Customer has been notified.',
    createdAt: '2023-04-05T11:45:00Z',
    updatedAt: '2023-04-06T16:30:00Z'
  },
  {
    id: 'c4',
    title: 'App Login Issues',
    description: 'Unable to login to the mobile app for the past 2 days. Getting error code 503.',
    status: 'In Progress',
    priority: 'High',
    department: 'Technical Support',
    departmentId: 'd1',
    userId: 'u3',
    userName: 'Michael Brown',
    staffId: 's3',
    staffName: 'Sarah Davis',
    isAppealed: false,
    feedback: '',
    remarks: 'Issue identified as server-side. Engineering team working on fix.',
    createdAt: '2023-04-14T08:50:00Z',
    updatedAt: '2023-04-14T13:20:00Z'
  },
  {
    id: 'c5',
    title: 'Damaged Product Received',
    description: 'The router I received was damaged. The antenna is broken.',
    status: 'Resolved',
    priority: 'Medium',
    department: 'Customer Support',
    departmentId: 'd4',
    userId: 'u1',
    userName: 'John Doe',
    staffId: 's4',
    staffName: 'Tom Wilson',
    isAppealed: true,
    feedback: 'Replacement was provided but it took too long.',
    remarks: 'Replacement router has been shipped.',
    createdAt: '2023-04-01T09:15:00Z',
    updatedAt: '2023-04-04T11:30:00Z'
  }
];

// Get departments for dropdown
export const getDepartments = async () => {
  try {
    // In a real app: const { data } = await api.get('/departments');
    
    // Mock data
    return [
      { id: 'd1', name: 'Technical Support', status: 'Verified' },
      { id: 'd2', name: 'Billing', status: 'Verified' },
      { id: 'd3', name: 'Sales', status: 'Verified' },
      { id: 'd4', name: 'Customer Support', status: 'Verified' },
      { id: 'd5', name: 'Product Development', status: 'Verified' }
    ];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get departments');
  }
};