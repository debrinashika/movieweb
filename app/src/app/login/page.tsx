"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../styles/login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); 
    
    if (!username || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();

      if (response.ok) {
        console.log('Login successful', result);
        localStorage.setItem('token', result.data.token);
        router.push('/');
        setTimeout(() => window.location.reload(), 800);
      } else {
        alert(result.message || 'Login failed');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className='login'>
      <div className='brown-box'>
        <h1 className='title-text'>LOG IN HERE!</h1>
        <form onSubmit={handleSubmit} className='inputs'>
          <label htmlFor='username' className='input-label'>USERNAME</label>
          <input
            id='username'
            type='text'
            className='text-input'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor='password' className='input-label'>PASSWORD</label>
          <input
            id='password'
            type='password'
            className='text-input'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p className='punyaakun'>
            <a href="/signup" className='signup-link'>Don't have an account yet?</a>
          </p>
          <button type='submit' className='button-login'>SUBMIT</button>
        </form>
      </div>
    </div>
  );
}
