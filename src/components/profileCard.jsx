import React from 'react';
import styles from '../styles/ProfileCard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';


const ProfileCard = ({profile, handleOpenProfile, handleDeleteProfile}) => {
    return (
        <div className={styles.profileCard}>
            <div className={styles.profileData}>
                <div className={styles.profileImage}>
                    <img src={profile.picture} alt={profile.name} />
                </div>
                <div className={styles.profileInfo}>
                    <span className={styles.profileHeader}>
                        <h3>{profile.name}</h3>
                        <a href={profile.profileURL}>
                            <FontAwesomeIcon icon={faExternalLinkAlt} />
                        </a>
                    </span>
                    <p>{profile.position}</p>
                    <p>{profile.company}</p>
                </div>
            </div>
            <div className={styles.profileActions}>
                <button className = {styles.expandProfileButton} onClick={() => {handleOpenProfile(profile)}}>Expand</button>
                <button className = {styles.deleteProfileButton} onClick={() => {handleDeleteProfile(profile.id)}}>delete profile</button>
            </div>
        </div>
    );
}
 
export default ProfileCard;