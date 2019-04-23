let tag = document.createElement('script');
tag.id = 'iframe-demo';
tag.src = 'https://www.youtube.com/iframe_api';
let firstScriptTag = document.getElementsByTagName('script')[1];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        events: {
        'onReady': playerReady
        }
    });
};

function playerReady() {
    recognition.start();
    recognition.onresult = function(event) {
        let lastIdx = event.results.length - 1;
        if (event.results[lastIdx].isFinal) {
            if (event.results[lastIdx][0].transcript.trim() == "play") {
                player.playVideo();
            }
            if (event.results[lastIdx][0].transcript.trim() == "pause") {
                player.pauseVideo();
            }
        }
    }
};
