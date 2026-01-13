//Sets up global variables
var color = "000000";
var mode = "hex";

//Converts to hexadecimal
const rgbToHex = (r, g, b) => ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');

//Determines if the input is valid
function isInputValid(input, mode="hex") {
    //If the mode is hexadecimal
    if (mode==="hex") {
        input = input.substr(1, input.length);
        if (input.length === 6 && /^[A-Za-z0-9]+$/.test(input)) {
            return true;
        } else {return false;}
    } else if (mode==="rgb") {//If the mode is RGB

    } else if (mode==="hsl") {//If the mode is HSL

    }
}

//What happens when the hexinput is put in focus
const hexInput = document.getElementById("hex-input");
hexInput.onfocus = function() {
    //Removes any response messages that exist
    if (document.getElementById("response-div").plaintext !== '') {
        deleteResponse();
    }

    //If there is no value inputed, change the value to '#'
    if (this.value === '') {
        this.value = '#';
    } else {//Changes the color of the box-shadow if the box has an input
        hexInput.style.boxShadow = isInputValid(this.value, "hex") ? "0 0 0 2.5px #00FF00B8":"0 0 0 2.5px #FF0000B8";;
    }

}
hexInput.onblur = function() {//What happens when the hexinput is out of focus
    if (this.value === '#') this.value = '';
    hexInput.style.boxShadow = "0 0 0 2.5px #FF000000";
}

//What happens when the input is typed on
document.getElementsByTagName("input")[0].oninput = function() {
    //Removes any response messages that exist
    if (document.getElementById("response-div").plaintext !== '') {
        deleteResponse();
    }

    //Prevents the # from being removed
    if (mode === "hex" && this.value === '') this.value = '#'+this.value;

    //Changes the box shadow to green if the input is valid
    if (isInputValid(this.value, mode)) {
        document.querySelector("input:focus").style.boxShadow = "0 0 0 2.5px #00FF00B8";
    } else {document.querySelector("input:focus").style.boxShadow = "0 0 0 2.5px #FF0000B8";}
}

//Adds a response dialogue
function submitResponse(message) {
    //Changes the color of the response div
    const response = document.getElementById('response-div');
    response.style.background = "#FFFFFF20";

    //Changes the response message
    response.innerHTML = `
        <h3 id="response">
            ${message}
        </h3>
    `;
}
function deleteResponse() {
    //Changes the color of the response div
    const response = document.getElementById('response-div');
    response.style.background = "#FFFFFF00";

    //Deletes the response message
    response.innerHTML = `
        <h3 id="response"></h3>
    `;
}

//What happens when a user presses the submit button
function submitHex(e) {
    //Prevents the page from reloading
    e.preventDefault();

    //Prevents the user from submitting an invalid value
    input = document.getElementById("hex-input").value;
    if (!isInputValid(input, 'hex')) {

    } else {submit(input, "hex");}
}
function submit(input, mode = "hex") {
    //Removes '#' from the input
    var input = input.substr(1, input.length);
    console.log(input);

    //Calculates how much the user is off by
    if (mode === "hex") {//If the mode is hexadecimal
        var rOff = Math.abs(Number("0x"+input.substr(0, 2))-Number("0x"+color.substr(0, 2)));
        var gOff = Math.abs(Number("0x"+input.substr(2, 2))-Number("0x"+color.substr(2, 2)));
        var bOff = Math.abs(Number("0x"+input.substr(4, 2))-Number("0x"+color.substr(4, 2)));
    }

    //Determines the response message
    var responseMessage;
    if (mode === "hex" && input === color) {
        submitResponse("Congradulations, you guessed the color!");
    } else {
        submitResponse(`Sorry, the correct answer is #${color}.<br>You were off by a factor of rgb(${rOff}, ${gOff}, ${bOff})`);
    }
    
    //Changes the color to be guessed
    color = (Math.random() * 0xFFFFFF * 1000000).toString(16).toUpperCase().slice(0, 6);
    document.getElementById("colorbox").style = "background: #"+color+";"
}