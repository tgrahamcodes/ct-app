'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

interface NavLink {
  href: string;
  label: string;
  icon?: string;
}

const navLinks: NavLink[] = [
  { 
    href: '/components/overview', 
    label: 'Overview', 
    icon: '/home-icon.svg' 
  },
  { 
    href: '/components/patients', 
    label: 'Patients', 
    icon: '/patients-icon.svg' 
  },
  { 
    href: '/components/schedule', 
    label: 'Schedule', 
    icon: '/schedule-icon.svg' 
  },
  { 
    href: '/components/messages', 
    label: 'Messages', 
    icon: '/messages-icon.svg' 
  },
  { 
    href: '/components/transactions', 
    label: 'Transactions', 
    icon: '/transactions-icon.svg' 
  },
];

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Logo Section */}
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <Link href="/components/patients">
              <Image 
                src="/logo.svg" 
                alt="Test Logo" 
                width={150}  
                height={50} 
                style={{
                  maxWidth: '150px',
                  maxHeight: '50px',
                  objectFit: 'contain'
                }}
              />
            </Link>
          </div>
        </div>
        
        {/* Navigation Links Section */}
        <div className={styles.linksSection}>
          <ul className={styles.navLinks}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li 
                  key={link.href} 
                  className={isActive ? styles.activeLink : ''}
                >
                  <Link href={link.href} className="flex items-center">
                    {link.icon && (
                      <div className={styles.iconContainer}>
                        <div 
                          className={styles.icon}
                          style={{
                            backgroundImage: `url('${link.icon}')`
                          }}
                        />
                      </div>
                    )}
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* User Profile Section */}
        <div className={styles.userProfile} ref={dropdownRef}>
          <div className={styles.userProfileContainer}>
            <Image 
              src="/doctor-user-profile.png"
              alt="User Profile"
              width={40}
              height={40}
              className={styles.userImage}
              onClick={toggleDropdown}
            />
            <div className={styles.userProfileText}>
              <div className={styles.userName}>Dr. Jose Simmons</div>
              <div className={styles.userRole}>General Practitioner</div>
            </div>
            <div className={styles.userProfileIcons}>
              <Image 
                src="/settings.svg"
                alt="Settings"
                width={16}
                height={16}
                className={styles.profileIcon}
              />
              <Image 
                src="/hamburger.svg"
                alt="Menu"
                width={16}
                height={16}
                className={styles.profileIcon}
              />
            </div>
          </div>

          {isDropdownOpen && (
            <div className={styles.userDropdown}>
              <ul>
                <li>
                  <Link href="/components/profile">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link href="/components/settings">
                    Settings
                  </Link>
                </li>
                <li>
                  <Link href="/logout">
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;