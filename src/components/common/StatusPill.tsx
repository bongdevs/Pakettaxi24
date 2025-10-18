/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { OrderStatus, DriverStatus, Payout } from '../../data/types';

interface StatusPillProps {
    status: OrderStatus | DriverStatus | Payout['status'];
}

export const StatusPill = ({ status }: StatusPillProps) => {
    const className = `status-${status.toLowerCase().replace(/ /g, '-')}`;
    return <span className={`status-pill ${className}`}>{status}</span>;
}