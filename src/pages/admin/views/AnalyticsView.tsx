/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import {
  LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Order, OrderStatus } from '../../../data/types';

interface AnalyticsViewProps {
    orders: Order[];
}

export const AnalyticsView = ({ orders }: AnalyticsViewProps) => {
  const orderVolumeData = useMemo(() => {
    const counts = orders.reduce((acc, order) => {
      acc[order.date] = (acc[order.date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([date, count]) => ({ date, orders: count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [orders]);

  const statusData = useMemo(() => {
    const counts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<OrderStatus, number>);
    
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const PIE_COLORS: Record<OrderStatus, string> = {
    'Delivered': '#22c55e',
    'In Transit': '#f97316',
    'Pending': '#eab308',
    'Cancelled': '#ef4444',
  };

  return (
    <div className="analytics-view">
      <div className="chart-container">
        <h3 className="chart-title">Order Volume Over Time</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={orderVolumeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-container">
        <h3 className="chart-title">Delivery Status Distribution</h3>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
              {statusData.map((entry) => (
                <Cell key={entry.name} fill={PIE_COLORS[entry.name as OrderStatus]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};