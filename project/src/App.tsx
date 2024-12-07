import React, { useEffect, useState, useCallback } from 'react';
import { Device, DeviceData } from './types/device';
import { fetchDevices, fetchDeviceData, addDevice } from './api/deviceApi';
import { DeviceSelect } from './components/DeviceSelect';
import { DataChart } from './components/DataChart';
import { LoadingSpinner } from './components/LoadingSpinner';
import { DeviceControls } from './components/DeviceControls';
import { AddDeviceModal } from './components/AddDeviceModal';
import { GaugeCircle } from 'lucide-react';

function App() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [isAddingDevice, setIsAddingDevice] = useState(false);

  const loadDevices = useCallback(async () => {
    try {
      const deviceList = await fetchDevices();
      setDevices(deviceList);
    } catch (err) {
      setError('Failed to load devices');
      console.error(err);
    }
  }, []);

  const loadDeviceData = useCallback(async () => {
    if (!selectedDevice) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchDeviceData(selectedDevice);
      setDeviceData(data);
    } catch (err) {
      setError('Failed to load device data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDevice]);

  useEffect(() => {
    loadDevices();
  }, [loadDevices]);

  useEffect(() => {
    if (selectedDevice) {
      loadDeviceData();
    }
  }, [selectedDevice, loadDeviceData]);

  const handleAddDevice = async (deviceName: string) => {
    setIsAddingDevice(true);
    try {
      await addDevice(deviceName);
      await loadDevices();
    } finally {
      setIsAddingDevice(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <GaugeCircle className="w-12 h-12 text-blue-600 mr-2" />
            <h1 className="text-4xl font-bold text-gray-900">
              Device Data Dashboard
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Real-time IoT Device Monitoring
          </p>
        </header>

        <DeviceControls
          onAddDevice={() => setIsAddDeviceModalOpen(true)}
          onRefresh={loadDeviceData}
          isLoading={isLoading}
        />

        <DeviceSelect
          devices={devices}
          selectedDevice={selectedDevice}
          onDeviceChange={setSelectedDevice}
          isLoading={isLoading}
        />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8">
            {error}
          </div>
        )}

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          selectedDevice && <DataChart data={deviceData} deviceName={selectedDevice} />
        )}

        <AddDeviceModal
          isOpen={isAddDeviceModalOpen}
          onClose={() => setIsAddDeviceModalOpen(false)}
          onAdd={handleAddDevice}
          isLoading={isAddingDevice}
        />
      </div>
    </div>
  );
}

export default App;