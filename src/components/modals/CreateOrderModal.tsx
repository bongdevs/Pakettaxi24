/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect, FormEvent } from 'react';
import { Order, DropoffPoint } from '../../data/types';

interface CreateOrderModalProps {
    onClose: () => void;
    onSave: (newOrder: Order) => void;
    customerName: string;
}

export const CreateOrderModal = ({ onClose, onSave, customerName }: CreateOrderModalProps) => {
    const [step, setStep] = useState(1);
    const [pickup, setPickup] = useState('');
    const [dropoffs, setDropoffs] = useState<DropoffPoint[]>([{ id: `new-${Date.now()}`, address: '' }]);
    const [deliveryCharge, setDeliveryCharge] = useState(0);

    const BASE_FEE = 10;
    const FEE_PER_DROP = 5;

    useEffect(() => {
        const charge = BASE_FEE + (dropoffs.length * FEE_PER_DROP);
        setDeliveryCharge(charge);
    }, [dropoffs.length]);

    const handleDropoffChange = (id: string, value: string) => {
        setDropoffs(prev => prev.map(dp => (dp.id === id ? { ...dp, address: value } : dp)));
    };

    const addDropoffPoint = () => {
        setDropoffs(prev => [...prev, { id: `new-${Date.now()}`, address: '' }]);
    };

    const removeDropoffPoint = (id: string) => {
        setDropoffs(prev => prev.filter(dp => dp.id !== id));
    };

    const goToNextStep = (e: FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handleConfirmOrder = () => {
        const newOrder: Order = {
            id: `ORD${Date.now().toString().slice(-4)}`,
            customerName,
            driverName: null,
            pickupAddress: pickup,
            dropoffPoints: dropoffs,
            status: 'Pending',
            date: new Date().toISOString().split('T')[0],
            deliveryCharge,
        };
        onSave(newOrder);
        setStep(3);
    };
    
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Create a New Delivery</h3>
                    <button type="button" onClick={onClose} className="modal-close-btn">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="create-order-steps">
                    <div className={`step ${step >= 1 ? 'active' : ''}`}><span>1</span> Addresses</div>
                    <div className={`step ${step >= 2 ? 'active' : ''}`}><span>2</span> Confirm</div>
                    <div className={`step ${step >= 3 ? 'active' : ''}`}><span>3</span> Success</div>
                </div>
                {step === 1 && (
                    <form onSubmit={goToNextStep}>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="pickupAddress">Pickup Address</label>
                                <input type="text" id="pickupAddress" value={pickup} onChange={e => setPickup(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Dropoff Points</label>
                                {dropoffs.map((point, index) => (
                                    <div key={point.id} className="dropoff-point-input">
                                        <input
                                            type="text"
                                            value={point.address}
                                            onChange={(e) => handleDropoffChange(point.id, e.target.value)}
                                            placeholder={`Dropoff Address #${index + 1}`}
                                            required
                                        />
                                        <button type="button" onClick={() => removeDropoffPoint(point.id)} className="remove-btn" disabled={dropoffs.length <= 1}>
                                            <span className="material-symbols-outlined">remove_circle</span>
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={addDropoffPoint} className="add-btn">
                                    <span className="material-symbols-outlined">add_circle</span> Add another dropoff
                                </button>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                            <button type="submit" className="action-btn">Next: Confirm Details</button>
                        </div>
                    </form>
                )}
                {step === 2 && (
                    <>
                        <div className="modal-body">
                           <h4>Please confirm your delivery details:</h4>
                           <p><strong>Pickup:</strong> {pickup}</p>
                           <p><strong>Dropoffs:</strong></p>
                           <ul>{dropoffs.map(d => <li key={d.id}>{d.address}</li>)}</ul>
                           <div className="delivery-charge">
                               <h4>Estimated Charge:</h4>
                               <p>${deliveryCharge.toFixed(2)}</p>
                           </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn-secondary" onClick={() => setStep(1)}>Back</button>
                            <button type="button" className="action-btn" onClick={handleConfirmOrder}>Confirm Order</button>
                        </div>
                    </>
                )}
                {step === 3 && (
                    <>
                        <div className="modal-body">
                            <div className="success-message">
                                <span className="material-symbols-outlined">task_alt</span>
                                <h3>Order Placed Successfully!</h3>
                                <p>Your order is now pending and will be assigned to a driver shortly.</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="action-btn" onClick={onClose}>Done</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};