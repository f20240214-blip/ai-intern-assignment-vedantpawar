document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('leadform');
  const messageInput = document.getElementById('message');
  const charCounter = document.getElementById('char-counter');
  const successMessage = document.getElementById('success-message');

    //console.log('submit listener attached');
    form.addEventListener('submit', (e) => {
    e.preventDefault();
    //console.log('submit intercepted');
    successMessage.textContent = '';

    const isValid = validateForm();

    if (isValid) {
        const formData = {
            fullName: form.fullName.value.trim(),
            email: form.email.value.trim(),
            country: form.country.value,
            courseLevel: form.courseLevel.value,
            preferredUniversity: form.university.value.trim(),
            message: form.message.value.trim()
        };
        console.log(JSON.stringify(formData));
        successMessage.hidden = false;
        successMessage.textContent = 'Form submitted successfully!';
        form.reset();
        charCounter.textContent = '0 / 300';
    }
});

messageInput.addEventListener('input', () => {
    const currentLength = messageInput.value.length;
    charCounter.textContent = `${currentLength} / 300`;
});

function validateForm() {
    let isValid = true;
    if (!validateName()) isValid = false;
    if (!validateEmail()) isValid = false;
    if (!validateCountry()) isValid = false;
    if (!validateCourseLevel()) isValid = false;
    if (!validateUniversity()) isValid = false;
    if (!validateMessage()) isValid = false;
    return isValid;
}

function validateName() {
    const name = form.fullName.value.trim();
    if (!name) {
        showError(form.fullName, 'Full Name is required.');
        return false;
    }
    clearError(form.fullName);
    return true;
}

function validateEmail() {
    const email = form.email.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        showError(form.email, 'Email is required.');
        return false;
    }
    if (!emailPattern.test(email)) {
        showError(form.email, 'Please enter a valid email address.');
        return false;
    }
    clearError(form.email);
    return true;
}

function validateCountry() {
    const country = form.country.value;
    if (!country) {
        showError(form.country, 'Country is required.');
        return false;
    }
    clearError(form.country);
    return true;
}

function validateCourseLevel() {

    const selected =
        document.querySelector(
            'input[name="courseLevel"]:checked'
        );

    if (!selected) {
        showRadioError(
            'Course Level is required.'
        );
        return false;
    }

    clearRadioError();
    return true;
}
/*I have a Student Lead Capture Form written in vanilla JavaScript.

The form contains a Course Level radio group:

<input type="radio" name="courseLevel" id="ug" value="UG">
<input type="radio" name="courseLevel" id="pg" value="PG">
<input type="radio" name="courseLevel" id="phd" value="PhD">

and an error element:

<small id="courseLevel-error" class="error"></small>

My current showError() and clearError() functions work for normal inputs because they use input.nextElementSibling to locate the error element.

I need to support radio button validation separately.

Modify the code as follows:

1. Add a function:
   showRadioError(message)

   - Sets the textContent of #courseLevel-error.
   - Scrolls the radio group into view smoothly.
   - Focuses the first radio button (id="ug") to guide keyboard and mobile users.

2. Add a function:
   clearRadioError()

   - Clears the textContent of #courseLevel-error.

3. Modify validateCourseLevel()

   - Use:
     document.querySelector('input[name="courseLevel"]:checked')
   - If no radio is selected:
       call showRadioError('Course Level is required.')
       return false
   - Otherwise:
       call clearRadioError()
       return true

4. Keep showError() and clearError() unchanged for normal text inputs, email, select, and textarea fields.

5. Add a reusable UX helper function:

   focusCourseLevelGroup()

   - Scroll smoothly to the first radio button.
   - Focus the first radio button.
   - Use:
     scrollIntoView({
       behavior: 'smooth',
       block: 'center'
     })

6. showRadioError() should call focusCourseLevelGroup().

7. Use modern ES6 syntax and return only the JavaScript code that needs to be added or changed. */
function showRadioError(message) {
    document.getElementById(
        'courseLevel-error'
    ).textContent = message;
    focusCourseLevelGroup();
}

function clearRadioError() {
    document.getElementById(
        'courseLevel-error'
    ).textContent = '';
}

function focusCourseLevelGroup() {
    const firstRadio = document.getElementById('ug');
    firstRadio.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
    firstRadio.focus();
}

function validateUniversity() {
    const university = form.university.value.trim();
    if (!university) {
        showError(form.university, 'Preferred University is required.');
        return false;
    }
    clearError(form.university);
    return true;
}

function validateMessage() {
    const message = form.message.value.trim();
    if (!message) {
        showError(form.message, 'Message is required.');
        return false;
    }
    clearError(form.message);
    return true;
}


function showError(input, message) {
    const errorElement = input.nextElementSibling;
    errorElement.textContent = message;
    input.classList.add('error');
    input.focus();
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function clearError(input) {
    const errorElement = input.nextElementSibling;
    errorElement.textContent = '';
    input.classList.remove('error');
}
});