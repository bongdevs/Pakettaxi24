/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useMemo, FormEvent, ChangeEvent, useEffect } from 'react';
import { User, Order, Driver, DriverView, BankDetails, OrderStatus } from '../../data/types';
import { Sidebar } from '../../components/common/Sidebar';
import { Header } from '../../components/common/Header';
import { todayStr, COMMISSION_RATE } from '../../data/mockData';
import { KPICard } from '../../components/common/KPICard';
import { StatusPill } from '../../components/common/StatusPill';
import { OrderRouteMap } from '../../components/common/OrderRouteMap';
import { mockPayouts } from '../../data/mockData';
import { HistoryView } from './views/HistoryView';
import { OrderDetailsView } from './views/OrderDetailsView';

// --- Sub-components for Driver Views ---

// --- Revamped Dashboard View ---
const DriverDashboardView = ({ driver, allOrders, onUpdateOrders }: { driver: Driver; allOrders: Order[]; onUpdateOrders: (orders: Order[]) => void; }) => {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const availableOrders = useMemo(() => allOrders.filter(o => o.status === 'Pending' && !o.driverName), [allOrders]);
    const activeDeliveries = useMemo(() => allOrders.filter(o => o.driverName === driver.name && (o.status === 'Pending' || o.status === 'In Transit')), [allOrders, driver.name]);
    
    useEffect(() => {
        if (activeDeliveries.length > 0 && !selectedOrder) {
            setSelectedOrder(activeDeliveries[0]);
        } else if (activeDeliveries.length === 0) {
            setSelectedOrder(null);
        }
    }, [activeDeliveries, selectedOrder]);

    const handleAcceptOrder = (orderId: string) => {
        const updatedOrders = allOrders.map(o => o.id === orderId ? { ...o, driverName: driver.name } : o);
        onUpdateOrders(updatedOrders);
    };
    
    const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
        const updatedOrders = allOrders.map(o => o.id === orderId ? { ...o, status, date: todayStr } : o);
        onUpdateOrders(updatedOrders);
    };

    return (
        <>
            <div className="driver-kpis">
                <KPICard title="Your Rating" value={`${driver.rating.toFixed(1)} ★`} icon="star" />
                <KPICard title="Deliveries Completed" value={driver.deliveriesCompleted} icon="task_alt" />
                <KPICard title="Available Jobs" value={availableOrders.length} icon="work" />
                <KPICard title="Your Active Deliveries" value={activeDeliveries.length} icon="local_shipping" />
            </div>
            <div className="driver-dashboard-grid">
                <div className="driver-orders-column">
                    <div className="card driver-orders-list">
                        <h3>Available Orders</h3>
                        {availableOrders.length > 0 ? (
                            <ul>
                                {availableOrders.map(order => (
                                <li key={order.id}>
                                    <div>
                                        <strong>ID: {order.id}</strong>
                                        <span style={{ display: 'block', fontSize: '0.875rem' }}>{order.customerName}</span>
                                    </div>
                                    <button className="action-btn btn-success" onClick={() => handleAcceptOrder(order.id)}>Accept</button>
                                </li>
                                ))}
                            </ul>
                        ) : <p className="no-active-orders">No jobs available.</p>}
                    </div>
                     <div className="card driver-orders-list">
                        <h3>Your Active Deliveries</h3>
                        {activeDeliveries.length > 0 ? (
                             <ul>
                                {activeDeliveries.map(order => (
                                <li key={order.id} className={`clickable ${selectedOrder?.id === order.id ? 'active' : ''}`} onClick={() => setSelectedOrder(order)}>
                                    <div>
                                        <strong>ID: {order.id}</strong>
                                        <span style={{ display: 'block', fontSize: '0.875rem' }}>{order.customerName}</span>
                                    </div>
                                    <StatusPill status={order.status} />
                                </li>
                                ))}
                            </ul>
                        ) : <p className="no-active-orders">No active deliveries.</p>}
                    </div>
                </div>
                <div className="card">
                    <h3>Delivery Route & Actions</h3>
                    {selectedOrder ? (
                        <div>
                             <div className="address-line"><span className="material-symbols-outlined address-icon pickup">trip_origin</span><strong>Pickup: </strong> <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedOrder.pickupAddress)}`} target="_blank" rel="noopener noreferrer">{selectedOrder.pickupAddress}</a></div>
                             {selectedOrder.dropoffPoints.map((point) => (<div key={point.id} className="address-line"><span className="material-symbols-outlined address-icon dropoff">fmd_good</span><strong>Dropoff: </strong><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(point.address)}`} target="_blank" rel="noopener noreferrer">{point.address}</a></div>))}
                            <OrderRouteMap order={selectedOrder} />
                            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                {selectedOrder.status === 'Pending' && <button className="action-btn" onClick={() => handleUpdateStatus(selectedOrder.id, 'In Transit')}>Start Delivery</button>}
                                {selectedOrder.status === 'In Transit' && <button className="action-btn btn-success" onClick={() => handleUpdateStatus(selectedOrder.id, 'Delivered')}>Complete Delivery</button>}
                            </div>
                        </div>
                    ) : (
                         <div className="pending-delivery" style={{ minHeight: '300px' }}>
                            <span className="material-symbols-outlined">map</span>
                            <h4>No Active Delivery Selected</h4>
                            <p>Select a delivery from your list to see the route.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};


// --- Revamped Earnings View ---
const EarningsView = ({ driver, onPayoutRequest }: { driver: Driver; onPayoutRequest: () => void }) => {
    return (
    <div>
        <div className="payout-summary">
            <div className="card"><h3>Available Balance</h3><p>${driver.currentBalance.toFixed(2)}</p><button className="action-btn" onClick={onPayoutRequest}>Request Payout</button></div>
            <div className="card"><h3>Total Earnings</h3><p>${driver.totalEarnings.toFixed(2)}</p></div>
        </div>
        <section className="card"><h3>Payout History</h3>
            <div className="table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Payout ID</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {mockPayouts.length > 0 ? mockPayouts.map(p => (
                        <tr key={p.id}>
                            <td><strong>{p.id}</strong></td>
                            <td>{p.date}</td>
                            <td><StatusPill status={p.status} /></td>
                            <td><strong>${p.amount.toFixed(2)}</strong></td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={4} style={{textAlign: 'center'}}>No payout history found.</td>
                        </tr>
                    )}
                </tbody>
            </table></div>
        </section>
    </div>
    );
};

// --- Revamped Settings View ---
const SettingsView = ({ driver, onSave }: { driver: Driver; onSave: (details: Driver) => void }) => {
    const [personalDetails, setPersonalDetails] = useState({ email: driver.email, phone: driver.phone, vehicle: driver.vehicle });
    const [bankDetails, setBankDetails] = useState<BankDetails>(driver.bankDetails || { accountHolder: '', bankName: '', accountNumber: '' });
    
    const handlePersonalChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPersonalDetails(prev => ({...prev, [name]: value}));
    };
    
    const handleBankChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBankDetails(prev => ({...prev, [name]: value}));
    };
    
    const handlePersonalSubmit = (e: FormEvent) => {
        e.preventDefault(); 
        onSave({ ...driver, ...personalDetails }); 
        alert('Personal details saved!');
    };
    
    const handleBankSubmit = (e: FormEvent) => {
        e.preventDefault(); 
        onSave({ ...driver, bankDetails }); 
        alert('Bank details saved!');
    };
    
    return (
        <div className="settings-grid">
             <div className="card">
                <h3>Personal & Vehicle Information</h3>
                <form onSubmit={handlePersonalSubmit} className="settings-form">
                    <div className="form-group"><label htmlFor="name">Full Name</label><input type="text" id="name" name="name" value={driver.name} readOnly /></div>
                    <div className="form-group"><label htmlFor="email">Email Address</label><input type="email" id="email" name="email" value={personalDetails.email} onChange={handlePersonalChange} required /></div>
                    <div className="form-group"><label htmlFor="phone">Phone Number</label><input type="tel" id="phone" name="phone" value={personalDetails.phone} onChange={handlePersonalChange} required /></div>
                    <div className="form-group"><label htmlFor="vehicle">Vehicle</label><input type="text" id="vehicle" name="vehicle" value={personalDetails.vehicle} onChange={handlePersonalChange} required /></div>
                    <div className="form-actions"><button type="submit" className="action-btn">Save Personal Info</button></div>
                </form>
            </div>
            <div className="card">
                <h3>Payout Settings</h3>
                <p>Manage your bank account details for receiving payouts.</p>
                <form onSubmit={handleBankSubmit} className="settings-form">
                    <div className="form-group"><label htmlFor="accountHolder">Account Holder Name</label><input type="text" id="accountHolder" name="accountHolder" value={bankDetails.accountHolder} onChange={handleBankChange} required /></div>
                    <div className="form-group"><label htmlFor="bankName">Bank Name</label><input type="text" id="bankName" name="bankName" value={bankDetails.bankName} onChange={handleBankChange} required /></div>
                    <div className="form-group"><label htmlFor="accountNumber">Account Number</label><input type="text" id="accountNumber" name="accountNumber" value={bankDetails.accountNumber} onChange={handleBankChange} required /></div>
                    <div className="form-actions"><button type="submit" className="action-btn">Save Bank Details</button></div>
                </form>
            </div>
        </div>
    );
};


// --- Main Driver Dashboard Component ---

const NAV_ITEMS = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'history', icon: 'history', label: 'Order History' },
    { id: 'earnings', icon: 'payments', label: 'Earnings' },
    { id: 'settings', icon: 'settings', label: 'Settings' },
];

interface DriverDashboardProps {
    user: User;
    allOrders: Order[];
    drivers: Driver[];
    onLogout: () => void;
    onUpdateOrders: (orders: Order[]) => void;
    onUpdateDrivers: (drivers: Driver[]) => void;
}

export const DriverDashboard = ({ user, allOrders, drivers, onLogout, onUpdateOrders, onUpdateDrivers }: DriverDashboardProps) => {
    const [driverView, setDriverView] = useState<DriverView>('dashboard');
    const [selectedHistoryOrderId, setSelectedHistoryOrderId] = useState<string | null>(null);
    const driverData = useMemo(() => drivers.find(d => d.name === user.name), [drivers, user.name]);

    const handleSaveDriver = (updatedDriver: Driver) => {
        const updatedDrivers = drivers.map(d => d.id === updatedDriver.id ? updatedDriver : d);
        onUpdateDrivers(updatedDrivers);
    };

    const handlePayoutRequest = () => {
        if (driverData && driverData.currentBalance > 0) {
            alert(`Payout of $${driverData.currentBalance.toFixed(2)} requested!`);
            const updatedDriver = { ...driverData, currentBalance: 0 };
            handleSaveDriver(updatedDriver);
        } else {
            alert('No balance available for payout.');
        }
    };
    
    const handleViewOrderDetails = (orderId: string) => {
        setSelectedHistoryOrderId(orderId);
    };

    const handleBackToHistory = () => {
        setSelectedHistoryOrderId(null);
        setDriverView('history');
    };
    
    const handleSetView = (newView: DriverView) => {
        setSelectedHistoryOrderId(null);
        setDriverView(newView);
    };

    if (!driverData) return <div className="loading">Loading driver data...</div>;

    const getHeaderTitle = () => {
        if (selectedHistoryOrderId) {
            return `Order Details #${selectedHistoryOrderId}`;
        }
        switch (driverView) {
            case 'dashboard':
                return 'Driver Dashboard';
            case 'history':
                return 'Order History';
            case 'earnings':
                return 'Earnings & Payouts';
            case 'settings':
                return 'Profile & Settings';
            default:
                return 'Driver Dashboard';
        }
    };

    const renderContent = () => {
        if (selectedHistoryOrderId) {
            return <OrderDetailsView orderId={selectedHistoryOrderId} orders={allOrders} onBack={handleBackToHistory} />;
        }
        switch(driverView) {
            case 'dashboard': return <DriverDashboardView driver={driverData} allOrders={allOrders} onUpdateOrders={onUpdateOrders} />;
            case 'history': return <HistoryView driver={driverData} orders={allOrders} onViewDetails={handleViewOrderDetails} />;
            case 'earnings': return <EarningsView driver={driverData} onPayoutRequest={handlePayoutRequest} />;
            case 'settings': return <SettingsView driver={driverData} onSave={handleSaveDriver} />;
            default: return null;
        }
    };

    return (
        <div className="driver-dashboard-container">
            <Sidebar activeView={driverView} setView={handleSetView} onLogout={onLogout} navItems={NAV_ITEMS} />
            <main className="main-content">
                <Header title={getHeaderTitle()} user={user} />
                <div className="content-area">{renderContent()}</div>
            </main>
        </div>
    );
};