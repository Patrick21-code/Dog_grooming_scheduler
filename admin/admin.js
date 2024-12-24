// Load all the data from localStorage (for customers, pets, and services)
function loadData() {
    const customersData = JSON.parse(localStorage.getItem("userCredentials")) || {}; // Retrieve and parse customer data or set to empty object
    const petData = JSON.parse(localStorage.getItem("pets")) || {}; // Retrieve and parse pet data or set to empty object
    const serviceData = JSON.parse(localStorage.getItem("serviceBookings")) || []; // Retrieve and parse service bookings or set to empty array

    return { customersData, petData, serviceData }; // Return the loaded data as an object
}

// Display customers data in the 'Customers' section
function displayCustomers(customersData) {
    const customerList = document.getElementById("customer-list"); // Get the customer list element
    customerList.innerHTML = ""; // Clear previous list

    for (const email in customersData) { // Iterate over each customer email
        const customer = customersData[email]; // Get customer data by email
        const customerDiv = document.createElement("div"); // Create a new div for the customer
        customerDiv.classList.add("customer-item"); // Add class for styling
        customerDiv.dataset.email = email; // Set data attribute for email
        customerDiv.innerHTML = ` 
            <h3>${customer.firstName} ${customer.lastName}</h3> 
            <p>Email: ${email}</p> 
            <p>Phone: ${customer.phoneNumber}</p> 
            <button onclick="deleteCustomer('${email}')">Delete</button> 
        `;
        customerList.appendChild(customerDiv); // Append the customer div to the customer list
    }
}

// Display service requests in the 'Requests' section
function displayServiceRequests(serviceData) {
    const requestQueue = document.getElementById("request-queue"); // Get the request queue element
    requestQueue.innerHTML = ""; // Clear previous requests

    const customersData = JSON.parse(localStorage.getItem("userCredentials")) || {}; // Load customers data
    const petData = JSON.parse(localStorage.getItem("pets")) || {}; // Load pets data

    serviceData.forEach((service, index) => { // Iterate over each service request
        const pet = petData[service.petId]; // Get pet data using petId from service
        const petName = pet ? pet.petName : 'Unknown Pet'; // Get pet name or set to 'Unknown Pet'
        const petBreed = pet ? pet.petBreed : 'Unknown Breed'; // Get pet breed or set to 'Unknown Breed'

        let ownerName = 'Unknown Owner'; // Default owner name
        let ownerEmail = 'Unknown Email'; // Default owner email
        if (pet && pet.ownerEmail) { // Check if pet exists and has an owner email
            const owner = customersData[pet.ownerEmail]; // Get owner data using owner email
            if (owner) { // If owner data exists
                ownerName = `${owner.firstName} ${owner.lastName}`; // Set owner name
                ownerEmail = pet.ownerEmail; // Set owner email
            }
        }

        const requestDiv = document.createElement("div"); // Create a new div for the service request
        requestDiv.classList.add("service-request"); // Add class for styling
        requestDiv.dataset.index = index; // Set data attribute for index
        requestDiv.dataset.petId = service.petId; // Set data attribute for petId
        requestDiv.dataset.ownerEmail = ownerEmail; // Set data attribute for owner email
        requestDiv.innerHTML = ` 
            <h3>Booking ID: ${service.bookingId}</h3> 
            <p>Owner: ${ownerName}</p>
            <p>Pet: ${petName}</p> 
            <p>Breed: ${petBreed}</p> 
            <p>Date: ${service.bookingDate}</p> 
            <p>Time: ${service.bookingTime}</p> 
            <button onclick="processServiceRequest(${index})">Process</button> 
        `;
        requestQueue.appendChild(requestDiv); // Append the service request div to the request queue
    });
}

// Display pet profiles in the 'Pets' section
function displayPets(petData) {
    const petList = document.getElementById("pet-list"); // Get the pet list element
    petList.innerHTML = ""; // Clear previous list

    const customersData = JSON.parse (localStorage.getItem("userCredentials")) || {}; // Load customers data

    Object.entries(petData).forEach(([petId, pet]) => { // Iterate over each pet entry
        const owner = customersData[pet.ownerEmail]; // Get owner data using owner's email
        const ownerName = owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown Owner'; // Set owner name or default to 'Unknown Owner'
        const ownerEmail = pet.ownerEmail || 'Unknown Email'; // Set owner email or default to 'Unknown Email'

        const petDiv = document.createElement("div"); // Create a new div for the pet
        petDiv.classList.add("pet-item"); // Add class for styling
        petDiv.dataset.petId = petId; // Set data attribute for petId
        petDiv.dataset.ownerEmail = ownerEmail; // Set data attribute for owner email
        petDiv.innerHTML = ` 
            <h3>${pet.petName}</h3> 
            <p>Owner: ${ownerName}</p> 
            <p>Breed: ${pet.petBreed}</p> 
            <button onclick="viewPetDetails('${petId}')">View Details</button> 
        `;
        petList.appendChild(petDiv); // Append the pet div to the pet list
    });
}

// Delete a customer and their associated data
function deleteCustomer(email) {
    if (confirm("Are you sure you want to delete this customer and all associated data?")) { // Confirm deletion
        const customersData = JSON.parse(localStorage.getItem("userCredentials")) || {}; // Load customers data
        const petData = JSON.parse(localStorage.getItem("pets")) || {}; // Load pets data
        const serviceData = JSON.parse(localStorage.getItem("serviceBookings")) || []; // Load service bookings

        delete customersData[email]; // Delete customer from data

        // Delete associated pets and remove from UI
        for (const petId in petData) { // Iterate over each pet
            if (petData[petId].ownerEmail === email) { // Check if pet belongs to the customer
                delete petData[petId]; // Delete pet from data
                const petElement = document.querySelector(`.pet-item[data-owner-email="${email}"]`); // Find pet element in UI
                if (petElement) petElement.remove(); // Remove pet element from UI if it exists
            }
        }

        // Delete associated service requests and remove from UI
        const updatedServiceData = serviceData.filter(service => { // Filter out services associated with the customer
            const pet = petData[service.petId]; // Get pet data for the service
            const shouldKeep = pet && pet.ownerEmail !== email; // Determine if the service should be kept
            if (!shouldKeep) { // If the service should be removed
                const requestElement = document.querySelector(`.service-request[data-owner-email="${email}"]`); // Find request element in UI
                if (requestElement) requestElement.remove(); // Remove request element from UI if it exists
            }
            return shouldKeep; // Return whether to keep the service
        });

        // Save updated data
        localStorage.setItem("userCredentials", JSON.stringify(customersData)); // Save updated customers data
        localStorage.setItem("pets", JSON.stringify(petData)); // Save updated pets data
        localStorage.setItem("serviceBookings", JSON.stringify(updatedServiceData)); // Save updated service bookings

        // Remove customer from UI
        const customerElement = document.querySelector(`.customer-item[data-email="${email}"]`); // Find customer element in UI
        if (customerElement) { // If customer element exists
            customerElement.style.opacity = '0'; // Fade out effect
            customerElement.style.transform = 'translateY(20px)'; // Slide down effect
            setTimeout(() => customerElement.remove(), 300); // Remove element after delay
        }
    }
}

// Process a service request
function processServiceRequest(index) {
    const serviceData = JSON.parse(localStorage.getItem("serviceBookings")) || []; // Load service bookings
    const petData = JSON.parse(localStorage.getItem("pets")) || {}; // Load pets data

    const processedService = serviceData.splice(index, 1)[0]; // Remove the service request from the array

    // Save updated data
    localStorage.setItem("serviceBookings", JSON.stringify(serviceData)); // Save updated service bookings

    // Remove the processed request from UI
    const requestElement = document.querySelector(`.service-request[data-index="${index}"]`); // Find request element ```javascript
    if (requestElement) { // If request element exists
        requestElement.style.opacity = '0'; // Fade out effect
        requestElement.style.transform = 'translateY(20px)'; // Slide down effect
        setTimeout(() => requestElement.remove(), 300); // Remove element after delay
    }

    // Update the data-index attributes for remaining service requests
    const remainingRequests = document.querySelectorAll('.service-request'); // Get all remaining service requests
    remainingRequests.forEach((request, newIndex) => { // Iterate over remaining requests
        request.dataset.index = newIndex; // Update data-index attribute
        const processButton = request.querySelector('button'); // Get process button
        processButton.setAttribute('onclick', `processServiceRequest(${newIndex})`); // Update button's onclick attribute
    });

    alert("Service request processed successfully!"); // Alert user that the request was processed
}

// View details for a pet profile
function viewPetDetails(petId) {
    const petData = JSON.parse(localStorage.getItem("pets")) || {}; // Load pets data
    const customersData = JSON.parse(localStorage.getItem("userCredentials")) || {}; // Load customers data
    const pet = petData[petId]; // Get pet data using petId

    if (pet) { // If pet exists
        const owner = customersData[pet.ownerEmail]; // Get owner data using owner's email
        const ownerName = owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown Owner'; // Set owner name or default to 'Unknown Owner'

        const modalDetails = document.getElementById("modal-details"); // Get modal details element
        modalDetails.innerHTML = `
            <h2>${pet.petName}</h2>
            <p>Owner: ${ownerName}</p>
            <p>Breed: ${pet.petBreed}</p>
            <p>Age: ${pet.petAge || "Not specified"}</p>
            <p>Weight: ${pet.petWeight || "Not specified"} lbs</p>
            <p>Special Needs: ${pet.specialNeeds || "None"}</p>
        `;
        openModal(); // Open the modal to display details
    } else { // If pet does not exist
        console.error("Pet not found:", petId); // Log error to console
        alert("Pet not found. Please try again."); // Alert user that pet was not found
    }
}

// Open the modal with details
function openModal() {
    const modal = document.getElementById("modal"); // Get modal element
    modal.style.display = "block"; // Set modal display to block
    setTimeout(() => { // Delay adding show class for transition effect
        modal.classList.add("show"); // Add class to show modal
    }, 10);
}

// Close the modal
function closeModal() {
    const modal = document.getElementById("modal"); // Get modal element
    modal.classList.remove("show"); // Remove show class to hide modal
    setTimeout(() => { // Delay setting display to none for transition effect
        modal.style.display = "none"; // Set modal display to none
    }, 300);
}

// Close the modal
document.querySelector(".close-modal").addEventListener("click", closeModal); // Add event listener to close modal on button click

// Switch between sections
document.querySelectorAll(".admin-nav ul li").forEach((navItem) => { // Iterate over navigation items
    navItem.addEventListener("click", () => { // Add click event listener
        document.querySelectorAll(".main-content section").forEach((section) => { // Iterate over all sections
            section.classList.add("hidden-section"); // Hide section
            section.classList.remove("active-section"); // Remove active class
        });

        const sectionId = navItem.getAttribute("data-section"); // Get target section ID from nav item
        const targetSection = document.getElementById(sectionId); // Get target section element
        targetSection.classList.remove("hidden-section"); // Show target section
        setTimeout(() => { // Delay adding active class for transition effect
            targetSection.classList.add("active-section"); // Add active class to target section
        }, 10);

        document.querySelectorAll(".admin-nav ul li").forEach((item) => { // Iterate over all nav items
            item.classList.remove("active"); // Remove active class from all nav items
        });
        navItem.classList.add("active"); // Add active class to the clicked nav item
    });
});

// Initialize the data and display it
function initAdminDashboard() {
    const { customersData, petData, serviceData } = loadData(); // Load data from localStorage

    displayCustomers(customersData); // Display customers in the UI
    displayServiceRequests(serviceData); // Display service requests in the UI
    displayPets(petData); // Display pets in the UI
}

// Initialize the admin dashboard
initAdminDashboard(); // Call the function to initialize the dashboard

// Add search functionality for customers
document.getElementById("customer-search").addEventListener("input", function() { // Add input event listener for customer search
    const searchTerm = this.value.toLowerCase(); // Get the search term and convert to lowercase
    const customerItems = document.querySelectorAll(".customer-item"); // Get all customer items
    
    customerItems.forEach(item => { // Iterate over each customer item
        const customerName = item.querySelector("h3").textContent.toLowerCase(); // Get customer's name
        const customerEmail = item.querySelector("p").textContent.toLowerCase(); // Get customer's email
        
        if (customerName.includes(searchTerm) || customerEmail.includes(searchTerm)) { // Check if name or email includes search term
            item.style.display = "block"; // Show item if it matches
        } else {
            item.style.display = "none"; // Hide item if it doesn't match
        }
    });
});

// Add search functionality for pets
document.getElementById("pet-search").addEventListener("input", function() { // Add input event listener for pet search
    const searchTerm = this.value.toLowerCase(); // Get the search term and convert to lowercase
    const petItems = document.querySelectorAll(".pet-item"); // Get all pet items
    
    petItems.forEach(item => { // Iterate over each pet item
        const petName = item.querySelector("h3").textContent.toLowerCase(); // Get pet's name
        const petOwner = item.querySelector("p").textContent.toLowerCase(); // Get pet owner's name
        
        if (petName.includes(searchTerm) || petOwner.includes(searchTerm)) { // Check if name or owner includes search term
            item.style.display = "block"; // Show item if it matches
        } else {
            item.style.display = "none"; // Hide item if it doesn't match
        }
    });
});