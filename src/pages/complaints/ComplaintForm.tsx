import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { COMPLAINT_PRIORITY } from '../../config/constants';
import Button from '../../components/ui/Button';
import { getDepartments, createComplaint } from '../../services/complaintService';

interface Department {
  id: string;
  name: string;
  status: string;
}

interface ComplaintFormData {
  title: string;
  description: string;
  departmentId: string;
  priority: string;
}

const ComplaintForm = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<ComplaintFormData>({
    defaultValues: {
      priority: COMPLAINT_PRIORITY.MEDIUM
    }
  });
  
  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const departmentsData = await getDepartments();
        setDepartments(departmentsData);
      } catch (error) {
        toast.error("Failed to load departments");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDepartments();
  }, []);
  
  const onSubmit = async (data: ComplaintFormData) => {
    setIsSubmitting(true);
    try {
      const complaint = await createComplaint(data);
      toast.success("Complaint submitted successfully!");
      navigate(`/complaints/${complaint.id}`);
    } catch (error) {
      toast.error("Failed to submit complaint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Submit a New Complaint</h1>
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-3 rounded-full border-blue-300 border-t-blue-600 animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Submit a New Complaint</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Brief summary of your complaint"
              className={`w-full px-3 py-2 border ${errors.title ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200`}
              {...register('title', {
                required: 'Title is required',
                minLength: {
                  value: 5,
                  message: 'Title must be at least 5 characters',
                },
                maxLength: {
                  value: 100,
                  message: 'Title must not exceed 100 characters',
                },
              })}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={5}
              placeholder="Provide details about your complaint"
              className={`w-full px-3 py-2 border ${errors.description ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200`}
              {...register('description', {
                required: 'Description is required',
                minLength: {
                  value: 20,
                  message: 'Description must be at least 20 characters',
                },
              })}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              id="departmentId"
              className={`w-full px-3 py-2 border ${errors.departmentId ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200`}
              {...register('departmentId', {
                required: 'Department is required',
              })}
              disabled={isSubmitting}
            >
              <option value="">Select a department</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
            {errors.departmentId && (
              <p className="mt-1 text-sm text-red-600">{errors.departmentId.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <div className="flex gap-4">
              {Object.values(COMPLAINT_PRIORITY).map((priority) => (
                <label key={priority} className="flex items-center">
                  <input
                    type="radio"
                    value={priority}
                    {...register('priority')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  <span className="ml-2 text-sm text-gray-700">{priority}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Submit Complaint
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;