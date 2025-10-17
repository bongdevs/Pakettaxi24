/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { Driver, Order } from '../../data/types';
import { StatusPill } from '../common/StatusPill';
import { PointsBadgeWithTooltip } from '../common/PointsBadgeWithTooltip';

interface DriverDetailsModalProps {
    driver: Driver;
    onClose: () => void;
    orders: Order[];
}

export const DriverDetailsModal = ({ driver, onClose, orders }: DriverDetailsModalProps) => {
    const [sortOrder, setSortOrder] = React.useState<'desc' | 'asc'>('desc');

    const driverOrders = React.useMemo(() => {
        const filteredOrders = orders.filter(o => o.driverName === driver.name);
        filteredOrders.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
        return filteredOrders;
    }, [orders, driver.name, sortOrder]);

    const toggleSortOrder = () => {
        setSortOrder(current => current === 'desc' ? 'asc' : 'desc');
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Driver Details</h3>
                    <button onClick={onClose} className="modal-close-btn">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="driver-info">
                        <p><strong>Name:</strong> {driver.name}</p>
                        <p><strong>Email:</strong> {driver.email}</p>
                        <p><strong>Phone:</strong> {driver.phone}</p>
                        <p><strong>Vehicle:</strong> {driver.vehicle}</p>
                        <p><strong>Status:</strong> <StatusPill status={driver.status} /></p>
                    </div>
                    <h4>Delivery History ({driverOrders.length})</h4>
                    <div className="table-container modal-table">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Dropoffs</th>
                                    <th>Status</th>
                                    <th onClick={toggleSortOrder} className="sortable-header" title="Click to sort">
                                        Date
                                        <span className="material-symbols-outlined sort-icon">
                                            {sortOrder === 'desc' ? 'arrow_downward' : 'arrow_upward'}
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {driverOrders.length > 0 ? driverOrders.map(order => (
                                    <tr key={order.id}>
                                        <td><strong>{order.id}</strong></td>
                                        <td>{order.customerName}</td>
                                        <td><PointsBadgeWithTooltip points={order.dropoffPoints} /></td>
                                        <td><StatusPill status={order.status} /></td>
                                        <td>{order.date}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center' }}>No deliveries found.</td>
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
