import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/InfoCard.module.css';

const InfoCard = ({text, width}) => {
    return (
        <div className={styles.infoCircleContainer} style={{width: `${width}%`}}>
            <FontAwesomeIcon icon={faInfoCircle} className={styles.infoCircle}/>
            <span className={styles.infoCircleText} dangerouslySetInnerHTML={{__html: text}}>
            </span>
        </div>
    );
}
 
export default InfoCard;