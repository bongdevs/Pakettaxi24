/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Customer, Order, SavedAddress } from '../../../data/types';
import { EditProfileModal } from '../../../components/modals/EditProfileModal';
import { ManageAddressModal } from '../../../components/modals/ManageAddressModal';
import { KPICard } from '../../../components/common/KPICard';

interface ProfileViewProps {
    customer: Customer;
    allOrders: Order[];
    onUpdateProfile: (updatedCustomer: Customer) => void;
}

export const ProfileView = ({ customer, allOrders, onUpdateProfile }: ProfileViewProps) => {
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [addressToManage, setAddressToManage] = useState<SavedAddress | null | 'new'>(null);

    const customerOrders = useMemo(() => allOrders.filter(o => o.customerName === customer.name), [allOrders, customer.name]);
    const totalSpent = useMemo(() => customerOrders.reduce((sum, order) => sum + order.deliveryCharge, 0), [customerOrders]);

    const handleSaveProfile = (name: string, phone: string) => {
        onUpdateProfile({ ...customer, name, phone });
        setIsEditingProfile(false);
    };

    const handleSaveAddress = (address: SavedAddress) => {
        let updatedAddresses;
        const existingAddresses = customer.savedAddresses || [];
        if (existingAddresses.some(a => a.id === address.id)) {
            updatedAddresses = existingAddresses.map(a => a.id === address.id ? address : a);
        } else {
            updatedAddresses = [...existingAddresses, address];
        }
        onUpdateProfile({ ...customer, savedAddresses: updatedAddresses });
        setAddressToManage(null);
    };
    
    const handleDeleteAddress = (addressId: string) => {
        const updatedAddresses = (customer.savedAddresses || []).filter(a => a.id !== addressId);
        onUpdateProfile({ ...customer, savedAddresses: updatedAddresses });
    };

    return (
        <>
            <div className="profile-grid">
                <div className="card">
                    <h3>Profile Information</h3>
                    <p><strong>Name:</strong> {customer.name}</p>
                    <p><strong>Email:</strong> {customer.email}</p>
                    <p><strong>Phone:</strong> {customer.phone || 'Not set'}</p>
                    <button className="action-btn" onClick={() => setIsEditingProfile(true)} style={{ marginTop: '1rem' }}>Edit Profile</button>
                </div>
                 <div className="card">
                    <h3>Account Statistics</h3>
                    <KPICard title="Total Orders" value={customer.orderCount} icon="inventory_2" />
                    <KPICard title="Total Spent" value={`$${totalSpent.toFixed(2)}`} icon="payments" />
                </div>
                <div className="card card-full-width">
                    <h3>Saved Addresses</h3>
                    <div className="address-list">
                        {(customer.savedAddresses && customer.savedAddresses.length > 0) ? (
                             <ul>
                                {customer.savedAddresses.map(addr => (
                                    <li key={addr.id} className="address-item">
                                        <div className="address-item-info">
                                            <span className="material-symbols-outlined">home_pin</span>
                                            <div>
                                                <strong>{addr.name}</strong>
                                                <span>{addr.address}</span>
                                            </div>
                                        </div>
                                        <div className="address-actions">
                                            <button className="action-btn-sm btn-info" onClick={() => setAddressToManage(addr)} title="Edit Address">
                                                <span className="material-symbols-outlined">edit</span>
                                            </button>
                                            <button className="action-btn-sm btn-danger" onClick={() => handleDeleteAddress(addr.id)} title="Delete Address">
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No saved addresses yet.</p>
                        )}
                       
                    </div>
                     <button className="action-btn" onClick={() => setAddressToManage('new')} style={{ marginTop: '1rem' }}>Add New Address</button>
                </div>
            </div>

            {isEditingProfile && (
                <EditProfileModal
                    customer={customer}
                    onClose={() => setIsEditingProfile(false)}
                    onSave={handleSaveProfile}
                />
            )}
            {addressToManage && (
                <ManageAddressModal
                    address={addressToManage === 'new' ? null : addressToManage}
                    onClose={() => setAddressToManage(null)}
                    onSave={handleSaveAddress}
                />
            )}
        </>
    );
};