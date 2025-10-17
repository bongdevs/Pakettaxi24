/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import * as React from 'react';
import { Order } from '../../../data/types';
import { KPICard } from '../../../components/common/KPICard';
import { COMMISSION_RATE, todayStr } from '../../../data/mockData';

interface FinancialsViewProps {
    orders: Order[];
}

export const FinancialsView = ({ orders }: FinancialsViewProps) => {
    const deliveredOrders = React.useMemo(() => orders.filter(o => o.status === 'Delivered'), [orders]);

    const financialData = React.useMemo(() => {
        const todayUTC = new Date();
        todayUTC.setUTCHours(0, 0, 0, 0);

        const startOfWeek = new Date(todayUTC);
        startOfWeek.setUTCDate(todayUTC.getUTCDate() - todayUTC.getUTCDay());

        const startOfMonth = new Date(todayUTC.getUTCFullYear(), todayUTC.getUTCMonth(), 1);

        const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.deliveryCharge, 0);
        const totalCommissions = totalRevenue * COMMISSION_RATE;

        const todaysCommissions = deliveredOrders
            .filter(o => o.date === todayStr)
            .reduce((sum, order) => sum + (order.deliveryCharge * COMMISSION_RATE), 0);

        const weeklyCommissions = deliveredOrders
            .filter(o => new Date(o.date) >= startOfWeek)
            .reduce((sum, order) => sum + (order.deliveryCharge * COMMISSION_RATE), 0);
            
        const monthlyCommissions = deliveredOrders
            .filter(o => new Date(o.date) >= startOfMonth)
            .reduce((sum, order) => sum + (order.deliveryCharge * COMMISSION_RATE), 0);

        return { totalCommissions, todaysCommissions, weeklyCommissions, monthlyCommissions };
    }, [deliveredOrders]);

    return (
        <div className="financials-view">
            <div className="financial-summary-grid">
                <KPICard title="Total Commissions" value={`$${financialData.totalCommissions.toFixed(2)}`} icon="percent" />
                <KPICard title="Commissions Today" value={`$${financialData.todaysCommissions.toFixed(2)}`} icon="today" />
                <KPICard title="Commissions This Week" value={`$${financialData.weeklyCommissions.toFixed(2)}`} icon="calendar_view_week" />
                <KPICard title="Commissions This Month" value={`$${financialData.monthlyCommissions.toFixed(2)}`} icon="calendar_month" />
            </div>
            <div className="card">
                <h3>Commission Log</h3>
                 <div className="table-container modal-table">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Total Charge</th>
                                <th>Commission Earned</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveredOrders.map(order => (
                                <tr key={order.id}>
                                    <td><strong>{order.id}</strong></td>
                                    <td>{order.date}</td>
                                    <td>${order.deliveryCharge.toFixed(2)}</td>
                                    <td>${(order.deliveryCharge * COMMISSION_RATE).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
