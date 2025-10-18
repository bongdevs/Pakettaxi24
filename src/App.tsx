/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthPage } from './pages/AuthPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { DriverDashboard } from './pages/driver/DriverDashboard';
import { User, Order, Customer } from './data/types';
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
                onLogout={handleLogout}
                onUpdateOrders={handleUpdateOrders}
            />;
        default:
            return <AuthPage onLogin={handleLogin} />;
    }
};