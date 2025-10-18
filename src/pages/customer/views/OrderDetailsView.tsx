
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { Order } from '../../../data/types';
import { StatusPill } from '../../../components/common/StatusPill';
import { OrderRouteMap } from '../../../components/common/OrderRouteMap';
import { RatingInput } from '../../../components/common/RatingInput';

interface OrderDetailsViewProps {
    orderId: string;
    orders: Order[];
    onBack: () => void;
    onUpdateOrders: (orders: Order[]) => void;
}

export const OrderDetailsView = ({ orderId, orders, onBack, onUpdateOrders }: OrderDetailsViewProps) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return <p>Order not found.</p>;

    const handleRateOrder = (orderId: string, rating: number) => {
        const updatedOrders = orders.map(o =>
            o.id === orderId ? { ...o, rating } : o
        );
        onUpdateOrders(updatedOrders);
    };

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
                    <p><strong>Charge:</strong> ${order.deliveryCharge.toFixed(2)}</p>
                </div>
                 <div className="card">
                    <h3>Driver & Rating</h3>
                    <p><strong>Driver:</strong> {order.driverName || 'N/A'}</p>
                    <hr />
                    {order.status === 'Delivered' ? (
                        order.rating ? (
                            <p><strong>Your Rating:</strong> <span className="rating-display">{order.rating.toFixed(1)} ★</span></p>
                        ) : (
                            <>
                                <p><strong>Rate your driver:</strong></p>
                                <RatingInput onRate={(rating) => handleRateOrder(order.id, rating)} />
                            </>
                        )
                    ) : (
                        <p>You can rate the delivery once it's completed.</p>
                    )}
                </div>
                <div className="card card-full-width">
                     <h3>Locations</h3>
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