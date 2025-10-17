/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { User, Order, OrderStatus, Driver } from '../../data/types';
import { StatusPill } from '../../components/common/StatusPill';
import { LiveTrackingMap } from '../../components/common/LiveTrackingMap';
import { CreateOrderModal } from '../../components/modals/CreateOrderModal';
import { mockDrivers } from '../../data/mockData';

interface CustomerHeaderProps {
    user: User;
    onLogout: () => void;
    onNewDelivery: () => void;
}
const CustomerHeader = ({ user, onLogout, onNewDelivery }: CustomerHeaderProps) => (
    <header className="customer-header">
        <div className="sidebar-header">
            <span className="material-symbols-outlined logo-icon">local_shipping</span>
            <h1>Pakettaxi24</h1>
        </div>
        <div className="header-actions">
            <button className="action-btn" onClick={onNewDelivery}>
                <span className="material-symbols-outlined">add</span> New Delivery
            </button>
            <div className="profile-section">
                <img src={`https://i.pravatar.cc/40?u=${user.email}`} alt={user.name} />
                <div>
                    <strong>{user.name}</strong>
                    <span>{user.role}</span>
                </div>
            </div>
            <button onClick={onLogout} className="logout-btn-customer" title="Logout">
                <span className="material-symbols-outlined">logout</span>
            </button>
        </div>
    </header>
);

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

interface CustomerDashboardProps {
    user: User;
    allOrders: Order[];
    onLogout: () => void;
    onAddOrder: (newOrder: Order) => void;
}

export const CustomerDashboard = ({ user, allOrders, onLogout, onAddOrder }: CustomerDashboardProps) => {
    const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
    const [isCreatingOrder, setIsCreatingOrder] = React.useState(false);

    const customerOrders = React.useMemo(() => allOrders.filter(o => o.customerName === user.name), [allOrders, user.name]);
    const activeOrders = React.useMemo(() => customerOrders.filter(o => o.status === 'In Transit' || o.status === 'Pending'), [customerOrders]);
    const orderHistory = React.useMemo(() => customerOrders.filter(o => o.status === 'Delivered' || o.status === 'Cancelled'), [customerOrders]);
    
    React.useEffect(() => {
        if (activeOrders.length > 0 && (!selectedOrder || !activeOrders.find(o => o.id === selectedOrder.id))) {
            setSelectedOrder(activeOrders[0]);
        } else if (activeOrders.length === 0) {
            setSelectedOrder(null);
        }
    }, [activeOrders, selectedOrder]);

    return (
        <div className="customer-dashboard-container">
            <CustomerHeader user={user} onLogout={onLogout} onNewDelivery={() => setIsCreatingOrder(true)} />
            <div className="customer-content-area">
                <div className="customer-main-grid">
                    <aside className="active-orders-list">
                        <div className="card">
                            <h3>Your Active Orders</h3>
                            {activeOrders.length > 0 ? (
                                <ul>{activeOrders.map(order => (
                                    <li key={order.id} className={selectedOrder?.id === order.id ? 'active' : ''} onClick={() => setSelectedOrder(order)}>
                                        <strong>Order #{order.id}</strong>
                                        <StatusPill status={order.status} />
                                    </li>
                                ))}</ul>
                            ) : (<p className="no-active-orders">No active orders.</p>)}
                        </div>
                    </aside>
                    <main className="delivery-tracking">
                        <div className="card">
                            {selectedOrder ? (
                                <>
                                    <h3>Tracking Order #{selectedOrder.id}</h3>
                                    {selectedOrder.status === 'In Transit' && selectedOrder.driverName ? (
                                        <>
                                            <DeliveryTimeline status={selectedOrder.status} />
                                            <LiveTrackingMap driverName={selectedOrder.driverName} drivers={mockDrivers} />
                                        </>
                                    ) : (
                                        <div className="pending-delivery">
                                            <span className="material-symbols-outlined">schedule</span>
                                            <h4>Your order is pending.</h4>
                                            <p>A driver will be assigned shortly.</p>
                                        </div>
                                    )}
                                </>
                            ) : (<h3>Select an active order to track</h3>)}
                        </div>
                    </main>
                    <section className="order-history-section">
                         <div className="card">
                            <h3>Your Order History</h3>
                            <div className="table-container modal-table">
                                <table className="data-table">
                                    <thead><tr><th>ID</th><th>Date</th><th>Status</th><th>Charge</th></tr></thead>
                                    <tbody>{orderHistory.map(order => (
                                        <tr key={order.id}>
                                            <td><strong>{order.id}</strong></td>
                                            <td>{order.date}</td>
                                            <td><StatusPill status={order.status} /></td>
                                            <td>${order.deliveryCharge.toFixed(2)}</td>
                                        </tr>
                                    ))}</tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            {isCreatingOrder && <CreateOrderModal onClose={() => setIsCreatingOrder(false)} onSave={onAddOrder} customerName={user.name} />}
        </div>
    );
};
