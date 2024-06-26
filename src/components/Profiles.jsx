    import styles from '../styles/Profiles.module.css';
    import React from 'react';
    import { useState, useEffect} from 'react';


    const Profiles = () => {
        
        const [profiles, setProfiles] = useState([]);

        useEffect(() => {
            const savedProfiles = JSON.parse(localStorage.getItem('profiles')) || [];
            setProfiles([...profiles, ...savedProfiles]);
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
                        notes: {}
                    };
                    const updatedProfiles = [...profiles, newProfile];
                    setProfiles(updatedProfiles);
                    localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
                }
            });
            });
        };

        const handleDeleteProfile = (id) => {
            const updatedProfiles = profiles.filter((profile) => profile.id !== id);
            setProfiles(updatedProfiles);
            localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
        }

        const [profilePopup, setProfilePopup] = useState(false);
        const [currentProfile, setCurrentProfile] = useState(null);

        const handleOpenProfile = (profile) => {
            setCurrentProfile(profile);
            setProfilePopup(true);
        };

        const handleCloseProfile = () => {
            setProfilePopup(false);
            setCurrentProfile(null);
            setNewNote('');
        }

        const [newNote, setNewNote] = useState('');
        const handleAddNote = () => {

            const noteToAdd = {id: Date.now(), text: newNote}
            const updatedProfiles = profiles.map((profile) => {
                if (profile.id === currentProfile.id) {
                    return {
                        ...profile,
                        notes: [...profile.notes, noteToAdd]
                    };
                }
                return profile;
            });

            setProfiles(updatedProfiles);
            setCurrentProfile({...currentProfile, notes: [...currentProfile.notes, noteToAdd]})
            localStorage.setItem('profiles', JSON.stringify(updatedProfiles));

            setNewNote('');
        }

        const handleDeleteNote = (noteID) => {
            const newNotes = currentProfile.notes.filter((note) => note.id !== noteID);

            const updatedProfiles = profiles.map((profile) => {
                if (profile.id === currentProfile.id) {
                    return {
                        ...profile,
                        notes: newNotes
                    };
                }
                return profile;
            });

            setProfiles(updatedProfiles);
            setCurrentProfile({...currentProfile, notes: newNotes})
            localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
        }
        
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
                            <button className = {styles.expand} onClick={() => {handleOpenProfile(profile)}}>Expand</button>
                            <button className = {styles.delete} onClick={() => {handleDeleteProfile(profile.id)}}>delete profile</button>
                        </div>
                    ))}
                </div>

                {profilePopup && (
                    <div className={styles.profilePopup}>
                        <h3>{currentProfile.name}</h3>
                        <div className={styles.notes}>
                            {!currentProfile.notes && <p>You didn't add any notes for this profile.</p>}
                            {
                                currentProfile.notes.map((note) => (
                                    <div className={styles.note} key={note.id}>
                                        <p>{note.text}</p>
                                        <button onClick={() => {handleDeleteNote(note.id)}}>delete note</button>
                                    </div>
                                ))                                    
                            }
                        </div>
                        <div className={styles.newNote}>
                            <input type="text" value={newNote} onChange={(e) => {setNewNote(e.target.value)}}/>
                            <button onClick={() => {handleAddNote(currentProfile.id)}}>save</button>
                        </div>
                        <button onClick={() => {handleCloseProfile()}}>close</button>
                    </div>
                )}
            </div>
        );
    };
    
    export default Profiles;