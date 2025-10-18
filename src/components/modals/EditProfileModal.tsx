/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, FormEvent } from 'react';
import { Customer } from '../../data/types';

interface EditProfileModalProps {
    customer: Customer;
    onClose: () => void;
    onSave: (name: string, phone: string) => void;
}

export const EditProfileModal = ({ customer, onClose, onSave }: EditProfileModalProps) => {
    const [name, setName] = useState(customer.name);
    const [phone, setPhone] = useState(customer.phone || '');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(name, phone);
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="modal-header">
                        <h3>Edit Profile</h3>
                        <button type="button" onClick={onClose} className="modal-close-btn">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="action-btn">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};