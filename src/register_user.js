'use strict';
const regBut = document.querySelector('.btn[id="regUser"');

regBut.addEventListener('click', function() {
    console.log("Button:" + this.textContent + ' was clicked');  
});