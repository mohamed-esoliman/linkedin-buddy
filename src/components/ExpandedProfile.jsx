import React from 'react';
import { useState } from 'react';
import styles from '../styles/ExpandedProfile.module.css';
import { generateMessage } from '../services/messageGeneration';
import InfoCard from './InfoCard.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

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
            <div className={styles.profileInfo}>
                <img src={currentProfile.picture} alt={currentProfile.name}/>
                <h2>{currentProfile.name}</h2>
                <span className={styles.position}>{currentProfile.position}</span>
                <span className={styles.company}>{currentProfile.company}</span>
            </div>
            <div className={styles.notes}>                
                <div className={styles.newNote}>
                    <textarea placeholder='add a new note...' value={newNote} onChange={(e) => {setNewNote(e.target.value)}}/>
                    <button onClick={() => {handleAddNote(currentProfile.id)}}>save</button>
                </div>

                <div className={styles.noteList}>
                    {currentProfile?.notes?.length == 0? 
                        <p>You didn't add any notes for this profile.</p>:
                        <p>Your notes for this profile:</p>
                        }
                    <ul>
                        {
                        currentProfile.notes.map((note) => (
                            <li className={styles.note} key={note.id}>
                                <p>{note.text}</p>
                                <button className={styles.deleteButton} onClick={() => {handleDeleteNote(note.id)}}>
                                    <FontAwesomeIcon icon={faTrash}/>
                                </button>
                            </li>
                        ))                                    
                        }
                    </ul>
                </div>
            </div>
            <hr/>
            <div className={styles.messages}>
                <div className={styles.messageInfo}>
                    <p className={styles.messageExplanation}>Want to connect with this person? Generate a connection message now!</p>
                    < InfoCard 
                        text = {"You can generate a connection message based on this person’s profile information and your account information. Make sure to add your details in the settings section so they can be used in generating the message. Also, it is very important to add your API secret key in the settings section. Not sure how to do that? Check out this <a href=\"https://www.maisieai.com/help/how-to-get-an-openai-api-key-for-chatgpt\" target='blank'>guide</a>."}
                        width = {20}
                    />
                </div>
                <div className="newMessage">
                    <textarea value={prompt} onChange={(e) => {setPrompt(e.target.value)}}/>
                    <button onClick={() => {handleGenerateMessage()}}>Generate message</button>
                </div>
                <div className={styles.messageList}>
                    {currentProfile?.messages?.length == 0? 
                        <p>You didn't generate any messages for this profile.</p>:
                        <p>Your messages for this profile:</p>
                        }
                    <ul>
                        {
                        currentProfile.messages.map((message) => (
                            <li className={styles.message} key={message.id}>
                                <p>{message.text}</p>
                            </li>
                        ))                                    
                        }
                    </ul>
                </div>
                
            </div>
            <button onClick={() => {close()}}>close</button>
        </div>
    );
}
 
export default ExpandedProfile;
