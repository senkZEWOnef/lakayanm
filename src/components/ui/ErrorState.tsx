interface ErrorStateProps {
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: string;
}

export function ErrorState({ 
  title = "Something went wrong",
  message = "We're having trouble loading this content. Please try again.",
  action,
  icon = "⚠️"
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">{message}</p>
      {action && (
        <button 
          onClick={action.onClick}
          className="btn btn-primary"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export function DatabaseErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      icon="🔌"
      title="Database Connection Issue"
      message="We're having trouble connecting to our database. This might be temporary - please try refreshing the page."
      action={onRetry ? {
        label: "Try Again",
        onClick: onRetry
      } : undefined}
    />
  );
}

export function NotFoundState({ 
  title = "Not Found",
  message = "The content you're looking for doesn't exist or has been moved."
}: { title?: string; message?: string }) {
  return (
    <ErrorState
      icon="🔍"
      title={title}
      message={message}
    />
  );
}