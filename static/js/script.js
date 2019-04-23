'use strict';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const synth = window.speechSynthesis;
const recognition = new SpeechRecognition();
recognition.continuous = true;

const socket = io();
const icon = document.querySelector('i');
let user = document.createElement('p');
let userContainer = document.querySelector('#user_text');
let bot = document.createElement('p');
let botContainer = document.querySelector('#bot_text');
userContainer.appendChild(user);
botContainer.appendChild(bot);
let video = document.getElementById('player');

icon.addEventListener('click', () => {
    recognition.start();
});

recognition.addEventListener('result', (event) => {
    let last = event.results.length - 1;
    let text = event.results[last][0].transcript.trim();
    user.textContent = 'You: ' + text;
    if (event.results[last].isFinal) {
        if (text.includes('what is the time')) {
            let time = getTime();
            speak(time);
        } else if (text.includes('what is the date')) {
            let date = getDate();
            speak(date);
        } else if (text.includes('what is the weather in')) {
            getWeather(text);
        } else if (text.includes('open') && text.includes('.com')) {
            openSite(text);
        } else {
            socket.emit('user_msg', text);
        };
    };
});

socket.on('bot_msg', (data) => {
    speak(data.fulfillmentText);
});

function speak(text) {
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.voice = synth.getVoices()[1];
    bot.textContent = 'A.I.: ' + text;
    synth.speak(utterThis);
};
function getTime() {
    const time = new Date(Date.now());
    return `the time is ${time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`
};
function getDate() {
    const date = new Date(Date.now())
    return `today is ${date.toLocaleDateString()}`;
};
function getWeather(speech) {
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${speech.split(' ')[5]}&appid=58b6f7c78582bffab3936dac99c31b25&units=metric`)
    .then((response) => {
        return response.json();
    })
    .then((weather) => {
        if (weather.cod === '404') {
        const utterThis = new SpeechSynthesisUtterance(`I cannot find the weather for ${speech.split(' ')[5]}`);
        synth.speak(utterThis);
        return;
        }
        const utterThis = new SpeechSynthesisUtterance(`the weather condition in ${weather.name} is ${weather.weather[0].description} at a temperature of ${(weather.main.temp*9/5) + 32} degrees Fahrenheit`);
        synth.speak(utterThis);
    });
};
function openSite(speech) {
    var transcriptArr = speech.split(' ');
    for(var i=0; i<transcriptArr.length; i++) {
        if (transcriptArr[i].includes('.com')) {
            window.open('http://' + transcriptArr[i]);
        };
    };
};