/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useMemo } from 'react';
import { Driver, Order } from '../../../data/types';
import { PointsBadgeWithTooltip } from '../../../components/common/PointsBadgeWithTooltip';
import { COMMISSION_RATE } from '../../../data/mockData';

interface HistoryViewProps {
    driver: Driver;
    orders: Order[];
    onViewDetails: (orderId: string) => void;
}

export const HistoryView = ({ driver, orders, onViewDetails }: HistoryViewProps) => {
    const deliveryHistory = useMemo(() => orders
        .filter(o => o.driverName === driver.name && o.status === 'Delivered')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        [orders, driver.name]
    );

    return (
        <section className="card">
            <h3>Your Delivery History</h3>
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Dropoff Points</th>
                            <th>Total Charge</th>
                            <th>Your Earnings</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deliveryHistory.length > 0 ? deliveryHistory.map(order => (
                            <tr key={order.id}>
                                <td>
                                    <a href="#" className="id-link" onClick={(e) => { e.preventDefault(); onViewDetails(order.id); }}>
                                        {order.id}
                                    </a>
                                </td>
                                <td>{order.date}</td>
                                <td>{order.customerName}</td>
                                <td><PointsBadgeWithTooltip points={order.dropoffPoints} /></td>
                                <td>${order.deliveryCharge.toFixed(2)}</td>
                                <td><strong>${(order.deliveryCharge * (1 - COMMISSION_RATE)).toFixed(2)}</strong></td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center' }}>No delivered orders found in your history.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};
