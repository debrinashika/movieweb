"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../styles/login.css';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmpassword, setconfirmPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); 
    
    if (!username || !password || !email) {
      alert('Please fill in all fields');
      return;
    }

    if (password != confirmpassword) {
      alert('Password do not match');
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email}),
      });
      const result = await response.json();

      if (response.ok) {
        console.log('Signup successful', result);
        router.push('/login');
      } else {
        alert(result.message || 'Signup failed');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className='login'>
      <div className='brown-box'>
        <h1 className='title-text-signup'>SIGN UP HERE!</h1>
        <form onSubmit={handleSubmit} className='inputs'>
          <label htmlFor='email' className='input-label'>EMAIL</label>
          <input
            id='email'
            type='text'
            className='text-input'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
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
          <label htmlFor='confirm-password' className='input-label'>CONFIRM PASSWORD</label>
          <input
            id='confirm-password'
            type='password'
            className='text-input'
            value={confirmpassword}
            onChange={(e) => setconfirmPassword(e.target.value)}
            required
          />
          <p className='punyaakun'>
            <a href="/login" className='signup-link'>Already have an account?</a>
          </p>
          <button type='submit' className='button-login'>SUBMIT</button>
        </form>
      </div>
    </div>
  );
}
