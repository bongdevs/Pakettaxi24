/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User } from '../../data/types';

interface HeaderProps {
    title: string;
    user: User;
    actions?: React.ReactNode;
}

export const Header = ({ title, user, actions }: HeaderProps) => {
    return (
        <header className="header">
            <h2>{title}</h2>
            <div className="header-actions">
                {actions}
                <div className="search-bar">
                    <span className="material-symbols-outlined">search</span>
                    <input type="text" placeholder="Search..." />
                </div>
                <div className="profile-section">
                    <img src={`https://i.pravatar.cc/40?u=${user.email}`} alt={user.name} />
                    <div>
                        <strong>{user.name}</strong>
                        <span>{user.role}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};