import React from 'react';
import { useState} from 'react';
import styles from '../styles/Settings.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Settings = ({user, updateUser, apiKey, updateApiKey, darkMode, updateDarkMode, close, showNotification}) => {

    // edit user info popup
    const [editPopup, setEditPopup] = useState(false);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            updateUser({...user, picture: reader.result});
            showNotification('Image uploaded successfully', 'success');
        };
        reader.readAsDataURL(file);
    }

    // api key input
    const [editingApiKey, setEditingApiKey] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);
    const [apiKeyInput, setApiKeyInput] = useState(apiKey);

    const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
    };

    const handleEditApiKey = () => {
        setEditingApiKey(true);
    };

    const handleSaveApiKey = () => {
        updateApiKey(apiKeyInput);
        showNotification('API key saved successfully', 'success');
        setEditingApiKey(false);
    };




    return (
        <div className={styles.container}>
            
            <section className={styles.darkMode}>
                <label className={styles.toggleContainer}>
                    <input
                        type="checkbox"
                        className={styles.toggleCheckbox}
                        checked={darkMode}
                        onChange={updateDarkMode}
                    />
                    <span className={styles.toggleLabel}>
                        <span className={styles.toggleIcon}></span>
                    </span>
                </label>
            </section>
            <hr/>

            <section className={styles.user}>
                <img src={user.picture} alt={user.name}/>
                <h3>{user.name}</h3>
                <span className={styles.position}>{user.position}</span>
                <span className={styles.company}>{user.company}</span>
                {/* <span className={styles.education}>{user.education}</span> */}
                <p className={styles.description}>{user.description}</p>
            
                <button class={styles.editInfo} onClick={() => setEditPopup(!editPopup)}>Edit</button>

                {editPopup && (
                    <div className={styles.editPopup}>
                        <form className={styles.editForm}>
                            <label htmlFor="image" className={styles.imageUpload}>Upload an image</label>
                            <input id="image" className={styles.imageUploadButton} type='file' accept='image/*' onChange={handleImageUpload}/>
                            <label htmlFor="name">Name</label>
                            <input type="text" value={user.name} onChange={(e) => updateUser({...user, name: e.target.value})}/>
                            <label htmlFor="position">Position</label>
                            <input type="text" value={user.position} onChange={(e) => updateUser({...user, position: e.target.value})}/>
                            <label htmlFor="company">Company</label>
                            <input type="text" value={user.company} onChange={(e) => updateUser({...user, company: e.target.value})}/>
                            <label htmlFor="education">Education</label>
                            <input type="text" value={user.education} onChange={(e) => updateUser({...user, education: e.target.value})}/>
                            <label htmlFor="description">Description</label>
                            <textarea placeholder="Add a short description about you; we recommend to keep it under 150 words to avoid problems with the AI API." value={user.description} onChange={(e) => updateUser({...user, description: e.target.value})}/>
                            <button className={styles.submitForm} onClick={() => setEditPopup(false)}>Save</button>
                        </form>
                    </div>
                )}

            </section>
            <hr/>

            <section className={styles.apiKey}>
                <h2>API Key</h2>
                <div className={styles.apiKeyContainer}>
                {editingApiKey ? (
                    <>
                    <input
                        type="text"
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        className={styles.apiKeyInput}
                    />
                    <button onClick={handleSaveApiKey}>Save</button>
                    </>
                ) : (
                    <>
                    {apiKey === '' ? (
                        <p className={styles.apiWarning}>
                        You didn't add an API key yet; please add one to be able to use the AI message generation functionality.
                        </p>
                    ) : (
                        <> 
                        <span className={styles.apiKeyLabel}>
                            {showApiKey ? apiKey : '•'.repeat(apiKey.length)}
                        </span>
                        <button className={styles.showButton} onClick={toggleShowApiKey}>
                            <FontAwesomeIcon icon={showApiKey ? faEyeSlash : faEye} />
                        </button>
                        </>
                    )}
                    <button onClick={handleEditApiKey}>Edit</button>
                    </>
                )}
                </div>
            </section>

            <button className={styles.closeButton} onClick={close}>Close Settings</button>

        </div>
    );
};
 
export default Settings;