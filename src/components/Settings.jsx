import React from 'react';
import { useState, useEffect } from 'react';
import styles from '../styles/Settings.module.css';

const Settings = ({user, updateUser, apiKey, updateApiKey, updateDarkMode, close}) => {

    const [editPopup, setEditPopup] = useState(false);

    return (

        <div className={styles.container}>
            <section className={styles.user}>
                <img src={user.picture} alt={user.name}/>
                <h3>{user.name}</h3>
                <div className={styles.description}>
                    <p>{user.position}</p>
                    <p>{user.company}</p>
                    <p>{user.education}</p>
                    <p>{user.description}</p>
                </div>
            
                <button onClick={() => setEditPopup(true)}>Edit</button>

                {editPopup && (
                    <form className={styles.editPopup}>
                        <input type='file' accept='image/*' onChange={(e) => updateUser({...user, picture: URL.createObjectURL(e.target.files[0])})}/>
                        <input type="text" placeholder="Name" value={user.name} onChange={(e) => updateUser({...user, name: e.target.value})}/>
                        <input type="text" placeholder="Position" value={user.position} onChange={(e) => updateUser({...user, position: e.target.value})}/>
                        <input type="text" placeholder="Company" value={user.company} onChange={(e) => updateUser({...user, company: e.target.value})}/>
                        <input type="text" placeholder="Education" value={user.education} onChange={(e) => updateUser({...user, education: e.target.value})}/>
                        <input type="text" placeholder="Description" value={user.description} onChange={(e) => updateUser({...user, description: e.target.value})}/>
                        <button onClick={() => setEditPopup(false)}>Save</button>
                    </form>
                )}

            </section>

            <section className={styles.darkMode}>
                <h2>Dark Mode</h2>
                <button onClick = {() => {updateDarkMode}}>Enable</button>
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