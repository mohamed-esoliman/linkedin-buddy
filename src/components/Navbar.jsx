import React from 'react';
// import { Link } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
    return (
        <nav>
            <h1>My App</h1>
            <ul className={styles.navLinks}>
                <li>
                    {/* <Link to="/">Home</Link> */}
                    Home
                </li>
                <li>
                    {/* <Link to="/profiles">Profiles</Link> */}
                    Profiles
                </li>
                <li>
                    {/* <Link to="/settings">Settings</Link> */}
                    Settings
                </li>
            </ul>
        </nav>
    );
}
 
export default Navbar;