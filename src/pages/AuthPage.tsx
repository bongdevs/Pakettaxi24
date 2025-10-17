/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { User, UserRole } from '../data/types';

interface AuthPageProps {
    onLogin: (user: User) => void;
}

export const AuthPage = ({ onLogin }: AuthPageProps) => {
    const [isLoginView, setIsLoginView] = React.useState(true);
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [role, setRole] = React.useState<UserRole>('Customer');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Dummy user logic
        if (isLoginView) {
            if (email === 'customer@example.com' && password === 'password') {
                onLogin({ name: 'Alice Johnson', email, role: 'Customer' });
                return;
            }
            if (email === 'driver@example.com' && password === 'password') {
                onLogin({ name: 'John Smith', email, role: 'Driver' });
                return;
            }
             if (email === 'admin@example.com' && password === 'password') {
                onLogin({ name: 'Admin User', email, role: 'Admin' });
                return;
            }
        }

        // Generic login/register for any other input
        const user: User = {
            name: isLoginView ? 'Admin User' : name,
            email,
            role: isLoginView ? 'Admin' : role
        };
        onLogin(user);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="material-symbols-outlined logo-icon">local_shipping</span>
                    <h2>{isLoginView ? 'Welcome Back!' : 'Create Account'}</h2>
                    <p>Enter your details to {isLoginView ? 'login' : 'register'}</p>
                </div>
                <form className="auth-form" onSubmit={handleSubmit}>
                    {!isLoginView && (
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@example.com" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="password" />
                    </div>
                    {!isLoginView && (
                        <div className="form-group">
                            <label htmlFor="role">I am a...</label>
                            <select id="role" value={role} onChange={e => setRole(e.target.value as UserRole)} required>
                                <option value="Customer">Customer</option>
                                <option value="Driver">Driver</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                    )}
                    <button type="submit" className="auth-btn">{isLoginView ? 'Login' : 'Register'}</button>
                </form>
                <div className="auth-footer">
                    <p>
                        {isLoginView ? "Don't have an account?" : "Already have an account?"}
                        <button onClick={() => setIsLoginView(!isLoginView)}>
                            {isLoginView ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};
