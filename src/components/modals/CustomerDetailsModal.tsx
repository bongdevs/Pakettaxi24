/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { Customer, Order } from '../../data/types';
import { StatusPill } from '../common/StatusPill';

interface CustomerDetailsModalProps {
    customer: Customer;
    onClose: () => void;
    orders: Order[];
}

export const CustomerDetailsModal = ({ customer, onClose, orders }: CustomerDetailsModalProps) => {
    const customerOrders = React.useMemo(() => {
        return orders.filter(o => o.customerName === customer.name)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [orders, customer.name]);

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Customer Details</h3>
                    <button onClick={onClose} className="modal-close-btn">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="customer-info">
                        <p><strong>Name:</strong> {customer.name}</p>
                        <p><strong>Email:</strong> {customer.email}</p>
                        <p><strong>Total Orders:</strong> {customer.orderCount}</p>
                    </div>
                    <h4>Order History ({customerOrders.length})</h4>
                    <div className="table-container modal-table">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Driver</th>
                                    <th>Status</th>
                                    <th>Charge</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customerOrders.length > 0 ? customerOrders.map(order => (
                                    <tr key={order.id}>
                                        <td><strong>{order.id}</strong></td>
                                        <td>{order.driverName || 'N/A'}</td>
                                        <td><StatusPill status={order.status} /></td>
                                        <td>${order.deliveryCharge.toFixed(2)}</td>
                                        <td>{order.date}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center' }}>No orders found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
