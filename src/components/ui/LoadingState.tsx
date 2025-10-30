interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ message = "Loading...", size = 'md' }: LoadingStateProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className={`animate-spin rounded-full border-2 border-brand border-t-transparent ${sizeClasses[size]} mb-4`}></div>
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
}

export function LoadingSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}></div>
  );
}

export function DepartmentCardSkeleton() {
  return (
    <div className="card">
      <LoadingSkeleton className="w-full h-32 mb-4" />
      <div className="text-center">
        <LoadingSkeleton className="w-12 h-12 mx-auto mb-3 rounded-full" />
        <LoadingSkeleton className="w-24 h-6 mx-auto mb-2" />
        <LoadingSkeleton className="w-32 h-4 mx-auto" />
      </div>
    </div>
  );
}

export function PlaceCardSkeleton() {
  return (
    <div className="card">
      <LoadingSkeleton className="w-full h-48 mb-4" />
      <LoadingSkeleton className="w-3/4 h-6 mb-2" />
      <LoadingSkeleton className="w-full h-4 mb-2" />
      <LoadingSkeleton className="w-1/2 h-4" />
    </div>
  );
}