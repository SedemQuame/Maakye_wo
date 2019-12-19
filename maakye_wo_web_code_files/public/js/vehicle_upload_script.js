// jshint esversion: 6
console.log("file_uploader");



updateList = function() {
    const input = document.getElementById('vehicle_images');
    const output = document.getElementById('fileList');

    output.innerHTML = '<ul class="list-unstyled">';
    for (let i = 0; i < input.files.length; ++i) {
        output.innerHTML += '<li>' + input.files.item(i).name + '</li>';
    }
    output.innerHTML += '</ul>';
};