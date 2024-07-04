import React, { useState, useEffect } from 'react';
import styles from '../styles/TextTyping.module.css';


const TextTyping = ({text, speed = 100}) => {
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < text.length) {
        const timeout = setTimeout(() => {
            setDisplayedText(displayedText + text[index]);
            setIndex(index + 1);
        }, speed);

        return () => clearTimeout(timeout);
        }
    }, [index, text, speed, displayedText]);

    return (
        <div className={styles.mainText}>
            {displayedText}
        </div>
    );
};
 
export default TextTyping;