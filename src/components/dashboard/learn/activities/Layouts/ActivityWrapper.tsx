import React from "react";

const withActivityWrapper = (WrappedComponent, activityType) => {
  return function ActivityWrapper({ onComplete, ...props }) {
    return (
      <div className="mb-4 rounded-lg border p-4">
        <h2 className="mb-2 text-xl font-semibold">{activityType} Activity</h2>
        <WrappedComponent {...props} />
        <button onClick={onComplete} className="mt-4">
          Complete Activity
        </button>
      </div>
    );
  };
};

export default withActivityWrapper;
