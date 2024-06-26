import styles from '../styles/Profiles.module.css';
import React from 'react';
import { useState, useEffect} from 'react';


const Profiles = () => {
    
    const [profiles, setProfiles] = useState([])

    useEffect(() => {
        const savedProfiles = JSON.parse(localStorage.getItem('profiles')) || [];
        setProfiles(savedProfiles)
    }, [])

    const handleSaveCurrentProfile = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'getProfileData' }, (response) => {
            if (response.error) {
                alert(response.error);
                return;
            }
            if (response){
                const newProfile = {
                    url: response.url,
                    id: response.id,
                    name: response.name,
                    bio: response.bio,
                    picture: response.picture,
                };
                const updatedProfiles = [...profiles, newProfile];
                setProfiles(updatedProfiles);
                localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
            }
        });
        });
    };

    
    return (
        <div className={styles.wrapper}>
            <div className={styles.buttons}>
                <button onClick={handleSaveCurrentProfile}>Save current profile</button>
                <span>or</span>
                <div className={styles.addNew}>
                    <input type="url" placeholder="Enter a profile link" />
                    <button>save</button>
                </div>
            </div>
            <h2>Your saved Profiles</h2>
            <div className={styles.profileList}>
                {profiles.map((profile, index) => (
                    <div className = {styles.profileCard} key={index}>
                        <a href={profile.profileURL}>
                            <img src={profile.picture} alt={profile.name} />
                            <h3>{profile.name}</h3>
                            <p>{profile.bio}</p>
                        </a>
                        <button className = {styles.note}>notes</button>
                        <button className = {styles.delete}>delete profile</button>
                    </div>
                ))}
            </div>
        </div>
    );
};
 
export default Profiles;