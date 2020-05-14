// getting elements by user actions
let date = document.getElementById("notification_date");
let details = document.getElementById("notification_details");
let action = document.getElementById("action_by");

// callback function.
function previewerFunc(e){
    let eventTarget = e.target;
    console.log(eventTarget);

    let parent = eventTarget.parentNode;
    let siblings = parent.children;

    let dateText = siblings[0].children[1].children[0].innerText;
    let detailsText = siblings[2].innerText;
    let userText = siblings[3].innerText;

    console.log(userText);    

    date.innerText = dateText;
    details.innerText = detailsText;
    action.innerText = userText;
}