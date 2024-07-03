import React from 'react';
import { useState, useEffect } from 'react';
import styles from '../styles/Settings.module.css';

const Settings = ({user, updateUser, apiKey, updateApiKey, darkMode, updateDarkMode, close}) => {

    console.log(user);

    const [editPopup, setEditPopup] = useState(false);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            updateUser({...user, picture: reader.result});
        };
        reader.readAsDataURL(file);
    }


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

            <section className={styles.user}>
                <img src={user.picture} alt={user.name}/>
                <h3>{user.name}</h3>
                <span className={styles.position}>{user.position}</span>
                <span className={styles.company}>{user.company}</span>
                {/* <span className={styles.education}>{user.education}</span> */}
                <p className={styles.description}>{user.description}</p>
            
                <button class={styles.editInfo} onClick={() => setEditPopup(!editPopup)}>Edit</button>

                {editPopup && (
                    <div className={styles.editForm}>
                        <form className={styles.editPopup}>
                            <input type='file' accept='image/*' onChange={handleImageUpload}/>
                            <input type="text" placeholder="Name" value={user.name} onChange={(e) => updateUser({...user, name: e.target.value})}/>
                            <input type="text" placeholder="Position" value={user.position} onChange={(e) => updateUser({...user, position: e.target.value})}/>
                            <input type="text" placeholder="Company" value={user.company} onChange={(e) => updateUser({...user, company: e.target.value})}/>
                            <input type="text" placeholder="Education" value={user.education} onChange={(e) => updateUser({...user, education: e.target.value})}/>
                            <input type="text" placeholder="Description" value={user.description} onChange={(e) => updateUser({...user, description: e.target.value})}/>
                            <button onClick={() => setEditPopup(false)}>Save</button>
                        </form>
                    </div>
                )}

            </section>

            <section className={styles.apiKey}>
                <h2>API Key</h2>
                <input value={apiKey} onChange={(e) => {updateApiKey(e.target.value)}}/>
                <button>Save</button>
            </section>

            <button onClick={close}>Close</button>

        </div>
    );
}
 
export default Settings;