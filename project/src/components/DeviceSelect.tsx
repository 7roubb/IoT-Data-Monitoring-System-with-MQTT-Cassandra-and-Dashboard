import React from 'react';
import { Device } from '../types/device';

interface DeviceSelectProps {
  devices: Device[];
  selectedDevice: string;
  onDeviceChange: (deviceName: string) => void;
  isLoading: boolean;
}

export function DeviceSelect({ 
  devices, 
  selectedDevice, 
  onDeviceChange, 
  isLoading 
}: DeviceSelectProps) {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <label 
        htmlFor="device-select" 
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Select Device
      </label>
      <select
        id="device-select"
        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        value={selectedDevice}
        onChange={(e) => onDeviceChange(e.target.value)}
        disabled={isLoading}
      >
        <option value="">Select a device</option>
        {devices.map((device) => (
          <option key={device.device_name} value={device.device_name}>
            {device.device_name}
          </option>
        ))}
      </select>
    </div>
  );
}