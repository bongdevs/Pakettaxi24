
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Order, Customer, CustomerView } from '../../data/types';
import { Sidebar } from '../../components/common/Sidebar';
import { Header } from '../../components/common/Header';
import { DashboardView } from './views/DashboardView';
import { ProfileView } from './views/ProfileView';
import { HistoryView } from './views/HistoryView';
import { CreateOrderModal } from '../../components/modals/CreateOrderModal';
import { OrderDetailsView } from './views/OrderDetailsView';

interface CustomerDashboardProps {
    user: User;
    allOrders: Order[];
    customers: Customer[];
    onLogout: () => void;
    onAddOrder: (newOrder: Order) => void;
    onUpdateCustomers: (customers: Customer[]) => void;
    onUpdateOrders: (orders: Order[]) => void;
}

const NAV_ITEMS = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'history', icon: 'history', label: 'Order History' },
    { id: 'profile', icon: 'person', label: 'Profile' },
];

export const CustomerDashboard = ({ user, allOrders, customers, onLogout, onAddOrder, onUpdateCustomers, onUpdateOrders }: CustomerDashboardProps) => {
    const [view, setView] = useState<CustomerView>('dashboard');
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [selectedHistoryOrderId, setSelectedHistoryOrderId] = useState<string | null>(null);
    
    const currentUserData = customers.find(c => c.name === user.name);
    
    const handleUpdateProfile = (updatedCustomer: Customer) => {
        const updatedCustomers = customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c);
        onUpdateCustomers(updatedCustomers);
    };

    const handleViewOrderDetails = (orderId: string) => {
        setSelectedHistoryOrderId(orderId);
    };

    const handleBackToHistory = () => {
        setSelectedHistoryOrderId(null);
        setView('history');
    };

    const getHeaderTitle = () => {
        if (selectedHistoryOrderId) {
            return `Order Details #${selectedHistoryOrderId}`;
        }
        if (view === 'history') return 'Order History';
        return view.charAt(0).toUpperCase() + view.slice(1);
    };

    const renderHeaderActions = () => {
        if (view === 'dashboard' && !selectedHistoryOrderId) {
            return (
                <button className="action-btn" onClick={() => setIsCreatingOrder(true)}>
                    <span className="material-symbols-outlined">add</span> New Delivery
                </button>
            );
        }
        return null;
    };

    const renderContent = () => {
        if (selectedHistoryOrderId) {
            return <OrderDetailsView
                orderId={selectedHistoryOrderId}
                orders={allOrders}
                onBack={handleBackToHistory}
                onUpdateOrders={onUpdateOrders}
            />;
        }

        switch (view) {
            case 'dashboard':
                return <DashboardView user={user} allOrders={allOrders} onUpdateOrders={onUpdateOrders} />;
            case 'history':
                return <HistoryView user={user} allOrders={allOrders} onViewDetails={handleViewOrderDetails} onUpdateOrders={onUpdateOrders} />;
            case 'profile':
                 if (!currentUserData) return <p>Loading profile...</p>;
                return <ProfileView customer={currentUserData} allOrders={allOrders} onUpdateProfile={handleUpdateProfile} />;
            default:
                return <DashboardView user={user} allOrders={allOrders} onUpdateOrders={onUpdateOrders} />;
        }
    };

    return (
        <div id="app-container">
            <Sidebar activeView={view} setView={setView} onLogout={onLogout} navItems={NAV_ITEMS} />
            <main className="main-content">
                <Header title={getHeaderTitle()} user={user} actions={renderHeaderActions()} />
                <section className="content-area">
                    {renderContent()}
                </section>
            </main>
            {isCreatingOrder && <CreateOrderModal onClose={() => setIsCreatingOrder(false)} onSave={onAddOrder} customerName={user.name} />}
        </div>
    );
};