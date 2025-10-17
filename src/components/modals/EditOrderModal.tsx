/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import * as React from 'react';
import { Order } from '../../data/types';

interface EditOrderModalProps {
    order: Order;
    onSave: (order: Order) => void;
    onClose: () => void;
}

export const EditOrderModal = ({ order, onSave, onClose }: EditOrderModalProps) => {
    const [formData, setFormData] = React.useState<Order>(order);
    const BASE_FEE = 10;
    const FEE_PER_DROP = 5;

    React.useEffect(() => {
        const charge = BASE_FEE + (formData.dropoffPoints.length * FEE_PER_DROP);
        setFormData(prev => ({ ...prev, deliveryCharge: charge }));
    }, [formData.dropoffPoints.length]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDropoffChange = (id: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            dropoffPoints: prev.dropoffPoints.map(dp => (dp.id === id ? { ...dp, address: value } : dp))
        }));
    };

    const addDropoffPoint = () => {
        setFormData(prev => ({
            ...prev,
            dropoffPoints: [...prev.dropoffPoints, { id: `new-${Date.now()}`, address: '' }]
        }));
    };

    const removeDropoffPoint = (id: string) => {
        setFormData(prev => ({
            ...prev,
            dropoffPoints: prev.dropoffPoints.filter(dp => dp.id !== id)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="modal-header">
                        <h3>Edit Order {order.id}</h3>
                        <button type="button" onClick={onClose} className="modal-close-btn">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="customerName">Customer Name</label>
                            <input type="text" id="customerName" name="customerName" value={formData.customerName} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="pickupAddress">Pickup Address</label>
                            <input type="text" id="pickupAddress" name="pickupAddress" value={formData.pickupAddress} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Dropoff Points</label>
                            {formData.dropoffPoints.map((point, index) => (
                                <div key={point.id} className="dropoff-point-input">
                                    <input
                                        type="text"
                                        value={point.address}
                                        onChange={(e) => handleDropoffChange(point.id, e.target.value)}
                                        placeholder={`Dropoff Address #${index + 1}`}
                                        required
                                    />
                                    <button type="button" onClick={() => removeDropoffPoint(point.id)} className="remove-btn" disabled={formData.dropoffPoints.length <= 1}>
                                        <span className="material-symbols-outlined">remove_circle</span>
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={addDropoffPoint} className="add-btn">
                                <span className="material-symbols-outlined">add_circle</span> Add another dropoff
                            </button>
                        </div>
                        <div className="delivery-charge">
                            <h4>Estimated Charge:</h4>
                            <p>${formData.deliveryCharge.toFixed(2)}</p>
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
