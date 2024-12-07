import { Device, DeviceData } from '../types/device';

const API_BASE_URL = 'http://localhost:5000';

export async function fetchDevices(): Promise<Device[]> {
  const response = await fetch(`${API_BASE_URL}/devices`);
  if (!response.ok) {
    throw new Error('Failed to fetch devices');
  }
  return response.json();
}

export async function fetchDeviceData(deviceName: string): Promise<DeviceData[]> {
  const response = await fetch(`${API_BASE_URL}/device/${deviceName}`);
  if (!response.ok) {
    throw new Error('Failed to fetch device data');
  }
  return response.json();
}

export async function addDevice(deviceName: string): Promise<Device> {
  const response = await fetch(`${API_BASE_URL}/device`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: deviceName }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add device');
  }
  
  return response.json();
}