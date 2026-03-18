// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize EmailJS with your Public Key
    emailjs.init('w4Xr_YGoBkEG-ilUp');
    
    // Get the contact form
    const form = document.getElementById('contact-form');
    
    if (!form) {
        console.error('Contact form not found!');
        return;
    }
    
    console.log('Contact form loaded successfully!');
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent page reload
        
        console.log('Form submitted!');
        
        const submitBtn = document.getElementById('alone');
        const originalValue = submitBtn.value;
        
        // Show loading state
        submitBtn.value = 'Sending...';
        submitBtn.disabled = true;
        
        // Send email using EmailJS
        emailjs.sendForm(
            'service_3he3dko',    // Your Service ID
            'template_gh8q7wi',   // Your Template ID
            this                  // The form element
        )
        .then(function(response) {
            // SUCCESS!
            console.log('Email sent successfully!', response);
            alert('Message sent successfully! You will get back to them soon.');
            form.reset(); // Clear the form
            submitBtn.value = originalValue;
            submitBtn.disabled = false;
        })
        .catch(function(error) {
            // ERROR
            console.error('Failed to send email:', error);
            alert('Failed to send message. Please try again.');
            submitBtn.value = originalValue;
            submitBtn.disabled = false;
        });
    });
});