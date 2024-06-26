    import styles from '../styles/Profiles.module.css';
    import React from 'react';
    import { useState, useEffect} from 'react';


    const Profiles = () => {
        
        const [profiles, setProfiles] = useState([
            {
                url: 'https://www.linkedin.com/in/testProfile/',
                id: '0',
                name: 'Test Profile',
                bio: 'This is a test profile',
                picture: 'https://via.placeholder.com/150',
                notes: ["This is a test note", "This is another test note"]
            }
        ]);

        useEffect(() => {
            const savedProfiles = JSON.parse(localStorage.getItem('profiles')) || [];
            setProfiles([...profiles, ...savedProfiles])
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
                        notes: []
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

        const [notesPopup, setNotesPopup] = useState(false);
        const [currentProfile, setCurrentProfile] = useState(null);

        const handleOpenNotes = (profile) => {
            setCurrentProfile(profile);
            setNotesPopup(true);
        };

        const [newNote, setNewNote] = useState('');
        const handleAddNote = (profileID) => {
            const updatedProfiles = profiles.map((profile) => {
                if (profile.id === profileID) {
                    return {
                        ...profile,
                        notes: [...profile.notes, newNote]
                    };
                }
                return profile;
            });

            setProfiles(updatedProfiles);
            setCurrentProfile({...currentProfile, notes: [...currentProfile.notes, newNote]})
            localStorage.setItem('profiles', JSON.stringify(updatedProfiles));

            setNewNote('');
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
                            <button className = {styles.note} onClick={() => {handleOpenNotes(profile)}}>notes</button>
                            <button className = {styles.delete} onClick={() => {handleDeleteProfile(profile.id)}}>delete profile</button>
                        </div>
                    ))}
                </div>

                {notesPopup && (
                    <div className={styles.notesPopup}>
                        <h3>{currentProfile.name}</h3>
                        <ul>
                            

                            { currentProfile.notes.length === 0?
                                <li>You didn't add any notes for this profile.</li>
                                :                        
                                currentProfile.notes.map((note, index) => (
                                    <li key={index}>{note}</li>
                                ))
                            }
                        </ul>
                        <div className={styles.newNote}>
                            <input type="text" value={newNote} onChange={(e) => {setNewNote(e.target.value)}}/>
                            <button onClick={() => {handleAddNote(currentProfile.id)}}>save</button>
                        </div>
                        <button onClick={() => {setNotesPopup(false)}}>close</button>
                    </div>
                )}
            </div>
        );
    };
    
    export default Profiles;