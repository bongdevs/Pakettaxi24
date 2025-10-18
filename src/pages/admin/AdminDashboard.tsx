/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Order, Driver, Customer, AdminView } from '../../data/types';
import { Sidebar } from '../../components/common/Sidebar';
import { Header } from '../../components/common/Header';
import { DashboardView } from './views/DashboardView';
import { OrdersView } from './views/OrdersView';
import { DriversView } from './views/DriversView';
import { CustomersView } from './views/CustomersView';
import { FinancialsView } from './views/FinancialsView';
import { OrderDetailsView } from './views/OrderDetailsView';

interface AdminDashboardProps {
    user: User;
    orders: Order[];
    drivers: Driver[];
    customers: Customer[];
    onLogout: () => void;
    onUpdateOrders: (orders: Order[]) => void;
}

const NAV_ITEMS = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'orders', icon: 'inventory_2', label: 'Orders' },
    { id: 'drivers', icon: 'local_shipping', label: 'Drivers' },
    { id: 'customers', icon: 'group', label: 'Customers' },
    { id: 'financials', icon: 'account_balance_wallet', label: 'Financials' },
];

export const AdminDashboard = ({ user, orders, drivers, customers, onLogout, onUpdateOrders }: AdminDashboardProps) => {
    const [view, setView] = useState<AdminView>('dashboard');
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

    const handleViewOrder = (orderId: string) => {
        setSelectedOrderId(orderId);
    };

    const handleBackToOrders = () => {
        setSelectedOrderId(null);
        setView('orders');
    };

    const handleSetView = (newView: AdminView) => {
        setSelectedOrderId(null);
        setView(newView);
    };

    const getHeaderTitle = () => {
        if (selectedOrderId) return `Order Details #${selectedOrderId}`;
        const title = view.charAt(0).toUpperCase() + view.slice(1);
        return title === 'Financials' ? 'Financials & Commissions' : title;
    };

    const renderContent = () => {
        if (selectedOrderId) {
            return <OrderDetailsView 
                orderId={selectedOrderId} 
                orders={orders}
                drivers={drivers}
                customers={customers}
                onBack={handleBackToOrders} 
            />;
        }
        switch (view) {
            case 'dashboard': return <DashboardView orders={orders} drivers={drivers} />;
            case 'orders': return <OrdersView orders={orders} onUpdateOrders={onUpdateOrders} onViewOrder={handleViewOrder} />;
            case 'drivers': return <DriversView drivers={drivers} orders={orders} />;
            case 'customers': return <CustomersView customers={customers} orders={orders} />;
            case 'financials': return <FinancialsView orders={orders} />;
            default: return <DashboardView orders={orders} drivers={drivers} />;
        }
    };

    return (
        <div id="app-container">
            <Sidebar activeView={view} setView={handleSetView} onLogout={onLogout} navItems={NAV_ITEMS} />
            <main className="main-content">
                <Header title={getHeaderTitle()} user={user} />
                <section className="content-area">
                    {renderContent()}
                </section>
            </main>
        </div>
    );
};