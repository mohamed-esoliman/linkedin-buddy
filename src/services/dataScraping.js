export const extractProfileData = async (tabId) => {

    return new Promise((resolve, reject) => {
        chrome.scripting.executeScript(
            {
                target: {tabId},
                function: () => {
                    try {

                        const nameElement = document.querySelector("#profile-content > div > div > div > div > main > section > div > div > div > div > span > a > h1");
                        const name = nameElement?.textContent.trim() || "";

                        const imageElement = document.querySelector("#profile-content > div > div > div > div > main > section > div > div > div > div > button > img");
                        const picture = imageElement?.src || "";
                        
                        //todo: fix scraping the bio
                        const bioElement = document.querySelector("#profile-content > div > div > div > div > main > section > div > div > div:nth-child(1) > div");
                        const bio = bioElement?.textContent.trim() || "";
                        
                        const companyElement = document.getElementById("experience").parentElement.querySelector("div > ul > li:nth-child(1) > div > div > div > div > span > span");
                        const alternativeCompanyElement = document.getElementById("experience").parentElement.querySelector("div > ul > li:nth-child(1) > div > div > div > a > div > div > div > div > span");
                        const company = companyElement?.textContent.trim() || alternativeCompanyElement?.textContent.trim() || "";
                        
                        const positionElement = document.getElementById("experience").parentElement.querySelector("div > ul > li:nth-child(1) > div > div > div > div > div > div > div > div > span:nth-child(1)");
                        const position = positionElement ? positionElement.textContent.trim() : "";
                        
                        return {
                                name: name,
                                picture: picture,
                                bio: bio,
                                company: company,
                                position: position,
                                }

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