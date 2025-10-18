/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Customer, Order } from '../../../data/types';
import { CustomerDetailsModal } from '../../../components/modals/CustomerDetailsModal';

interface CustomersViewProps {
    customers: Customer[];
    orders: Order[];
}

export const CustomersView = ({ customers, orders }: CustomersViewProps) => {
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    return (
        <>
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Customer ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Total Orders</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(customer => (
                            <tr key={customer.id} className="clickable-row" onClick={() => setSelectedCustomer(customer)} title="View details">
                                <td><strong>{customer.id}</strong></td>
                                <td>{customer.name}</td>
                                <td>{customer.email}</td>
                                <td>{customer.orderCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedCustomer && (
                <CustomerDetailsModal
                    customer={selectedCustomer}
                    onClose={() => setSelectedCustomer(null)}
                    orders={orders}
                />
            )}
        </>
    );
};