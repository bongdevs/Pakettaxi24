/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface KPICardProps {
    title: string;
    value: string | number;
    icon: string;
}

export const KPICard = ({ title, value, icon }: KPICardProps) => (
    <div className="card">
        <div className="card-icon">
             <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div className="card-content">
            <h3>{title}</h3>
            <p>{value}</p>
        </div>
    </div>
);