/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { AuthPage } from './pages/AuthPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { DriverDashboard } from './pages/driver/DriverDashboard';
import { User, Order } from './data/types';
import { mockOrders, mockDrivers, generateCustomers } from './data/mockData';

export const App = () => {
    const [currentUser, setCurrentUser] = React.useState<User | null>(null);
    // Centralized state for orders, drivers, and customers
    const [orders, setOrders] = React.useState<Order[]>(mockOrders);
    const [drivers, setDrivers] = React.useState(mockDrivers);
    const [customers, setCustomers] = React.useState(() => generateCustomers(mockOrders));

    React.useEffect(() => {
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
                onLogout={handleLogout} 
                onAddOrder={handleAddOrder}
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
