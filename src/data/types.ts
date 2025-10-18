/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AdminView = 'dashboard' | 'orders' | 'drivers' | 'customers' | 'financials';
export type DriverView = 'dashboard' | 'earnings' | 'settings';
export type CustomerView = 'dashboard' | 'profile' | 'history';
export type OrderStatus = 'Pending' | 'In Transit' | 'Delivered' | 'Cancelled';
export type DriverStatus = 'Online' | 'Offline' | 'On-delivery';
export type UserRole = 'Admin' | 'Driver' | 'Customer';

export interface DropoffPoint {
    id: string;
    address: string;
}

export interface Order {
  id: string;
  customerName: string;
  driverName: string | null;
  pickupAddress: string;
  dropoffPoints: DropoffPoint[];
  status: OrderStatus;
  date: string;
  deliveryCharge: number;
}

export interface BankDetails {
    accountHolder: string;
    bankName: string;
    accountNumber: string;
}

export interface Driver {
  id: string;
  name: string;
  vehicle: string;
  status: DriverStatus;
  rating: number;
  deliveriesCompleted: number;
  phone: string;
  email: string;
  lat: number;
  lng: number;
  bankDetails?: BankDetails;
  currentBalance: number;
  totalEarnings: number;
}

export interface Payout {
    id: string;
    date: string;
    amount: number;
    status: 'Completed' | 'Processing';
}

export interface SavedAddress {
    id: string;
    name: string; // e.g., 'Home', 'Work'
    address: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  orderCount: number;
  phone?: string;
  savedAddresses?: SavedAddress[];
}

export interface User {
    name: string;
    email: string;
    role: UserRole;
}