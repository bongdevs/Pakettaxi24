/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import * as React from 'react';
import { Order, OrderStatus } from '../../../data/types';
import { StatusPill } from '../../../components/common/StatusPill';
import { PointsBadgeWithTooltip } from '../../../components/common/PointsBadgeWithTooltip';
import { EditOrderModal } from '../../../components/modals/EditOrderModal';

interface OrdersViewProps {
    orders: Order[];
    onUpdateOrders: (orders: Order[]) => void;
    onViewOrder: (orderId: string) => void;
}

export const OrdersView = ({ orders, onUpdateOrders, onViewOrder }: OrdersViewProps) => {
    const [recentlyUpdatedId, setRecentlyUpdatedId] = React.useState<string | null>(null);
    const [editingOrder, setEditingOrder] = React.useState<Order | null>(null);

    const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
        const updatedOrders = orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        );
        onUpdateOrders(updatedOrders);
        setRecentlyUpdatedId(orderId);
        setTimeout(() => setRecentlyUpdatedId(null), 1500);
    };

    const handleSaveChanges = (updatedOrder: Order) => {
        const updatedOrders = orders.map(order =>
            order.id === updatedOrder.id ? updatedOrder : order
        );
        onUpdateOrders(updatedOrders);
        setEditingOrder(null);
        setRecentlyUpdatedId(updatedOrder.id);
        setTimeout(() => setRecentlyUpdatedId(null), 1500);
    };

    return (
        <>
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Order ID</th><th>Customer</th><th>Driver</th><th>Status</th><th>Date</th>
                            <th>Pickup</th><th>Dropoffs</th><th>Charge</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className={order.id === recentlyUpdatedId ? 'row-updated' : ''}>
                                <td><a href="#" className="id-link" onClick={(e) => { e.preventDefault(); onViewOrder(order.id); }}>{order.id}</a></td>
                                <td>{order.customerName}</td>
                                <td>{order.driverName || 'N/A'}</td>
                                <td><StatusPill status={order.status} /></td>
                                <td>{order.date}</td>
                                <td>{order.pickupAddress}</td>
                                <td><PointsBadgeWithTooltip points={order.dropoffPoints} /></td>
                                <td>${order.deliveryCharge.toFixed(2)}</td>
                                <td className="actions-cell">
                                    <button className="action-btn-sm btn-info" onClick={() => setEditingOrder(order)} title="Edit Order">
                                        <span className="material-symbols-outlined">edit</span>
                                    </button>
                                    <button className="action-btn-sm btn-success" onClick={() => handleUpdateStatus(order.id, 'Delivered')} disabled={order.status === 'Delivered' || order.status === 'Cancelled'} title="Mark Delivered">
                                        <span className="material-symbols-outlined">check_circle</span>
                                    </button>
                                    <button className="action-btn-sm btn-danger" onClick={() => handleUpdateStatus(order.id, 'Cancelled')} disabled={order.status === 'Delivered' || order.status === 'Cancelled'} title="Cancel Order">
                                        <span className="material-symbols-outlined">cancel</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {editingOrder && <EditOrderModal order={editingOrder} onClose={() => setEditingOrder(null)} onSave={handleSaveChanges} />}
        </>
    );
};
