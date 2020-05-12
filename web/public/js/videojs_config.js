// jshint esversion:6

// video.js config
let options = {
    autoplay: true,
    responsive: true
};
let player = videojs('my-player', options, function onPlayerReady() {
    videojs.log('Your player is ready!');
    // In this context, `this` is the player that was created by Video.js.
    this.play();
    // How about an event listener? 
    this.on('ended', () => { videojs.log('Awww...over so soon?!'); });
});