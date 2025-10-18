/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Order, Driver, Customer, Payout } from './types';

export const COMMISSION_RATE = 0.10; // 10% commission

const today = new Date();
const y = today.getFullYear();
const m = (today.getMonth() + 1).toString().padStart(2, '0');
const d = today.getDate().toString().padStart(2, '0');
export const todayStr = `${y}-${m}-${d}`;

export const mockOrders: Order[] = [
  { id: 'ORD001', customerName: 'Alice Johnson', driverName: 'John Smith', pickupAddress: '123 Oak St', dropoffPoints: [{ id: 'dp1-1', address: '456 Pine St' }], status: 'Delivered', date: '2023-10-26', deliveryCharge: 15.00 },
  { id: 'ORD002', customerName: 'Bob Williams', driverName: 'Jane Doe', pickupAddress: '789 Maple Ave', dropoffPoints: [{ id: 'dp2-1', address: '101 Birch Rd' }, { id: 'dp2-2', address: '202 Spruce Ave' }], status: 'In Transit', date: '2023-10-26', deliveryCharge: 20.00 },
  { id: 'ORD003', customerName: 'Charlie Brown', driverName: 'John Smith', pickupAddress: '212 Elm St', dropoffPoints: [{ id: 'dp3-1', address: '313 Cedar Ln' }], status: 'Pending', date: todayStr, deliveryCharge: 15.00 },
  { id: 'ORD004', customerName: 'Diana Prince', driverName: 'John Smith', pickupAddress: '414 Spruce Dr', dropoffPoints: [{ id: 'dp4-1', address: '515 Redwood Ct' }], status: 'Cancelled', date: '2023-10-25', deliveryCharge: 15.00 },
  { id: 'ORD005', customerName: 'Alice Johnson', driverName: 'Mike Ross', pickupAddress: '616 Aspen Way', dropoffPoints: [{ id: 'dp5-1', address: '717 Sequoia Blvd' }], status: 'Delivered', date: '2023-10-26', deliveryCharge: 15.00 },
  { id: 'ORD006', customerName: 'Fiona Glenanne', driverName: 'Jane Doe', pickupAddress: '818 Willow Creek', dropoffPoints: [{ id: 'dp6-1', address: '919 Cypress Hills' }, { id: 'dp6-2', address: '1010 Palm Rd' }, { id: 'dp6-3', address: '1111 Beach Blvd' }], status: 'In Transit', date: '2023-10-27', deliveryCharge: 25.00 },
  { id: 'ORD007', customerName: 'George Costanza', driverName: 'Harvey Specter', pickupAddress: '111 Main St', dropoffPoints: [{ id: 'dp7-1', address: '222 Side St' }], status: 'Delivered', date: '2023-10-28', deliveryCharge: 15.00 },
  { id: 'ORD008', customerName: 'Harry Potter', driverName: 'John Smith', pickupAddress: '4 Privet Drive', dropoffPoints: [{ id: 'dp8-1', address: 'Hogwarts' }], status: 'Pending', date: todayStr, deliveryCharge: 15.00 },
  { id: 'ORD009', customerName: 'Alice Johnson', driverName: 'Jane Doe', pickupAddress: 'Barnett College', dropoffPoints: [{ id: 'dp9-1', address: 'Temple of Doom' }], status: 'In Transit', date: '2023-10-28', deliveryCharge: 15.00 },
  { id: 'ORD010', customerName: 'Bob Williams', driverName: 'Harvey Specter', pickupAddress: '333 Oak St', dropoffPoints: [{ id: 'dp10-1', address: '444 Pine St' }, { id: 'dp10-2', address: '555 Maple Ave' }], status: 'Delivered', date: todayStr, deliveryCharge: 20.00 },
];

export const mockDrivers: Driver[] = [
    { id: 'DRV01', name: 'John Smith', vehicle: 'Van (AB 123 CD)', status: 'Online', rating: 4.8, deliveriesCompleted: 125, phone: '+1-202-555-0103', email: 'john.smith@example.com', lat: 34.0522, lng: -118.2437, currentBalance: 250.75, totalEarnings: 1250.50, bankDetails: { accountHolder: 'John H Smith', bankName: 'Global Bank', accountNumber: '**** **** **** 1234' } },
    { id: 'DRV02', name: 'Jane Doe', vehicle: 'Motorcycle (XY 789 Z)', status: 'On-delivery', rating: 4.9, deliveriesCompleted: 210, phone: '+1-202-555-0142', email: 'jane.doe@example.com', lat: 40.7128, lng: -74.0060, currentBalance: 410.00, totalEarnings: 2300.00 },
    { id: 'DRV03', name: 'Mike Ross', vehicle: 'Car (FG 456 HI)', status: 'Offline', rating: 4.7, deliveriesCompleted: 88, phone: '+1-202-555-0188', email: 'mike.ross@example.com', lat: 41.8781, lng: -87.6298, currentBalance: 120.25, totalEarnings: 950.80, bankDetails: { accountHolder: 'Michael Ross', bankName: 'City Bank', accountNumber: '**** **** **** 5678' } },
    { id: 'DRV04', name: 'Harvey Specter', vehicle: 'Van (JK 789 LM)', status: 'Online', rating: 5.0, deliveriesCompleted: 301, phone: '+1-202-555-0199', email: 'harvey.specter@example.com', lat: 34.0928, lng: -118.3287, currentBalance: 850.00, totalEarnings: 5200.00 },
];

export const mockPayouts: Payout[] = [
    { id: 'PAY01', date: '2023-10-20', amount: 500.00, status: 'Completed' },
    { id: 'PAY02', date: '2023-10-13', amount: 450.50, status: 'Completed' },
    { id: 'PAY03', date: '2023-10-06', amount: 520.25, status: 'Completed' },
    { id: 'PAY04', date: '2023-09-29', amount: 480.00, status: 'Completed' },
];

export const generateCustomers = (orders: Order[]): Customer[] => {
    const customerOrderCounts = orders.reduce((acc, order) => {
        acc[order.customerName] = (acc[order.customerName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return Object.keys(customerOrderCounts)
        .sort()
        .map((name, index) => ({
            id: `CUS${(index + 1).toString().padStart(3, '0')}`,
            name,
            email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
            orderCount: customerOrderCounts[name],
            phone: `+1-202-555-01${Math.floor(10 + Math.random() * 90)}`,
            savedAddresses: name === 'Alice Johnson' ? [
                { id: 'addr1', name: 'Home', address: '123 Oak St' },
                { id: 'addr2', name: 'Work', address: '789 Business Rd' }
            ] : [],
        }));
};