//Gets up the mode
var mode = new URL(window.location).searchParams.get("mode") ?? "hex";
document.getElementById("modeSelect").value = mode;

//Sets up the color
var color;
if (mode == "hex" || mode == "rgb") color = "FFFFFF";
else if (mode == "pantone") color = "F2F0EB";

//Gets the pantone colors
import { pantoneColors } from "./pantone-colors.js";

//Converts RGB to hexadecimal
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
        <div id="pantone-dropdown-container">
            <input type="text" id="pantone-input" class="color-input" placeholder="Search Pantone Color" autocomplete="off"></input>
            <ul id="pantone-list"></ul>
        </div>
    `;

    const pantoneList = document.getElementById("pantone-list");
    const pantoneInput = document.getElementById("pantone-input");

    // Populate initial list
    Object.entries(pantoneColors).forEach(([key, val]) => {
        const option = document.createElement("li");
        option.innerText = key;
        option.dataset.value = key;
        option.className = "pantone-option";
        option.addEventListener("click", function() {
            pantoneInput.value = key;
            pantoneList.style.display = "none";
        });
        pantoneList.appendChild(option);
    });

    // Filter list on input
    pantoneInput.addEventListener("input", function() {
        const searchTerm = this.value.toLowerCase();
        const options = pantoneList.querySelectorAll(".pantone-option");
        pantoneList.style.display = searchTerm ? "block" : "none";

        options.forEach(option => {
            option.style.display = option.innerText.toLowerCase().includes(searchTerm) ? "block" : "none";
        });
    });

    // Hide list on blur
    pantoneInput.addEventListener("blur", function() {
        setTimeout(() => { pantoneList.style.display = "none"; }, 200);
    });

    // Show list on focus
    pantoneInput.addEventListener("focus", function() {
        if (this.value) pantoneList.style.display = "block";
    });
}

//Determines if the input is valid
function isInputValid(input) {
    console.log("checking validity");
    console.log(input, mode);
    //If the mode is hexadecimal
    if (mode==="hex") {
        input = input.substr(1, input.length);
        if (input.length === 6 && /^[A-Fa-f0-9]+$/.test(input)) return true;
    } else if (mode==="rgb") {//If the mode is RGB
        input = input.toString();
        if (input.length === 3 && input < 256) return true;
    } else if (mode==="pantone") {//If the mode is pantone, check the pantone colors
        console.log(input);
        if (input && Object.keys(pantoneColors).includes(input)) return true;
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
            this.style.boxShadow = isInputValid(this.value) ? "0 0 0 2.5px #00FF00B8":"0 0 0 2.5px #FF0000B8";;
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
        if (isInputValid(this.value)) {
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
        if (!isInputValid(input)) return;
    } else if (mode === "rgb") {
        input = "#"+rgbToHex(
            document.getElementById("r-input").value,
            document.getElementById("g-input").value,
            document.getElementById("b-input").value
        ).toUpperCase();
        if (!isInputValid(input)) return;
    } else if (mode === "pantone") {
        input = document.getElementById("pantone-input").value;
        if (!isInputValid(input)) return;
        input = "#" + pantoneColors[input];
    }

    //Prevents the user from submitting an invalid value
    submit(input, mode);
});
function submit(input, mode="hex") {
    //Removes '#' from the input
    var input = input.substr(1, input.length);

    //Calculates how much the user is off by
    var rOff = Math.abs(Number("0x"+input.substr(0, 2))-Number("0x"+color.substr(0, 2)));
    var gOff = Math.abs(Number("0x"+input.substr(2, 2))-Number("0x"+color.substr(2, 2)));
    var bOff = Math.abs(Number("0x"+input.substr(4, 2))-Number("0x"+color.substr(4, 2)));

    //Determines what the correct color is
    var answer = "";
    if (mode === "hex" || mode === "rgb") answer = '#'+color;
    else if (mode === "pantone") answer = Object.keys(pantoneColors).find(key => pantoneColors[key] === color);

    //Determines the response message
    var responseMessage;
    if (input === color) {
        submitResponse("Congradulations, you guessed the color!");
    } else {
        submitResponse(`Sorry, the correct answer is ${answer}.<br>You were off by a factor of rgb(${rOff}, ${gOff}, ${bOff})`);
    }
    
    //Changes the color to be guessed
    if (mode === "hex" || mode === "rgb") color = (Math.random() * 0xFFFFFF * 1000000).toString(16).toUpperCase().slice(0, 6);
    else if (mode === "pantone") {
        const pantoneKeys = Object.keys(pantoneColors);
        const randomPantone = pantoneKeys[Math.floor(Math.random() * pantoneKeys.length)];
        color = pantoneColors[randomPantone].toUpperCase();
    }
    document.getElementById("colorbox").style = "background: #"+color+";"
}

//Adds a response dialogue
function submitResponse(message) {
    //Changes the color of the response div, and makes it visible
    const response = document.getElementById("response-div");
    response.style.background = "#FFFFFF20";
    response.style.visibility = "visible";

    //Changes the response message
    response.innerHTML = `
        <h3 id="response">
            ${message}
        </h3>
    `;
}

function deleteResponse() {
    //Changes the color of the response div, and makes it hidden
    const response = document.getElementById("response-div");
    response.style.background = "#FFFFFF00";
    response.style.visibility = "hidden";

    //Deletes the response message
    response.innerHTML = `
        <h3 id="response"></h3>
    `;
}