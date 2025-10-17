/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import * as React from 'react';
import { Order, Driver, Customer } from '../../../data/types';
import { StatusPill } from '../../../components/common/StatusPill';
import { LiveTrackingMap } from '../../../components/common/LiveTrackingMap';

interface OrderDetailsViewProps {
    orderId: string;
    orders: Order[];
    drivers: Driver[];
    customers: Customer[];
    onBack: () => void;
}

export const OrderDetailsView = ({ orderId, orders, drivers, customers, onBack }: OrderDetailsViewProps) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return <p>Order not found.</p>;

    const driver = order.driverName ? drivers.find(d => d.name === order.driverName) : null;
    const customer = customers.find(c => c.name === order.customerName);

    return (
        <div className="order-details-view">
            <button onClick={onBack} className="back-button">
                <span className="material-symbols-outlined">arrow_back</span>
                Back to Orders
            </button>
            <div className="details-grid">
                <div className="card">
                    <h3>Order Summary</h3>
                    <p><strong>ID:</strong> {order.id}</p>
                    <p><strong>Status:</strong> <StatusPill status={order.status} /></p>
                    <p><strong>Date:</strong> {order.date}</p>
                    <p><strong>Charge:</strong> ${order.deliveryCharge.toFixed(2)}</p>
                </div>
                 <div className="card">
                    <h3>Customer & Driver</h3>
                    <p><strong>Customer:</strong> {customer?.name || 'N/A'}</p>
                    <p><strong>Contact:</strong> {customer?.email || 'N/A'}</p>
                    <hr />
                    <p><strong>Driver:</strong> {driver?.name || 'N/A'}</p>
                    <p><strong>Vehicle:</strong> {driver?.vehicle || 'N/A'}</p>
                </div>
                <div className="card card-full-width">
                     <h3>Locations</h3>
                     <p><strong>Pickup:</strong> {order.pickupAddress}</p>
                     <p><strong>Dropoffs:</strong></p>
                     <ul>{order.dropoffPoints.map(p => <li key={p.id}>{p.address}</li>)}</ul>
                </div>
                 {order.status === 'In Transit' && order.driverName && (
                    <div className="card card-full-width">
                        <h3>Live Driver Location</h3>
                        <LiveTrackingMap driverName={order.driverName} drivers={drivers} />
                    </div>
                )}
            </div>
        </div>
    );
};
