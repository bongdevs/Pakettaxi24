/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { User, Order } from '../../../data/types';
import { StatusPill } from '../../../components/common/StatusPill';
import { PointsBadgeWithTooltip } from '../../../components/common/PointsBadgeWithTooltip';

interface HistoryViewProps {
    user: User;
    allOrders: Order[];
}

export const HistoryView = ({ user, allOrders }: HistoryViewProps) => {
    const orderHistory = useMemo(() => {
        return allOrders
            .filter(o => o.customerName === user.name && (o.status === 'Delivered' || o.status === 'Cancelled'))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [allOrders, user.name]);

    return (
        <div className="card">
            <h3>Your Past Orders</h3>
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Driver</th>
                            <th>Dropoff Points</th>
                            <th>Charge</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderHistory.length > 0 ? (
                            orderHistory.map(order => (
                                <tr key={order.id}>
                                    <td><strong>{order.id}</strong></td>
                                    <td>{order.date}</td>
                                    <td><StatusPill status={order.status} /></td>
                                    <td>{order.driverName || 'N/A'}</td>
                                    <td><PointsBadgeWithTooltip points={order.dropoffPoints} /></td>
                                    <td>${order.deliveryCharge.toFixed(2)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center' }}>You have no past orders.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
