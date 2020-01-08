// jshint esversion:6
console.log("violator js script");

// getting btn elements by their ids
const v_videos = document.getElementById('v-pills-violator-video-tab');
const v_info = document.getElementById('v-pills-violator-info-tab');
const v_admin = document.getElementById('v-pills-violator-admin-tab');

// getting pane elements by thier ids
const v_videos_pane = document.getElementById('v-pills-violator-video');
const v_info_pane = document.getElementById('v-pills-violator-info');
const v_admin_pane = document.getElementById('v-pills-violator-admin');

// event listeners
v_videos.addEventListener('click', () => {
    v_videos_pane.style.display = 'block';
    v_info_pane.style.display = 'none';
    v_admin_pane.style.display = 'none';
});

v_info.addEventListener('click', () => {
    v_videos_pane.style.display = 'none';
    v_info_pane.style.display = 'block';
    v_admin_pane.style.display = 'none';
});

v_admin.addEventListener('click', () => {
    v_videos_pane.style.display = 'none';
    v_info_pane.style.display = 'none';
    v_admin_pane.style.display = 'block';
});

// Displaying violator lists.
// =============================

const list_pane_toggling_btn = document.getElementById('v-pills-violator-list');
const list_pane = document.getElementById('pane');

function animateCSS(element, animationName, callback) {
    const node = document.getElementById('pane');
    node.classList.add('animated', animationName, 'fast');

    function handleAnimationEnd() {
        node.classList.remove('animated', animationName);
        node.removeEventListener('animationend', handleAnimationEnd);

        if (typeof callback === 'function') callback();
    }

    node.addEventListener('animationend', handleAnimationEnd);
}

list_pane_toggling_btn.addEventListener('click', () => {
    
        list_pane.style.display = 'block';
        animateCSS(list_pane, 'bounceInRight');
        setTimeout(() => {
            animateCSS(list_pane, 'bounceOutRight');
            setTimeout(() => {
                list_pane.style.display = 'none';
            }, 500);
        }, 5000);    
});


