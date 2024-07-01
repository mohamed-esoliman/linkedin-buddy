export const extractProfileData = async (tabId) => {

    console.log("Extracting profile data from tab", tabId);

    return new Promise((resolve, reject) => {
        chrome.scripting.executeScript(
            {
                target: {tabId},
                function: () => {
                    const profile = {};
                    try {
                        const nameElement = document.querySelector("#profile-content > div > div > div > div > main > section > div > div > div > div > span > a > h1");
                        profile.name = nameElement ? nameElement.textContent.trim() : "";

                        const imageElement = document.querySelector("#profile-content > div > div > div > div > main > section > div > div > div > div > button > img");
                        profile.picture = imageElement ? imageElement.src : "../media/person.png";

                        const bioElement = document.querySelector("#profile-content > div > div > div > div > main > section > div > div > div > div > div");
                        profile.bio = bioElement ? bioElement.textContent.trim() : "";

                        const experienceSection = document.getElementById("experience").parentElement;
                        const companyElement = experienceSection.querySelector("div > ul > li:nth-child(1) > div > div > div > div > span > span");
                        profile.company = companyElement ? companyElement.textContent.trim() : "";

                        profile.url = window.location.href;
                        return profile;

                    } catch (error) {
                        console.error("Error extracting profile data", error);
                        return {error: error.message};
                    }
                }
            },
            (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError.message);
                } else if (result && result[0] && result[0].result) {
                    resolve(result[0].result);
                } else {
                    reject("No result returned from script execution");
                }
            }
        );
    });
}