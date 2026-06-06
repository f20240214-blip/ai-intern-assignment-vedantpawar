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
        const submitBtn = document.getElementById('submitBtn');
        const btnText = document.getElementById('btnText');
        const btnLoader = document.getElementById('btnLoader');
        const thankYou = document.getElementById('thankYou');

        // show loading state
        if (submitBtn) submitBtn.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (btnLoader) btnLoader.style.display = 'inline-block';

        fetch('https://fluffy-ice.app.n8n.cloud/webhook/leadform', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName: formData.fullName,
                email: formData.email,
                country: formData.country,
                courseLevel: (document.querySelector('input[name="courseLevel"]:checked') || {}).value,
                preferredUniversity: formData.preferredUniversity,
                message: formData.message
            })
        })
            .then((res) => {
                if (res.ok) {
                    if (thankYou) thankYou.style.display = 'block';
                    form.reset();
                    charCounter.textContent = '0 / 300';
                } else {
                    alert('Submission failed. Please try again.');
                }
            })
            .catch((err) => {
                alert('Network error. Please check your connection.');
                console.error(err);
            })
            .finally(() => {
                if (submitBtn) submitBtn.disabled = false;
                if (btnText) btnText.style.display = '';
                if (btnLoader) btnLoader.style.display = 'none';
            });
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