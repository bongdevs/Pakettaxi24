/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import * as React from 'react';
import { Driver, Order } from '../../../data/types';
import { StatusPill } from '../../../components/common/StatusPill';
import { DriverDetailsModal } from '../../../components/modals/DriverDetailsModal';

interface DriversViewProps {
    drivers: Driver[];
    orders: Order[];
}

export const DriversView = ({ drivers, orders }: DriversViewProps) => {
    const [selectedDriver, setSelectedDriver] = React.useState<Driver | null>(null);

    return (
        <>
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Driver ID</th>
                            <th>Name</th>
                            <th>Vehicle</th>
                            <th>Status</th>
                            <th>Rating</th>
                            <th>Deliveries</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drivers.map(driver => (
                            <tr key={driver.id}>
                                <td><strong>{driver.id}</strong></td>
                                <td>{driver.name}</td>
                                <td>{driver.vehicle}</td>
                                <td><StatusPill status={driver.status} /></td>
                                <td>{driver.rating.toFixed(1)} ★</td>
                                <td>{driver.deliveriesCompleted}</td>
                                <td>
                                    <button className="action-btn" onClick={() => setSelectedDriver(driver)}>
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedDriver && <DriverDetailsModal driver={selectedDriver} onClose={() => setSelectedDriver(null)} orders={orders} />}
        </>
    );
};
