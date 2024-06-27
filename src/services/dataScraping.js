export const extractProfileData = async (profileURL) => {
    return new Promise((resolve, reject) => {
        chrome.scripting.excuteScript(
            {
                target: profileURL,
                function: () => {
                    const nameElement = document.querySelector("#profile-content > div > div > div > div > main > section > div > div > div > div > span > a > h1");
                    const name = nameElement ? nameElement.textContent.trim() : "";

                    const imageElement = document.querySelector("#profile-content > div > div > div > div > main > section > div > div > div > div > button > img");
                    const imageUrl = imageElement ? imageElement.src : "https://placehold.jp/150x150.png";

                    const bioElement = document.querySelector("#profile-content > div > div > div > div > main > section > div > div > div > div > div");
                    const bio = bioElement ? bioElement.textContent.trim() : "";

                    const experienceSection = document.getElementById("experience").parentElement;
                    const companyElement = experienceSection.querySelector("div > ul > li:nth-child(1) > div > div > div > div > span > span");
                    const company = companyElement ? companyElement.textContent.trim() : "";

                    const profile = {
                        url: profileURL,
                        id: profileURL.split("/")[4],
                        name: name,
                        picture: imageUrl,
                        bio: bio,
                        company: company
                    };

                    return profile;
                }
            },
            (result) => {
                if (result[0].result.error) {
                    reject(result[0].result.error);
                }
                resolve(result[0].result);
            }
        );
    });
}




