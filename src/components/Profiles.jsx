import React from 'react';
import { useState } from 'react';

const Profiles = () => {
    const [profiles, setProfiles] = useState([{name: 'John Doe', bio: "", picture: '', note: "This is a note"}]);
    
    return (
        <div>
            <h2>Your Saved Profiles</h2>
            <ul>
                {profiles.map((profile, index) => (
                    <li key={index}>
                        <h3>{profile.name}</h3>
                        <p>{profile.bio}</p>
                        <img src={profile.picture} alt={profile.name} />
                        <p>{profile.note}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
 
export default Profiles;