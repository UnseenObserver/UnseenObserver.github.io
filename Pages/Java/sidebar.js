// Get the elements
const hoverArea = document.querySelector('.hover-area');
const sidebar = document.querySelector('.sidebar');

let isSidebarOpen = false; // Track the sidebar state

// Function to open the sidebar
function openSidebar() {
    sidebar.classList.add('open');
    isSidebarOpen = true;
}

// Function to close the sidebar
function closeSidebar() {
    sidebar.classList.remove('open');
    isSidebarOpen = false;
}

// Function to toggle the sidebar (used for click and touch events)
function toggleSidebar() {
    if (isSidebarOpen) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

// --- Mouse Events (for desktop) ---
// Open sidebar on mouse enter of the hover area
hoverArea.addEventListener('mouseenter', () => {
    openSidebar();
});

// Optionally, close sidebar when the mouse leaves the hover area
hoverArea.addEventListener('mouseleave', () => {
    // This check can be adjusted depending on your desired behavior;
    // here we close only if not manually opened via click/touch.
    if (!isSidebarOpen) {
        closeSidebar();
    }
});

// Keep sidebar open when hovering over the sidebar itself
sidebar.addEventListener('mouseenter', () => {
    openSidebar();
});

// Close sidebar when leaving the sidebar, if not hovering over the hover area
sidebar.addEventListener('mouseleave', () => {
    closeSidebar();
});

// --- Click and Touch Events (for mobile/touch devices) ---
// Add click event listeners to toggle the sidebar
hoverArea.addEventListener('click', toggleSidebar);
sidebar.addEventListener('click', toggleSidebar);

// Add touch event listeners to improve touch responsiveness
hoverArea.addEventListener('touchstart', function(e) {
    e.preventDefault(); // Prevent simulated mouse events
    toggleSidebar();
});
sidebar.addEventListener('touchstart', function(e) {
    e.preventDefault();
    toggleSidebar();
});
