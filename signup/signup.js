// HashMap class for in-memory storage of user credentials
class HashMap {
    constructor() {
        this.data = {}; // Initialize an empty object to store key-value pairs
    }

    set(key, value) {
        this.data[key] = value; // Store a value with a specific key
    }

    get(key) {
        return this.data[key] || null; // Retrieve value by key, return null if not found
    }

    has(key) {
        return key in this.data; // Check if a specific key exists in the data
    }

    getAll() {
        return this.data; // Return entire data object
    }
}

// Create an instance of HashMap to store user credentials
const userCredentials = new HashMap();

// Function to load existing data from localStorage into HashMap
function loadFromStorage() {
    const storedData = localStorage.getItem("userCredentials"); // Retrieve stored credentials
    if (storedData) {
        const parsedData = JSON.parse(storedData); // Convert JSON string to object
        for (const email in parsedData) {
            userCredentials.set(email, parsedData[email]); // Populate HashMap with stored credentials
        }
    }
}

// Save HashMap data to localStorage
function saveToStorage() {
    localStorage.setItem("userCredentials", JSON.stringify(userCredentials.getAll())); // Convert HashMap to JSON string and store
}

// Handle form submission
document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Collect form input values
    const firstName = document.getElementById("first-name").value.trim(); // Get first name and remove whitespace
    const lastName = document.getElementById("last-name").value.trim(); // Get last name and remove whitespace
    const email = document.getElementById("email").value.trim(); // Get email and remove whitespace
    const phoneNumber = document.getElementById("phone-number").value.trim(); // Get phone number and remove whitespace
    const password = document.getElementById("password").value.trim(); // Get password and remove whitespace
    const confirmPassword = document.getElementById("confirm-password").value.trim(); // Get confirm password and remove whitespace

    // Validate password matching
    if (password !== confirmPassword) {
        alert("Passwords do not match!"); // Show alert if passwords are different
        return; // Stop form submission
    }

    // Load existing data from storage
    loadFromStorage();

    // Check if user already exists
    if (userCredentials.has(email)) {
        alert("User already exists. Please use a different email."); // Show alert for existing user
        return; // Stop form submission
    }

    // Add new user to the HashMap
    userCredentials.set(email, {
        firstName,       // Store first name
        lastName,        // Store last name
        phoneNumber,     // Store phone number
        password,        // Store password
    });

    // Save updated credentials to localStorage
    saveToStorage();

    // Show success message and redirect
    alert("Account created successfully!");
    window.location.href = "../login/login.html"; // Redirect to login page
});

// Initialize data on page load
loadFromStorage();

// Add event listener for clearing storage
document.getElementById("clear-storage").addEventListener("click", () => {
    localStorage.clear(); // Remove all data from localStorage
    alert("All data has been cleared from localStorage."); // Show confirmation message
});