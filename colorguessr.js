//Sets up global variables
var color = "FFFFFF";

//Sets up the mode
var mode = new URL(window.location).searchParams.get("mode") ?? "hex";
document.getElementById("modeSelect").value = mode;

//Gets the pantone colors
import { pantoneColors } from "./pantone-colors.js";

//Converts to hexadecimal
const rgbToHex = (r, g, b) => ((Number(r) << 16) + (Number(g) << 8) + Number(b)).toString(16).padStart(6, '0');

//Builds the response form
if (mode === "hex") {
    document.getElementById("main-form-div").innerHTML = `
        <input type="text" id="hex-input" class="color-input" size=10 placeholder="Enter Hex Value" autocomplete="off"></input>
    `;
} else if (mode === "rgb") {
    document.getElementById("main-form-div").innerHTML = `
        <input type="number" id="r-input" class="color-input" min=0 placeholder="Red" autocomplete="off"></input>
        <input type="number" id="g-input" class="color-input" min=0 placeholder="Green" autocomplete="off"></input>
        <input type="number" id="b-input" class="color-input" min=0 placeholder="Blue" autocomplete="off"></input>
    `;
} else if (mode === "pantone") {
    document.getElementById("main-form-div").innerHTML = `
    <div class="dropdown dropdown-scroll">
        <div class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
            <div class="input-group input-group-sm search-control">
                <span class="input-group-addon">
                    <span class="glyphicon glyphicon-search"></span>
                </span>
                <input type="text" class="form-control" placeholder="Search">
            </div>
            <ul class="dropdown-list">
                <li role="presentation" ng-repeat='item in items | filter:eventSearch'></li>
            </ul>
        </div>
    </div>
    `;

    Object.entries(pantoneColors).forEach(([key, val]) => {
        const option = document.createElement("li");
        option.value = key; option.innerText = key;
        document.getElementsByClassName("dropdown-list")[0].appendChild(option);
        document.getElementsByClassName("dropdown-list")[0].appendChild(document.createElement("br"));
    });
}

//Determines if the input is valid
function isInputValid(input, mode="hex") {
    //If the mode is hexadecimal
    if (mode==="hex") {
        input = input.substr(1, input.length);
        if (input.length === 6 && /^[A-Fa-f0-9]+$/.test(input)) return true;
    } else if (mode==="rgb") {//If the mode is RGB
        input = input.toString();
        if (input.length === 3 && input < 256) return true;
    } else if (mode==="pantone") {//If the mode is pantone

    }
    return false;
}

//Adds event listeners to the inputs
const inputs = document.querySelectorAll(".color-input");
inputs.forEach(el => {
    //What happens when the input is put in focus
    el.onfocus = function() {
        //Removes any response messages that exist
        if (document.getElementById("response-div").plaintext !== '') {
            deleteResponse();
        }

        //If there is no value inputed
        if (this.value === '') {
            if (mode === "hex") this.value = '#';
        } else {//Changes the color of the box-shadow if the box has an input
            this.style.boxShadow = isInputValid(this.value, "hex") ? "0 0 0 2.5px #00FF00B8":"0 0 0 2.5px #FF0000B8";;
        }
    }

    //What happens when the input is out of focus
    el.onblur = function() {
        //Removes the # if the mode is hex and there is no other value
        if (this.value === '#' && mode === "hex") this.value = '';

        //Removes the box shadow
        this.style.boxShadow = "0 0 0 2.5px #FF000000";
    }

    //What happens when the input is typed on
    el.oninput = function() {
        //Removes any response messages that exist
        if (document.getElementById("response-div").plaintext !== '') deleteResponse();

        //What to do if the mode is hex
        if (mode === "hex" && this.value === '') this.value = '#'+this.value;

        //Changes the box shadow to green if the input is valid
        if (isInputValid(this.value, mode)) {
            document.querySelector("input:focus").style.boxShadow = "0 0 0 2.5px #00FF00B8";
        } else {document.querySelector("input:focus").style.boxShadow = "0 0 0 2.5px #FF0000B8";}
    }
});

//What happens when a user presses the submit button
document.getElementById('main-form').addEventListener('submit', function (e) {
    //Prevents the page from reloading
    e.preventDefault();

    //Gets the input
    var input;
    if (mode === "hex") {
        input = document.getElementById("hex-input").value;
    } else if (mode === "rgb") {
        input = "#"+rgbToHex(
            document.getElementById("r-input").value,
            document.getElementById("g-input").value,
            document.getElementById("b-input").value
        ).toUpperCase();
    } else if (mode === "pantone") {
        input = document.getElementById("pantone-input").value;
    }

    //Prevents the user from submitting an invalid value
    if (!isInputValid(input, "hex")) {
    } else submit(input, mode);
});
function submit(input, mode="hex") {
    console.log("submitted");

    //Removes '#' from the input
    var input = input.substr(1, input.length);
    console.log(input);

    //Calculates how much the user is off by
    var rOff = Math.abs(Number("0x"+input.substr(0, 2))-Number("0x"+color.substr(0, 2)));
    var gOff = Math.abs(Number("0x"+input.substr(2, 2))-Number("0x"+color.substr(2, 2)));
    var bOff = Math.abs(Number("0x"+input.substr(4, 2))-Number("0x"+color.substr(4, 2)));

    //Determines the response message
    var responseMessage;
    if (input === color) {
        submitResponse("Congradulations, you guessed the color!");
    } else {
        submitResponse(`Sorry, the correct answer is #${color}.<br>You were off by a factor of rgb(${rOff}, ${gOff}, ${bOff})`);
    }
    
    //Changes the color to be guessed
    color = (Math.random() * 0xFFFFFF * 1000000).toString(16).toUpperCase().slice(0, 6);
    document.getElementById("colorbox").style = "background: #"+color+";"
}

//Adds a response dialogue
function submitResponse(message) {console.log("response submitted");
    //Changes the color of the response div
    const response = document.getElementById("response-div");
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
    const response = document.getElementById("response-div");
    response.style.background = "#FFFFFF00";

    //Deletes the response message
    response.innerHTML = `
        <h3 id="response"></h3>
    `;
}