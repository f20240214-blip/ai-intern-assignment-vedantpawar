/*Generate vanilla JavaScript for a Student Lead Capture Form.

Requirements:

- Use only vanilla JavaScript.
- Select the form using id="leadform".
- Validate all required fields:
  - Full Name
  - Email
  - Country
  - Course Level
  - Preferred University
  - Message
- Email must match a valid email pattern.
- Display inline error messages in the corresponding
  small.error elements.
- Remove errors when fields become valid.
- Implement a live character counter for the textarea
  with id="message" and maxlength="300".
- Prevent default form submission.
- If validation fails:
  - focus the first invalid field
  - scroll it into view smoothly
- If validation succeeds:
  - create a JavaScript object containing all form values
  - console.log the object as JSON
  - show a success message in #success-message
  - reset the form
  - reset the character counter to 0 / 300
- Organize code into reusable functions:
  validateName()
  validateEmail()
  validateCountry()
  validateCourseLevel()
  validateUniversity()
  validateMessage()
  showError()
  clearError()
- Use modern ES6 syntax.
- Do not use frameworks or external libraries.
- Return only JavaScript. */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('leadform');
  const messageInput = document.getElementById('message');
  const charCounter = document.getElementById('char-counter');
  const successMessage = document.getElementById('success-message');
});

    form.addEventListener('submit', (e) => {
    e.preventDefault();
    successMessage.textContent = '';

    const isValid = validateForm();

    if (isValid) {
        const formData = {
            fullName: form.fullName.value.trim(),
            email: form.email.value.trim(),
            country: form.country.value,
            courseLevel: form.courseLevel.value,
            preferredUniversity: form.preferredUniversity.value.trim(),
            message: form.message.value.trim()
        };
        console.log(JSON.stringify(formData));
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
    const courseLevel = form.courseLevel.value;
    if (!courseLevel) {
        showError(form.courseLevel, 'Course Level is required.');
        return false;
    }
    clearError(form.courseLevel);
    return true;
}

function validateUniversity() {
    const university = form.preferredUniversity.value.trim();
    if (!university) {
        showError(form.preferredUniversity, 'Preferred University is required.');
        return false;
    }
    clearError(form.preferredUniversity);
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