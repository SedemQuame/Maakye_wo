// jshint esversion:6
console.log("road js script");

// getting btn elements by their ids
const videos = document.getElementById('v-pills-home-tab');
const info = document.getElementById('v-pills-profile-tab');
const analytics = document.getElementById('v-pills-messages-tab');
const maps = document.getElementById('v-pills-settings-tab');

// getting pane elements by thier ids
const videos_pane = document.getElementById('v-pills-home');
const info_pane = document.getElementById('v-pills-profile');
const analytics_pane = document.getElementById('v-pills-messages');
const maps_pane = document.getElementById('v-pills-settings');


// event listeners
videos.addEventListener('click', () => {
    videos_pane.style.display = 'block';
    info_pane.style.display = 'none';
    analytics_pane.style.display = 'none';
    maps_pane.style.display = 'none';
});

info.addEventListener('click', () => {
    videos_pane.style.display = 'none';
    info_pane.style.display = 'block';
    analytics_pane.style.display = 'none';
    maps_pane.style.display = 'none';
});

analytics.addEventListener('click', () => {
    videos_pane.style.display = 'none';
    info_pane.style.display = 'none';
    analytics_pane.style.display = 'block';
    maps_pane.style.display = 'none';
});

maps.addEventListener('click', () => {
    videos_pane.style.display = 'none';
    info_pane.style.display = 'none';
    analytics_pane.style.display = 'none';
    maps_pane.style.display = 'block';
});

