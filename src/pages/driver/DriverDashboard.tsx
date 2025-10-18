/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useMemo, FormEvent, ChangeEvent } from 'react';
import { User, Order, Driver, DriverView, BankDetails, OrderStatus } from '../../data/types';
import { Sidebar } from '../../components/common/Sidebar';
import { Header } from '../../components/common/Header';
import { mockDrivers, mockPayouts, todayStr } from '../../data/mockData';
import { KPICard } from '../../components/common/KPICard';
import { StatusPill } from '../../components/common/StatusPill';

// --- Sub-components for Driver Views ---

const DriverDashboardView = ({ orders, onUpdateStatus }: { orders: Order[]; onUpdateStatus: (orderId: string, status: OrderStatus) => void; }) => {
    const activeDeliveries = useMemo(() => orders.filter(o => o.status === 'In Transit' || o.status === 'Pending'), [orders]);
    const deliveryHistory = useMemo(() => orders.filter(o => o.status === 'Delivered' || o.status === 'Cancelled'), [orders]);

    const kpis = useMemo(() => {
        const todaysDeliveries = orders.filter(o => o.date === todayStr && o.status === 'Delivered');
        const earnings = todaysDeliveries.reduce((sum, order) => sum + order.deliveryCharge, 0);
        return { earnings: earnings.toFixed(2), completedToday: todaysDeliveries.length, activeCount: activeDeliveries.length };
    }, [orders, activeDeliveries.length]);

    return (
        <>
            <div className="driver-kpis"><KPICard title="Today's Earnings" value={`$${kpis.earnings}`} icon="payments" /><KPICard title="Active Deliveries" value={kpis.activeCount} icon="local_shipping" /><KPICard title="Completed Today" value={kpis.completedToday} icon="task_alt" /></div>
            <section className="card">
                <h3>Active Deliveries</h3>
                {activeDeliveries.length > 0 ? (<div className="active-deliveries-grid">{activeDeliveries.map(order => (
                    <div key={order.id} className="active-delivery-card">
                        <div className="delivery-card-header"><h4>Order #{order.id}</h4><StatusPill status={order.status} /></div>
                        <div className="delivery-card-body"><p><strong>Customer:</strong> {order.customerName}</p>
                            <div className="address-line"><span className="material-symbols-outlined address-icon pickup">trip_origin</span><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.pickupAddress)}`} target="_blank" rel="noopener noreferrer">{order.pickupAddress}</a></div>
                            {order.dropoffPoints.map((point) => (<div key={point.id} className="address-line"><span className="material-symbols-outlined address-icon dropoff">fmd_good</span><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(point.address)}`} target="_blank" rel="noopener noreferrer">{point.address}</a></div>))}
                        </div>
                        <div className="delivery-card-footer">
                            {order.status === 'Pending' && <button className="action-btn" onClick={() => onUpdateStatus(order.id, 'In Transit')}>Start Delivery</button>}
                            {order.status === 'In Transit' && <button className="action-btn btn-success" onClick={() => onUpdateStatus(order.id, 'Delivered')}>Complete Delivery</button>}
                        </div>
                    </div>))}</div>) : <p className="no-active-orders">No active deliveries.</p>}
            </section>
            <section className="card"><h3>Delivery History</h3>
                <div className="table-container modal-table"><table className="data-table">
                    <thead><tr><th>ID</th><th>Date</th><th>Status</th><th>Earnings</th></tr></thead>
                    <tbody>{deliveryHistory.map(order => (<tr key={order.id}><td><strong>{order.id}</strong></td><td>{order.date}</td><td><StatusPill status={order.status} /></td><td>${order.deliveryCharge.toFixed(2)}</td></tr>))}</tbody>
                </table></div>
            </section>
        </>
    );
};

const EarningsView = ({ driver, onPayoutRequest }: { driver: Driver; onPayoutRequest: () => void }) => (
    <div>
        <div className="payout-summary">
            <div className="card"><h3>Available Balance</h3><p>${driver.currentBalance.toFixed(2)}</p><button className="action-btn" onClick={onPayoutRequest}>Request Payout</button></div>
            <div className="card"><h3>Total Earnings</h3><p>${driver.totalEarnings.toFixed(2)}</p></div>
        </div>
        <section className="card"><h3>Payout History</h3>
            <div className="table-container modal-table"><table className="data-table">
                <thead><tr><th>ID</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>{mockPayouts.map(p => (<tr key={p.id}><td><strong>{p.id}</strong></td><td>{p.date}</td><td>${p.amount.toFixed(2)}</td><td><StatusPill status={p.status} /></td></tr>))}</tbody>
            </table></div>
        </section>
    </div>
);

const SettingsView = ({ driver, onSave }: { driver: Driver; onSave: (details: BankDetails) => void }) => {
    const [details, setDetails] = useState<BankDetails>(driver.bankDetails || { accountHolder: '', bankName: '', accountNumber: '' });
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDetails(prev => ({...prev, [name]: value}));
    };
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault(); onSave(details); alert('Bank details saved!');
    };
    return (
        <div className="card"><h3>Payout Settings</h3><p>Manage your bank account details for receiving payouts.</p>
            <form onSubmit={handleSubmit} className="settings-form">
                <div className="form-group"><label htmlFor="accountHolder">Account Holder Name</label><input type="text" id="accountHolder" name="accountHolder" value={details.accountHolder} onChange={handleChange} required /></div>
                <div className="form-group"><label htmlFor="bankName">Bank Name</label><input type="text" id="bankName" name="bankName" value={details.bankName} onChange={handleChange} required /></div>
                <div className="form-group"><label htmlFor="accountNumber">Account Number</label><input type="text" id="accountNumber" name="accountNumber" value={details.accountNumber} onChange={handleChange} required /></div>
                <div className="form-actions"><button type="submit" className="action-btn">Save Changes</button></div>
            </form>
        </div>
    );
};


// --- Main Driver Dashboard Component ---

const NAV_ITEMS = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'earnings', icon: 'payments', label: 'Earnings' },
    { id: 'settings', icon: 'settings', label: 'Settings' },
];

interface DriverDashboardProps {
    user: User;
    allOrders: Order[];
    onLogout: () => void;
    onUpdateOrders: (orders: Order[]) => void;
}

export const DriverDashboard = ({ user, allOrders, onLogout, onUpdateOrders }: DriverDashboardProps) => {
    const [driverView, setDriverView] = useState<DriverView>('dashboard');
    const [driverData, setDriverData] = useState<Driver | null>(() => mockDrivers.find(d => d.name === user.name) || null);

    const driverOrders = useMemo(() => allOrders.filter(o => o.driverName === user.name), [allOrders, user.name]);

    const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
        const updatedOrders = allOrders.map(order =>
            order.id === orderId ? { ...order, status: newStatus, date: todayStr } : order
        );
        onUpdateOrders(updatedOrders);
    };
    
    const handleSaveBankDetails = (details: BankDetails) => {
        setDriverData(prev => prev ? { ...prev, bankDetails: details } : null);
    };

    const handlePayoutRequest = () => {
        if (driverData && driverData.currentBalance > 0) {
            alert(`Payout of $${driverData.currentBalance.toFixed(2)} requested!`);
            setDriverData(prev => prev ? { ...prev, currentBalance: 0 } : null);
        } else {
            alert('No balance available for payout.');
        }
    };

    if (!driverData) return <div className="loading">Loading driver data...</div>;

    const getHeaderTitle = () => ({ dashboard: 'Driver Dashboard', earnings: 'Earnings & Payouts', settings: 'Settings' })[driverView];

    const renderContent = () => {
        switch(driverView) {
            case 'dashboard': return <DriverDashboardView orders={driverOrders} onUpdateStatus={handleUpdateStatus} />;
            case 'earnings': return <EarningsView driver={driverData} onPayoutRequest={handlePayoutRequest} />;
            case 'settings': return <SettingsView driver={driverData} onSave={handleSaveBankDetails} />;
        }
    };

    return (
        <div className="driver-dashboard-container">
            <Sidebar activeView={driverView} setView={setDriverView} onLogout={onLogout} navItems={NAV_ITEMS} />
            <main className="main-content">
                <Header title={getHeaderTitle()} user={user} />
                <div className="content-area">{renderContent()}</div>
            </main>
        </div>
    );
};