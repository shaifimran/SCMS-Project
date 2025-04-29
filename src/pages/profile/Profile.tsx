import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { User, Mail, Phone, Key, Shield } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    register: registerProfile, 
    handleSubmit: handleProfileSubmit, 
    reset: resetProfile,
    formState: { errors: profileErrors } 
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '123-456-7890', // Mock phone number
    }
  });
  
  const { 
    register: registerPassword, 
    handleSubmit: handlePasswordSubmit, 
    watch: watchPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors } 
  } = useForm<PasswordFormData>();
  
  const newPassword = watchPassword('newPassword');
  
  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      // In a real app: await api.put('/users/profile', data);
      
      // Mock successful update
      setTimeout(() => {
        setIsEditingProfile(false);
        toast.success("Profile updated successfully");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error("Failed to update profile");
      setIsLoading(false);
    }
  };
  
  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsLoading(true);
    try {
      // In a real app: await api.put('/users/password', { currentPassword, newPassword });
      
      // Mock successful update
      setTimeout(() => {
        setIsChangingPassword(false);
        resetPassword();
        toast.success("Password changed successfully");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error("Failed to change password");
      setIsLoading(false);
    }
  };
  
  const cancelProfileEdit = () => {
    resetProfile();
    setIsEditingProfile(false);
  };
  
  const cancelPasswordChange = () => {
    resetPassword();
    setIsChangingPassword(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">View and update your account information</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold flex items-center">
            <User size={20} className="text-blue-600 mr-2" />
            Personal Information
          </h2>
          {!isEditingProfile && (
            <Button 
              variant="outline" 
              size="small"
              onClick={() => setIsEditingProfile(true)}
            >
              Edit
            </Button>
          )}
        </div>
        
        {isEditingProfile ? (
          <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                className={`w-full px-3 py-2 border ${profileErrors.name ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200`}
                {...registerProfile('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                })}
                disabled={isLoading}
              />
              {profileErrors.name && (
                <p className="mt-1 text-sm text-red-600">{profileErrors.name.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className={`w-full px-3 py-2 border ${profileErrors.email ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200`}
                {...registerProfile('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Please enter a valid email',
                  },
                })}
                disabled={isLoading || true} // Email usually can't be changed easily
              />
              {profileErrors.email && (
                <p className="mt-1 text-sm text-red-600">{profileErrors.email.message}</p>
              )}
              {!profileErrors.email && (
                <p className="mt-1 text-xs text-gray-500">
                  Email address cannot be changed. Contact support if needed.
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                className={`w-full px-3 py-2 border ${profileErrors.phone ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200`}
                {...registerProfile('phone', {
                  pattern: {
                    value: /^[0-9-+\s()]*$/,
                    message: 'Please enter a valid phone number',
                  },
                })}
                disabled={isLoading}
              />
              {profileErrors.phone && (
                <p className="mt-1 text-sm text-red-600">{profileErrors.phone.message}</p>
              )}
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={cancelProfileEdit}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                loading={isLoading}
                disabled={isLoading}
              >
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
              <div className="sm:w-1/3 flex items-center text-gray-600 mb-1 sm:mb-0">
                <User size={16} className="mr-2" />
                <span>Full Name</span>
              </div>
              <div className="sm:w-2/3 font-medium">{user?.name}</div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
              <div className="sm:w-1/3 flex items-center text-gray-600 mb-1 sm:mb-0">
                <Mail size={16} className="mr-2" />
                <span>Email</span>
              </div>
              <div className="sm:w-2/3 font-medium">{user?.email}</div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
              <div className="sm:w-1/3 flex items-center text-gray-600 mb-1 sm:mb-0">
                <Phone size={16} className="mr-2" />
                <span>Phone</span>
              </div>
              <div className="sm:w-2/3 font-medium">123-456-7890</div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center py-2">
              <div className="sm:w-1/3 flex items-center text-gray-600 mb-1 sm:mb-0">
                <Shield size={16} className="mr-2" />
                <span>Role</span>
              </div>
              <div className="sm:w-2/3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold flex items-center">
            <Key size={20} className="text-blue-600 mr-2" />
            Change Password
          </h2>
          {!isChangingPassword && (
            <Button 
              variant="outline" 
              size="small"
              onClick={() => setIsChangingPassword(true)}
            >
              Change
            </Button>
          )}
        </div>
        
        {isChangingPassword ? (
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                className={`w-full px-3 py-2 border ${passwordErrors.currentPassword ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200`}
                {...registerPassword('currentPassword', {
                  required: 'Current password is required',
                })}
                disabled={isLoading}
              />
              {passwordErrors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                className={`w-full px-3 py-2 border ${passwordErrors.newPassword ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200`}
                {...registerPassword('newPassword', {
                  required: 'New password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
                  },
                })}
                disabled={isLoading}
              />
              {passwordErrors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className={`w-full px-3 py-2 border ${passwordErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200`}
                {...registerPassword('confirmPassword', {
                  required: 'Please confirm your new password',
                  validate: (value) => 
                    value === newPassword || 'Passwords do not match',
                })}
                disabled={isLoading}
              />
              {passwordErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
              )}
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={cancelPasswordChange}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                loading={isLoading}
                disabled={isLoading}
              >
                Update Password
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-gray-600">
            For security reasons, your password is not displayed. Click the Change button to update your password.
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;