import React from 'react';
import styles from '../styles/NavBar.module.css';

const NavBar = ({toggleSettings}) => {
    return (
      <nav>
        <img src="../media/linkedIn-buddy-logo.svg" alt="LinkedIn Buddy" />
        <button class={styles.settingsButton} onClick={toggleSettings}>
          Settings
        </button>
      </nav>
    );
}
 
export default NavBar;