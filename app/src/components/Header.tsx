"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { UserService } from '../services/userService';
import Image from 'next/image';
import Link from 'next/link';
import profileIcon from '../assets/ProfileSmall.svg';
import '../styles/header.css';

export default function Header() {
    const [user, setUser] = useState<{ username: string; balance: number } | null>(null);
    const router = useRouter();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const popupRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setUser(null);
                    return;
                }

                const response = await fetch('/api/self', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    console.error('Failed to fetch user data:', response.statusText);
                    setUser(null);
                    return;
                }

                const result = await response.json();
                console.log('Fetched user data:', result.data);
                if (result.status === 'success') {
                    const responseuser = await fetch('/api/users/', {
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const result2 = await responseuser.json();
                    setUser(result2)
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Failed to fetch user data', error);
                setUser(null);
            }
        };

        fetchUserData();
    }, []);

    const togglePopup = () => {
        setIsPopupOpen(prev => !prev);
    };

    const handleLogout = async () => {
        try {
            localStorage.removeItem('token');
            setUser(null);
            router.push('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const handleBought = async () => {
        try {
            router.push('/bought');
        } catch (error) {
            console.error('failed', error);
        }
    };

    const handleBookmark = async () => {
        try {
            router.push('/bookmark');
        } catch (error) {
            console.error('failed', error);
        }
    };

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            setIsPopupOpen(false);
        }
    }, []);

    useEffect(() => {
        if (isPopupOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isPopupOpen, handleClickOutside]);

    return (
        <header>
            <nav className="header-box">
                <h1><Link href="/">MOVIEBROS</Link></h1>
                    {user ? (
                        <div className="profile-sec">
                            <div className="username-balance">
                                <span className="username">{user.username}</span>
                                <span className="balance">Balance: {user.balance}$</span>
                            </div>
                            <Image src={profileIcon} alt="Profile" className="profile-icon-navbar" onClick={togglePopup} />
                            <div className={`profile-popup ${isPopupOpen ? 'show' : ''}`} ref={popupRef}>
                                <button className="popup-option" onClick={handleLogout}>Log Out</button>
                                <button className="popup-option" onClick={handleBookmark}>Bookmark</button>
                                <button className="popup-option" onClick={handleBought}>Bought Film</button>
                            </div>
                        </div>
                    ) : (
                        <div className='button-box'>
                            <Link href="/login"><button>LOG IN</button></Link>
                            <Link href="/signup"><button>SIGN UP</button></Link>
                        </div>
                    )}
            </nav>
        </header>
    );
}
