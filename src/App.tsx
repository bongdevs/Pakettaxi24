
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthPage } from './pages/AuthPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { DriverDashboard } from './pages/driver/DriverDashboard';
import { User, Order, Customer, Driver } from './data/types';
import { mockOrders, mockDrivers, generateCustomers } from './data/mockData';

export const App = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    // Centralized state for orders, drivers, and customers
    const [orders, setOrders] = useState<Order[]>(mockOrders);
    const [drivers, setDrivers] = useState(mockDrivers);
    const [customers, setCustomers] = useState(() => generateCustomers(mockOrders));

    useEffect(() => {
        // Re-generate customers if orders change
        setCustomers(generateCustomers(orders));

        // Recalculate driver ratings and delivery counts
        const driversToUpdate = drivers.map(driver => {
            const driverOrders = orders.filter(o => o.driverName === driver.name);
            const deliveredOrders = driverOrders.filter(o => o.status === 'Delivered');
            const ratedOrders = deliveredOrders.filter(o => o.rating != null);

            const newCompletedCount = deliveredOrders.length;
            let newRating = driver.rating;
            if (ratedOrders.length > 0) {
                const totalRating = ratedOrders.reduce((sum, o) => sum + o.rating!, 0);
                newRating = totalRating / ratedOrders.length;
            }

            // Only create a new object if something changed to avoid unnecessary re-renders
            if (driver.rating !== newRating || driver.deliveriesCompleted !== newCompletedCount) {
                return {
                    ...driver,
                    rating: newRating,
                    deliveriesCompleted: newCompletedCount
                };
            }
            return driver;
        });
        
        if (JSON.stringify(drivers) !== JSON.stringify(driversToUpdate)) {
             setDrivers(driversToUpdate);
        }

    }, [orders]);

    const handleLogin = (user: User) => {
        setCurrentUser(user);
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };

    const handleAddOrder = (newOrder: Order) => {
        setOrders(prevOrders => [newOrder, ...prevOrders]);
    };
    
    const handleUpdateOrders = (updatedOrders: Order[]) => {
        setOrders(updatedOrders);
    };

    const handleUpdateCustomers = (updatedCustomers: Customer[]) => {
        setCustomers(updatedCustomers);
    }
    
    const handleUpdateDrivers = (updatedDrivers: Driver[]) => {
        setDrivers(updatedDrivers);
    };

    if (!currentUser) {
        return <AuthPage onLogin={handleLogin} />;
    }

    switch (currentUser.role) {
        case 'Admin':
            return <AdminDashboard 
                user={currentUser} 
                orders={orders}
                drivers={drivers}
                customers={customers}
                onLogout={handleLogout} 
                onUpdateOrders={handleUpdateOrders}
            />;
        case 'Customer':
            return <CustomerDashboard 
                user={currentUser} 
                allOrders={orders} 
                customers={customers}
                onLogout={handleLogout} 
                onAddOrder={handleAddOrder}
                onUpdateCustomers={handleUpdateCustomers}
                onUpdateOrders={handleUpdateOrders}
            />;
        case 'Driver':
            return <DriverDashboard 
                user={currentUser} 
                allOrders={orders}
                drivers={drivers}
                onLogout={handleLogout}
                onUpdateOrders={handleUpdateOrders}
                onUpdateDrivers={handleUpdateDrivers}
            />;
        default:
            return <AuthPage onLogin={handleLogin} />;
    }
};