export const extractProfileData = async (tabId) => {

    console.log("Extracting profile data from tab", tabId);

    return new Promise((resolve, reject) => {
        chrome.scripting.executeScript(
            {
                target: {tabId},
                function: () => {
                    try {
                        const profile = {};

                        profile.url = window.location.href;
                        profile.id = profile.url.split("/")[4];

                        const nameElement = document.querySelector("#profile-content > div > div > div > div > main > section > div > div > div > div > span > a > h1");
                        profile.name = nameElement?.textContent.trim() || "";

                        const imageElement = document.querySelector("#profile-content > div > div > div > div > main > section > div > div > div > div > button > img");
                        profile.picture = imageElement?.src || "../media/person.png";
                        
                        //todo: fix scraping the bio
                        const bioElement = document.querySelector("#profile-content > div > div > div > div > main > section > div > div > div:nth-child(1) > div");
                        profile.bio = bioElement?.textContent.trim() || "";
                        
                        const companyElement = document.getElementById("experience").parentElement.querySelector("div > ul > li:nth-child(1) > div > div > div > div > span > span");
                        const alternativeCompanyElement = document.getElementById("experience").parentElement.querySelector("div > ul > li:nth-child(1) > div > div > div > a > div > div > div > div > span");
                        profile.company = companyElement?.textContent.trim() || alternativeCompanyElement?.textContent.trim() || "";
                        
                        const positionElement = document.getElementById("experience").parentElement.querySelector("div > ul > li:nth-child(1) > div > div > div > div > div > div > div > div > span:nth-child(1)");
                        profile.position = positionElement ? positionElement.textContent.trim() : "";

                        profile.notes = [];
                        profile.message = "";
                        
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