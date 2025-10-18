
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useMemo, useState, useEffect } from 'react';
import { Order, Driver } from '../../../data/types';
import { KPICard } from '../../../components/common/KPICard';
import { COMMISSION_RATE } from '../../../data/mockData';
import { OrderRouteMap } from '../../../components/common/OrderRouteMap';
import { StatusPill } from '../../../components/common/StatusPill';

interface DashboardViewProps {
    orders: Order[];
    drivers: Driver[];
}

export const DashboardView = ({ orders, drivers }: DashboardViewProps) => {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const totalRevenue = useMemo(() => orders.reduce((sum, order) => {
        return order.status === 'Delivered' ? sum + order.deliveryCharge : sum;
    }, 0).toFixed(2), [orders]);

    const totalCommissions = useMemo(() => (parseFloat(totalRevenue) * COMMISSION_RATE).toFixed(2), [totalRevenue]);
    
    const recentOrders = useMemo(() => {
        return orders
            .slice()
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10);
    }, [orders]);

    useEffect(() => {
        if (recentOrders.length > 0 && !selectedOrder) {
            setSelectedOrder(recentOrders[0]);
        }
    }, [recentOrders, selectedOrder]);

    return (
        <div className="dashboard-view">
            <div className="kpi-cards">
                <KPICard title="Total Revenue" value={`$${totalRevenue}`} icon="payments" />
                <KPICard title="Total Commissions" value={`$${totalCommissions}`} icon="percent" />
                <KPICard title="Active Drivers" value={drivers.filter(d => d.status === 'Online' || d.status === 'On-delivery').length} icon="local_shipping" />
                <KPICard title="Delivered Orders" value={orders.filter(o => o.status === 'Delivered').length} icon="task_alt" />
            </div>
            <div className="admin-dashboard-grid">
                <div className="card recent-orders-list">
                    <h3>Recent Orders</h3>
                    {recentOrders.length > 0 ? (
                        <ul>
                            {recentOrders.map(order => (
                                <li
                                    key={order.id}
                                    className={selectedOrder?.id === order.id ? 'active' : ''}
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    <div>
                                        <strong>ID: {order.id}</strong>
                                        <span style={{ display: 'block', fontSize: '0.875rem' }}>
                                            {order.customerName}
                                        </span>
                                    </div>
                                    <StatusPill status={order.status} />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-active-orders">No recent orders found.</p>
                    )}
                </div>
                <div className="card">
                    <h3>Order Route</h3>
                    {selectedOrder ? (
                        <OrderRouteMap order={selectedOrder} />
                    ) : (
                        <div className="pending-delivery" style={{ minHeight: '300px' }}>
                            <span className="material-symbols-outlined">map</span>
                            <h4>No Order Selected</h4>
                            <p>Select an order from the list to see its route.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
