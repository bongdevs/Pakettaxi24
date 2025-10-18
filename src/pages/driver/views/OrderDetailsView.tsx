/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { Order } from '../../../data/types';
import { StatusPill } from '../../../components/common/StatusPill';
import { OrderRouteMap } from '../../../components/common/OrderRouteMap';
import { COMMISSION_RATE } from '../../../data/mockData';

interface OrderDetailsViewProps {
    orderId: string;
    orders: Order[];
    onBack: () => void;
}

export const OrderDetailsView = ({ orderId, orders, onBack }: OrderDetailsViewProps) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return <p>Order not found.</p>;

    return (
        <div className="order-details-view">
            <button onClick={onBack} className="back-button">
                <span className="material-symbols-outlined">arrow_back</span>
                Back to Order History
            </button>
            <div className="details-grid">
                <div className="card">
                    <h3>Order Summary</h3>
                    <p><strong>ID:</strong> {order.id}</p>
                    <p><strong>Status:</strong> <StatusPill status={order.status} /></p>
                    <p><strong>Date:</strong> {order.date}</p>
                </div>
                 <div className="card">
                    <h3>Financials</h3>
                    <p><strong>Total Charge:</strong> ${order.deliveryCharge.toFixed(2)}</p>
                    <hr />
                    <p><strong>Your Earnings:</strong> ${(order.deliveryCharge * (1 - COMMISSION_RATE)).toFixed(2)}</p>
                </div>
                 <div className="card card-full-width">
                    <h3>Customer & Locations</h3>
                     <p><strong>Customer:</strong> {order.customerName}</p>
                     <p><strong>Pickup:</strong> {order.pickupAddress}</p>
                     <p><strong>Dropoffs:</strong></p>
                     <ul>{Array.isArray(order.dropoffPoints) && order.dropoffPoints.map(p => <li key={p.id}>{p.address}</li>)}</ul>
                </div>
                <div className="card card-full-width">
                    <h3>Delivery Route</h3>
                    <OrderRouteMap order={order} />
                </div>
            </div>
        </div>
    );
};
