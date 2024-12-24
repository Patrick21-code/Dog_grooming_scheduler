// Pet management class using HashMap data structure
class HashMap {
    constructor() {
        this.data = {}; // Initialize empty object to store key-value pairs
    }

    set(key, value) {
        this.data[key] = value; // Set a key-value pair in the data object
    }

    get(key) {
        return this.data[key] || null; // Retrieve value by key, return null if not found
    }

    has(key) {
        return key in this.data; // Check if a specific key exists in the data
    }

    getAll() {
        return this.data; // Return the entire data object
    }

    remove(key) {
        delete this.data[key]; // Remove a specific key-value pair from the data
    }
}

// Create an instance of HashMap to manage pet data
const pets = new HashMap();

// Function to load existing pet data from localStorage
function loadPetData() {
    const storedPets = localStorage.getItem("pets"); // Retrieve stored pet data
    if (storedPets) {
        const parsedPets = JSON.parse(storedPets); // Parse JSON string to object
        Object.keys(parsedPets).forEach((petId) => {
            pets.set(petId, parsedPets[petId]); // Add each stored pet to the HashMap
        });
    }
}

// Function to save pet data to localStorage
function savePetData() {
    localStorage.setItem("pets", JSON.stringify(pets.getAll())); // Convert HashMap to JSON and store
}

// Add event listener to form submission
document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Collect input values and trim whitespace
    const petName = document.getElementById("petName").value.trim(); // Get pet name
    const petBreed = document.getElementById("petBreed").value.trim(); // Get pet breed
    const petAge = document.getElementById("petAge").value.trim(); // Get pet age
    const petWeight = document.getElementById("petWeight").value.trim(); // Get pet weight
    const specialNeeds = document.getElementById("specialNeeds").value.trim(); // Get special needs

    // Input validation
    if (!petName || !petBreed || !petAge || !petWeight) {
        alert("Please fill in all required fields."); // Show alert for missing fields
        return; // Stop form submission
    }

    // Age validation
    if (petAge < 0 || petAge > 30) {
        alert("Please enter a valid age (0-30 years)."); // Show alert for invalid age
        return; // Stop form submission
    }

    // Weight validation
    if (petWeight < 0 || petWeight > 300) {
        alert("Please enter a valid weight (0-300 lbs)."); // Show alert for invalid weight
        return; // Stop form submission
    }

    // Get current user's email from localStorage
    const currentUserEmail = localStorage.getItem("currentUserEmail");

    // Check if user is logged in
    if (!currentUserEmail) {
        alert("Please log in before registering a pet."); // Show login reminder
        return; // Stop form submission
    }

    // Generate unique pet ID using current timestamp
    const petId = new Date().getTime().toString();

    // Create pet object with collected data
    const pet = {
        petId,                      // Unique identifier
        petName,                    // Pet's name
        petBreed,                   // Pet's breed
        petAge: parseFloat(petAge), // Convert age to number
        petWeight: parseFloat(petWeight), // Convert weight to number
        specialNeeds: specialNeeds || "None", // Special needs or default to "None"
        ownerEmail: currentUserEmail // Associate pet with current user
    };

    // Save pet data to HashMap and localStorage
    pets.set(petId, pet);
    savePetData();

    // Show success message
    alert(`Pet ${petName} has been successfully registered!`);

    // Redirect to service selection page
    window.location.href = "../service-selection/service.html";
});

// Load existing pet data when page loads
loadPetData();