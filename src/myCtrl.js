app.controller('myCtrl', function($scope) {
    $scope.gend ={"selected":null};
    $scope.genders= [{id: 1, value: "M"}, {id: 0, value: "F"}];
    $scope.today = formatDate(new Date());
});

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(date) {
    return [
        date.getFullYear(),
        padTo2Digits(date.getMonth()),
        padTo2Digits(date.getDate()),
    ].join('-');
}

// show a message with a type of the input
function showMessage(input, message, type) {
	// get the small element and set the message
	const msg = input.parentNode.querySelector("small");
	msg.innerText = message;
	// update the class for the input
	input.className = type ? "success" : "error";
	return type;
}

function showError(input, message) {
	return showMessage(input, message, false);
}

function showSuccess(input) {
	return showMessage(input, "", true);
}

function hasValue(input, message) {
	if (input.value.trim() === "") {
		return showError(input, message);
	}
	return showSuccess(input);
}

function selectedValue(input, message) {
    console.log("select val: " + input.value );

	if (input.value === "") {
		return showError(input, message);
	}
	return showSuccess(input);
}

function validateName(input, requiredMsg, invalidMsg) {
    //Check input
	if (!hasValue(input, requiredMsg)) { 
		return false;
	}
    else if(!/^[a-zA-Z]+$/.test(input.value.trim())){
        //if contains characters other than letters
        return showError(input, invalidMsg);
    }
    
	return showSuccess(input);
}

function validateEmail(input, requiredMsg, invalidMsg) {
	// check if the value is not empty
	if (!hasValue(input, requiredMsg)) {
		return false;
	}
	// validate email format
	const emailRegex =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	const email = input.value.trim();
	if (!emailRegex.test(email)) {
		return showError(input, invalidMsg);
	}
	return true;
}

const form = document.querySelector("#register");

const NAME_REQUIRED = "Please enter your name";
const NAME_INVALID = "Please enter your name as on your identification";
const EMAIL_REQUIRED = "Please enter your email";
const EMAIL_INVALID = "Please enter a correct email address format";
const DOB_REQUIRED = "Please enter your date of birth";
const GENDER_REQUIRED = "Please select your gender";

form.addEventListener("submit", function (event) {
	// stop form submission
	event.preventDefault();

	// validate the form
	let fnameValid = validateName(form.elements["fname"], NAME_REQUIRED, NAME_INVALID);
    let lnameValid = validateName(form.elements["lname"], NAME_REQUIRED, NAME_INVALID);
	let emailValid = validateEmail(form.elements["email"], EMAIL_REQUIRED, EMAIL_INVALID);
    let dobValid = hasValue(form.elements["dob"], DOB_REQUIRED);
    let genderValid = selectedValue(form.elements["gender"], GENDER_REQUIRED);
	// if valid, submit the form.
    validarr = [fnameValid, lnameValid, emailValid, dobValid, genderValid];
	if (validarr.every(element => element === true)) {
		alert("Form to be posted.");
        console.log('registration form submitted');
	}
    alert("Error. Review input fields");
    console.log('Error: Registration Form has invalid inputs');
});

