import React from 'react';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ size = 'medium', fullScreen = false }) => {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  };

  const spinner = (
    <div className={`${sizeClasses[size]} rounded-full border-blue-300 border-t-blue-600 animate-spin`} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
        <div className="flex flex-col items-center">
          {spinner}
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-8">
      {spinner}
    </div>
  );
};

export default Loading;