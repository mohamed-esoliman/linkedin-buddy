import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/TextTyping.module.css';


const TextTyping = ({text, delay = 30}) => {
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);
    const textRef = useRef();

    useEffect(() => {
        if (index < text.length) {
        const timeout = setTimeout(() => {
            setDisplayedText(displayedText + text[index]);
            setIndex(index + 1);
        }, delay);

        return () => clearTimeout(timeout);
        }
    }, [index, text, delay, displayedText]);

    return (
        <div className={styles.typingMessage}>
            <div className={styles.mainText} ref={textRef}>{displayedText}</div>
            <div className={styles.cursor} style={{ left: `${textRef.current?.offsetWidth || 0}px`, top: `${textRef.current?.offsetHeight || 0}px` }}></div>
        </div>
    );
};
 
export default TextTyping;