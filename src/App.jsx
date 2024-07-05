import styles from "./App.module.css";
import React from "react";
import { useState, useEffect } from "react";
import { extractProfileData } from "./services/dataScraping";
import NavBar from "./components/NavBar";
import Settings from "./components/Settings";
import ProfileCard from "./components/ProfileCard";
import ExpandedProfile from "./components/ExpandedProfile";
import Footer from "./components/Footer";
import { enqueueSnackbar, SnackbarProvider, closeSnackbar } from "notistack";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";

const App = () => {
  const [user, setUser] = useState({
    picture: "../media/person.png",
    name: "User Name",
    position: "Position",
    company: "Company",
    education: "School",
    description: "About me...",
  });

  const [profiles, setProfiles] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const handleUpdateUser = (newUser) => {
    setUser(newUser);
  };

  const handleUpdateProfiles = (newProfiles) => {
    setProfiles(newProfiles);
  };

  const handleUpdateDarkMode = () => {
    setDarkMode(!darkMode);
    showNotification(
      "Dark mode " + (darkMode ? "disabled" : "enabled"),
      "default"
    );
  };

  const handleUpdateApiKey = (newApiKey) => {
    setApiKey(newApiKey);
  };

  useEffect(() => {
    chrome.storage.local.get(["user"], (result) => {
      if (result.user) {
        setUser(result.user);
      }
    });

    chrome.storage.sync.get("profiles", (result) => {
      if (result.profiles) {
        setProfiles(result.profiles);
      }
    });

    chrome.storage.sync.get("darkMode", (result) => {
      if (result.darkMode) {
        setDarkMode(result.darkMode);
      }
    });

    chrome.storage.local.get("apiKey", (result) => {
      if (result.apiKey) {
        setApiKey(result.apiKey);
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.set({ user }, () => {
      console.log("User saved");
    });
  }, [user]);

  useEffect(() => {
    chrome.storage.sync.set({ profiles }, () => {
      console.log("Profiles saved");
    });
  }, [profiles]);

  useEffect(() => {
    chrome.storage.sync.set({ darkMode }, () => {
      console.log("Dark mode saved:" + darkMode ? "enabled" : "disabled");
    });
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  useEffect(() => {
    chrome.storage.local.set({ apiKey }, () => {
      console.log("API Key saved");
    });
  }, [apiKey]);

  const handleSaveCurrentProfile = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab.url || !tab.url.includes("linkedin.com/in/")) {
      showNotification("Please open a LinkedIn profile to save.", "error");
      return;
    }

    for (let i = 0; i < profiles.length; i++) {
      if (profiles[i].url === tab.url) {
        showNotification("Profile already saved.", "error");
        return;
      }
    }

    extractProfileData(tab.id).then((result) => {
      const profile = {
        name: result.name,
        picture: result.picture,
        bio: result.bio,
        company: result.company,
        position: result.position,
        url: tab.url,
      };
      profile.url = tab.url;
      profile.id = profile.url.split("/")[4];
      profile.notes = [];
      profile.message = "";

      if (!profile.name || !profile.picture) {
        showNotification(
          "You can not save your own profile! Add your data to the user section in settings if you want.",
          "warning"
        );
        return;
      }
      const updatedProfiles = [...profiles, profile];
      setProfiles(updatedProfiles);
      setProfilePopup(null);
      showNotification("Profile saved", "success");
    });
  };

  const handleDeleteProfile = (id) => {
    const updatedProfiles = profiles.filter((profile) => profile.id !== id);
    setProfiles(updatedProfiles);

    showNotification("Profile deleted", "success");
  };

  // settings
  const [settingsPopup, setSettingsPopup] = useState(false);

  const toggleSettings = () => {
    setSettingsPopup(!settingsPopup);
  };

  // Profile popup and notes
  const [profilePopup, setProfilePopup] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);

  const updateCurrentProfile = (profile) => {
    setCurrentProfile(profile);
  };

  const handleOpenProfile = (profile) => {
    setCurrentProfile(profile);
    setProfilePopup(profile.id);
  };

  const handleCloseProfile = () => {
    setProfilePopup(null);
    setCurrentProfile(null);
  };

  // notifications

  const showNotification = (message, variant) => {
    enqueueSnackbar(message, { variant: variant });
  };

  return (
    <div className={styles.app}>
      <div className={styles.wrapper}>
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={2500}
          preventDuplicate={true}
          anchorOrigin={{ vertical: "top", horizontal: "middle" }}
          action={(snackbarId) => (
            <button
              className="close-notification-button"
              onClick={() => closeSnackbar(snackbarId)}
            >
              <FontAwesomeIcon icon={faWindowClose} />
            </button>
          )}
          classes={{
            containerRoot: "notificationContainer",
          }}
        />

        <NavBar toggleSettings={toggleSettings} />

        {settingsPopup && (
          <Settings
            user={user}
            updateUser={handleUpdateUser}
            apiKey={apiKey}
            updateApiKey={handleUpdateApiKey}
            darkMode={darkMode}
            updateDarkMode={handleUpdateDarkMode}
            close={toggleSettings}
            showNotification={showNotification}
          />
        )}

        <div className={styles.mainButton}>
          <button
            onClick={() => {
              handleSaveCurrentProfile();
            }}
          >
            Save current profile
          </button>
        </div>
        <div className={styles.profileList}>
          <h2>Your saved Profiles</h2>
          {profiles.length === 0 && (
            <p>
              You haven't saved any profiles yet. Start by saving a LinkedIn
              profile to see it here.
            </p>
          )}
          {profiles.map((profile, index) => (
            <div className={styles.profile} key={index}>
              <ProfileCard
                profile={profile}
                handleOpenProfile={handleOpenProfile}
                handleDeleteProfile={handleDeleteProfile}
              />
              {profilePopup === profile.id && (
                <ExpandedProfile
                  user={user}
                  profiles={profiles}
                  updateProfiles={handleUpdateProfiles}
                  currentProfile={currentProfile}
                  updateCurrentProfile={updateCurrentProfile}
                  apiKey={apiKey}
                  close={handleCloseProfile}
                  showNotification={showNotification}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
