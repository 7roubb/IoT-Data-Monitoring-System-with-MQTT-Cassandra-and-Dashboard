import React from 'react';
import { PlusCircle, RefreshCw } from 'lucide-react';

interface DeviceControlsProps {
  onAddDevice: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export function DeviceControls({ onAddDevice, onRefresh, isLoading }: DeviceControlsProps) {
  return (
    <div className="flex gap-4 justify-center mb-8">
      <button
        onClick={onAddDevice}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <PlusCircle className="w-5 h-5 mr-2" />
        Add Device
      </button>
      
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RefreshCw className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
        Refresh Data
      </button>
    </div>
  );
}