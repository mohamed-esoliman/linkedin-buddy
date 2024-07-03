import React from 'react';
import { useState } from 'react';
import styles from '../styles/ExpandedProfile.module.css';
import { generateMessage } from '../services/messageGeneration';

const ExpandedProfile = ({user, profiles, updateProfiles, currentProfile, updateCurrentProfile, apiKey, close}) => {

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

    const [prompt, setPrompt] = useState('');


    const handleGenerateMessage = async () => {
        const name = user.name;
        const description = user.description;

        const receiver = currentProfile.name;
        const receiverPosition = currentProfile.position;
        const receiverCompany = currentProfile.company;

        const message = `Create a professional LinkedIn connection message for ${receiver}. They are working as ${receiverPosition} at ${receiverCompany}. My name is ${name}, and here is a short description about me ${description}.\n Express your desire to connect and learn more. Also, I want you to include the following: ${prompt}. This is a linkedIn message, not an email. Keep it short and professional.`;

        const generatedMessage = await generateMessage(apiKey, message);
        const messageToAdd = {id: Date.now(), text: generatedMessage};
        const updatedProfiles = profiles.map((profile) => {
            if (profile.id === currentProfile.id) {
                return {
                    ...profile,
                    messages: [...profile.messages, messageToAdd]
                };
            }
            return profile;
        }
        );
        updateProfiles(updatedProfiles);
        updateCurrentProfile({...currentProfile, messages: [...currentProfile.messages, messageToAdd]});
        console.log(generatedMessage);
    }



    return (
        <div className={styles.expandedProfile}>
            <img src={currentProfile.picture} alt={currentProfile.name}/>
            <h3>{currentProfile.name}</h3>
            <div className={styles.description}>
                <p>{currentProfile.position}</p>
                <p>{currentProfile.company}</p>
            </div>
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
                <div className={styles.newNote}>
                    <input type="text" value={newNote} onChange={(e) => {setNewNote(e.target.value)}}/>
                    <button onClick={() => {handleAddNote(currentProfile.id)}}>save</button>
                </div>
            </div>
            <div className={styles.messages}>
                <textarea value={prompt} onChange={(e) => {setPrompt(e.target.value)}}/>
                <button onClick={() => {handleGenerateMessage()}}>Generate message</button>
            </div>
            <button onClick={() => {close()}}>close</button>
        </div>
    );
}
 
export default ExpandedProfile;
