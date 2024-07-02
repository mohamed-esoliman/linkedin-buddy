import styles from '../styles/Home.module.css';
import React from 'react';
import { useState, useEffect} from 'react';
import { extractProfileData } from '../services/dataScraping';
import ExpandedProfile from './ExpandedProfile';
import Settings from './Settings';

const Home = () => {
    
    const [profiles, setProfiles] = useState([]);
    const [darkMode, setDarkMode] = useState(false);
    const [apiKey, setApiKey] = useState('');

    const handleUpdateProfiles = (newProfiles) => {
        setProfiles(newProfiles);
    }

    const handleUpdateDarkMode = () => {
        setDarkMode(!darkMode);
    }

    const handleUpdateApiKey = (newApiKey) => {
        setApiKey(newApiKey);
    }

    useEffect(() => {
        chrome.storage.sync.get('profiles', (result) => {
            if (result.profiles) {
                setProfiles(result.profiles);
            }
        });

        chrome.storage.sync.get('darkMode', (result) => {
            if (result.darkMode) {
                setDarkMode(result.darkMode);
            }
        });

        chrome.storage.sync.get('apiKey', (result) => {
            if (result.apiKey) {
                setApiKey(result.apiKey);
            }
        });
    }, [])

    useEffect(() => {
        chrome.storage.sync.set({profiles}, () => {
            console.log('Profiles saved');
        });
    }, [profiles]);

    const handleSaveCurrentProfile = async () => {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});

        if (!tab.url || !tab.url.includes('linkedin.com/in/')) {
            alert('This is not a LinkedIn profile.');
            return;
        }

        for (let i = 0; i < profiles.length; i++) {
            if (profiles[i].url === tab.url) {
                alert('This profile has already been saved.');
                return;
            }
        }

        extractProfileData(tab.id).then(profile => {
            console.log(profile);
            const updatedProfiles = [...profiles, profile];
            setProfiles(updatedProfiles);
        });
    }

    const handleDeleteProfile = (id) => {
        const updatedProfiles = profiles.filter((profile) => profile.id !== id);
        setProfiles(updatedProfiles);
    }

    // settings
    const [settingsPopup, setSettingsPopup] = useState(false);

    const handleOpenSettings = () => {
        setSettingsPopup(true);
    };

    const handleCloseSettings = () => {
        setSettingsPopup(false);
    };



    // Profile popup and notes
    const [profilePopup, setProfilePopup] = useState(false);
    const [currentProfile, setCurrentProfile] = useState(null);

    const updateCurrentProfile = (profile) => {
        setCurrentProfile(profile);
    }

    const handleOpenProfile = (profile) => {
        setCurrentProfile(profile);
        setProfilePopup(true);
    };

    const handleCloseProfile = () => {
        setProfilePopup(false);
        setCurrentProfile(null);
    }
    
    return (
        <div className={styles.wrapper}>
            <nav>
                <div className="icon">
                    <img src="../media/linkedIn-buddy-logo" alt="LinkedIn Buddy"/>
                    <button onClick={handleOpenSettings}>Settings</button>
                </div>
            </nav>

            {settingsPopup && 
            <Settings 
                updateDarkMode = {handleUpdateDarkMode} 
                apiKey = {apiKey} 
                updateApiKey = {handleUpdateApiKey} 
                close = {handleCloseSettings}/>
            }

            <div className={styles.button}>
                <button onClick={() => {handleSaveCurrentProfile()}}>Save current profile</button>
            </div>
            <div className={styles.profileList}>
                <h2>Your saved Profiles</h2>
                {profiles.map((profile, index) => (
                    <div className = {styles.profileCard} key={index}>
                        <a href={profile.profileURL}>
                            <img src={profile.picture} alt={profile.name} />
                            <h3>{profile.name}</h3>
                            <p>{profile.position}</p>
                            <p>{profile.company}</p>
                        </a>
                        <button className = {styles.expand} onClick={() => {handleOpenProfile(profile)}}>Expand</button>
                        <button className = {styles.delete} onClick={() => {handleDeleteProfile(profile.id)}}>delete profile</button>
                    </div>
                ))}
            </div>

            {profilePopup && 
            <ExpandedProfile 
                profiles = {profiles} 
                currentProfile = {currentProfile} 
                updateCurrentProfile = {updateCurrentProfile} 
                updateProfiles = {handleUpdateProfiles} 
                close = {handleCloseProfile}/>
            }
        </div>
    );
};

export default Home;