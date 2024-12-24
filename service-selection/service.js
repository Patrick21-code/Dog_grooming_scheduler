// Define a Queue class for managing service bookings
class Queue {
    constructor() {
        this.data = []; // Initialize an empty array to store queue items
    }

    enqueue(item) {
        this.data.push(item); // Add an item to the end of the queue
    }

    dequeue() {
        return this.data.shift(); // Remove and return the first item from the queue
    }

    peek() {
        return this.data[0]; // Return the first item without removing it
    }

    size() {
        return this.data.length; // Return the number of items in the queue
    }

    getAll() {
        return this.data; // Return all items in the queue
    }
}

// Create an instance of Queue to manage service bookings
const serviceBookings = new Queue();

// Disable past dates in date picker
const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
document.getElementById('bookingDate').setAttribute('min', today); // Set minimum date in date picker to today

// Load existing service bookings from localStorage
function loadServiceBookings() {
    const storedBookings = localStorage.getItem("serviceBookings"); // Retrieve stored bookings
    if (storedBookings) {
        const parsedBookings = JSON.parse(storedBookings); // Parse JSON string to object
        parsedBookings.forEach(booking => {
            serviceBookings.enqueue(booking); // Add each stored booking to the queue
        });
    }
}

// Save service bookings to localStorage
function saveServiceBookings() {
    localStorage.setItem("serviceBookings", JSON.stringify(serviceBookings.getAll())); // Convert queue to JSON and store
}

// Handle form submission for booking a service
document.getElementById("bookingForm").addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Collect form input values
    const serviceType = document.getElementById("serviceType").value.trim(); // Get selected service type
    const bookingDate = document.getElementById("bookingDate").value.trim(); // Get booking date
    const bookingTime = document.getElementById("bookingTime").value.trim(); // Get booking time

    // Input validation
    if (!serviceType || !bookingDate || !bookingTime) {
        alert("Please fill in all required fields."); // Show alert for missing fields
        return; // Stop form submission
    }

    // Date validation
    const currentDate = new Date(); // Get current date
    const selectedDate = new Date(bookingDate); // Convert booking date to Date object
    if (selectedDate < currentDate) {
        alert("Please choose a date that is in the future."); // Show alert for past dates
        return; // Stop form submission
    }

    // Check for time slot overlap
    const existingBookings = serviceBookings.getAll(); // Get all existing bookings
    const overlap = existingBookings.some(booking => 
        booking.bookingDate === bookingDate && booking.bookingTime === bookingTime
    ); // Check if the selected time slot is already booked
    if (overlap) {
        alert("This time slot is already taken. Please choose another time."); // Show alert for conflicting booking
        return; // Stop form submission
    }

    // Get current user's email
    const currentUserEmail = localStorage.getItem("currentUserEmail"); // Retrieve logged-in user's email

    // User authentication check
    if (!currentUserEmail) {
        alert("Please log in before booking a service."); // Show login reminder
        return; // Stop form submission
    }

    // Pet registration check
    const allPets = JSON.parse(localStorage.getItem("pets")) || {}; // Retrieve all registered pets
    const userPets = Object.values(allPets).filter(pet => pet.ownerEmail === currentUserEmail); // Filter pets belonging to current user

    // Check if user has registered pets
    if (userPets.length === 0) {
        alert("Please register a pet before booking a service."); // Show pet registration reminder
        return; // Stop form submission
    }

    // Select pet (for simplicity, using first registered pet)
    const petId = userPets[0].petId; // Get ID of first registered pet

    // Generate unique booking ID
    const bookingId = new Date().getTime().toString(); // Create booking ID using current timestamp

    // Create service booking object
    const serviceBooking = {
        bookingId,       // Unique identifier
        serviceType,     // Selected service type
        bookingDate,     // Booking date
        bookingTime,     // Booking time
        petId,           // Associated pet ID
        ownerEmail: currentUserEmail // User's email
    };

    // Add booking to queue and save to localStorage
    serviceBookings.enqueue(serviceBooking);
    saveServiceBookings();

    // Show success message
    alert("Your grooming service has been booked successfully!");

    // Redirect to landing page
    window.location.href = "../landing/landing.html";
});

// Load existing service bookings when page loads
loadServiceBookings();