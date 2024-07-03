import styles from '../styles/Home.module.css';
import React from 'react';
import { useState, useEffect} from 'react';
import { extractProfileData } from '../services/dataScraping';
import ExpandedProfile from './ExpandedProfile';
import Settings from './Settings';

const Home = () => {

    const [user, setUser] = useState({
        picture: '../media/person.png',
        name: '',
        position: '',
        company: '',
        education: '',
        description: '',
    });
    
    const [profiles, setProfiles] = useState([]);
    const [darkMode, setDarkMode] = useState(false);
    const [apiKey, setApiKey] = useState('');

    const handleUpdateUser = (newUser) => {
        setUser(newUser);
    }
    
    const handleUpdateProfiles = (newProfiles) => {
        setProfiles(newProfiles);
    }

    const handleUpdateDarkMode = () => {
        console.log('Dark mode updated');
        setDarkMode(!darkMode);
    }

    const handleUpdateApiKey = (newApiKey) => {
        setApiKey(newApiKey);
        console.log(newApiKey);
    }

    useEffect(() => {
        chrome.storage.local.get(['user'], (result) => {
            if (result.user) {
                setUser(result.user);
            }
        });

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

        chrome.storage.local.get('apiKey', (result) => {
            if (result.apiKey) {
                setApiKey(result.apiKey);
            }
        }); 
    }, [])

    useEffect(() => {
        chrome.storage.local.set({user}, () => {
            console.log('User saved');
        });
    }, [user]);
    
    useEffect(() => {
        chrome.storage.sync.set({profiles}, () => {
            console.log('Profiles saved');
        });
    }, [profiles]);

    useEffect(() => {
        chrome.storage.sync.set({darkMode}, () => {
            console.log('Dark mode saved:' + darkMode? 'enabled' : 'disabled');
        });
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    useEffect(() => {
        chrome.storage.local.set({apiKey}, () => {
            console.log('API Key saved');
        });
    }, [apiKey]);

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

    const toggleSettings = () => {
        setSettingsPopup(!settingsPopup);
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
                <img src="../media/linkedIn-buddy-logo.svg" alt="LinkedIn Buddy"/>
                <button class = {styles.settingsButton} onClick={toggleSettings}>Settings</button>
            </nav>

            {settingsPopup && 
            <Settings 
                user = {user}
                updateUser = {handleUpdateUser}
                apiKey = {apiKey} 
                updateApiKey = {handleUpdateApiKey}
                darkMode = {darkMode}
                updateDarkMode = {handleUpdateDarkMode} 
                close = {toggleSettings}/>
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
                user = {user}
                profiles = {profiles}
                updateProfiles = {handleUpdateProfiles} 
                currentProfile = {currentProfile} 
                updateCurrentProfile = {updateCurrentProfile}
                apiKey = {apiKey}
                close = {handleCloseProfile}/>
            }
        </div>
    );
};

export default Home;