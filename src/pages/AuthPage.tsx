/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, FormEvent } from 'react';
import { User, UserRole } from '../data/types';

interface AuthPageProps {
    onLogin: (user: User) => void;
}

const dummyUsers: Record<string, { name: string; role: UserRole }> = {
    'customer@example.com': { name: 'Alice Johnson', role: 'Customer' },
    'driver@example.com': { name: 'John Smith', role: 'Driver' },
    'admin@example.com': { name: 'Admin User', role: 'Admin' },
};

export const AuthPage = ({ onLogin }: AuthPageProps) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>('Customer');
    const [error, setError] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        if (isLoginView) {
            if (password === 'password' && dummyUsers[email]) {
                onLogin({ ...dummyUsers[email], email });
                return;
            }
            setError('Invalid email or password.');

        } else { // Register view
            const newUser: User = { name, email, role };
            // In a real app, you'd check if the user exists, etc.
            // For this mock app, we'll just log them in.
            onLogin(newUser);
        }
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
                    {error && <div className="auth-error">{error}</div>}
                    {!isLoginView && (
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="customer@example.com" />
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