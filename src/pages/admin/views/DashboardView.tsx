/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import * as React from 'react';
import { Order, Driver } from '../../../data/types';
import { KPICard } from '../../../components/common/KPICard';
import { COMMISSION_RATE } from '../../../data/mockData';

interface DashboardViewProps {
    orders: Order[];
    drivers: Driver[];
}

export const DashboardView = ({ orders, drivers }: DashboardViewProps) => {
    const totalRevenue = React.useMemo(() => orders.reduce((sum, order) => {
        return order.status === 'Delivered' ? sum + order.deliveryCharge : sum;
    }, 0).toFixed(2), [orders]);

    const totalCommissions = React.useMemo(() => (parseFloat(totalRevenue) * COMMISSION_RATE).toFixed(2), [totalRevenue]);
    
    return (
        <div className="dashboard-view">
            <div className="kpi-cards">
                <KPICard title="Total Revenue" value={`$${totalRevenue}`} icon="payments" />
                <KPICard title="Total Commissions" value={`$${totalCommissions}`} icon="percent" />
                <KPICard title="Active Drivers" value={drivers.filter(d => d.status === 'Online' || d.status === 'On-delivery').length} icon="local_shipping" />
                <KPICard title="Delivered Orders" value={orders.filter(o => o.status === 'Delivered').length} icon="task_alt" />
            </div>
        </div>
    );
};
