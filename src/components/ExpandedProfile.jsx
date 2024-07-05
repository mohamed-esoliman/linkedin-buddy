import React from 'react';
import { useState } from 'react';
import styles from '../styles/ExpandedProfile.module.css';
import { generateMessage } from '../services/messageGeneration';
import InfoCard from './InfoCard.jsx';
import TextTyping from './TextTyping.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const ExpandedProfile = ({user, profiles, updateProfiles, currentProfile, updateCurrentProfile, apiKey, close, showNotification}) => {

    const [newNote, setNewNote] = useState('');
    const handleAddNote = () => {

        if (newNote === '') {
            showNotification('Note cannot be empty', 'error');
            return;
        }

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

        showNotification('Note added', 'success');
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

        showNotification('Note deleted', 'success');
    }

    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);


    const handleGenerateMessage = async () => {

        if (user.name === "User Name" || user.description === "About me...") {
            showNotification(
              "For better results, please add your name and description in the settings.",
              "warning"
            );
        }

        const name = user.name;
        const description = user.description;

        const receiver = currentProfile.name;
        const receiverPosition = currentProfile.position;
        const receiverCompany = currentProfile.company;

        const message = `Create a professional LinkedIn connection message for ${receiver}. They are working as ${receiverPosition} at ${receiverCompany}. My name is ${name}, and here is a short description about me ${description}.\n Express your desire to connect and learn more. Also, I want you to include the following: ${prompt}. This is a linkedIn message, not an email. Keep it short and professional.`;

        setPrompt('');

        try {
            const generatedMessage = await generateMessage(apiKey, message);
            return generatedMessage;
        } catch (error) {
            showNotification(error.message, 'error');
            setIsGenerating(false);
            return null;
        }
    }

    const handleAddMessage = () => {

        if (!apiKey) {
            showNotification('Please add your API key in the settings section', 'error');
            return;
        }

        updateCurrentProfile({...currentProfile, message: ""});
        setIsGenerating(true);

        handleGenerateMessage().then((generatedMessage) => {
            if (generateMessage){
                const updatedProfiles = profiles.map((profile) => {
                    if (profile.id === currentProfile.id) {
                    return {
                        ...profile,
                        message: generatedMessage,
                    };
                    }
                    return profile;
                });
                updateProfiles(updatedProfiles);
                updateCurrentProfile({
                    ...currentProfile,
                    message: generatedMessage,
                });
            }
        });
    }

    const handleDeleteMessage = () => {
        const updatedProfiles = profiles.map((profile) => {
            if (profile.id === currentProfile.id) {
                return {
                    ...profile,
                    message: ""
                };
            }
            return profile;
        });

        updateProfiles(updatedProfiles);
        updateCurrentProfile({...currentProfile, message: ""});

        showNotification('Message deleted', 'success');
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
                <div className={styles.newMessage}>
                    <textarea placeholder={"Add additional details or context for the connection message..."} value={prompt} onChange={(e) => {setPrompt(e.target.value)}}/>
                    <button className={styles.generateMessageButton} onClick={() => {handleAddMessage()}}>
                        {currentProfile.message === ""? "Generate message": "Regenerate message"}
                    </button>
                </div>
                <div className={styles.messageList}>
                    {currentProfile?.message === ""? 
                        <p>You didn't generate any messages for this profile.</p>:
                        <div className={styles.message}>
                            {isGenerating?
                                <TextTyping text={currentProfile.message}/>:
                                <p>{currentProfile.message}</p>
                            }
                            <button className={styles.deleteMessageButton} onClick={() => {handleDeleteMessage()}}>Delete message</button>
                        </div>
                    }
                </div>
                
            </div>
            <button className={styles.closeButton} onClick={() => {close()}}>close</button>
        </div>
    );
}
 
export default ExpandedProfile;
