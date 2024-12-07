import React, { useMemo } from 'react';
import { DeviceData } from '../types/device';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataChartProps {
  data: DeviceData[];
  deviceName: string;
}

export function DataChart({ data, deviceName }: DataChartProps) {
  const chartData = useMemo(() => {
    return data.map(item => ({
      ...item,
      timestamp: new Date(item.timestamp).toLocaleTimeString(),
    }));
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        No data available for this device
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {deviceName} - Temperature and Humidity Data
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#FF6B6B"
            name="Temperature"
          />
          <Line
            type="monotone"
            dataKey="humidity"
            stroke="#4ECDC4"
            name="Humidity"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}