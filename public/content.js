chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getProfileData'){
        if (!window.location.href.includes('linkedin.com/in/')){
            sendResponse({error: 'not a LinkedIn profile.'});
            return;
        }

        const url = window.location.href;
        const id = url.split('/')[4];
        const nameElement = document.querySelector('text-heading-xlarge');
        const name = nameElement ? nameElement.innerText : '';
        const bioElement = document.querySelector('text-body-medium');
        const bio = bioElement ? bioElement.innerText : '';
        const pictureElement = document.querySelector('evi-image');
        const pictureSrc = pictureElement ? pictureElement.src : '';

        console.log({url, id, name, bio, pictureSrc});


        sendResponse({url, id, name, bio, pictureSrc});
    };
})