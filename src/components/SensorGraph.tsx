'use client'

import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { GraphDataResponse } from '@/lib/types'

interface SensorGraphProps {
  data: GraphDataResponse
  color?: string
  height?: number
}

const SensorGraph: React.FC<SensorGraphProps> = ({ 
  data, 
  color = '#10B981', 
  height = 200 
}) => {
  // Transform data for recharts
  const chartData = data.data_points.map(point => ({
    time: new Date(point.timestamp).toLocaleTimeString('th-TH', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    value: point.value,
    fullTime: new Date(point.timestamp).toLocaleString('th-TH'),
    status: point.status
  }))

  // Calculate trend indicator
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return '↗️'
      case 'decreasing':
        return '↘️'
      default:
        return '→'
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'text-green-500'
      case 'decreasing':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{data.fullTime}</p>
          <p className="text-sm text-gray-600">
            {data.value} {data.unit || ''}
          </p>
          <p className="text-xs text-gray-500">
            Status: <span className={`font-medium ${
              data.status === 'green' ? 'text-green-600' : 
              data.status === 'yellow' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {data.status}
            </span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-800">
            {data.sensor_type}
          </h3>
          <span className={`text-sm font-medium ${getTrendColor(data.trend || 'stable')}`}>
            {getTrendIcon(data.trend || 'stable')} {data.trend || 'stable'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="font-bold text-2xl text-gray-800">
            {data.average_value?.toFixed(1) || '0.0'}
            {data.unit && <span className="text-sm font-normal text-gray-500 ml-1">{data.unit}</span>}
          </div>
          <div className="text-sm text-gray-500">
            Last 24h
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Min: {data.min_value?.toFixed(1) || '0.0'}</span>
          <span>Max: {data.max_value?.toFixed(1) || '0.0'}</span>
          <span>Avg: {data.average_value?.toFixed(1) || '0.0'}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`gradient-${data.sensor_type.replace(/\s+/g, '-').replace(/[()]/g, '').toLowerCase()}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#666' }}
              interval="preserveStartEnd"
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#666' }}
              domain={['dataMin - 1', 'dataMax + 1']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={3}
              fill={`url(#gradient-${data.sensor_type.replace(/\s+/g, '-').replace(/[()]/g, '').toLowerCase()})`}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Time labels */}
        <div className="flex justify-between mt-3 text-xs text-gray-500">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>
      </div>
    </div>
  )
}

export default SensorGraph
