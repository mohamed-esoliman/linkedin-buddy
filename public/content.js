chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getProfileData'){
        if (!window.location.href.includes('linkedin.com/in/')){
            sendResponse({error: 'not a LinkedIn profile.'});
            return;
        }

        const url = window.location.href;
        const id = url.split('/')[4];
        const nameElement = document.querySelector('text-heading-xlarge.inline.t-24.v-align-middle.break-words');
        const name = nameElement ? nameElement.innerText : '';
        const bioElement = document.querySelector('text-body-medium.break-words');
        const bio = bioElement ? bioElement.innerText : '';
        const pictureElement = document.querySelector('evi-image.ember-view.profile-photo-edit__preview');
        const pictureSrc = pictureElement ? pictureElement.src : '';

        console.log({url, id, name, bio, pictureSrc});


        sendResponse({url, id, name, bio, pictureSrc});
    };
})