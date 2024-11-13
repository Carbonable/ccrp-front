'use client';
import { useRefetchAll } from '@/context/General';
import React, { useState } from 'react';
import { resetDatabase } from '../../actions/dev/resetDb';

const DangerButton = () => {
  const { triggerRefetch } = useRefetchAll();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleReset = async () => {
    setIsLoading(true);
    setIsSuccess(false);
    try {
      await resetDatabase();
      triggerRefetch();
      setIsSuccess(true);
      // Reset success state after 2 seconds
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleReset}
      disabled={isLoading}
      className={`
        p-4 rounded-full w-32 h-32 
        text-white 
        disabled:opacity-50
        transition-colors duration-200
        ${isSuccess ? 'bg-green-500' : 'bg-red-600'}
      `}
    >
      {isLoading ? 'Resetting...' : isSuccess ? 'Success!' : 'Reset DB\n(dev mode only)'}
    </button>
  );
};

export default DangerButton;