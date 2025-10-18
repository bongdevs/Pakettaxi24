/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface NavItemData {
    id: string;
    icon: string;
    label: string;
}

interface NavItemProps {
    icon: string;
    label: string;
    active: boolean;
    onClick: () => void;
}

const NavItem = ({ icon, label, active, onClick }: NavItemProps) => (
    <a href="#" className={`nav-link ${active ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); onClick(); }}>
        <span className="material-symbols-outlined">{icon}</span>
        <span className="nav-text">{label}</span>
    </a>
);

interface SidebarProps {
    activeView: string;
    setView: (view: any) => void;
    onLogout: () => void;
    navItems: NavItemData[];
}

export const Sidebar = ({ activeView, setView, onLogout, navItems }: SidebarProps) => {
    return (
        <aside className="sidebar">
            <div>
                <div className="sidebar-header">
                    <span className="material-symbols-outlined logo-icon">local_shipping</span>
                    <h1>Pakettaxi24</h1>
                </div>
                <ul className="nav-menu">
                    {navItems.map(item => (
                        <li className="nav-item" key={item.id}>
                            <NavItem
                                icon={item.icon}
                                label={item.label}
                                active={activeView === item.id}
                                onClick={() => setView(item.id)}
                            />
                        </li>
                    ))}
                </ul>
            </div>
            <div className="sidebar-footer">
                <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); onLogout(); }}>
                    <span className="material-symbols-outlined">logout</span>
                    <span className="nav-text">Logout</span>
                </a>
            </div>
        </aside>
    );
};