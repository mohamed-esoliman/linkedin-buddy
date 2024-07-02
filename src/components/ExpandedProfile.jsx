import React from 'react';
import { useState } from 'react';
import styles from '../styles/ExpandedProfile.module.css';

const ExpandedProfile = ({profiles, currentProfile, updateCurrentProfile, updateProfiles, close}) => {

    console.log("I am being rendered");
    console.log(currentProfile);

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

        updateProfiles(updatedProfiles);
        updateCurrentProfile({...currentProfile, notes: [...currentProfile.notes, noteToAdd]});

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

        updateProfiles(updatedProfiles);
        updateCurrentProfile({...currentProfile, notes: newNotes});
    }



    return (
        <div className={styles.expandedProfile}>
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
            <button onClick={() => {close()}}>close</button>
        </div>
    );
}
 
export default ExpandedProfile;
