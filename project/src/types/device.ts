export interface Device {
  device_name: string;
  topic: string;
}

export interface DeviceData {
  timestamp: string;
  temperature: number;
  humidity: number;
}