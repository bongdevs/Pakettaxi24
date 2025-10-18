
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { User, Order } from '../../../data/types';
import { StatusPill } from '../../../components/common/StatusPill';
import { PointsBadgeWithTooltip } from '../../../components/common/PointsBadgeWithTooltip';
import { RatingInput } from '../../../components/common/RatingInput';

interface HistoryViewProps {
    user: User;
    allOrders: Order[];
    onViewDetails: (orderId: string) => void;
    onUpdateOrders: (orders: Order[]) => void;
}

export const HistoryView = ({ user, allOrders, onViewDetails, onUpdateOrders }: HistoryViewProps) => {
    const orderHistory = useMemo(() => {
        return allOrders
            .filter(o => o.customerName === user.name && (o.status === 'Delivered' || o.status === 'Cancelled'))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [allOrders, user.name]);

    const handleRateOrder = (orderId: string, rating: number) => {
        const updatedOrders = allOrders.map(o =>
            o.id === orderId ? { ...o, rating } : o
        );
        onUpdateOrders(updatedOrders);
    };

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
                            <th>Rating</th>
                            <th>Charge</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderHistory.length > 0 ? (
                            orderHistory.map(order => (
                                <tr key={order.id}>
                                    <td>
                                        <a href="#" className="id-link" onClick={(e) => { e.preventDefault(); onViewDetails(order.id); }}>
                                            {order.id}
                                        </a>
                                    </td>
                                    <td>{order.date}</td>
                                    <td><StatusPill status={order.status} /></td>
                                    <td>{order.driverName || 'N/A'}</td>
                                    <td>
                                        {order.status === 'Delivered' ? (
                                            order.rating ? (
                                                <span className="rating-display">{order.rating.toFixed(1)} ★</span>
                                            ) : (
                                                <RatingInput onRate={(rating) => handleRateOrder(order.id, rating)} />
                                            )
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
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