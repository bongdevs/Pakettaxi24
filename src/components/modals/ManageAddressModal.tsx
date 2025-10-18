/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, FormEvent } from 'react';
import { SavedAddress } from '../../data/types';

interface ManageAddressModalProps {
    address: SavedAddress | null;
    onClose: () => void;
    onSave: (address: SavedAddress) => void;
}

export const ManageAddressModal = ({ address, onClose, onSave }: ManageAddressModalProps) => {
    const [name, setName] = useState(address?.name || '');
    const [addressLine, setAddressLine] = useState(address?.address || '');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const newAddress: SavedAddress = {
            id: address?.id || `addr-${Date.now()}`,
            name,
            address: addressLine,
        };
        onSave(newAddress);
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="modal-header">
                        <h3>{address ? 'Edit' : 'Add New'} Address</h3>
                        <button type="button" onClick={onClose} className="modal-close-btn">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="addressName">Label (e.g., Home, Work)</label>
                            <input type="text" id="addressName" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="addressLine">Address</label>
                            <input type="text" id="addressLine" value={addressLine} onChange={e => setAddressLine(e.target.value)} required />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="action-btn">Save Address</button>
                    </div>
                </form>
            </div>
        </div>
    );
};