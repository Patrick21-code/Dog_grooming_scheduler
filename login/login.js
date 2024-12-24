// HashMap class to store user credentials in a key-value data structure
class HashMap {
    constructor() {
        this.data = {}; // Initialize an empty object to store key-value pairs
    }

    set(key, value) {
        this.data[key] = value; // Set a key-value pair in the data object
    }

    get(key) {
        return this.data[key] || null; // Retrieve value by key, return null if not found
    }

    has(key) {
        return key in this.data; // Check if a key exists in the data object
    }

    getAll() {
        return this.data; // Return the entire data object
    }
}

// Create an instance of HashMap to store user credentials
const userCredentials = new HashMap();

// Function to load existing user credentials from localStorage
function loadFromStorage() {
    const storedData = localStorage.getItem("userCredentials"); // Retrieve stored credentials from localStorage
    if (storedData) {
        const parsedData = JSON.parse(storedData); // Parse the JSON string to an object
        for (const email in parsedData) {
            userCredentials.set(email, parsedData[email]); // Add each stored credential to the HashMap
        }
    }
}

// Add event listener to the login form submission
document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Get email and password from input fields
    const email = document.getElementById("email").value.trim(); // Get email input and remove whitespace
    const password = document.getElementById("password").value.trim(); // Get password input and remove whitespace

    // Load stored credentials from localStorage into HashMap
    loadFromStorage();

    // Check if user exists in the credentials
    if (!userCredentials.has(email)) {
        alert("User does not exist. Please sign up first."); // Show alert if user not found
        return;
    }

    // Retrieve stored user data for the given email
    const storedUser = userCredentials.get(email);

    // Validate password
    if (storedUser.password !== password) {
        alert("Incorrect password. Please try again."); // Show alert for incorrect password
        return;
    }

    // If login is successful
    localStorage.setItem("currentUserEmail", email); // Store current user's email in localStorage
    alert("Login successful!"); // Show success message
    window.location.href = "../pet-details/pet.html"; // Redirect to pet details page
});