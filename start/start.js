document.addEventListener('DOMContentLoaded', () => { // Wait for the DOM to fully load before executing script
    const loginOptions = document.querySelectorAll('.login-option'); // Select all login option elements
    const adminLoginModal = document.getElementById('adminLoginModal'); // Get the admin login modal element
    const adminLoginBtn = document.getElementById('adminLoginBtn'); // Get the admin login button
    const loginError = document.getElementById('loginError'); // Get the login error message element
    const adminUsername = document.getElementById('adminUsername'); // Get the admin username input field
    const adminPassword = document.getElementById('adminPassword'); // Get the admin password input field

    loginOptions.forEach(option => { // Iterate through each login option
        option.addEventListener('click', function() { // Add click event listener to each option
            const loginType = this.getAttribute('data-type'); // Get the login type from data attribute
            if (loginType === 'customer') { // If customer login is selected
                window.location.href = '../landing/landing.html'; // Redirect to customer landing page
            } else if (loginType === 'admin') { // If admin login is selected
                // Show admin login modal
                adminLoginModal.style.display = 'flex'; // Display the admin login modal
            }
        });
    });

    adminLoginBtn.addEventListener('click', () => { // Add click event listener to admin login button
        const username = adminUsername.value; // Get entered username
        const password = adminPassword.value; // Get entered password

        // Validate credentials
        if (username === 'patpat' && password === 'thedawg12') { // Check if credentials are correct
            // Successful login
            window.location.href = '../admin/admin.html'; // Redirect to admin dashboard
        } else {
            // Show error message
            loginError.style.display = 'block'; // Display login error message
            // Note: There's a typo 'e' here which seems to be an accidental character
            // Clear password field
            adminPassword.value = ''; // Reset password input
        }
    });

    // Optional: Close error message when user starts typing
    adminUsername.addEventListener('input', () => { // Add input event listener to username field
        loginError.style.display = 'none'; // Hide error message when user types
    });

    adminPassword.addEventListener('input', () => { // Add input event listener to password field
        loginError.style.display = 'none'; // Hide error message when user types
    });
});