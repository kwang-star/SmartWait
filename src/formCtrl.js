app.controller('formCtrl', function($scope) {
    $scope.gend ={"selected":null};
    $scope.genders= [{id: 1, value: "M"}, {id: 0, value: "F"}];
	$scope.today= formatDate(new Date());
	console.log(new Date().getMonth());
	console.log($scope.today);

	document.getElementById('dob').max=$scope.today;
});


function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

//To format Date into YYYY-MM-DD
function formatDate(date) {
    return [
        date.getFullYear(),
        padTo2Digits(date.getMonth()+1),
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

//Not Needed for DOB, since input type date checks itself
function validateDate(input, requiredMsg, invalidMsg) {
	// check if the value is not empty
	if (!hasValue(input, requiredMsg)) {
		return false;
	}
	
	// check if DOB is in future
	if (new Date(input).getTime() > new Date().getTime()) {
		return showError(input, invalidMsg);
	}

	// check if DOB is before "1870-01-01"
	if (new Date(input).getTime() > new Date(1870-01-01).getTime()) {
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
	if (validarr.every(element => element === true)) 
	{
		alert("Form to be posted.");
        console.log('registration form submitted');
		window.location="reg_confirm.html";
	}
	else
	{
		alert("Error. Review input fields");
    	console.log('Error: Registration Form has invalid inputs');
	}
});

