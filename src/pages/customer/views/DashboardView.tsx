/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { User, Order, OrderStatus } from '../../../data/types';
import { StatusPill } from '../../../components/common/StatusPill';
import { LiveTrackingMap } from '../../../components/common/LiveTrackingMap';
import { mockDrivers } from '../../../data/mockData';
import { OrderRouteMap } from '../../../components/common/OrderRouteMap';

// --- Sub-component: Delivery Timeline Visualization ---
const DeliveryTimeline = ({ status }: { status: OrderStatus }) => {
    const steps = ['Pending', 'In Transit', 'Delivered'];
    const currentStepIndex = steps.indexOf(status);

    return (
        <div className="timeline">
            {steps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isActive = index === currentStepIndex;
                return (
                    <div key={step} className={`timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                        <div className="timeline-dot"></div>
                        <div className="timeline-content"><p>{step}</p></div>
                    </div>
                );
            })}
        </div>
    );
};


// --- Sub-component: Panel for Active Orders List ---
const ActiveOrdersPanel = ({ orders, selectedOrder, onSelectOrder }: { orders: Order[]; selectedOrder: Order | null; onSelectOrder: (order: Order) => void; }) => (
    <aside className="active-orders-list">
        <div className="card">
            <h3>Your Active Orders</h3>
            {orders.length > 0 ? (
                <ul>{orders.map(order => (
                    <li key={order.id} className={selectedOrder?.id === order.id ? 'active' : ''} onClick={() => onSelectOrder(order)}>
                        <strong>Order #{order.id}</strong>
                        <StatusPill status={order.status} />
                    </li>
                ))}</ul>
            ) : (<p className="no-active-orders">No active orders.</p>)}
        </div>
    </aside>
);

// --- Sub-component: Panel for Tracking a Delivery ---
const DeliveryTrackingPanel = ({ order, onCancelOrder }: { order: Order | null; onCancelOrder: (orderId: string) => void; }) => (
    <main className="delivery-tracking">
        <div className="card">
            {order ? (
                <>
                    <div className="tracking-panel-header">
                        <h3>Tracking Order #{order.id}</h3>
                        {order.status === 'Pending' && (
                            <button className="action-btn btn-danger" onClick={() => onCancelOrder(order.id)}>
                                Cancel Order
                            </button>
                        )}
                    </div>
                    
                    <DeliveryTimeline status={order.status} />
                    
                    {order.status === 'In Transit' && order.driverName ? (
                        <LiveTrackingMap driverName={order.driverName} drivers={mockDrivers} />
                    ) : order.status === 'Pending' ? (
                        <>
                            <OrderRouteMap order={order} />
                            <div className="pending-delivery" style={{ minHeight: 'auto', padding: '1rem 0', color: 'var(--text-secondary)' }}>
                                <h4 style={{fontSize: '1.1rem', margin: 0}}>Your order is pending.</h4>
                                <p>A driver will be assigned shortly.</p>
                            </div>
                        </>
                    ) : (
                         <div className="pending-delivery" style={{ minHeight: 'auto', padding: '2rem 0' }}>
                            <span className="material-symbols-outlined" style={{ marginTop: '2rem' }}>schedule</span>
                            <h4>Your order is {order.status.toLowerCase()}.</h4>
                            <p>Check your order history for details.</p>
                        </div>
                    )}
                </>
            ) : (
                <div className="pending-delivery">
                    <span className="material-symbols-outlined">pace</span>
                    <h4>No Active Order Selected</h4>
                    <p>Select an order from the left to see its status.</p>
                </div>
            )}
        </div>
    </main>
);

interface DashboardViewProps {
    user: User;
    allOrders: Order[];
    onUpdateOrders: (orders: Order[]) => void;
}

export const DashboardView = ({ user, allOrders, onUpdateOrders }: DashboardViewProps) => {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const customerOrders = useMemo(() => allOrders.filter(o => o.customerName === user.name)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [allOrders, user.name]);
        
    const activeOrders = useMemo(() => customerOrders.filter(o => o.status === 'In Transit' || o.status === 'Pending'), [customerOrders]);

    useEffect(() => {
        setSelectedOrder(prevSelectedOrder => {
            const isStillActive = prevSelectedOrder && activeOrders.some(o => o.id === prevSelectedOrder.id);
            if (isStillActive) {
                const updatedSelectedOrder = activeOrders.find(o => o.id === prevSelectedOrder.id);
                return updatedSelectedOrder || null;
            }
            return activeOrders.length > 0 ? activeOrders[0] : null; 
        });
    }, [activeOrders]);
    
    const handleCancelOrder = (orderId: string) => {
        const updatedOrders = allOrders.map(o => 
            o.id === orderId ? { ...o, status: 'Cancelled' as OrderStatus } : o
        );
        onUpdateOrders(updatedOrders);
    };

    return (
        <div className="customer-main-grid">
            <ActiveOrdersPanel
                orders={activeOrders}
                selectedOrder={selectedOrder}
                onSelectOrder={setSelectedOrder}
            />
            <DeliveryTrackingPanel order={selectedOrder} onCancelOrder={handleCancelOrder} />
        </div>
    );
};