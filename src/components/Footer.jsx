import React from "react";
import styles from "../styles/Footer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(faGithub, faLinkedin);

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <span className={styles.developer}>
        <p className={styles.copyRights}>© 2024 By</p>
        <p className={styles.devName}>Mohamed Soliman</p>
      </span>
      <div className={styles.socialMedia}>
        <a
          href="https://github.com/mohamed-esoliman"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={["fab", "github"]} className={styles.icon} />
        </a>
        <a
          href="https://www.linkedin.com/in/mohamedesoliman/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={["fab", "linkedin"]} className={styles.icon} />
        </a>
      </div>
      <p className={styles.version}>LinkedIn Buddy v1.0</p>
    </footer>
  );
};

export default Footer;
